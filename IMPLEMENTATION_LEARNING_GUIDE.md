# ProductPage Implementation Learning Guide

This document explains all major changes made for:

- authentication (login/logout/me/signup)
- app-wide route protection
- product creation and persistence
- runtime stability fixes (React warning and image-host error)

## 1. High-Level Architecture

The app now uses this flow:

1. `proxy.ts` runs before pages/APIs and enforces authentication.
2. Auth APIs (`/api/auth/*`) manage login state using an HTTP-only cookie.
3. Users are persisted in `data/users.json` via `lib/auth-users.ts`.
4. Products are persisted in `data/products.json` via `app/actions/products.ts`.
5. UI pages/forms call the APIs and react to responses.

## 2. Global Route Protection (Next.js Proxy)

### File

- `proxy.ts`

### What changed

- Added a global request guard.
- Allowed public pages: `/login`, `/signup`.
- Allowed public auth APIs: `/api/auth/login`, `/api/auth/signup`, `/api/auth/me`, `/api/auth/logout`.
- Blocked all other pages when not logged in.
- Blocked all other APIs with `401 Unauthorized` when not logged in.
- Redirected authenticated users away from `/login` and `/signup` to `/products`.

### Concept

- In Next.js 16, using `proxy.ts` is the correct file convention for global request interception in this project setup.
- This is centralized access control, so you do not need to repeat auth checks in every single page.

## 3. Auth Core Utilities

### File

- `lib/auth.ts`

### What changed

- Added cookie constants:
  - `AUTH_COOKIE_NAME`
  - `AUTH_COOKIE_MAX_AGE`
- Added username normalization:
  - `normalizeUsername()` lowercases + trims input.
- Added signup validation rules:
  - username required, 3-30 chars, pattern limited
  - password required, 6-100 chars
- Added cookie helpers:
  - `createAuthCookieValue()`
  - `parseAuthCookieValue()`
- Added safe redirect helpers:
  - `isSafeRedirect()`
  - `resolveRedirect()`

### Concept

- `resolveRedirect()` prevents open-redirect vulnerabilities by only allowing internal paths like `/products`, not external URLs.
- Keeping validation in one file avoids duplicated rules between UI and API.

## 4. User Persistence (Signup/Login Shared Storage)

### File

- `lib/auth-users.ts`

### What changed

- Added file-backed user store in `data/users.json`.
- Added `validateCredentials()` for login.
- Added `registerUser()` for signup.
- Added sanitization when reading file data.
- Auto-seeds default user (`admin/admin123` or env values) if missing.

### Why this was needed

- In-memory user storage can differ between route handlers/processes.
- File-backed storage ensures signup credentials can be used by login reliably.

### Concept

- This is a lightweight persistence layer.
- It is acceptable for local/demo usage but not production-grade auth.

## 5. Auth API Endpoints

### Files

- `app/api/auth/login/route.ts`
- `app/api/auth/signup/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/me/route.ts`

### What each endpoint does

1. `POST /api/auth/login`

- validates content type + body
- checks credentials using `lib/auth-users.ts`
- sets cookie on success (`httpOnly`, `sameSite=lax`, `secure` in production)

2. `POST /api/auth/signup`

- validates input and uniqueness
- writes new user to `data/users.json`
- returns `201` on success, `409` for duplicate username, `400` for validation

3. `POST /api/auth/logout`

- clears auth cookie (`maxAge: 0`)

4. `GET /api/auth/me`

- reads cookie and returns `{ authenticated, user }`

### Concept

- Using dedicated endpoints keeps auth logic server-side.
- Status codes communicate intent clearly:
  - `200` success
  - `201` created
  - `400` bad request
  - `401` unauthorized
  - `409` conflict

## 6. Login and Signup Pages + Forms

### Files

- `app/login/page.tsx`
- `app/login/LoginForm.tsx`
- `app/signup/page.tsx`
- `app/signup/SignupForm.tsx`
- `app/login/page.module.css`

### What changed

- Added login page and client form.
- Added signup page and client form.
- Login page reads optional `from` and `username` query params.
- Signup redirects to login with prefilled username after success.
- Added cross-links between login and signup.

### Concept

- Server component (`page.tsx`) decides redirect rules and passes props.
- Client component (`LoginForm.tsx` / `SignupForm.tsx`) handles user interaction and fetch.

## 7. Navbar Auth Awareness

### Files

- `app/components/Navbar.tsx`
- `app/components/navbar.module.css`

### What changed

- Navbar now checks `/api/auth/me` on route changes.
- Shows `Login` when unauthenticated.
- Shows `Signed in as ...` + `Logout` when authenticated.
- Hides internal app links (`/products`, `/posts`, `/Stocks`, `/cart`) unless authenticated.

### Concept

- This is UI-level access feedback.
- Real protection is still enforced by `proxy.ts`; hidden links are a UX layer only.

## 8. Product Data Layer (Persistent CRUD)

### File

- `app/actions/products.ts`

### What changed

- Replaced in-memory product array with file-backed persistence in `data/products.json`.
- Added utilities:
  - `ensureProductsFile()`
  - `readProducts()`
  - `writeProducts()`
  - `sanitizeProducts()`
- Updated product CRUD to read/write from file:
  - `getAllProducts()`
  - `getProductById()`
  - `createProduct()`
  - `updateProduct()`
  - `deleteProduct()`

### Why this was needed

- API and page rendering were not always sharing one in-memory state.
- File-backed storage keeps product additions visible consistently.

### Concept

- Persistence decouples data from process memory lifecycle.
- Sanitization protects against malformed JSON data.

## 9. Products API and Page Guard

### Files

- `app/api/products/route.ts`
- `app/products/page.tsx`

### What changed

- Both endpoints now check auth cookie via `await cookies()`.
- Unauthorized requests return `401` from API.
- Product page redirects to login if not authenticated.
- Product page includes `AddProductForm`.

### Concept

- Defense in depth: global proxy + local checks in sensitive handlers.

## 10. Add Product Form

### Files

- `app/components/AddProductForm.tsx`
- `app/components/AddProductForm.module.css`

### What changed

- Added dedicated product creation form.
- Client validation for all required fields.
- Calls `POST /api/products` with JSON payload.
- Shows validation and API error messages.
- On success, triggers page reload to show updated list.

### Note about React warning

- `router.refresh()` caused a React dev-mode warning around Suspense cleanup.
- Replaced with `window.location.reload()` as a pragmatic workaround.

### Concept

- Sometimes framework dev-mode warnings are upstream bugs.
- Reliable UX can require fallback strategies until upstream fixes arrive.

## 11. Image Host Runtime Error Fix

### File

- `app/components/SafeImage.tsx`

### Problem

- `next/image` throws runtime errors for unconfigured external hostnames.

### What changed

- `SafeImage` now automatically sets `unoptimized` for remote URLs.
- This allows rendering arbitrary user-provided image URLs without editing `next.config.ts` for every host.

### Concept

- `next/image` optimization pipeline needs allowed hosts.
- `unoptimized` bypasses optimizer restrictions for dynamic external URLs.

## 12. Next.js 16 Specific Fixes

### Cookies API

- In Next.js 16, `cookies()` is async in server contexts.
- Updated usage from `cookies().get(...)` to `(await cookies()).get(...)`.

### Proxy file naming

- Used `proxy.ts` with exported `proxy()` handler for global guard behavior in this project setup.

## 13. Data Files Created

### Files

- `data/users.json`
- `data/products.json`

### Concept

- Local JSON persistence is simple and debuggable.
- This is still temporary architecture; production should use a real DB.

## 14. Security + Production Caveats

Current implementation is suitable for learning/demo, not production.

Main gaps:

1. Passwords are plain text in `data/users.json`.
2. No brute-force protection / lockout / rate limiting.
3. No CSRF protection strategy for cookie auth APIs.
4. No user roles/permissions beyond "logged in or not".

Production upgrades:

1. Hash passwords with `bcrypt`/`argon2`.
2. Move users/products to a database.
3. Add request rate limiting.
4. Add role-based authorization.

## 15. Endpoint Contract Summary

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products

- `GET /api/products` (auth required)
- `POST /api/products` (auth required)

## 16. Quick Self-Test Flow

1. Open `/signup`, create a new account.
2. Sign in with those credentials at `/login`.
3. Open `/products` and add a product.
4. Refresh page and verify product still exists.
5. Logout and verify protected routes redirect to `/login`.

## 17. Learning Checklist (What You Should Understand)

1. Difference between server and client components in Next.js App Router.
2. Why global route guards belong in proxy/middleware.
3. Cookie-based session basics (`httpOnly`, `sameSite`, `secure`).
4. Why in-memory state can break across handlers and reloads.
5. Why file/DB persistence fixes consistency issues.
6. Why status codes and validation contracts matter.
7. When to use framework workarounds pragmatically (e.g., hard reload).

---

If you want, next step can be a second doc that refactors this demo auth into production-ready auth with hashed passwords + Prisma + PostgreSQL.

## 18. Deep Dive: `AddProductForm` State (Line-by-Line Learning)

### File

- `app/components/AddProductForm.tsx`

### State block you highlighted

```tsx
const [errors, setErrors] = useState<FormErrors>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
```

### Why these 3 states exist

1. `errors`

- Type: `FormErrors`
- Initial value: `{}`
- Purpose: holds field-level validation errors (`title`, `price`, `description`, `image`, `category`) and optional `general` error.
- UI usage: each field conditionally shows its own message. This gives precise feedback instead of one generic error.

2. `isSubmitting`

- Type: `boolean`
- Initial value: `false`
- Purpose: tracks in-flight API call.
- UI usage:
  - disables inputs and submit button
  - changes button text (`Add Product` -> `Adding...`)
- Benefit: prevents accidental double-submit and race conditions.

3. `submitMessage`

- Type: `{ type: 'success' | 'error'; text: string } | null`
- Initial value: `null`
- Purpose: top-level status message.
- Why union type helps:
  - enforces only two visual states (`success` or `error`)
  - message rendering is deterministic in JSX

### Submit lifecycle (important concept)

1. User clicks submit -> `handleSubmit` starts.
2. Reset old messages:

- `setSubmitMessage(null)`
- `setErrors({})`

3. Run `validateForm()`:

- if invalid: store field errors + set error banner + return early.

4. Set `isSubmitting(true)`.
5. Call `POST /api/products`.
6. Parse API response.
7. Success path:

- currently calls `window.location.reload()`.
- reason: workaround for React dev-mode Suspense cleanup warning seen with `router.refresh()`.

8. Failure path:

- write either field/general message from server.

9. `finally`:

- `setIsSubmitting(false)` to always restore UI state.

### Why `finally` is critical

If you only set `isSubmitting(false)` in success path, any thrown error can leave the form permanently disabled. `finally` guarantees cleanup.

### `handleChange` behavior (small but important)

When user edits a field:

- updates that field in `formData`
- clears that field's error only
- clears success banner if present

This creates a responsive UX:

- users are not forced to resubmit to clear old field errors
- resolved fields stop showing red state immediately

### Type-safety concepts used

1. `FormErrors` interface

- gives strict keys for known fields
- prevents typo-based bugs in error mapping

2. `submitMessage` discriminated shape

- keeps render logic simple: `styles[submitMessage.type]`
- no unknown status strings

3. `ApiResponse` type

- makes response handling explicit (`success`, `message`, optional `errors`, `data`)

### Design tradeoff used here

Current success behavior is full page reload (`window.location.reload()`).

Pros:

- stable, simple, avoids React dev warning path
- guaranteed fresh server-rendered list

Cons:

- heavier UX than optimistic update
- loses unsaved in-memory UI context outside this form

### Better production evolution (next step)

1. Move product list to a client boundary and inject added product optimistically.
2. Keep server as source of truth and reconcile on response.
3. Replace hard reload with state update + optional background refresh.

### Quick mental model

- `errors` = field-level validation truth
- `isSubmitting` = request lifecycle lock
- `submitMessage` = top-level operation feedback

This separation is why the form stays predictable under failure, retry, and async delays.
