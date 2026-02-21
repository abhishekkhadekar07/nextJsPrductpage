// Shared cache tags for products list/detail so writes can invalidate both scopes.
export const PRODUCTS_CACHE_TAG = 'products';

export function productCacheTag(id: string | number) {
  return `product:${String(id)}`;
}
