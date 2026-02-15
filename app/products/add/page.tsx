import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AddProductForm from '../../components/AddProductForm';
import styles from './page.module.css';
import { AUTH_COOKIE_NAME } from '../../../lib/auth';

export default async function AddProductPage() {
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
  if (!authCookie?.value) {
    redirect('/login?from=/products/add');
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Create Product</h1>
        <p className={styles.description}>Fill in the details and submit to add a new product.</p>
        <Link href="/products" className={styles.backLink}>Back to products</Link>
      </header>
      <AddProductForm redirectTo="/products" />
    </div>
  );
}
