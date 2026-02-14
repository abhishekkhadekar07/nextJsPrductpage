"use client";

import Link from 'next/link';
import styles from './navbar.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

export default function Navbar() {
  const items = useSelector((state: RootState) => state.cart?.items ?? []);
  const total = items.reduce((s: number, i) => s + (i.qty || 0), 0);

  return (
    <header className={styles.container}>
      <div className={styles.brand}>
        <Link href="/" className={styles.brandLink}>Home</Link>
      </div>

      <nav className={styles.nav}>
        <Link href="/products" className={styles.link}>Products</Link>
        <Link href="/posts" className={styles.link}>Posts</Link>
        <Link href="/Stocks" className={styles.link}>Stocks</Link>
        <Link href="/cart" className={styles.link}>Cart ({total})</Link>
      </nav>
     
    </header>
  );
}
