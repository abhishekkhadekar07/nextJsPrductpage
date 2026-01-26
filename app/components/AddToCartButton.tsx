'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/cartSlice';

export default function AddToCartButton({ product }: { product: any }) {
  const dispatch = useDispatch();
  const [showMessage, setShowMessage] = useState(false);

  function handleAdd() {
    dispatch(addItem({ 
      id: product.id, 
      title: product.title ?? product.name, 
      price: product.price, 
      image: product.image 
    }));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  }

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={handleAdd} 
        style={{ 
          marginTop: 8, 
          padding: '0.5rem 1rem',
          background: '#0b5cff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }} 
        aria-label={`Add ${product.title ?? product.name} to cart`}
      >
        Add to cart
      </button>
      {showMessage && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '0.5rem',
          padding: '0.5rem',
          background: '#d1f2eb',
          color: '#0e6251',
          borderRadius: '4px',
          fontSize: '0.85rem',
          whiteSpace: 'nowrap'
        }}>
          Added to cart!
        </div>
      )}
    </div>
  );
}
