import 'server-only';
import { cookies } from 'next/headers';
import type { AdminSessionResponse } from '@portfolio/contracts';

export async function getAdminSession(): Promise<
  { state: 'authorized'; session: AdminSessionResponse } | { state: 'unauthorized' | 'unavailable' }
> {
  const token = (await cookies()).get('admin_session')?.value;
  if (!token) return { state: 'unauthorized' };
  try {
    const result = await fetch(
      `${process.env.API_INTERNAL_ORIGIN ?? 'http://127.0.0.1:4000'}/api/v1/admin/auth/session`,
      {
        cache: 'no-store',
        headers: { cookie: `admin_session=${/^[a-f0-9]{64}$/.test(token) ? token : 'invalid'}` },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (result.status === 401) return { state: 'unauthorized' };
    if (!result.ok) return { state: 'unavailable' };
    return { state: 'authorized', session: (await result.json()) as AdminSessionResponse };
  } catch {
    return { state: 'unavailable' };
  }
}
