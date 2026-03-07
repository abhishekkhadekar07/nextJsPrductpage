import Link from 'next/link';
import { Suspense } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import AddToCartForm from '../../components/AddToCartForm';
import { normalizeImageUrl } from '../../../lib/image-url';
import SafeImage from '../../components/SafeImage';
import { getAllProducts, getProductById, type Product } from '../../actions/products';
import { PRODUCTS_CACHE_TAG, productCacheTag } from '../../../lib/cache-tags';

type ProductPageProps = {
  params: Promise<{ productid: string }>;
};

// Prebuild known product IDs at build time; unknown IDs are generated on demand.
export async function generateStaticParams() {
  const result = await getAllProducts();
  const products = result.data ?? [];
  return products.map((product) => ({ productid: String(product.id) }));
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const productId = params.productid;

  return (
    <div className={styles.container}>
      <Link href="/products" className={styles.back}>
        {'<-'} Back to products
      </Link>
      {/* PPR: render page frame immediately and stream detail payload when ready. */}
      <Suspense fallback={<ProductDetailsFallback />}>
        <ProductDetails productId={productId} />
      </Suspense>
    </div>
  );
}

async function getCachedProduct(productId: string): Promise<Product | null> {
  // ISR-style detail caching with list+detail tags for efficient revalidation after mutations.
  'use cache';
  cacheTag(PRODUCTS_CACHE_TAG);
  cacheTag(productCacheTag(productId));
  cacheLife('hours');

  const result = await getProductById(productId);
  return result.success && result.data ? result.data : null;
}

async function ProductDetails({ productId }: { productId: string }) {
  const product = await getCachedProduct(productId);

  if (!product) {
    notFound();
  }

  return (
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
          <p className={styles.rating}>
            Rating: {product.rating.rate} ({product.rating.count})
          </p>
        )}

        <div className={styles.description}>
          <p>{product.description}</p>
        </div>

        <AddToCartForm product={product} />
        <div className={styles.nextActions}>
          <Link href="/cart" className={styles.secondaryAction}>
            View Cart
          </Link>
          <Link href="/checkout" className={styles.primaryAction}>
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductDetailsFallback() {
  return (
    <div className={styles.grid}>
      <div className={styles.media}>
        <div style={{ width: '100%', height: '420px', background: '#f0f0f0', borderRadius: '8px' }} />
      </div>
      <div className={styles.content}>
        <div style={{ width: '75%', height: '32px', background: '#e0e0e0', borderRadius: '4px' }} />
      </div>
    </div>
  );
}
