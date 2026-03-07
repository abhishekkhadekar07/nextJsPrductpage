import Link from 'next/link';
import { Suspense } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import AddToCartButton from '../components/AddToCartButton';
import { getAllProducts } from '../actions/products';
import { normalizeImageUrl } from '../../lib/image-url';
import SafeImage from '../components/SafeImage';
import { AUTH_COOKIE_NAME } from '../../lib/auth';
import { PRODUCTS_CACHE_TAG } from '../../lib/cache-tags';

type Product = {
  id: number | string;
  title?: string;
  name?: string;
  price?: number;
  image?: string;
  rating?: {
    rate?: number;
    count?: number;
  };
};

type ProductsPageProps = {
  searchParams?: Promise<{ q?: string | string[] }>;
};

export default async function Page(props: ProductsPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const q = typeof searchParams.q === 'string' ? searchParams.q : (searchParams.q?.[0] ?? '');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Products</h1>
          <Link href="/products/add" className={styles.addLink}>Add Product</Link>
        </div>
        <form className={styles.searchForm} method="get" action="/products">
          <input
            name="q"
            placeholder="Search products"
            defaultValue={q}
            className={styles.searchInput}
            aria-label="Search products"
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>
      </header>

      <main>
        {/* PPR: static shell is prerendered, while auth/data filtering streams dynamically. */}
        <Suspense key={q} fallback={<p className={styles.empty}>Loading products...</p>}>
          <ProductsResults q={q} />
        </Suspense>
      </main>
    </div>
  );
}

async function getProductsList(): Promise<Product[]> {
  // ISR-style caching for the products list; tag + TTL allow timed refresh and manual invalidation.
  'use cache';
  cacheTag(PRODUCTS_CACHE_TAG);
  cacheLife('minutes');
  const result = await getAllProducts();
  return (result.data ?? []) as Product[];
}

async function ProductsResults({ q }: { q: string }) {
  // Keep auth in the streamed section so the route can still use PPR for the outer shell.
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
  if (!authCookie?.value) {
    redirect('/login?from=/products');
  }

  const products = await getProductsList();
  const filtered = q
    ? products.filter((p) => ((p.title ?? p.name) || '').toLowerCase().includes(q.toLowerCase()))
    : products;

  if (filtered.length === 0) {
    return <p className={styles.empty}>No products found.</p>;
  }

  return (
    <>
      <p className={styles.resultsCount}>
        Showing {filtered.length} of {products.length} products
      </p>
      <ul className={styles.grid}>
        {filtered.map((p) => (
          <li key={p.id} className={styles.card}>
            <Link href={`/products/${p.id}`} className={styles.cardLink}>
              <div className={styles.imageWrap}>
                <SafeImage
                  src={normalizeImageUrl(p.image, p.title ?? p.name ?? 'Product')}
                  alt={p.title ?? p.name ?? 'Product image'}
                  fill
                  className={styles.image}
                  sizes="(min-width: 980px) 33vw, (min-width: 660px) 50vw, 100vw"
                />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.productTitle}>{p.title ?? p.name}</h3>
                <p className={styles.price}>${p.price?.toFixed?.(2) ?? ''}</p>
                {p.rating?.rate !== undefined && (
                  <p className={styles.rating}>Rating: {p.rating.rate} ({p.rating.count})</p>
                )}
              </div>
            </Link>
            <div className={styles.cardActions}>
              <AddToCartButton product={p} />
              <Link href="/checkout" className={styles.checkoutLink}>Checkout</Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
