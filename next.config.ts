import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// `output: 'export'` solo en producción (yarn build) — dev queda con rutas
// dinámicas runtime habilitadas para poder navegar a /groups/<id>, /join/<code>
// y futuras rutas runtime durante el desarrollo. En build estático para S3+CF
// (ADR-INFRA-0003), Next exige generateStaticParams en las rutas [param]
// (ver infra/README.md "Limitaciones conocidas").
const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' as const } : {}),
};

export default withNextIntl(nextConfig);
