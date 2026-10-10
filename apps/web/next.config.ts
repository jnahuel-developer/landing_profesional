import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  async rewrites() {
    const origin = process.env.API_INTERNAL_ORIGIN ?? 'http://127.0.0.1:4000';
    return [{ source: '/api/v1/contacts', destination: `${origin}/api/v1/contacts` }];
  },
};

export default withNextIntl(nextConfig);
