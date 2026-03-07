import { vi } from 'vitest';
import { cn } from '@/lib/utils';
import { normalizeImageUrl } from '@/lib/image-url';
import { PRODUCTS_CACHE_TAG, productCacheTag } from '@/lib/cache-tags';
import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAME,
  createAuthCookieValue,
  isSafeRedirect,
  normalizeUsername,
  parseAuthCookieValue,
  resolveRedirect,
  validateSignupInput,
} from '@/lib/auth';
import { fetchWithCacheMonitoring } from '@/lib/cache-utils';

describe('lib/utils.ts', () => {
  it('merges class names and tailwind conflicts', () => {
    expect(cn('p-2', 'text-sm', 'p-4')).toContain('p-4');
    expect(cn('p-2', 'text-sm', 'p-4')).not.toContain('p-2');
  });
});

describe('lib/image-url.ts', () => {
  it('returns placehold.co fallback for missing url', () => {
    const result = normalizeImageUrl('', 'Product Name');
    expect(result).toBe('https://placehold.co/300x300?text=Product%20Name');
  });

  it('rewrites via.placeholder.com to placehold.co', () => {
    const result = normalizeImageUrl('https://via.placeholder.com/640x480?text=Hello', 'Fallback');
    expect(result).toBe('https://placehold.co/640x480?text=Hello');
  });

  it('keeps valid non-placeholder urls unchanged', () => {
    const result = normalizeImageUrl('https://example.com/image.png', 'Fallback');
    expect(result).toBe('https://example.com/image.png');
  });
});

describe('lib/cache-tags.ts', () => {
  it('exports expected cache tag values', () => {
    expect(PRODUCTS_CACHE_TAG).toBe('products');
    expect(productCacheTag(123)).toBe('product:123');
  });
});

describe('lib/auth.ts', () => {
  it('exports auth cookie constants', () => {
    expect(AUTH_COOKIE_NAME).toBe('productpage_auth');
    expect(AUTH_COOKIE_MAX_AGE).toBe(60 * 60 * 24 * 7);
  });

  it('normalizes usernames and validates signup input', () => {
    expect(normalizeUsername('  Alice_1 ')).toBe('alice_1');
    expect(validateSignupInput('ab', '123456')).toEqual({
      valid: false,
      message: 'Username must be at least 3 characters long',
    });
    expect(validateSignupInput('alice', '123456')).toEqual({
      valid: true,
      username: 'alice',
    });
  });

  it('handles auth cookie encoding and parsing', () => {
    const value = createAuthCookieValue('alice@example.com');
    expect(parseAuthCookieValue(value)).toEqual({ username: 'alice@example.com' });
    expect(parseAuthCookieValue('%E0%A4%A')).toBeNull();
  });

  it('allows only safe relative redirects', () => {
    expect(isSafeRedirect('/products')).toBe(true);
    expect(isSafeRedirect('https://example.com')).toBe(false);
    expect(resolveRedirect('/cart', '/products')).toBe('/cart');
    expect(resolveRedirect('//evil.com', '/products')).toBe('/products');
  });
});

describe('lib/cache-utils.ts', () => {
  it('returns HIT status from response header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        headers: { 'x-nextjs-cache': 'HIT' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchWithCacheMonitoring('https://example.com/api');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.cacheStatus).toBe('HIT');
    expect(result.isCacheHit).toBe(true);
    expect(result.data).toEqual({ ok: true });
  });

  it('falls back to duration heuristic when cache header is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 'ok' })))
    );
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1005);

    const result = await fetchWithCacheMonitoring('https://example.com/api');

    expect(result.duration).toBe(5);
    expect(result.cacheStatus).toBe('HIT');
    expect(result.isCacheHit).toBe(true);
    nowSpy.mockRestore();
  });

  it('throws clear error when response is not valid json', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('not-json', { headers: { 'x-nextjs-cache': 'MISS' } }))
    );
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(fetchWithCacheMonitoring('https://example.com/api')).rejects.toThrow(
      'Invalid JSON response from API'
    );

    errorSpy.mockRestore();
  });
});
