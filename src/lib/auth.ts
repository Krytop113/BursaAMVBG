import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET_STRING = process.env.SESSION_SECRET || 'fallback-secret-key-12345';
const JWT_SECRET_BYTES = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = 'user_session';

export interface UserSessionPayload {
  id: number;
  username: string;
  role?: number;
  sessionToken: string;
}

export async function signToken(payload: UserSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET_BYTES);
}

export async function verifyTokenEdge(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_BYTES);
    return payload as unknown as UserSessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyTokenEdge(token);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
