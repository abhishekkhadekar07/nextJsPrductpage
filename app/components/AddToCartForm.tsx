'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/cartSlice';
import styles from '../products/[productid]/page.module.css';

type Product = {
  id: number | string;
  title?: string;
  name?: string;
  price?: number;
  image?: string;
};

export default function AddToCartForm({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(addItem({
      id: product.id,
      title: product.title ?? product.name,
      price: product.price,
      image: product.image,
      qty: quantity
    }));

    setMessage(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
    setQuantity(1);
    setTimeout(() => setMessage(null), 2200);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.cartForm}>
      {message && (
        <div
          style={{
            gridColumn: '1 / -1',
            padding: '0.62rem 0.72rem',
            background: '#e8fbf2',
            color: '#0f725d',
            border: '1px solid #b9ead7',
            borderRadius: '0.72rem',
            fontSize: '0.88rem'
          }}
        >
          {message}
        </div>
      )}
      <label className={styles.qtyLabel}>
        Quantity
        <input
          name="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
          min={1}
          className={styles.qtyInput}
        />
      </label>
      <button type="submit" className={styles.addButton}>
        Add to cart
      </button>
    </form>
  );
}
