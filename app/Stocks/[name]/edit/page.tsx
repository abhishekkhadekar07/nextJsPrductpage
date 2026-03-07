'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import UpdateForm from './UpdateForm';
import styles from '../../stocks.module.css';

export default function EditPage() {
  const params = useParams<{ name: string }>();
  const routeName = params?.name ? decodeURIComponent(params.name) : '';
  const stocks = useSelector((state: RootState) => state.stocks.items);

  const stock = useMemo(
    () => stocks.find((item) => item.name.toLowerCase() === routeName.toLowerCase()),
    [stocks, routeName]
  );

  if (!stock) {
    return (
      <div className={styles.page}>
        <h2 className={styles.editTitle}>Stock not found</h2>
        <Link href="/Stocks" className={styles.editLink}>
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.editTitle}>Edit {stock.name}</h2>
      <UpdateForm stock={stock} />
    </div>
  );
}
