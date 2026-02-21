import { NextResponse } from 'next/server';

type StockTick = {
  name: string;
  BUY: number;
};

const basePrices: Record<string, number> = {
  HDFC: 922,
  CONCOR: 511,
  NIFTYBEES: 293,
  RELIANCE: 2865,
  TCS: 4120,
  INFY: 1698,
  ICICIBANK: 1214,
  SBIN: 798,
  ITC: 468,
  LT: 3745,
  AXISBANK: 1128,
  BAJFINANCE: 7320,
};

function normalizeSymbol(value: string): string {
  return value.trim().toUpperCase();
}

function createInitialSeries(symbols: string[]): StockTick[] {
  return symbols.map((symbol) => ({
    name: symbol,
    BUY: Number((basePrices[symbol] ?? 100 + Math.random() * 900).toFixed(2)),
  }));
}

function nextPrice(current: number): number {
  const drift = (Math.random() - 0.5) * 0.018;
  const next = current * (1 + drift);
  return Number(Math.max(next, 1).toFixed(2));
}

function serialize(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');

  const symbols = symbolsParam
    ? symbolsParam
        .split(',')
        .map((value) => normalizeSymbol(decodeURIComponent(value)))
        .filter(Boolean)
    : Object.keys(basePrices).slice(0, 8);

  if (symbols.length === 0) {
    return NextResponse.json(
      { success: false, message: 'Provide at least one stock symbol in ?symbols=' },
      { status: 400 }
    );
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let series = createInitialSeries(symbols);

      const push = (event: string, payload: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n` + serialize(payload)));
      };

      push('snapshot', { ts: Date.now(), stocks: series });

      const tickTimer = setInterval(() => {
        series = series.map((item) => ({ ...item, BUY: nextPrice(item.BUY) }));
        push('tick', { ts: Date.now(), stocks: series });
      }, 3000);

      const pingTimer = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
      }, 15000);

      const cleanup = () => {
        clearInterval(tickTimer);
        clearInterval(pingTimer);
        try {
          controller.close();
        } catch {
          // Ignore close race conditions.
        }
      };

      request.signal.addEventListener('abort', cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
