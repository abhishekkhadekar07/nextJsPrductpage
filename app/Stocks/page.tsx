import { fetchStocks } from '../actions/stocks';
import AddStockForm from './AddStockForm';

export default async function Page() {
  const result = await fetchStocks();
  const stocks = Array.isArray(result?.data) ? result.data : [];

  return (
    <div>
      <h1>Stocks</h1>
      <AddStockForm />
      <ul style={{ marginTop: 16 }}>
        {stocks.map((s: any, idx: number) => (
          <li key={idx}>{s.name} — {s.BUY}</li>
        ))}
      </ul>
    </div>
  );
}
