import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import stocksReducer from './stocksSlice';
import postsReducer from './postsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    stocks: stocksReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
