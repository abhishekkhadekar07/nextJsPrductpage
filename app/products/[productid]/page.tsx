import Link from 'next/link';
import styles from './page.module.css';
import AddToCartForm from '../../components/AddToCartForm';
import { normalizeImageUrl } from '../../../lib/image-url';
import SafeImage from '../../components/SafeImage';

type Product = {
  id: number | string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  rating?: {
    rate?: number;
    count?: number;
  };
};

type ProductPageProps = {
  params: Promise<{ productid: string }>;
};

export default async function ProductPage(props: ProductPageProps) {
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

  let product: Product;
  if (!raw || raw.trim().length === 0) {
    product = {
      id: productId,
      title: 'Product not available',
      description: 'No data returned from upstream API.'
    };
  } else {
    try {
      product = JSON.parse(raw) as Product;
      if (typeof product.id === 'undefined') {
        product.id = productId;
      }
    } catch {
      throw new Error('Invalid JSON returned from product API: ' + raw.slice(0, 200));
    }
  }

  return (
    <div className={styles.container}>
      <Link href="/products" className={styles.back}>{'<-'} Back to products</Link>

      <div className={styles.grid}>
        <div className={styles.media}>
          <div className={styles.imageWrap}>
            <SafeImage
              src={normalizeImageUrl(product.image, product.title ?? product.name ?? 'Product')}
              alt={product.title ?? product.name ?? 'Product image'}
              fill
              className={styles.image}
              sizes="(min-width: 920px) 420px, 100vw"
            />
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{product.title ?? product.name}</h1>
          <p className={styles.price}>${product.price?.toFixed?.(2) ?? ''}</p>
          {product.rating?.rate !== undefined && (
            <p className={styles.rating}>Rating: {product.rating.rate} ({product.rating.count})</p>
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
