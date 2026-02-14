'use client';

import { useState, useTransition } from 'react';
import { updateStock } from '../actions/stocks';
import { useRouter } from 'next/navigation';

export default function UpdateStockForm({
  name,
  currentBUY,
}) {
  const [buy, setBuy] = useState(currentBUY);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdate = () => {
    startTransition(async () => {
      await updateStock(name, buy);
      router.refresh(); // refresh server component
    });
  };

  return (
    <>
      <input
        type="number"
        value={buy}
        onChange={(e) => setBuy(Number(e.target.value))}
        style={{ marginLeft: 10, width: 80 }}
      />
      <button
        onClick={handleUpdate}
        disabled={isPending}
        style={{
          marginLeft: 5,
          background: 'green',
          color: 'white',
          border: 'none',
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        {isPending ? 'Updating...' : 'Update'}
      </button>
    </>
  );
}
