import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Build. Browse. Buy.</h1>
        <p className={styles.description}>
          A colorful storefront for products, posts, and your cart in one place.
        </p>
        <div className={styles.actions}>
          <Link href="/products" className={`${styles.link} ${styles.primaryLink}`}>
            Explore Products
          </Link>
          <Link href="/posts" className={`${styles.link} ${styles.secondaryLink}`}>
            Read Posts
          </Link>
          <Link href="/cart" className={`${styles.link} ${styles.ghostLink}`}>
            Open Cart
          </Link>
        </div>
      </header>

      <section className={styles.featureGrid}>
        <article className={styles.featureCard}>
          <h2>Catalog</h2>
          <p>Search products fast, open details, and add items without leaving the flow.</p>
        </article>
        <article className={styles.featureCard}>
          <h2>Content</h2>
          <p>Browse posts, read details, and add new posts with a cleaner form experience.</p>
        </article>
        <article className={styles.featureCard}>
          <h2>Checkout Prep</h2>
          <p>Adjust quantities in cart and track totals with clear, readable controls.</p>
        </article>
      </section>
    </div>
  );
}
