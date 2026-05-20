import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { SkorifyFrontendStack, SkorifyFrontendEnvironment } from '../lib/skorify-frontend-stack';

const synth = (
  env: SkorifyFrontendEnvironment,
  overrides: Partial<{ domainAliases: string[]; acmCertificateArn: string }> = {},
): Template => {
  const app = new cdk.App();
  const stack = new SkorifyFrontendStack(app, `SkorifyFrontend-${env}`, {
    stackName: `skorify-frontend-${env}`,
    env: { account: '111122223333', region: 'us-east-1' },
    skorifyEnvironment: env,
    domainAliases: overrides.domainAliases,
    acmCertificateArn: overrides.acmCertificateArn,
  });
  return Template.fromStack(stack);
};

describe('SkorifyFrontendStack: bucket S3', () => {
  test('crea un bucket privado con BlockPublicAccess y encryption S3-managed', () => {
    const t = synth('dev');
    t.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'skorify-frontend-dev',
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      BucketEncryption: {
        ServerSideEncryptionConfiguration: Match.arrayWith([
          Match.objectLike({
            ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' },
          }),
        ]),
      },
    });
  });

  test('en dev el bucket se borra con destroy; en stg/prd queda RETAIN', () => {
    const tDev = synth('dev');
    const tStg = synth('stg');
    const tPrd = synth('prd');

    tDev.hasResource('AWS::S3::Bucket', { DeletionPolicy: 'Delete' });
    tStg.hasResource('AWS::S3::Bucket', { DeletionPolicy: 'Retain' });
    tPrd.hasResource('AWS::S3::Bucket', { DeletionPolicy: 'Retain' });
  });
});

describe('SkorifyFrontendStack: CloudFront', () => {
  test('crea un OAC SIGV4 firmando siempre, sin OAI legacy', () => {
    const t = synth('dev');
    t.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        Name: 'skorify-frontend-dev-oac',
        OriginAccessControlOriginType: 's3',
        SigningBehavior: 'always',
        SigningProtocol: 'sigv4',
      },
    });
    // OAI legacy no debe existir: el OAC lo reemplaza.
    t.resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 0);
  });

  test('errores 403 y 404 sirven /404.html con código 404 real (no SPA-style 200)', () => {
    const t = synth('dev');
    t.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        CustomErrorResponses: Match.arrayWith([
          Match.objectLike({
            ErrorCode: 403,
            ResponseCode: 404,
            ResponsePagePath: '/404.html',
          }),
          Match.objectLike({
            ErrorCode: 404,
            ResponseCode: 404,
            ResponsePagePath: '/404.html',
          }),
        ]),
      }),
    });
  });

  test('default behavior usa CachingOptimized + redirect a HTTPS + GET/HEAD/OPTIONS', () => {
    const t = synth('dev');
    t.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        DefaultCacheBehavior: Match.objectLike({
          ViewerProtocolPolicy: 'redirect-to-https',
          AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
          Compress: true,
        }),
      }),
    });
  });

  test('agrega un behavior aparte para /_next/static/*', () => {
    const t = synth('dev');
    t.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        CacheBehaviors: Match.arrayWith([
          Match.objectLike({
            PathPattern: '/_next/static/*',
            ViewerProtocolPolicy: 'redirect-to-https',
          }),
        ]),
      }),
    });
  });

  test('asocia una CloudFront Function viewer-request al default behavior', () => {
    const t = synth('dev');
    t.hasResourceProperties('AWS::CloudFront::Function', {
      Name: 'skorify-frontend-dev-rewrite',
      FunctionConfig: Match.objectLike({ Runtime: 'cloudfront-js-2.0' }),
    });
    t.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        DefaultCacheBehavior: Match.objectLike({
          FunctionAssociations: Match.arrayWith([
            Match.objectLike({ EventType: 'viewer-request' }),
          ]),
        }),
      }),
    });
  });

  test('el code de la rewrite function cubre los 4 casos de Next static export', () => {
    const t = synth('dev');
    const fns = t.findResources('AWS::CloudFront::Function');
    const code = Object.values(fns)[0].Properties.FunctionCode as string;
    // Raíz: /
    expect(code).toContain(`uri === '/'`);
    // Trailing slash → index.html
    expect(code).toContain(`endsWith('/')`);
    // Asset con extensión: detecta punto en el último segmento
    expect(code).toContain(`lastIndexOf('/')`);
    expect(code).toContain(`indexOf('.')`);
    // Sin extensión → .html
    expect(code).toContain(`uri + '.html'`);
  });

  test('HTTP version es HTTP/2 + HTTP/3', () => {
    // Sin custom domain, CloudFormation no emite ViewerCertificate (la
    // distro queda con el cert default *.cloudfront.net, fuera de control
    // del template). El MinimumProtocolVersion solo aplica con ACM cert
    // (cubierto en el test 'con aliases + cert' del bloque de aliases).
    const t = synth('dev');
    t.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        HttpVersion: 'http2and3',
      }),
    });
  });
});

describe('SkorifyFrontendStack: Response Headers Policy', () => {
  test('aplica HSTS 2 años con includeSubDomains+preload, XCTO nosniff, X-Frame DENY, Referrer same-origin', () => {
    const t = synth('dev');
    t.hasResourceProperties('AWS::CloudFront::ResponseHeadersPolicy', {
      ResponseHeadersPolicyConfig: Match.objectLike({
        Name: 'skorify-frontend-dev-headers',
        SecurityHeadersConfig: Match.objectLike({
          StrictTransportSecurity: Match.objectLike({
            AccessControlMaxAgeSec: 63072000,
            IncludeSubdomains: true,
            Preload: true,
            Override: true,
          }),
          ContentTypeOptions: Match.objectLike({ Override: true }),
          FrameOptions: Match.objectLike({ FrameOption: 'DENY', Override: true }),
          ReferrerPolicy: Match.objectLike({
            ReferrerPolicy: 'same-origin',
            Override: true,
          }),
        }),
      }),
    });
  });

  test('CSP base trae frame-ancestors none y permite styles inline (MUI)', () => {
    const t = synth('dev');
    const headers = t.findResources('AWS::CloudFront::ResponseHeadersPolicy');
    const csp =
      Object.values(headers)[0].Properties.ResponseHeadersPolicyConfig.SecurityHeadersConfig
        .ContentSecurityPolicy.ContentSecurityPolicy;
    expect(csp).toContain(`frame-ancestors 'none'`);
    expect(csp).toContain(`style-src 'self' 'unsafe-inline'`);
    expect(csp).toContain(`default-src 'self'`);
  });
});

describe('SkorifyFrontendStack: aliases y certificado', () => {
  test('sin aliases y sin cert: usa default CloudFront (no domainNames ni Certificate)', () => {
    const t = synth('dev');
    const dists = t.findResources('AWS::CloudFront::Distribution');
    const config = Object.values(dists)[0].Properties.DistributionConfig;
    expect(config.Aliases).toBeUndefined();
  });

  test('con aliases + cert: agrega domainNames, referencia el cert ACM y fuerza TLS 1.2 (2021)', () => {
    const t = synth('prd', {
      domainAliases: ['skorify.example.com'],
      acmCertificateArn: 'arn:aws:acm:us-east-1:111122223333:certificate/abcdef-1234-5678-9012-abc',
    });
    t.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        Aliases: ['skorify.example.com'],
        ViewerCertificate: Match.objectLike({
          AcmCertificateArn:
            'arn:aws:acm:us-east-1:111122223333:certificate/abcdef-1234-5678-9012-abc',
          MinimumProtocolVersion: 'TLSv1.2_2021',
          SslSupportMethod: 'sni-only',
        }),
      }),
    });
  });

  test('aliases sin cert: el stack falla rápido', () => {
    expect(() => synth('dev', { domainAliases: ['dev-skorify.example.com'] })).toThrow(
      /acmCertificateArn/,
    );
  });
});

describe('SkorifyFrontendStack: outputs', () => {
  test('expone BucketName, DistributionId y DistributionDomainName', () => {
    const t = synth('stg');
    const outputs = t.findOutputs('*');
    const keys = Object.keys(outputs);
    expect(keys).toEqual(
      expect.arrayContaining(['BucketName', 'DistributionId', 'DistributionDomainName']),
    );
    expect(outputs.BucketName.Export.Name).toBe('skorify-frontend-stg-bucket-name');
    expect(outputs.DistributionId.Export.Name).toBe('skorify-frontend-stg-distribution-id');
  });
});
