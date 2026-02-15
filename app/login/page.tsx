import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import styles from './page.module.css';
import { AUTH_COOKIE_NAME, resolveRedirect } from '../../lib/auth';

type LoginPageProps = {
  searchParams?: { from?: string | string[]; username?: string | string[] };
};

export default async function Page({ searchParams }: LoginPageProps) {
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
  if (authCookie?.value) {
    redirect('/products');
  }

  const fromParam = typeof searchParams?.from === 'string' ? searchParams?.from : searchParams?.from?.[0];
  const usernameParam =
    typeof searchParams?.username === 'string' ? searchParams?.username : searchParams?.username?.[0];
  const redirectTo = resolveRedirect(fromParam, '/products');

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroBadge}>Secure Access</div>
        <h1 className={styles.heroTitle}>Sign in to manage products</h1>
        <p className={styles.heroText}>
          Products are protected. Log in to browse the catalog and add new inventory.
        </p>
        <ul className={styles.heroList}>
          <li>View the latest product list</li>
          <li>Add new items with images</li>
          <li>Keep your cart and inventory in sync</li>
        </ul>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Welcome back</h2>
          <p className={styles.cardSubtitle}>Use your credentials to access products.</p>
        </div>
        <LoginForm redirectTo={redirectTo} initialUsername={usernameParam ?? ''} />
        <div className={styles.credHint}>
          <strong>Demo login:</strong> admin / admin123 (override with AUTH_USERNAME and AUTH_PASSWORD).
        </div>
      </section>
    </div>
  );
}
