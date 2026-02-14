'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { applyRealtimeStocks } from '../../store/stocksSlice';
import AddStockForm from './AddStockForm';
import DeleteStockButton from './DeleteStockButton';
import styles from './stocks.module.css';

type LiveStatus = 'off' | 'connecting' | 'live' | 'error';

export default function Page() {
  const dispatch = useDispatch();
  const stocks = useSelector((state: RootState) => state.stocks.items);
  const hydrated = useSelector((state: RootState) => state.stocks.hydrated);

  const [liveEnabled, setLiveEnabled] = useState(true);
  const [streamStatus, setStreamStatus] = useState<Exclude<LiveStatus, 'off'>>('connecting');
  const symbolList = useMemo(() => stocks.map((item) => item.name), [stocks]);
  const symbolsKey = useMemo(() => [...symbolList].sort().join(','), [symbolList]);
  const symbolsQuery = useMemo(
    () => symbolList.map((name) => encodeURIComponent(name)).join(','),
    [symbolList]
  );
  const status: LiveStatus = !hydrated || !liveEnabled || symbolList.length === 0 ? 'off' : streamStatus;

  useEffect(() => {
    if (!hydrated || !liveEnabled || symbolList.length === 0) {
      return;
    }
    const source = new EventSource(`/api/stocks/realtime?symbols=${symbolsQuery}`);

    const onTick = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { stocks?: Array<{ name: string; BUY: number }> };
        if (Array.isArray(payload.stocks)) {
          dispatch(applyRealtimeStocks(payload.stocks));
          setStreamStatus('live');
        }
      } catch {
        setStreamStatus('error');
      }
    };

    source.onopen = () => {
      setStreamStatus('connecting');
    };

    source.addEventListener('snapshot', onTick as EventListener);
    source.addEventListener('tick', onTick as EventListener);

    source.onerror = () => {
      setStreamStatus('error');
      source.close();
    };

    return () => {
      source.close();
    };
  }, [dispatch, hydrated, liveEnabled, symbolList.length, symbolsKey, symbolsQuery]);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>Stocks</h1>
        <div className={styles.toolbarControls}>
          <span className={`${styles.liveBadge} ${styles[`liveBadge_${status}`]}`}>
            {status === 'live' ? 'Live' : status === 'connecting' ? 'Connecting' : status === 'error' ? 'Error' : 'Off'}
          </span>
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => {
              setLiveEnabled((prev) => !prev);
              setStreamStatus('connecting');
            }}
          >
            {liveEnabled ? 'Disable Live' : 'Enable Live'}
          </button>
        </div>
      </div>

      <AddStockForm />

      {!hydrated ? <p className={styles.message}>Loading saved stocks...</p> : null}

      <ul className={styles.list}>
        {stocks.map((s) => (
          <li key={s.name} className={styles.item}>
            <div className={styles.nameValue}>
              <span className={styles.stockName}>{s.name}</span>
              <span className={styles.stockValue}>BUY: {s.BUY}</span>
            </div>
            <div className={styles.actions}>
              <Link
                href={`/Stocks/${encodeURIComponent(s.name)}/edit`}
                className={styles.editLink}
              >
                Edit
              </Link>
              <DeleteStockButton name={s.name} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
