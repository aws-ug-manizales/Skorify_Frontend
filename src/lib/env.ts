import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL debe ser una URL válida'),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
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
