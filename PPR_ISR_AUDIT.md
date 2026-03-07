# PPR + ISR Audit

Date: 2026-02-15  
Framework: Next.js 16.1.1 (App Router)

## What Was Implemented

1. Enabled Partial Prerendering globally with `cacheComponents`.
2. Added explicit Suspense boundaries so dynamic parts stream instead of blocking.
3. Added ISR-style cached server data for products using `use cache` + `cacheLife`.
4. Added on-demand cache invalidation after product mutations with `revalidateTag`.

## Code Changes

- `next.config.ts`
  - Added `cacheComponents: true`.
- `app/layout.tsx`
  - Wrapped `Navbar` in `Suspense` to avoid blocking-route errors and allow streaming.
- `app/products/page.tsx`
  - Split dynamic product rendering into a Suspense-streamed section.
  - Added cached server data function:
    - `use cache`
    - `cacheTag('products')`
    - `cacheLife('minutes')`
- `app/products/[productid]/page.tsx`
  - Reworked detail page to use local product data (same source as product list).
  - Added cached detail data function:
    - `use cache`
    - `cacheTag('products')`
    - `cacheTag('product:{id}')`
    - `cacheLife('hours')`
  - Added `generateStaticParams` to prebuild known product IDs.
- `app/actions/products.ts`
  - Added cache invalidation on create/update/delete:
    - `revalidateTag('products', 'max')`
    - `revalidateTag('product:{id}', 'max')`
- `app/api/stocks/realtime/route.ts`
  - Removed route segment config exports (`dynamic`, `runtime`) because they are incompatible with `cacheComponents`.
- `lib/cache-tags.ts`
  - Added shared cache tag constants/helpers.

## Route-by-Route Audit

| Route                   | Page Type | Current Rendering | ISR / Revalidation                         | Notes                                                          |
| ----------------------- | --------- | ----------------- | ------------------------------------------ | -------------------------------------------------------------- |
| `/`                     | Server    | Static            | Not needed                                 | Pure static landing page.                                      |
| `/cart`                 | Client    | Static shell      | Not needed                                 | Cart data is Redux/client state.                               |
| `/login`                | Server    | Partial Prerender | Not needed                                 | Cookie-based redirect logic streams dynamically.               |
| `/signup`               | Server    | Partial Prerender | Not needed                                 | Cookie-based redirect logic streams dynamically.               |
| `/posts`                | Client    | Static shell      | Not needed                                 | Uses Redux local data; no server data fetch.                   |
| `/posts/add`            | Client    | Static shell      | Not needed                                 | Client form + Redux mutation only.                             |
| `/posts/[postid]`       | Client    | Partial Prerender | Not needed                                 | Dynamic param + client render; no server ISR data path.        |
| `/products`             | Server    | Partial Prerender | Cached data (`minutes`) + tag invalidation | Product list now streams and uses cached server data.          |
| `/products/add`         | Server    | Partial Prerender | Not needed                                 | Auth check is dynamic; form is client component.               |
| `/products/[productid]` | Server    | Partial Prerender | Cached data (`hours`) + tag invalidation   | Detail page now uses ISR-style cache and prebuilt known IDs.   |
| `/Stocks`               | Client    | Static shell      | Not needed                                 | Live updates via SSE + Redux; should stay dynamic client-side. |
| `/Stocks/[name]/edit`   | Client    | Partial Prerender | Not needed                                 | Client-side param lookup and Redux state.                      |

## Why Some Pages Do Not Use ISR

ISR applies to server-rendered cached data. Pages that are fully client-state driven (`/cart`, `/posts`, `/Stocks`) do not gain value from ISR unless their data source is moved to server fetching.

## Validation Performed

Command run:

```bash
npm run build
```

Result:

- Build succeeded with `Next.js 16.1.1 (Turbopack, Cache Components)`.
- Route output shows partial prerendered routes.
- Route output includes revalidation metadata for `/products/[productid]` (`1h` revalidate, `1d` expire).

## Practical Verification Steps

1. Run production mode: `npm run build && npm start`.
2. Visit `/products` and `/products/[id]` while logged in and observe streamed loading states.
3. Create/update/delete a product and verify list/detail refresh without full rebuild.
4. Re-run `npm run build` and confirm the same route rendering categories (Static, Partial Prerender, Dynamic).
