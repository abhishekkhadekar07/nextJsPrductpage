'use client';

import { useDispatch } from 'react-redux';
import { deleteStock } from '../../store/stocksSlice';
import styles from './stocks.module.css';

export default function DeleteStockButton({ name }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteStock({ name }));
  };

  return (
    <button onClick={handleDelete} className={styles.deleteButton}>
      Delete
    </button>
  );
}
