import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const scriptSrc = isDev 
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval';" 
  : "script-src 'self' 'unsafe-inline';";

const trustedTypes = isDev
  ? "trusted-types nextjs nextjs#dev; require-trusted-types-for 'script';"
  : "trusted-types nextjs; require-trusted-types-for 'script';";

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; ${scriptSrc} style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com; frame-ancestors 'none'; object-src 'none'; ${trustedTypes}`,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
