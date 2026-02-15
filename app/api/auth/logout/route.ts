import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../../../lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    maxAge: 0,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
