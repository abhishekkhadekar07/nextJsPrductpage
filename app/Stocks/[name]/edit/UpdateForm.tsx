'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { updateStock } from '@/app/actions/stocks';

type Stock = {
  name: string;
  BUY: number;
};

type UpdateFormProps = {
  stock: Stock;
};

export default function UpdateForm({ stock }: UpdateFormProps) {
  const [buy, setBuy] = useState(stock.BUY);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateStock(stock.name, buy);
    router.push('/Stocks'); // go back after update
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input value={stock.name} disabled />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>BUY:</label>
        <input
          type="number"
          value={buy}
          onChange={(e) => setBuy(Number(e.target.value))}
        />
      </div>

      <button
        type="submit"
        style={{
          marginTop: 15,
          background: 'green',
          color: 'white',
          padding: '6px 12px',
          border: 'none'
        }}
      >
        Update Stock
      </button>
    </form>
  );
}
