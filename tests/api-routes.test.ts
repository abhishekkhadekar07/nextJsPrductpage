/* @vitest-environment node */

import { setCookies } from './mocks/next';
import { AUTH_COOKIE_NAME, createAuthCookieValue } from '@/lib/auth';

describe('app/api/posts/route.ts', () => {
  it('GET returns posts payload', async () => {
    const { GET } = await import('@/app/api/posts/route');
    const response = await GET(new Request('http://localhost/api/posts'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('POST rejects unsupported content type', async () => {
    const { POST } = await import('@/app/api/posts/route');
    const response = await POST(
      new Request('http://localhost/api/posts', {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body: 'title=abc',
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'Unsupported content type',
    });
  });
});

describe('app/api/products/route.ts', () => {
  it('GET returns unauthorized when auth cookie is missing', async () => {
    setCookies({});
    const { GET } = await import('@/app/api/products/route');
    const response = await GET(new Request('http://localhost/api/products'));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ success: false, message: 'Unauthorized' });
  });

  it('POST validates required fields for authenticated requests', async () => {
    setCookies({ [AUTH_COOKIE_NAME]: 'token' });
    const { POST } = await import('@/app/api/products/route');
    const response = await POST(
      new Request('http://localhost/api/products', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'Only title' }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: expect.stringContaining('Missing required fields'),
    });
  });
});

describe('app/api/orders/route.ts', () => {
  it('GET returns unauthorized when auth cookie is missing', async () => {
    setCookies({});
    const { GET } = await import('@/app/api/orders/route');
    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ success: false, message: 'Unauthorized' });
  });

  it('POST creates order for authenticated user and GET returns user orders', async () => {
    setCookies({ [AUTH_COOKIE_NAME]: createAuthCookieValue('alice') });
    const { GET, POST } = await import('@/app/api/orders/route');

    const createResponse = await POST(
      new Request('http://localhost/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: 101, title: 'Test Product', price: 20, qty: 2 }],
        }),
      })
    );
    const createData = await createResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createData.success).toBe(true);

    const listResponse = await GET();
    const listData = await listResponse.json();

    expect(listResponse.status).toBe(200);
    expect(listData.success).toBe(true);
    expect(Array.isArray(listData.data)).toBe(true);
    expect(listData.data.length).toBeGreaterThan(0);
    expect(listData.data[0].username).toBe('alice');
  });
});

describe('app/api/stocks/route.ts', () => {
  it('GET returns stock list', async () => {
    const { GET } = await import('@/app/api/stocks/route');
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST validates payload', async () => {
    const { POST } = await import('@/app/api/stocks/route');
    const response = await POST(
      new Request('http://localhost/api/stocks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 123, BUY: 'abc' }),
      })
    );

    expect(response.status).toBe(400);
  });

  it('PUT and DELETE handle not found', async () => {
    const { PUT, DELETE } = await import('@/app/api/stocks/route');

    const putResponse = await PUT(
      new Request('http://localhost/api/stocks', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'UNKNOWN', BUY: 10 }),
      })
    );
    expect(putResponse.status).toBe(404);

    const deleteResponse = await DELETE(
      new Request('http://localhost/api/stocks', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'UNKNOWN' }),
      })
    );
    expect(deleteResponse.status).toBe(404);
  });
});

describe('app/api/stocks/realtime/route.ts', () => {
  it('returns bad request for empty symbols query', async () => {
    const { GET } = await import('@/app/api/stocks/realtime/route');
    const response = await GET(new Request('http://localhost/api/stocks/realtime?symbols=%20'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: expect.stringContaining('Provide at least one stock symbol'),
    });
  });
});

describe('app/api/auth routes', () => {
  it('login rejects missing credentials', async () => {
    const { POST } = await import('@/app/api/auth/login/route');
    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: '', password: '' }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'Username and password are required',
    });
  });

  it('signup rejects unsupported content type', async () => {
    const { POST } = await import('@/app/api/auth/signup/route');
    const response = await POST(
      new Request('http://localhost/api/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body: 'x',
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'Unsupported content type',
    });
  });

  it('me route reflects auth cookie', async () => {
    setCookies({ [AUTH_COOKIE_NAME]: createAuthCookieValue('alice') });
    const { GET } = await import('@/app/api/auth/me/route');
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.authenticated).toBe(true);
    expect(data.user).toEqual({ username: 'alice' });
  });

  it('logout clears auth cookie', async () => {
    const { POST } = await import('@/app/api/auth/logout/route');
    const response = await POST();
    const setCookieHeader = response.headers.get('set-cookie') || '';

    expect(response.status).toBe(200);
    expect(setCookieHeader).toContain(`${AUTH_COOKIE_NAME}=`);
    expect(setCookieHeader).toContain('Max-Age=0');
  });
});
