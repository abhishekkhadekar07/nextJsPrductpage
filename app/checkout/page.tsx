'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { clearCart } from '../../store/cartSlice';
import styles from './page.module.css';

type CheckoutItem = {
  id: number | string;
  title?: string;
  price?: number;
  qty?: number;
};

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart?.items ?? []) as CheckoutItem[];
  const [isPlacing, setIsPlacing] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);

  const productCount = items.reduce((sum, item) => sum + (item.qty || 0), 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);
  const tax = subtotal * 0.08;
  const shipping = items.length > 0 && subtotal < 100 ? 9.99 : 0;
  const total = subtotal + tax + shipping;

  async function handlePlaceOrder() {
    setIsPlacing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    dispatch(clearCart());
    setIsPlaced(true);
    setIsPlacing(false);
  }

  if (isPlaced) {
    return (
      <div className={styles.container}>
        <section className={styles.card}>
          <h1 className={styles.title}>Order confirmed</h1>
          <p className={styles.text}>Your checkout is complete. Thank you for your purchase.</p>
          <div className={styles.actions}>
            <Link href="/products" className={styles.primaryAction}>
              Continue Shopping
            </Link>
            <Link href="/cart" className={styles.secondaryAction}>
              Go to Cart
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <section className={styles.card}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.text}>Your cart is empty. Add products before checkout.</p>
          <div className={styles.actions}>
            <Link href="/products" className={styles.primaryAction}>
              Browse Products
            </Link>
            <Link href="/cart" className={styles.secondaryAction}>
              Go to Cart
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.title}>
          Checkout ({productCount} {productCount === 1 ? 'item' : 'items'})
        </h1>

        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item.id} className={styles.itemRow}>
              <div>
                <p className={styles.itemTitle}>{item.title || 'Product'}</p>
                <p className={styles.itemMeta}>
                  Qty: {item.qty || 0} x ${(item.price || 0).toFixed(2)}
                </p>
              </div>
              <p className={styles.itemTotal}>${((item.price || 0) * (item.qty || 0)).toFixed(2)}</p>
            </li>
          ))}
        </ul>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax (8%)</span>
            <strong>${tax.toFixed(2)}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <strong>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</strong>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={handlePlaceOrder}
            disabled={isPlacing}
          >
            {isPlacing ? 'Placing Order...' : 'Place Order'}
          </button>
          <Link href="/cart" className={styles.secondaryAction}>
            Back to Cart
          </Link>
        </div>
      </section>
    </div>
  );
}
