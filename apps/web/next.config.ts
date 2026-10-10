import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  async rewrites() {
    const origin = process.env.API_INTERNAL_ORIGIN ?? 'http://127.0.0.1:4000';
    return ['contacts', 'privacy/consent', 'analytics/events'].map((path) => ({
      source: `/api/v1/${path}`,
      destination: `${origin}/api/v1/${path}`,
    }));
  },
};

export default withNextIntl(nextConfig);
