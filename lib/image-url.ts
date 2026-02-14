const PLACEHOLDER_BASE = 'https://placehold.co';

export function normalizeImageUrl(url: string | undefined, fallbackText: string): string {
  if (!url || !url.trim()) {
    return `${PLACEHOLDER_BASE}/300x300?text=${encodeURIComponent(fallbackText)}`;
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'via.placeholder.com') {
      const size = parsed.pathname.replace(/^\/+/, '') || '300x300';
      const text = parsed.searchParams.get('text') || fallbackText;
      return `${PLACEHOLDER_BASE}/${size}?text=${encodeURIComponent(text)}`;
    }
    return url;
  } catch {
    return `${PLACEHOLDER_BASE}/300x300?text=${encodeURIComponent(fallbackText)}`;
  }
}
