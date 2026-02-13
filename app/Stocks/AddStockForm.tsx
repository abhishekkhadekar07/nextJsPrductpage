"use client";

import React, { useState } from 'react';

export default function AddStockForm() {
  const [name, setName] = useState('');
  const [buy, setBuy] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, BUY: Number(buy) })
      });
      const data = await response.json();
      if (response.ok) {
        const added = data.stock ?? { name, BUY: Number(buy) };
        setMessage('Added: ' + (added.name ?? name));
        setName('');
        setBuy('');
        // reload the server-rendered page so server fetch (with revalidate) shows updated list
        window.location.reload();
      } else {
        setMessage(data.message || 'Failed to add stock');
      }
    } catch (err) {
      setMessage(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block' }}>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block' }}>BUY</label>
        <input value={buy} onChange={(e) => setBuy(e.target.value)} required inputMode="numeric" />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Adding…' : 'Add Stock'}</button>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </form>
  );
}
