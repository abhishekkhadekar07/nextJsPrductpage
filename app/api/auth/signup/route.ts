import { NextResponse } from 'next/server';
import { registerUser } from '../../../../lib/auth-users';

type SignupBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: SignupBody = {};

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

    const result = await registerUser(String(body.username ?? ''), String(body.password ?? ''));

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: result.code === 'exists' ? 409 : 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: result.user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
