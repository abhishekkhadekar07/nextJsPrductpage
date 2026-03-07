# Interview Q&A Notes: ProductPage

## 1) What problem does this project solve?

It builds a protected product application where only authenticated users can access the app, create products, and browse related sections. It includes signup/login/logout/session-check APIs, global route protection, and persistent product/user storage.

## 2) Why did you use `proxy.ts`?

I used `proxy.ts` for centralized access control in Next.js App Router. It enforces auth before requests reach protected pages/APIs, reducing duplicated checks and keeping rules consistent.

## 3) Which routes are public and which are protected?

Public routes:

- `/login`
- `/signup`
- `/api/auth/login`
- `/api/auth/signup`
- `/api/auth/me`
- `/api/auth/logout`

Protected:

- All other pages and APIs.

## 4) How is authentication implemented?

Auth is cookie-based session auth.

- On successful login, server sets an HTTP-only cookie (`productpage_auth`).
- Protected routes verify presence of that cookie.
- Logout clears the cookie (`maxAge: 0`).

## 5) Why HTTP-only cookie instead of localStorage token?

HTTP-only cookies are not accessible from JavaScript, reducing XSS token theft risk. It keeps session handling server-centric and simpler for protected server routes.

## 6) How do you prevent open redirect issues?

Using `resolveRedirect()` + `isSafeRedirect()` in `lib/auth.ts`. Only internal paths starting with `/` are allowed, and `//` is blocked.

## 7) Why did signup/login initially fail with in-memory data?

In-memory state can differ between route handlers/processes. Signup and login were not guaranteed to read the same runtime memory. I replaced it with file-backed storage (`data/users.json`) via `lib/auth-users.ts`.

## 8) How are users stored now?

In `data/users.json` with read/write/sanitize helpers in `lib/auth-users.ts`.

- `registerUser()` creates users with validation.
- `validateCredentials()` checks login.
- default admin user is auto-seeded if missing.

## 9) How are products stored now?

In `data/products.json` via `app/actions/products.ts`.

- Added `ensureProductsFile`, `readProducts`, `writeProducts`, `sanitizeProducts`.
- CRUD reads/writes one shared file-backed source.

## 10) What bug did this product storage fix?

`POST /api/products` could succeed but `/products` page sometimes showed old data due to in-memory inconsistency. File-backed storage fixed visibility and persistence.

## 11) What does the Add Product form state do?

In `AddProductForm.tsx`:

- `errors`: field-level and general validation errors.
- `isSubmitting`: disable UI and prevent duplicate submit.
- `submitMessage`: success/error banner payload.

## 12) Why was `window.location.reload()` used after add?

`router.refresh()` triggered a React dev-mode Suspense cleanup warning. `window.location.reload()` is a pragmatic stable workaround so users always see the new product immediately.

## 13) How does validation work in add product flow?

Two layers:

- Client-side validation in `AddProductForm.tsx` for immediate UX.
- Server-side validation in `app/api/products/route.ts` for trust boundary enforcement.

## 14) Why is server-side validation still required?

Client validation can be bypassed. API must re-validate request body and reject bad/missing values.

## 15) What status codes are used and why?

- `200`: success read/login/logout/me
- `201`: resource created (signup/product create)
- `400`: invalid request/validation error
- `401`: unauthorized access
- `409`: conflict (duplicate username)
- `500`: unexpected server error

## 16) How is navbar auth-aware?

Navbar calls `/api/auth/me` and conditionally renders login/logout and protected links. It improves UX but does not replace backend protection.

## 17) What was the `next/image` hostname runtime issue?

User-added external image domains caused runtime errors when not configured in `next.config`. I updated `SafeImage` to mark remote URLs as `unoptimized`, avoiding optimizer host restrictions for dynamic sources.

## 18) Why not keep adding domains in `next.config.ts`?

For user-generated URLs, domain list is unbounded. `unoptimized` on remote URLs is more robust for this use-case.

## 19) What are current security limitations?

- Passwords are plain text in `data/users.json`.
- No brute-force/rate limiting.
- No CSRF strategy.
- No role-based access control.

## 20) What would you do for production readiness?

1. Hash passwords (bcrypt/argon2).
2. Move users/products to a DB (PostgreSQL + Prisma).
3. Add rate limiting and account lockout.
4. Add CSRF protections.
5. Add RBAC and audit logs.
6. Replace file storage with transactional writes.

## 21) Why both proxy-level guard and endpoint checks?

Defense in depth:

- Proxy handles global policy and early rejection.
- Endpoint/page checks protect sensitive operations if proxy config is changed or bypassed.

## 22) What did you change for Next.js 16 compatibility?

`cookies()` in server contexts is async. Updated calls to `(await cookies()).get(...)`.

## 23) How do you explain this project architecture in 30 seconds?

I built a cookie-authenticated Next.js app with centralized route protection via `proxy.ts`, auth APIs for signup/login/logout/me, persistent file-backed storage for users and products, and a validated add-product flow. I fixed state consistency bugs and runtime issues around refresh and dynamic image hosts.

## 24) What are the most important files to review quickly?

1. `proxy.ts`
2. `lib/auth.ts`
3. `lib/auth-users.ts`
4. `app/api/auth/login/route.ts`
5. `app/api/auth/signup/route.ts`
6. `app/actions/products.ts`
7. `app/api/products/route.ts`
8. `app/components/AddProductForm.tsx`
9. `app/components/SafeImage.tsx`
10. `app/components/Navbar.tsx`

## 25) What testing checklist would you run manually?

1. Signup with new username -> expect `201`.
2. Signup same username -> expect `409`.
3. Login with valid creds -> expect cookie set + redirect works.
4. Access protected route without login -> redirect to `/login`.
5. Access protected API without login -> `401`.
6. Add product -> appears in `/products` and persists.
7. Logout -> protected routes blocked again.
8. Add product with external image URL -> no runtime image host crash.

## Quick Revision Script (Speakable)

- Auth model: cookie session + proxy guard.
- Data model: file-backed users/products.
- Reliability fixes: replaced in-memory stores, avoided dev refresh warning, handled dynamic image URLs safely.
- Security today: demo-grade.
- Security tomorrow: hash + DB + rate-limit + CSRF + RBAC.
