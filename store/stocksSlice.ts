import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Stock = {
  name: string;
  BUY: number;
};

type StocksState = {
  items: Stock[];
  hydrated: boolean;
};

export const STOCKS_STORAGE_KEY = 'stocks_db_v1';

const seedStocks: Stock[] = [
  { name: 'HDFC', BUY: 922 },
  { name: 'CONCOR', BUY: 511 },
  { name: 'NIFTYBEES', BUY: 293 },
  { name: 'RELIANCE', BUY: 2865 },
  { name: 'TCS', BUY: 4120 },
  { name: 'INFY', BUY: 1698 },
  { name: 'ICICIBANK', BUY: 1214 },
  { name: 'SBIN', BUY: 798 },
  { name: 'ITC', BUY: 468 },
  { name: 'LT', BUY: 3745 },
  { name: 'AXISBANK', BUY: 1128 },
  { name: 'BAJFINANCE', BUY: 7320 },
];

const initialState: StocksState = {
  items: seedStocks,
  hydrated: false,
};

function cleanName(value: string): string {
  return value.trim().toUpperCase();
}

function normalizeStock(value: Partial<Stock>): Stock | null {
  if (typeof value.name !== 'string') return null;
  const name = cleanName(value.name);
  if (!name) return null;
  const buyValue = Number(value.BUY);
  if (!Number.isFinite(buyValue)) return null;
  return { name, BUY: buyValue };
}

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    hydrateStocks(state, action: PayloadAction<Stock[] | null>) {
      if (Array.isArray(action.payload)) {
        state.items = action.payload
          .map((item) => normalizeStock(item))
          .filter((item): item is Stock => item !== null);
      }
      state.hydrated = true;
    },
    addStock(state, action: PayloadAction<{ name: string; BUY: number }>) {
      const stock = normalizeStock(action.payload);
      if (!stock) return;
      const existing = state.items.find((item) => item.name.toLowerCase() === stock.name.toLowerCase());
      if (existing) {
        existing.BUY = stock.BUY;
        return;
      }
      state.items.push(stock);
    },
    updateStock(state, action: PayloadAction<{ name: string; BUY: number }>) {
      const stock = normalizeStock(action.payload);
      if (!stock) return;
      const target = state.items.find((item) => item.name.toLowerCase() === stock.name.toLowerCase());
      if (!target) return;
      target.BUY = stock.BUY;
    },
    deleteStock(state, action: PayloadAction<{ name: string }>) {
      const name = cleanName(action.payload.name);
      state.items = state.items.filter((item) => item.name.toLowerCase() !== name.toLowerCase());
    },
    applyRealtimeStocks(state, action: PayloadAction<Stock[]>) {
      const updates = Array.isArray(action.payload) ? action.payload : [];
      for (const entry of updates) {
        const stock = normalizeStock(entry);
        if (!stock) continue;
        const existing = state.items.find((item) => item.name.toLowerCase() === stock.name.toLowerCase());
        if (existing) {
          existing.BUY = stock.BUY;
        } else {
          state.items.push(stock);
        }
      }
    },
  },
});

export const { hydrateStocks, addStock, updateStock, deleteStock, applyRealtimeStocks } = stocksSlice.actions;
export default stocksSlice.reducer;
