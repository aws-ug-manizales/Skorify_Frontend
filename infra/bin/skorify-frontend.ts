#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SkorifyFrontendStack, SkorifyFrontendEnvironment } from '../lib/skorify-frontend-stack';

// Mapa ambiente → cuenta AWS. Espejo de `SKORIFY_ACCOUNT_TO_ENV` en
// Skorify_DevOps/lib/config/organizations-config.ts. Si esto se desincroniza,
// algún deploy va a fallar — preferible que falle acá con un mensaje claro
// y no a la mitad de un `cdk deploy` en la cuenta equivocada.
const ACCOUNT_BY_ENV: Record<SkorifyFrontendEnvironment, string> = {
  dev: '968306633562',
  stg: '553284493694',
  prd: '151646410766',
};

const app = new cdk.App();

// SKORIFY_ENVIRONMENT es el contrato con el workflow (cd-{env}.yml lo setea).
// Si no viene, fallamos rápido para que no se despliegue contra la cuenta
// equivocada por accidente.
const envName = process.env.SKORIFY_ENVIRONMENT;
if (!isSkorifyEnv(envName)) {
  throw new Error(
    `SKORIFY_ENVIRONMENT inválido o ausente: '${envName ?? ''}'. ` +
      `Esperado uno de: dev | stg | prd.`,
  );
}

// Validamos que la cuenta activa matchee el ambiente. Sin esto, un local
// deploy con SKORIFY_ENVIRONMENT=prd y credenciales de DEV intentaría
// crear `skorify-frontend-prd` en la cuenta de DEV; el stack del workflow
// del ambiente correcto entraría en conflicto luego.
const activeAccount = process.env.CDK_DEFAULT_ACCOUNT;
const expectedAccount = ACCOUNT_BY_ENV[envName];
if (activeAccount && activeAccount !== expectedAccount) {
  throw new Error(
    `Las credenciales activas son de la cuenta ${activeAccount}, pero ` +
      `SKORIFY_ENVIRONMENT=${envName} corresponde a la cuenta ${expectedAccount}. ` +
      `Cambiá el perfil AWS (AWS_PROFILE=skorify-${envName}) o ajustá SKORIFY_ENVIRONMENT.`,
  );
}

// Dominios y certificado ACM son opcionales. Cuando estén vacíos el stack
// se queda con el dominio *.cloudfront.net y el cert default de CloudFront.
// Cuando se setean (vars del workflow o cdk context), el stack agrega los
// aliases y referencia el cert ACM (que debe vivir en us-east-1).
const domainAliases = parseList(process.env.SKORIFY_FRONTEND_DOMAIN_ALIASES);
const acmCertificateArn = process.env.SKORIFY_FRONTEND_ACM_CERT_ARN ?? '';

new SkorifyFrontendStack(app, `SkorifyFrontend-${envName}`, {
  stackName: `skorify-frontend-${envName}`,
  description: `Infra del frontend Skorify (${envName}): S3 privado + CloudFront + OAC. ADR-INFRA-0003.`,
  env: {
    // Estos vienen del CLI/rol activo. El workflow asume skorify-frontend-infra
    // en la cuenta del environment, así que CDK_DEFAULT_ACCOUNT ya resuelve.
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  skorifyEnvironment: envName,
  domainAliases,
  acmCertificateArn,
  tags: {
    Environment: envName,
    Project: 'Skorify_Frontend',
    ManagedBy: 'AWS CDK',
  },
});

const isSkorifyEnv = (value: string | undefined): value is SkorifyFrontendEnvironment => {
  return value === 'dev' || value === 'stg' || value === 'prd';
};

const parseList = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};
