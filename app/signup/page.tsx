import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignupForm from './SignupForm';
import styles from '../login/page.module.css';
import { AUTH_COOKIE_NAME, resolveRedirect } from '../../lib/auth';

type SignupPageProps = {
  searchParams?: { from?: string | string[] };
};

export default async function Page({ searchParams }: SignupPageProps) {
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
  if (authCookie?.value) {
    redirect('/products');
  }

  const fromParam = typeof searchParams?.from === 'string' ? searchParams?.from : searchParams?.from?.[0];
  const redirectTo = resolveRedirect(fromParam, '/products');

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroBadge}>Create Account</div>
        <h1 className={styles.heroTitle}>Sign up for product access</h1>
        <p className={styles.heroText}>
          Create your account, then sign in with your new username and password.
        </p>
        <ul className={styles.heroList}>
          <li>Register your own login credentials</li>
          <li>Sign in and access protected pages</li>
          <li>Add and browse products securely</li>
        </ul>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Create your account</h2>
          <p className={styles.cardSubtitle}>After sign up, you can sign in immediately.</p>
        </div>
        <SignupForm redirectTo={redirectTo} />
      </section>
    </div>
  );
}
