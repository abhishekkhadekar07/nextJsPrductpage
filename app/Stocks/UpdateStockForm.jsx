'use client';

import { useState, useTransition } from 'react';
import { useDispatch } from 'react-redux';
import { updateStock } from '../../store/stocksSlice';
import styles from './stocks.module.css';

export default function UpdateStockForm({ name, currentBUY }) {
  const dispatch = useDispatch();
  const [buy, setBuy] = useState(currentBUY);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(() => {
      dispatch(updateStock({ name, BUY: buy }));
    });
  };

  return (
    <div className={styles.actions}>
      <input type="number" value={buy} onChange={(e) => setBuy(Number(e.target.value))} />
      <button onClick={handleUpdate} disabled={isPending} className={styles.updateButton}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}
