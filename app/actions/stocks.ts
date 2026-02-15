'use server';

export async function fetchStocks() {
      try {
        // Server actions run inside the container. Use internal app port (3000 by default),
        // not the host-mapped port (for example 9000) that the browser uses.
        const protocol = process.env.INTERNAL_API_PROTOCOL || 'http';
        const host = process.env.INTERNAL_API_HOST || '127.0.0.1';
        const port = process.env.PORT || '3000';
        const fullUrl = `${protocol}://${host}:${port}/api/stocks`;
    
        const response = await fetch(fullUrl, {
          // revalidate cached result every 60 seconds
          next: { revalidate: 0 }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch stocks: ${response.status}`);
        }

        const data = await response.json();
        
        return { data: data, success: true };
      } catch (e) {
        console.log('error in stocks', e);
        return { success: false };
      }
    }

export async function deleteStock(name: string) {
  // Same Docker networking rule applies for mutations as well.
  const protocol = process.env.INTERNAL_API_PROTOCOL || 'http';
  const host = process.env.INTERNAL_API_HOST || '127.0.0.1';
  const port = process.env.PORT || '3000';
  const fullUrl = `${protocol}://${host}:${port}/api/stocks`;

  const res = await fetch(fullUrl, {
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
  // Same Docker networking rule applies for mutations as well.
  const protocol = process.env.INTERNAL_API_PROTOCOL || 'http';
  const host = process.env.INTERNAL_API_HOST || '127.0.0.1';
  const port = process.env.PORT || '3000';
  const fullUrl = `${protocol}://${host}:${port}/api/stocks`;

  const res = await fetch(fullUrl, {
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
