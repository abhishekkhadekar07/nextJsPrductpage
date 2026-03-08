import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, parseAuthCookieValue } from '../../../lib/auth';
import { createOrderForUser, getOrdersByUsername, type OrderItem } from '../../actions/orders';

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      message: 'Unauthorized',
    },
    { status: 401 }
  );
}

export async function GET() {
  try {
    const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
    const authUser = parseAuthCookieValue(authCookie?.value);
    if (!authUser?.username) {
      return unauthorizedResponse();
    }

    const result = await getOrdersByUsername(authUser.username);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch orders',
        error: String(error),
      },
      { status: 500 }
    );
  }
}

type CreateOrderBody = {
  items?: OrderItem[];
};

export async function POST(request: Request) {
  try {
    const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
    const authUser = parseAuthCookieValue(authCookie?.value);
    if (!authUser?.username) {
      return unauthorizedResponse();
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsupported content type',
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as CreateOrderBody;
    if (!Array.isArray(body.items)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Items array is required',
        },
        { status: 400 }
      );
    }

    const result = await createOrderForUser(authUser.username, body.items);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to place order',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
