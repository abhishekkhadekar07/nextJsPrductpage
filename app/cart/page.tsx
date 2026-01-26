'use client';

import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { removeItem, setQty, clearCart } from '../../store/cartSlice';
import styles from './page.module.css';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.cart?.items ?? []);

  const subtotal = items.reduce((sum: number, item: any) => {
    return sum + (item.price || 0) * (item.qty || 0);
  }, 0);

  const totalItems = items.reduce((sum: number, item: any) => sum + (item.qty || 0), 0);

  const handleRemove = (id: number | string) => {
    dispatch(removeItem({ id }));
  };

  const handleQuantityChange = (id: number | string, newQty: number) => {
    if (newQty <= 0) {
      handleRemove(id);
    } else {
      dispatch(setQty({ id, qty: newQty }));
    }
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart</h1>
        </div>
        <div className={styles.empty}>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link href="/products" style={{ 
            display: 'inline-block', 
            marginTop: '1rem', 
            padding: '0.75rem 1.5rem', 
            background: '#0b5cff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '6px' 
          }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>
      </div>

      <ul className={styles.cartList}>
        {items.map((item: any) => (
          <li key={item.id} className={styles.cartItem}>
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title || 'Product'} 
                className={styles.itemImage}
              />
            )}
            <div className={styles.itemDetails}>
              <h3 className={styles.itemTitle}>{item.title || 'Product'}</h3>
              <p className={styles.itemPrice}>${(item.price || 0).toFixed(2)} each</p>
            </div>
            <div className={styles.itemActions}>
              <div className={styles.quantityControl}>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.id, (item.qty || 1) - 1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.qty || 1}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                  className={styles.quantityInput}
                />
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.id, (item.qty || 1) + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => handleRemove(item.id)}
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}):</span>
          <span className={styles.summaryValue}>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Total:</span>
          <span className={`${styles.summaryValue} ${styles.totalValue}`}>${subtotal.toFixed(2)}</span>
        </div>
        <button className={styles.checkoutButton}>
          Proceed to Checkout
        </button>
        <button
          onClick={handleClearCart}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginTop: '0.5rem',
            background: 'transparent',
            color: '#e74c3c',
            border: '1px solid #e74c3c',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
