'use server';
import { headers } from "next/headers";

export async function fetchStocks() {
      try {
        // Get the host from headers to construct full URL
        const headersList = await headers();
        const host = headersList.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const fullUrl = `${protocol}://${host}/api/stocks`;
    
        const response = await fetch(fullUrl, {
          // revalidate cached result every 60 seconds
          next: { revalidate: 0 }
        });
        const data = await response.json();
        console.log('stocks data',data);
        
        return { data: data, success: true };
      } catch (e) {
        console.log('error in stocks', e);
        return { success: false };
      }
    }

export async function deleteStock(name: string) {
  const res = await fetch('http://localhost:3000/api/stocks', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
    cache: 'no-store',
  });

  return res.json();
}


export async function updateStock(name: string, BUY: number) {
  const res = await fetch('http://localhost:3000/api/stocks', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, BUY }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to update stock');
  }

  return res.json();
}
