'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/cartSlice';
import styles from '../products/[productid]/page.module.css';

export default function AddToCartForm({ product }: { product: any }) {
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

    setMessage(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
    setQuantity(1);
    
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.cartForm}>
      {message && (
        <div style={{
          padding: '0.75rem',
          background: '#d1f2eb',
          color: '#0e6251',
          borderRadius: '6px',
          marginBottom: '0.5rem',
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}
      <label className={styles.qtyLabel}>
        Quantity
        <input
          name="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
