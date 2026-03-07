import { PRODUCTS_CACHE_TAG, productCacheTag } from '@/lib/cache-tags';
import { normalizeUsername, resolveRedirect, validateSignupInput } from '@/lib/auth';

describe('Jest Sanity Checks', () => {
  it('checks cache tag helpers', () => {
    expect(PRODUCTS_CACHE_TAG).toBe('products');
    expect(productCacheTag(42)).toBe('product:42');
  });

  it('checks auth helpers', () => {
    expect(normalizeUsername('  User_1 ')).toBe('user_1');
    expect(resolveRedirect('/products', '/login')).toBe('/products');
    expect(resolveRedirect('https://evil.com', '/login')).toBe('/login');
    expect(validateSignupInput('ab', '123456')).toEqual({
      valid: false,
      message: 'Username must be at least 3 characters long',
    });
  });
});
