'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { normalizeUsername } from '../../lib/auth';

export type OrderItem = {
  id: number | string;
  title?: string;
  price?: number;
  qty?: number;
  image?: string;
};

export type NormalizedOrderItem = Required<Pick<OrderItem, 'id' | 'title' | 'price' | 'qty'>> &
  Pick<OrderItem, 'image'>;

export type OrderTotals = {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  totalItems: number;
};

export type Order = {
  id: number;
  username: string;
  createdAt: string;
  items: NormalizedOrderItem[];
  totals: OrderTotals;
};

const ORDERS_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(ORDERS_DIR, 'orders.json');

async function ensureOrdersFile() {
  await fs.mkdir(ORDERS_DIR, { recursive: true });

  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, '[]', 'utf8');
  }
}

function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

function sanitizeOrderItems(raw: unknown): NormalizedOrderItem[] {
  if (!Array.isArray(raw)) return [];

  const items: NormalizedOrderItem[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;

    const source = entry as Partial<OrderItem>;
    const id = source.id;
    const title = String(source.title ?? 'Product').trim() || 'Product';
    const price = Number(source.price);
    const qty = Math.max(1, Math.trunc(Number(source.qty)));
    const image = source.image ? String(source.image) : undefined;

    if ((typeof id !== 'number' && typeof id !== 'string') || !Number.isFinite(price) || price < 0) {
      continue;
    }

    items.push({
      id,
      title,
      price: roundCurrency(price),
      qty,
      image,
    });
  }

  return items;
}

function sanitizeOrders(raw: unknown): Order[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;

      const source = entry as Partial<Order>;
      const id = Number(source.id);
      const username = normalizeUsername(String(source.username ?? ''));
      const createdAt = String(source.createdAt ?? '');
      const items = sanitizeOrderItems(source.items);

      if (!Number.isFinite(id) || !username || !createdAt || items.length === 0) {
        return null;
      }

      const totals = calculateTotals(items);
      return {
        id,
        username,
        createdAt,
        items,
        totals,
      };
    })
    .filter((order): order is Order => Boolean(order))
    .sort((a, b) => b.id - a.id);
}

async function readOrders() {
  await ensureOrdersFile();

  try {
    const file = await fs.readFile(ORDERS_FILE, 'utf8');
    return sanitizeOrders(JSON.parse(file) as unknown);
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await ensureOrdersFile();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

function calculateTotals(items: Order['items']): OrderTotals {
  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.price * item.qty, 0));
  const tax = roundCurrency(subtotal * 0.08);
  const shipping = subtotal > 0 && subtotal < 100 ? 9.99 : 0;
  const total = roundCurrency(subtotal + tax + shipping);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return {
    subtotal,
    tax,
    shipping,
    total,
    totalItems,
  };
}

export async function getOrdersByUsername(username: string) {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    return {
      success: false,
      message: 'Username is required',
    };
  }

  const orders = await readOrders();
  const userOrders = orders.filter((order) => order.username === normalizedUsername);

  return {
    success: true,
    data: userOrders,
    count: userOrders.length,
  };
}

export async function createOrderForUser(username: string, itemsInput: OrderItem[]) {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    return {
      success: false,
      message: 'Username is required',
    };
  }

  const items = sanitizeOrderItems(itemsInput);
  if (items.length === 0) {
    return {
      success: false,
      message: 'Order must include at least one valid item',
    };
  }

  const orders = await readOrders();
  const nextId = Math.max(...orders.map((order) => order.id), 0) + 1;

  const newOrder: Order = {
    id: nextId,
    username: normalizedUsername,
    createdAt: new Date().toISOString(),
    items,
    totals: calculateTotals(items),
  };

  orders.push(newOrder);
  await writeOrders(orders);

  return {
    success: true,
    data: newOrder,
    message: 'Order placed successfully',
  };
}
