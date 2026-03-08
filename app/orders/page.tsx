import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, parseAuthCookieValue } from '../../lib/auth';
import { getOrdersByUsername } from '../actions/orders';
import styles from './page.module.css';

export default async function OrdersPage() {
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
  const authUser = parseAuthCookieValue(authCookie?.value);

  if (!authUser?.username) {
    redirect('/login?from=/orders');
  }

  const result = await getOrdersByUsername(authUser.username);
  const orders = result.success ? (result.data ?? []) : [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.subtitle}>Signed in as {authUser.username}</p>
      </header>

      {orders.length === 0 ? (
        <section className={styles.emptyState}>
          <p>No orders yet. Add products and complete checkout to see orders here.</p>
          <Link href="/products" className={styles.actionLink}>
            Browse Products
          </Link>
        </section>
      ) : (
        <ul className={styles.list}>
          {orders.map((order) => (
            <li key={order.id} className={styles.card}>
              <div className={styles.orderHeader}>
                <div>
                  <h2 className={styles.orderId}>Order #{order.id}</h2>
                  <p className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <p className={styles.orderTotal}>${order.totals.total.toFixed(2)}</p>
              </div>

              <ul className={styles.items}>
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.id}`} className={styles.itemRow}>
                    <span>
                      {item.title} x {item.qty}
                    </span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.summary}>
                <span>{order.totals.totalItems} items</span>
                <span>Subtotal: ${order.totals.subtotal.toFixed(2)}</span>
                <span>Tax: ${order.totals.tax.toFixed(2)}</span>
                <span>{order.totals.shipping === 0 ? 'Shipping: Free' : `Shipping: $${order.totals.shipping.toFixed(2)}`}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
