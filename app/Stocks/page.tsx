import Link from 'next/link';
import { fetchStocks } from '../actions/stocks';
import AddStockForm from './AddStockForm';
import DeleteStockButton from './DeleteStockButton';

type Stock = {
  name: string;
  BUY: number;
};

export default async function Page() {
  const result = await fetchStocks();
  const stocks: Stock[] = Array.isArray(result?.data)
    ? result.data.filter(
        (item): item is Stock =>
          typeof item?.name === 'string' && typeof item?.BUY === 'number'
      )
    : [];

  return (
    <div>
      <h1>Stocks</h1>
      <AddStockForm />
      <ul style={{ marginTop: 16 }}>
        {stocks.map((s) => (
          <li key={s.name}>
            {s.name} - {s.BUY}
            <Link
              href={`/Stocks/${encodeURIComponent(s.name)}/edit`}
              style={{
                marginLeft: 10,
                background: 'blue',
                color: 'white',
                padding: '4px 8px',
                textDecoration: 'none'
              }}
            >
              Edit
            </Link>
            <DeleteStockButton name={s.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
