import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url('NEXT_PUBLIC_API_URL debe ser una URL válida'),
  NEXT_PUBLIC_APP_URL: z.url('NEXT_PUBLIC_APP_URL debe ser una URL válida'),
  NEXT_PUBLIC_USER_POOL_ID: z
    .string()
    .regex(/^[\w-]+_[A-Za-z0-9]+$/, 'NEXT_PUBLIC_USER_POOL_ID debe tener el formato <region>_<id>'),
  NEXT_PUBLIC_CLIENT_ID: z.string().min(1, 'NEXT_PUBLIC_CLIENT_ID es obligatorio'),
  NEXT_PUBLIC_COGNITO_DOMAIN: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
  NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
  NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
});

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(
    `\n\n[env] Variables de entorno inválidas o faltantes:\n${missing}\n\n` +
      `Copia .env.example como .env.local y completa los valores.\n`,
  );
}

export const env = parsed.data;

export const cognitoRegion = parsed.data.NEXT_PUBLIC_USER_POOL_ID.split('_')[0];
