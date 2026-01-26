

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = {
  id: number | string;
  title?: string;
  price?: number;
  image?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Partial<CartItem> & { id: number | string; qty?: number }>) {
      const { id, title, price, image, qty = 1 } = action.payload;
      const existing = state.items.find(i => i.id === id);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ id, title, price, image, qty } as CartItem);
      }
    },
    removeItem(state, action: PayloadAction<{ id: number | string }>) {
      state.items = state.items.filter(i => i.id !== action.payload.id);
    },
    clearCart(state) {
      state.items = [];
    },
    setQty(state, action: PayloadAction<{ id: number | string; qty: number }>) {
      const it = state.items.find(i => i.id === action.payload.id);
      if (it) it.qty = action.payload.qty;
    }
  }
});

export const { addItem, removeItem, clearCart, setQty } = cartSlice.actions;
export default cartSlice.reducer;
