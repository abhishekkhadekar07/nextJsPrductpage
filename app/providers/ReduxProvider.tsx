"use client";

import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { type RootState } from '../../store/store';
import { STOCKS_STORAGE_KEY, hydrateStocks, type Stock } from '../../store/stocksSlice';

function StocksPersistenceBridge() {
  const dispatch = useDispatch();
  const stocks = useSelector((state: RootState) => state.stocks.items);
  const hydrated = useSelector((state: RootState) => state.stocks.hydrated);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STOCKS_STORAGE_KEY);
      if (!raw) {
        dispatch(hydrateStocks(null));
        return;
      }
      const parsed = JSON.parse(raw) as Stock[];
      dispatch(hydrateStocks(Array.isArray(parsed) ? parsed : null));
    } catch {
      dispatch(hydrateStocks(null));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STOCKS_STORAGE_KEY, JSON.stringify(stocks));
    } catch {
      // Ignore storage quota errors and keep app functional in-memory.
    }
  }, [stocks, hydrated]);

  return null;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StocksPersistenceBridge />
      {children}
    </Provider>
  );
}
