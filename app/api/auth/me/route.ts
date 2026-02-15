import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, parseAuthCookieValue } from '../../../../lib/auth';

export async function GET() {
  const cookieValue = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const user = parseAuthCookieValue(cookieValue);

  return NextResponse.json({
    authenticated: Boolean(user),
    user,
  });
}
