import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import AddToCartButton from '../components/AddToCartButton';
import { fetchProducts } from '../actions/products';
import { normalizeImageUrl } from '../../lib/image-url';
import SafeImage from '../components/SafeImage';
import { AUTH_COOKIE_NAME } from '../../lib/auth';

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
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME);
  if (!authCookie?.value) {
    redirect('/login?from=/products');
  }

  const searchParams = props.searchParams ? await props.searchParams : {};
  const q = typeof searchParams.q === 'string' ? searchParams.q : (searchParams.q?.[0] ?? '');

  const cacheResult = await fetchProducts();
  const products: Product[] = cacheResult?.data?.data || [];
  const filtered = q
    ? products.filter((p) => ((p.title ?? p.name) || '').toLowerCase().includes(q.toLowerCase()))
    : products;

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
        {filtered.length === 0 ? (
          <p className={styles.empty}>No products found.</p>
        ) : (
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
                    <AddToCartButton product={p} />
                    {p.rating?.rate !== undefined && (
                      <p className={styles.rating}>Rating: {p.rating.rate} ({p.rating.count})</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
