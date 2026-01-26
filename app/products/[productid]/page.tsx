import Link from 'next/link';
import styles from './page.module.css';
import AddToCartForm from '../../components/AddToCartForm';

export default async function ProductPage(props: any) {
  const params = await props.params;
  const productId = params.productid;
  
  const fakeBase = process.env.NEXT_PUBLIC_FAKEAPI ?? 'https://fakestoreapi.com';
  
  const res = await fetch(`${fakeBase}/products/${productId}`, {
    next: { revalidate: 3600 }
  });
  
  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${productId}: ${res.status} - ${raw}`);
  }
  
  let product: any;
  if (!raw || raw.trim().length === 0) {
    product = { title: 'Product not available', description: 'No data returned from upstream API.' };
  } else {
    try {
      product = JSON.parse(raw);
    } catch (err) {
      throw new Error('Invalid JSON returned from product API: ' + raw.slice(0, 200));
    }
  }

  return (
    <div className={styles.container}>
      <Link href="/products" className={styles.back}>← Back to products</Link>

      <div className={styles.grid}>
        <div className={styles.media}>
          <div className={styles.imageWrap}>
            <img src={product.image} alt={product.title ?? product.name ?? 'Product image'} className={styles.image} />
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{product.title ?? product.name}</h1>
          <p className={styles.price}>${product.price?.toFixed?.(2) ?? ''}</p>
          {product.rating?.rate !== undefined && (
            <p className={styles.rating}>⭐ {product.rating.rate} ({product.rating.count})</p>
          )}

          <div className={styles.description}>
            <p>{product.description}</p>
          </div>

          <AddToCartForm product={product} />
        </div>
      </div>
    </div>
  );
}
