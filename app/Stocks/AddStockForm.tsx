"use client";

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStock } from '../../store/stocksSlice';
import styles from './stocks.module.css';

export default function AddStockForm() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [buy, setBuy] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const buyValue = Number(buy);

    if (!name.trim() || Number.isNaN(buyValue)) {
      setMessage('Please provide a valid stock name and BUY value.');
      return;
    }

    dispatch(addStock({ name, BUY: buyValue }));
    setMessage(`Saved stock: ${name.trim().toUpperCase()}`);
    setName('');
    setBuy('');
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formRow}>
        <label className={styles.label}>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label}>BUY</label>
        <input value={buy} onChange={(e) => setBuy(e.target.value)} required inputMode="numeric" />
      </div>
      <button type="submit" className={styles.submitButton}>
        Add Stock
      </button>
      {message && <div className={styles.message}>{message}</div>}
    </form>
  );
}
