'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './navbar.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

type AuthState = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  username?: string;
};

export default function Navbar() {
  const items = useSelector((state: RootState) => state.cart?.items ?? []);
  const total = items.reduce((s: number, i) => s + (i.qty || 0), 0);
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>({ status: 'loading' });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isActive = true;

    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: { authenticated?: boolean; user?: { username?: string } }) => {
        if (!isActive) return;
        if (data?.authenticated) {
          setAuthState({ status: 'authenticated', username: data.user?.username || 'User' });
        } else {
          setAuthState({ status: 'unauthenticated' });
        }
      })
      .catch(() => {
        if (!isActive) return;
        setAuthState({ status: 'unauthenticated' });
      });

    return () => {
      isActive = false;
    };
  }, [pathname]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setAuthState({ status: 'unauthenticated' });
      setIsLoggingOut(false);
      router.push('/login');
      router.refresh();
    }
  }

  return (
    <header className={styles.container}>
      <div className={styles.brand}>
        <Link href="/" className={styles.brandLink}>
          Home
        </Link>
      </div>

      <nav className={styles.nav}>
        {authState.status === 'authenticated' && (
          <Link href="/products" className={styles.link}>
            Products
          </Link>
        )}
        {authState.status === 'authenticated' && (
          <Link href="/posts" className={styles.link}>
            Posts
          </Link>
        )}
        {authState.status === 'authenticated' && (
          <Link href="/Stocks" className={styles.link}>
            Stocks
          </Link>
        )}
        {authState.status === 'authenticated' && (
          <Link href="/cart" className={styles.link}>
            Cart ({total})
          </Link>
        )}
        {authState.status === 'authenticated' && total > 0 && (
          <Link href="/checkout" className={styles.link}>
            Checkout
          </Link>
        )}
        <div className={styles.auth}>
          {authState.status === 'loading' && <span className={styles.authBadge}>Checking access...</span>}
          {authState.status === 'unauthenticated' && (
            <Link href="/login" className={styles.authButton}>
              Login
            </Link>
          )}
          {authState.status === 'authenticated' && (
            <>
              <span className={styles.authBadge}>Signed in as {authState.username}</span>
              <button
                type="button"
                className={styles.authButton}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Signing out...' : 'Logout'}
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
