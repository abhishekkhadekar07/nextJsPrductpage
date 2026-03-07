/* @vitest-environment node */

import { NextRequest } from 'next/server';
import nextConfig from '@/next.config';
import { config, proxy } from '@/proxy';

describe('next.config.ts', () => {
  it('enables standalone output, cache components and remote image patterns', () => {
    expect(nextConfig.output).toBe('standalone');
    expect(nextConfig.cacheComponents).toBe(true);
    expect(nextConfig.images?.remotePatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ hostname: 'fakestoreapi.com' }),
        expect.objectContaining({ hostname: 'via.placeholder.com' }),
        expect.objectContaining({ hostname: 'placehold.co' }),
      ])
    );
  });
});

describe('proxy.ts', () => {
  it('redirects unauthenticated users from protected page to login', () => {
    const request = new NextRequest('http://localhost/products');
    const response = proxy(request);

    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(response.headers.get('location')).toContain('/login?from=%2Fproducts');
  });

  it('blocks protected API for unauthenticated users', async () => {
    const request = new NextRequest('http://localhost/api/products');
    const response = proxy(request);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toMatchObject({
      success: false,
      message: 'Unauthorized',
    });
  });

  it('redirects authenticated users away from /login', () => {
    const request = new NextRequest('http://localhost/login', {
      headers: {
        cookie: 'productpage_auth=alice',
      },
    });
    const response = proxy(request);

    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(response.headers.get('location')).toContain('/products');
  });

  it('allows static assets', () => {
    const request = new NextRequest('http://localhost/_next/static/chunks/main.js');
    const response = proxy(request);

    expect(response.headers.get('location')).toBeNull();
  });

  it('exports expected matcher config', () => {
    expect(config.matcher).toBe('/:path*');
  });
});
