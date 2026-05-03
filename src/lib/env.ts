import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url('NEXT_PUBLIC_API_URL debe ser una URL válida'),
  NEXT_PUBLIC_APP_URL: z.url('NEXT_PUBLIC_APP_URL debe ser una URL válida'),
  NEXT_PUBLIC_AUTH_MODE: z.enum(['mock', 'api']).default('mock'),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_AUTH_MODE: process.env.NEXT_PUBLIC_AUTH_MODE,
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
