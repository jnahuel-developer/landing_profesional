import { createHmac, timingSafeEqual } from 'node:crypto';
export const preferenceCookie = 'privacy_preference';
export const visitorCookie = 'analytics_visitor';
export const sessionCookie = 'analytics_session';
export const preferenceAge = 180 * 86_400;
export const visitorAge = 30 * 86_400;
export interface SignedValue {
  kind: 'accepted' | 'rejected' | 'visitor' | 'session';
  expires: number;
  id?: string;
  receipt?: string;
}
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export function signCookie(value: SignedValue, secret: string) {
  const data = Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${data}.${createHmac('sha256', secret).update(data).digest('base64url')}`;
}
export function readCookie(
  header: string | undefined,
  name: string,
  secret: string,
  now: number,
): SignedValue | null {
  try {
    const value = header
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1);
    if (!value || value.length > 1024) return null;
    const [data, signature, extra] = value.split('.');
    if (!data || !signature || extra) return null;
    const expected = createHmac('sha256', secret).update(data).digest();
    const supplied = Buffer.from(signature, 'base64url');
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString()) as SignedValue;
    if (
      !parsed ||
      !['accepted', 'rejected', 'visitor', 'session'].includes(parsed.kind) ||
      !Number.isSafeInteger(parsed.expires) ||
      parsed.expires <= now ||
      parsed.expires > now + preferenceAge * 1000
    )
      return null;
    if (parsed.kind !== 'rejected' && (!parsed.id || !uuid.test(parsed.id))) return null;
    if (
      (parsed.kind === 'visitor' || parsed.kind === 'session') &&
      (!parsed.receipt || !uuid.test(parsed.receipt))
    )
      return null;
    return parsed;
  } catch {
    return null;
  }
}
export function cookieHeader(name: string, value: string, age: number, secure: boolean) {
  return `${name}=${value}; Max-Age=${age}; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}
