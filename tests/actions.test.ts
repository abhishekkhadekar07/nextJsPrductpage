/* @vitest-environment node */

import { vi } from 'vitest';

describe('app/actions/posts.ts', () => {
  it('returns all posts and can fetch a single post', async () => {
    vi.resetModules();
    const postsActions = await import('@/app/actions/posts');

    const all = await postsActions.getAllPosts();
    expect(all.success).toBe(true);
    expect(all.count).toBeGreaterThan(0);

    const single = await postsActions.fetchPostById(1);
    expect(single.success).toBe(true);
    expect(single.data?.id).toBe(1);
  });

  it('creates post with incremental id and handles missing post lookup', async () => {
    vi.resetModules();
    const postsActions = await import('@/app/actions/posts');

    const before = await postsActions.getAllPosts();
    const created = await postsActions.createPost({
      title: 'Testing title',
      body: 'Testing body',
      userId: 42,
    });
    const after = await postsActions.getAllPosts();

    expect(created.success).toBe(true);
    expect(after.count).toBe(before.count + 1);

    const missing = await postsActions.getPostById(999999);
    expect(missing.success).toBe(false);
  });

  it('fetchPosts returns success false when fetch throws', async () => {
    vi.resetModules();
    const postsActions = await import('@/app/actions/posts');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    const result = await postsActions.fetchPosts();
    expect(result.success).toBe(false);
  });
});

describe('app/actions/stocks.ts', () => {
  it('fetchStocks returns data when request succeeds', async () => {
    vi.resetModules();
    const stocksActions = await import('@/app/actions/stocks');
    const payload = [{ name: 'ABC', BUY: 10 }];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(payload), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      )
    );

    const result = await stocksActions.fetchStocks();
    expect(result.success).toBe(true);
    expect(result.data).toEqual(payload);
  });

  it('deleteStock sends DELETE request and returns parsed json', async () => {
    vi.resetModules();
    const stocksActions = await import('@/app/actions/stocks');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await stocksActions.deleteStock('TCS');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'DELETE' });
    expect(result).toEqual({ success: true });
  });

  it('updateStock throws when response is not ok', async () => {
    vi.resetModules();
    const stocksActions = await import('@/app/actions/stocks');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('fail', { status: 500 })));

    await expect(stocksActions.updateStock('INFY', 1234)).rejects.toThrow('Failed to update stock');
  });
});

describe('app/actions/products.ts', () => {
  it('fetches products and finds one by id', async () => {
    vi.resetModules();
    const productActions = await import('@/app/actions/products');

    const all = await productActions.getAllProducts();
    expect(all.success).toBe(true);
    expect(all.count).toBeGreaterThan(0);

    const knownId = all.data?.[0]?.id;
    const one = await productActions.fetchProductById(String(knownId));
    expect(one.success).toBe(true);
    expect(one.data?.id).toBe(knownId);
  });

  it('handles validation and not found cases without mutating data', async () => {
    vi.resetModules();
    const productActions = await import('@/app/actions/products');

    const invalidCreate = await productActions.createProduct({
      title: '',
      price: 0,
      description: '',
      image: '',
    });
    expect(invalidCreate.success).toBe(false);

    const missingUpdate = await productActions.updateProduct(9999999, { title: 'Nope' });
    expect(missingUpdate.success).toBe(false);

    const missingDelete = await productActions.deleteProduct(9999999);
    expect(missingDelete.success).toBe(false);
  });
});
