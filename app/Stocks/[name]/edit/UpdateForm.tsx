'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { updateStock } from '../../../../store/stocksSlice';
import styles from '../../stocks.module.css';

type Stock = {
  name: string;
  BUY: number;
};

type UpdateFormProps = {
  stock: Stock;
};

export default function UpdateForm({ stock }: UpdateFormProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [buy, setBuy] = useState(stock.BUY);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateStock({ name: stock.name, BUY: buy }));
    router.push('/Stocks');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.formRow}>
        <label className={styles.label}>Name</label>
        <input value={stock.name} disabled />
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>BUY</label>
        <input type="number" value={buy} onChange={(e) => setBuy(Number(e.target.value))} />
      </div>

      <button type="submit" className={styles.updateButton}>
        Update Stock
      </button>
    </form>
  );
}
