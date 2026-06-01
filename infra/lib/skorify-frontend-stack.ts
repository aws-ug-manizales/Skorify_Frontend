import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export type SkorifyFrontendEnvironment = 'dev' | 'stg' | 'prd';

export interface SkorifyFrontendStackProps extends cdk.StackProps {
  /** Ambiente Skorify; controla naming de recursos y tags. */
  readonly skorifyEnvironment: SkorifyFrontendEnvironment;
  /**
   * Aliases DNS adicionales (ej. `dev-skorify.example.com`). Cuando está
   * vacío el sitio queda sirviendo en `*.cloudfront.net` con el cert default.
   */
  readonly domainAliases?: string[];
  /**
   * ARN del cert ACM (debe vivir en `us-east-1`). Requerido cuando hay
   * `domainAliases`. Cuando está vacío, no se setean aliases y CloudFront
   * usa su cert default.
   */
  readonly acmCertificateArn?: string;
}

/**
 * Stack del frontend Skorify (ADR-INFRA-0003): bucket S3 privado servido
 * detrás de CloudFront con OAC. Sin runtime servidor. El bucket no expone
 * acceso público; solo CloudFront puede leer vía OAC.
 *
 * Asume que el contenido es Next.js en modo `output: 'export'` (HTML
 * estático por ruta). Por eso 403/404 se mapean a `/404.html` con
 * `response_code = 404` — no se hace el patrón SPA `→ /index.html (200)`.
 */
export class SkorifyFrontendStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: SkorifyFrontendStackProps) {
    super(scope, id, props);

    const env = props.skorifyEnvironment;
    const aliases = props.domainAliases ?? [];
    const certArn = props.acmCertificateArn ?? '';

    if (aliases.length > 0 && certArn.length === 0) {
      throw new Error(
        `Se declararon domainAliases (${aliases.join(', ')}) pero falta acmCertificateArn. ` +
          `El cert ACM (en us-east-1) es obligatorio para asignar aliases en CloudFront.`,
      );
    }

    // ============================================================
    // S3 bucket privado
    // ============================================================
    // BucketName explícito: el workflow de deploy-assets necesita conocerlo
    // antes de cdk synth (lo arma con `skorify-frontend-{env}` por convención).
    this.bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: `skorify-frontend-${env}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false,
      // En dev se puede borrar limpio; en stg/prd dejar RETAIN para no perder
      // los assets ante un destroy accidental del stack.
      removalPolicy:
        env === 'prd' || env === 'stg'
          ? cdk.RemovalPolicy.RETAIN
          : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: env === 'dev',
    });

    // ============================================================
    // Origin Access Control (reemplaza al OAI legacy)
    // ============================================================
    const oac = new cloudfront.S3OriginAccessControl(this, 'Oac', {
      originAccessControlName: `skorify-frontend-${env}-oac`,
      description: `OAC para skorify-frontend-${env}`,
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    // ============================================================
    // Response Headers Policy: HSTS + endurecimientos típicos
    // ============================================================
    // CSP base intencionalmente permisiva con styles inline (MUI los usa)
    // y `connect-src 'self'` que se irá ampliando cuando el frontend
    // empiece a llamar al backend. Iterar con el sitio desplegado.
    const cspBase = [
      `default-src 'self'`,
      `script-src 'self'`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: blob:`,
      `font-src 'self' data:`,
      `connect-src 'self'`,
      `frame-ancestors 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
    ].join('; ');

    const responseHeaders = new cloudfront.ResponseHeadersPolicy(this, 'Headers', {
      responseHeadersPolicyName: `skorify-frontend-${env}-headers`,
      comment: `Security headers para skorify-frontend-${env}`,
      securityHeadersBehavior: {
        strictTransportSecurity: {
          accessControlMaxAge: cdk.Duration.days(730),
          includeSubdomains: true,
          preload: true,
          override: true,
        },
        contentTypeOptions: { override: true },
        frameOptions: {
          frameOption: cloudfront.HeadersFrameOption.DENY,
          override: true,
        },
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.SAME_ORIGIN,
          override: true,
        },
        contentSecurityPolicy: {
          contentSecurityPolicy: cspBase,
          override: true,
        },
      },
    });

    // ============================================================
    // CloudFront Function: rewrite de rutas a archivos .html
    // ============================================================
    // Next.js static export con `trailingSlash: false` (default) emite un
    // archivo `<ruta>.html` por cada página. Pero el navegador pide `/groups`,
    // no `/groups.html`, y S3 no entiende esa equivalencia: devuelve 403 y
    // CloudFront cae al error response (/404.html).
    //
    // Soluciono con un viewer-request rewrite:
    //   /                       -> /index.html
    //   /ruta/                  -> /ruta/index.html        (trailingSlash: true)
    //   /ruta  (sin extensión)  -> /ruta.html              (trailingSlash: false)
    //   /algo.ext               -> sin cambio              (asset)
    //
    // Si el equipo frontend decide `trailingSlash: true`, hay que actualizar
    // este código para que `/ruta` → `/ruta/index.html` (no `.html`).
    //
    // Limitación: este rewrite solo funciona para rutas con HTML estático
    // en el bucket. Rutas con segmentos dinámicos sin `generateStaticParams`
    // (ej. `groups/[id]`, `join/[code]`) NO existen en el export y caen al
    // 404 igual. Ver README "Limitaciones".
    const rewriteFn = new cloudfront.Function(this, 'RewriteHtml', {
      functionName: `skorify-frontend-${env}-rewrite`,
      comment: 'Rewrite de rutas para Next.js static export.',
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Raíz: sirve index.html
  if (uri === '/') {
    request.uri = '/index.html';
    return request;
  }

  // Termina en '/': sirve index.html dentro
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
    return request;
  }

  // El último segmento tiene punto: es un asset (.js, .css, .png, etc.)
  var lastSlash = uri.lastIndexOf('/');
  var lastSegment = uri.substring(lastSlash + 1);
  if (lastSegment.indexOf('.') !== -1) {
    return request;
  }

  // Ruta sin extensión: agregar .html
  request.uri = uri + '.html';
  return request;
}
`.trim()),
    });

    // ============================================================
    // CloudFront distribution
    // ============================================================
    const origin = origins.S3BucketOrigin.withOriginAccessControl(this.bucket, {
      originAccessControl: oac,
    });

    const distributionProps: cloudfront.DistributionProps = {
      comment: `skorify-frontend-${env}`,
      defaultRootObject: 'index.html',
      enabled: true,
      // SSG: 403 y 404 sirven /404.html con código 404 real (no SPA-style
      // 200; ver ADR-INFRA-0003 punto 9).
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      defaultBehavior: {
        origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        responseHeadersPolicy: responseHeaders,
        functionAssociations: [
          {
            function: rewriteFn,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      additionalBehaviors: {
        // Assets con content hash de Next.js: nunca cambian para un mismo
        // hash, así que aplican cache largo + immutable. La cache policy
        // managed `CachingOptimized` ya da TTL razonable; el max-age long
        // termina expresándose en el response (los assets vienen con
        // Cache-Control immutable del bucket o del CDN edge).
        // No le pongo el rewriteFn: los assets tienen extensión y la
        // function lo dejaría pasar igual, pero ahorrar invocaciones es
        // más barato (CloudFront Functions se cobran por request).
        '/_next/static/*': {
          origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED_FOR_UNCOMPRESSED_OBJECTS,
          compress: true,
          responseHeadersPolicy: responseHeaders,
        },
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      ...(aliases.length > 0
        ? {
            domainNames: aliases,
            certificate: acm.Certificate.fromCertificateArn(this, 'Cert', certArn),
          }
        : {}),
    };

    this.distribution = new cloudfront.Distribution(this, 'Distribution', distributionProps);

    // ============================================================
    // Outputs (consume el workflow deploy-assets)
    // ============================================================
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'Bucket de assets del frontend; lo usa aws s3 sync.',
      exportName: `skorify-frontend-${env}-bucket-name`,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'ID de la distro de CloudFront; lo usa cloudfront create-invalidation.',
      exportName: `skorify-frontend-${env}-distribution-id`,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
      description: 'Hostname público de la distro (*.cloudfront.net o el alias custom).',
    });
  }
}
