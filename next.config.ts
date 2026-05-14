import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Deploy a S3 + CloudFront (ADR-INFRA-0003 en Skorify_DevOps).
  // 'next build' emite la app como HTML/CSS/JS estático en 'out/'. Las
  // rutas dinámicas con segmentos runtime requieren manejo aparte:
  // ver infra/README.md sección "Limitaciones conocidas".
  output: 'export',
};

export default withNextIntl(nextConfig);
