import cartReducer, { addItem, clearCart, removeItem, setQty } from '@/store/cartSlice';
import postsReducer, { addPost } from '@/store/postsSlice';
import stocksReducer, {
  addStock,
  applyRealtimeStocks,
  deleteStock,
  hydrateStocks,
  updateStock,
} from '@/store/stocksSlice';
import store from '@/store/store';

describe('store/cartSlice.ts', () => {
  it('adds, updates qty, removes and clears cart items', () => {
    let state = cartReducer(undefined, { type: 'init' });

    state = cartReducer(state, addItem({ id: 10, title: 'Phone', price: 99.5 }));
    state = cartReducer(state, addItem({ id: 10, qty: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].qty).toBe(3);

    state = cartReducer(state, setQty({ id: 10, qty: 7 }));
    expect(state.items[0].qty).toBe(7);

    state = cartReducer(state, removeItem({ id: 10 }));
    expect(state.items).toHaveLength(0);

    state = cartReducer(state, addItem({ id: 11, qty: 1 }));
    state = cartReducer(state, clearCart());
    expect(state.items).toEqual([]);
  });
});

describe('store/postsSlice.ts', () => {
  it('adds a valid post and ignores empty values', () => {
    const initial = postsReducer(undefined, { type: 'init' });
    const stateWithPost = postsReducer(
      initial,
      addPost({ title: '  New Post  ', body: '  Body text  ', userId: 9 })
    );

    expect(stateWithPost.items.at(-1)).toMatchObject({
      title: 'New Post',
      body: 'Body text',
      userId: 9,
    });

    const afterInvalid = postsReducer(stateWithPost, addPost({ title: '   ', body: '   ', userId: 1 }));
    expect(afterInvalid.items).toHaveLength(stateWithPost.items.length);
  });
});

describe('store/stocksSlice.ts', () => {
  it('hydrates, adds, updates, deletes and applies realtime updates', () => {
    let state = stocksReducer(undefined, { type: 'init' });

    state = stocksReducer(
      state,
      hydrateStocks([
        { name: '  abc  ', BUY: 100 },
        { name: '', BUY: 20 },
      ] as never)
    );
    expect(state.hydrated).toBe(true);
    expect(state.items).toEqual([{ name: 'ABC', BUY: 100 }]);

    state = stocksReducer(state, addStock({ name: 'abc', BUY: 200 }));
    expect(state.items).toEqual([{ name: 'ABC', BUY: 200 }]);

    state = stocksReducer(state, addStock({ name: 'TCS', BUY: 4000 }));
    state = stocksReducer(state, updateStock({ name: 'tcs', BUY: 4100 }));
    expect(state.items.find((item) => item.name === 'TCS')?.BUY).toBe(4100);

    state = stocksReducer(state, applyRealtimeStocks([{ name: 'new', BUY: 50 }]));
    expect(state.items.find((item) => item.name === 'NEW')?.BUY).toBe(50);

    state = stocksReducer(state, deleteStock({ name: 'abc' }));
    expect(state.items.some((item) => item.name === 'ABC')).toBe(false);
  });
});

describe('store/store.ts', () => {
  it('creates all expected slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('cart');
    expect(state).toHaveProperty('stocks');
    expect(state).toHaveProperty('posts');
  });
});
