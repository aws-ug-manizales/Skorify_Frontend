# `infra/` — CDK app del frontend Skorify

Stack que provisiona la infra del sitio (S3 privado + CloudFront con OAC) para los tres ambientes: `dev`, `stg`, `prd`. Implementa el ADR-INFRA-0003 que vive en `Skorify_DevOps/docs/adr/infra/0003-frontend-nextjs-ssg-s3-cloudfront.md`.

El despliegue de **assets** del sitio (output de `next build`) NO está en este CDK; eso lo hace un job aparte del workflow (`aws s3 sync` + `cloudfront create-invalidation`) usando el rol `skorify-frontend-deploy`. Este CDK solo gestiona la infra, que cambia mucho menos.

## Recursos que crea

Por ambiente:

- Bucket S3 privado `skorify-frontend-{env}` con `BlockPublicAccess.BLOCK_ALL`, SSE-S3, HTTPS only.
- CloudFront `Origin Access Control` (OAC, SIGV4 always) — reemplaza al `OriginAccessIdentity` legacy.
- `Response Headers Policy` con HSTS 2 años (`includeSubDomains; preload`), `X-Content-Type-Options nosniff`, `X-Frame-Options DENY`, `Referrer-Policy same-origin` y una CSP base (`default-src 'self'` + permisos para MUI inline + `frame-ancestors 'none'`).
- CloudFront Function viewer-request (`skorify-frontend-{env}-rewrite`) que mapea las rutas de Next static export:
  - `/` → `/index.html`
  - `/ruta/` → `/ruta/index.html`
  - `/ruta` (sin extensión) → `/ruta.html`
  - `/algo.ext` → sin cambio (assets pasan derecho)
- Distribución CloudFront con:
  - Default behavior: managed cache `CachingOptimized`, HTTPS forced, `GET/HEAD/OPTIONS`, compresión, HTTP/2 + HTTP/3, TLS mínimo 1.2 (2021), function rewrite asociada.
  - Behavior dedicado para `/_next/static/*` (assets con content-hash de Next.js, cache largo, sin rewrite — los assets ya tienen extensión).
  - Error responses 403 y 404 → `/404.html` con código **404 real** (no SPA-style 200; SSG genera un HTML por ruta).
  - Aliases DNS y cert ACM **opcionales** (cuando se setean las vars `SKORIFY_FRONTEND_DOMAIN_ALIASES` y `SKORIFY_FRONTEND_ACM_CERT_ARN`).
- Outputs exportados: `skorify-frontend-{env}-bucket-name`, `skorify-frontend-{env}-distribution-id`. El workflow `deploy-assets` los lee.

## Ambientes y cuentas

| Env | Cuenta AWS | Stack | Bucket |
|---|---|---|---|
| dev | `968306633562` | `skorify-frontend-dev` | `skorify-frontend-dev` |
| stg | `553284493694` | `skorify-frontend-stg` | `skorify-frontend-stg` |
| prd | `151646410766` | `skorify-frontend-prd` | `skorify-frontend-prd` |

Política de bucket por ambiente: `dev` permite `destroy` + `autoDeleteObjects` (re-crear limpio); `stg`/`prd` quedan en `RETAIN` para no perder assets en caso de eliminar el stack por accidente.

## Pre-requisitos

- CDK bootstrap aplicado en la cuenta destino (`cdk-hnb659fds-*` roles existentes). Ya está hecho en las 3 cuentas Skorify a 2026-05-14.
- El rol federado `skorify-frontend-infra` ya existe en cada cuenta (lo crea `SkorifyBootstrapStack` en `Skorify_DevOps`). Trust: `repo:aws-ug-manizales/Skorify_Frontend:environment:{env}`.
- El equipo de frontend debe activar `output: 'export'` en `next.config.ts` antes del primer deploy de assets (este stack no depende de eso, pero el workflow `deploy-assets` sí).

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `SKORIFY_ENVIRONMENT` | sí | `dev` \| `stg` \| `prd`. Define naming, cuenta destino y políticas de bucket. |
| `CDK_DEFAULT_ACCOUNT` | sí | Lo setea el CLI al usar credenciales. Debe matchear el ambiente. |
| `CDK_DEFAULT_REGION` | sí | `us-east-1` (CloudFront es global pero CDK requiere region; cert ACM también vive ahí). |
| `SKORIFY_FRONTEND_DOMAIN_ALIASES` | no | Lista separada por comas, ej. `dev-skorify.example.com`. Cuando está vacío, el sitio queda en `*.cloudfront.net`. |
| `SKORIFY_FRONTEND_ACM_CERT_ARN` | si hay aliases | ARN del cert ACM en `us-east-1`. |

## Comandos

Desde `infra/`. El repo usa **yarn** (no npm), `package-lock.json` está en `.gitignore`.

```bash
yarn install
yarn build
yarn test               # 15 tests sobre el template sintetizado

# Deploy local (requiere credenciales del ambiente coincidente):
AWS_PROFILE=skorify-dev SKORIFY_ENVIRONMENT=dev npx cdk synth
AWS_PROFILE=skorify-dev SKORIFY_ENVIRONMENT=dev npx cdk diff
AWS_PROFILE=skorify-dev SKORIFY_ENVIRONMENT=dev npx cdk deploy
```

`bin/skorify-frontend.ts` valida que `CDK_DEFAULT_ACCOUNT` matchee `SKORIFY_ENVIRONMENT`; un mismatch tira un error antes de tocar AWS.

Desde CI: el workflow `cd-{env}.yml` corre el job `cdk-deploy-infra` con `environment: {env}`, asume `skorify-frontend-infra` vía el composite `setup-aws-credentials@<sha>` de `aws-ug-manizales/Skorify_DevOps` y luego ejecuta `cdk deploy SkorifyFrontend-{env}`.

## Limitaciones conocidas

### Rutas dinámicas sin `generateStaticParams` (bloquean el build)

Este stack asume `output: 'export'` en `next.config.ts`. Con export activado, las rutas dinámicas del App Router necesitan `generateStaticParams()` que devuelva un set finito de valores; sin eso, `next build` falla. Las dos rutas afectadas hoy:

- `src/app/(dashboard)/groups/[id]/page.tsx` — IDs runtime (grupos generados por usuarios).
- `src/app/join/[code]/page.tsx` — codes runtime.

Opciones para resolverlo (decisión del equipo frontend):

1. **Convertir esas rutas a client-side**: una página genérica que lee el segmento del path con `useParams()` y hace fetch al backend. Requiere mover la lógica server → client y, si depende de SEO, evaluar impacto.
2. **Reemplazar este ADR**: pasar a SSR (OpenNext sobre Lambda + CloudFront) si las rutas dinámicas son críticas. Costo y complejidad mayores.

Mientras no se resuelva, esas rutas caerán al 404 (la CloudFront Function rewrite no las puede inventar; solo mapea rutas que sí existen en el bucket).

### Otros pendientes

- **Dominio del proyecto**: cuando se registre, setear `SKORIFY_FRONTEND_DOMAIN_ALIASES` y `SKORIFY_FRONTEND_ACM_CERT_ARN` en cada environment del workflow.
- **CSP ajustada**: la base permite styles inline para MUI. Cuando el sitio esté desplegado, revisar `connect-src` (debe listar el backend) y endurecer si aplica.
- **`trailingSlash` y formas canónicas**: la rewrite function soporta ambas formas (`/x` → `/x.html` y `/x/` → `/x/index.html`), así no hay que cambiar código si el equipo cambia el setting. Pero **no normaliza entre modos**: con `trailingSlash: false` (default Next), Next emite `/x.html` y un visitante que escriba `/x/` cae al 404 (la function lo manda a `/x/index.html`, que no existe). En modo SSR Next redirige server-side; en estático no hay redirect. El equipo debe elegir un modo, mantener consistencia en los links, y opcionalmente reforzar con un middleware del bucket o un segundo `Function` que dropee/agregue la barra final.
- **Features de Next no soportadas con `output: 'export'`**: Server Actions, Cookies, Draft Mode, ISR, Image Optimization con el loader default, Proxy, y ciertas configs de Rewrites/Redirects/Headers. Hay que validar que ninguno se use cuando el equipo active el export (referencia: Next.js docs, `01-app/02-guides/static-exports.mdx`).
