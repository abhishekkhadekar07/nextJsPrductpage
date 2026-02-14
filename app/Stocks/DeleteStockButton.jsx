'use client';

import { useTransition } from 'react';
import { deleteStock } from '../actions/stocks';
import { useRouter } from 'next/navigation';

export default function DeleteStockButton({ name }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteStock(name);
      router.refresh(); // re-fetch server component
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      style={{ marginLeft: 10 }}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
