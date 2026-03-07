'use client';

import { useState, type MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/cartSlice';

type Product = {
  id: number | string;
  title?: string;
  name?: string;
  price?: number;
  image?: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const [showMessage, setShowMessage] = useState(false);

  function handleAdd(event: MouseEvent<HTMLButtonElement>) {
    // Prevent navigation when this button is rendered inside clickable cards/links.
    event.preventDefault();
    event.stopPropagation();
    dispatch(
      addItem({
        id: product.id,
        title: product.title ?? product.name,
        price: product.price,
        image: product.image,
      })
    );
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1800);
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleAdd}
        type="button"
        style={{
          marginTop: 8,
          borderRadius: 999,
          padding: '0.48rem 0.9rem',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}
        aria-label={`Add ${product.title ?? product.name} to cart`}
      >
        Add to cart
      </button>
      {showMessage && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.5rem',
            padding: '0.44rem 0.58rem',
            background: '#e8fbf2',
            color: '#0f725d',
            border: '1px solid #b9ead7',
            borderRadius: '0.6rem',
            fontSize: '0.82rem',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          Added to cart
        </div>
      )}
    </div>
  );
}
