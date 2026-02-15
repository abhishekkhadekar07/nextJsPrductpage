import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAME,
  createAuthCookieValue,
  normalizeUsername,
} from '../../../../lib/auth';
import { validateCredentials } from '../../../../lib/auth-users';

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: LoginBody = {};

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await request.formData();
      body = {
        username: formData.get('username') as string,
        password: formData.get('password') as string,
      };
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsupported content type',
        },
        { status: 400 }
      );
    }

    const username = normalizeUsername(String(body.username ?? ''));
    const password = String(body.password ?? '');

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username and password are required',
        },
        { status: 400 }
      );
    }

    if (!(await validateCredentials(username, password))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: { username },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: createAuthCookieValue(username),
      httpOnly: true,
      sameSite: 'lax',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
