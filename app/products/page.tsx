import Link from 'next/link';
import styles from './page.module.css';
import AddToCartButton from '../components/AddToCartButton';
import { fetchProducts } from '../actions/products';

export default async function Page(props: any) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const q = typeof searchParams.q === 'string' ? searchParams.q : (searchParams.q?.[0] ?? '');


  const cacheResult = await fetchProducts();

 console.log('cacheresult',cacheResult.data.data);
 
  const products: any[] = cacheResult.data.data || [];
  const filtered = q
    ? products.filter(p => ((p.title ?? p.name) || '').toString().toLowerCase().includes(q.toLowerCase()))
    : products;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
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
            {filtered.map((p: any) => (
              <li key={p.id} className={styles.card}>
                <Link href={`/products/${p.id}`} className={styles.cardLink}>
                  <div className={styles.imageWrap}>
                    <img src={p.image} alt={p.title ?? p.name ?? 'Product image'} className={styles.image} />
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.productTitle}>{p.title ?? p.name}</h3>
                    <p className={styles.price}>${p.price?.toFixed?.(2) ?? ''}</p>
                    <AddToCartButton product={p} />
                    {p.rating?.rate !== undefined && (
                      <p className={styles.rating}>⭐ {p.rating.rate} ({p.rating.count})</p>
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