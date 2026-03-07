export interface CacheResult {
  data: unknown;
  cacheStatus: 'HIT' | 'MISS' | 'UNKNOWN';
  duration: number;
  isCacheHit: boolean;
}

export async function fetchWithCacheMonitoring(
  url: string,
  options: RequestInit & { next?: { revalidate?: number | false } } = {}
): Promise<CacheResult> {
  const startTime = Date.now();
  const res = await fetch(url, options);
  const duration = Date.now() - startTime;
  const nextJsCacheStatus = res.headers.get('x-nextjs-cache');

  let cacheStatus: 'HIT' | 'MISS' | 'UNKNOWN' = 'UNKNOWN';
  let isCacheHit = false;

  if (nextJsCacheStatus === 'HIT') {
    cacheStatus = 'HIT';
    isCacheHit = true;
  } else if (nextJsCacheStatus === 'MISS') {
    cacheStatus = 'MISS';
    isCacheHit = false;
  } else {
    isCacheHit = duration < 10;
    cacheStatus = isCacheHit ? 'HIT' : 'MISS';
  }

  const raw = await res.text();
  let data: unknown = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to parse JSON response:', err);
    throw new Error('Invalid JSON response from API');
  }

  return { data, cacheStatus, duration, isCacheHit };
}
