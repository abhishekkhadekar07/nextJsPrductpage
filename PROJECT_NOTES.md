# Project Notes: ProductPage (Implementation Summary)

## Scope Completed
- Added full authentication flow (signup/login/logout/me).
- Protected the full app for unauthenticated users.
- Added product creation form and API support.
- Fixed product persistence so added products appear reliably.
- Fixed runtime issues around React refresh warning and dynamic image hosts.
- Added learning documentation for review.

## Major Changes

### 1) App-Wide Protection
**File:** `proxy.ts`
- Added global guard to protect all pages and APIs by default.
- Public pages: `/login`, `/signup`.
- Public APIs: `/api/auth/login`, `/api/auth/signup`, `/api/auth/me`, `/api/auth/logout`.
- Non-auth page requests redirect to `/login?from=...`.
- Non-auth API requests return `401`.

**Concepts:** centralized authorization, route interception, defense-in-depth.

### 2) Auth Core + Validation
**File:** `lib/auth.ts`
- Cookie constants and helpers.
- Username normalization (`trim + lowercase`).
- Signup validation rules.
- Safe redirect guard (`resolveRedirect`) to avoid open redirect attacks.

**Concepts:** input normalization, validation boundaries, redirect safety.

### 3) User Persistence Layer
**File:** `lib/auth-users.ts`
**Data:** `data/users.json`
- Implemented file-backed user store.
- `registerUser()` for signup.
- `validateCredentials()` for login.
- Default admin user auto-seeding.
- Read sanitization to avoid malformed data issues.

**Concepts:** persistence vs in-memory state, consistency across handlers.

### 4) Auth APIs
**Files:**
- `app/api/auth/signup/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/me/route.ts`

**Behavior:**
- Signup: create account with validation (`201`, `409`, `400`).
- Login: verify credentials and set `httpOnly` auth cookie.
- Logout: clear cookie.
- Me: return session state (`authenticated`, `user`).

**Concepts:** session cookies, HTTP status semantics.

### 5) Login/Signup UI
**Files:**
- `app/login/page.tsx`
- `app/login/LoginForm.tsx`
- `app/signup/page.tsx`
- `app/signup/SignupForm.tsx`
- `app/login/page.module.css`

**Behavior:**
- Signup creates credentials and redirects to login.
- Login supports redirect target via `from` query.
- Username prefill after signup.
- Cross-links between login and signup.

**Concepts:** server component redirects + client form submission flow.

### 6) Navbar Auth Awareness
**Files:**
- `app/components/Navbar.tsx`
- `app/components/navbar.module.css`

**Behavior:**
- Fetches `/api/auth/me`.
- Shows login/logout state.
- Protected nav links only visible when authenticated.

**Concepts:** UI authorization feedback (not a substitute for backend guard).

### 7) Product Persistence Fix
**File:** `app/actions/products.ts`
**Data:** `data/products.json`
- Replaced in-memory products with file-backed persistence.
- Added file ensure/read/write/sanitize helpers.
- Updated CRUD to read/write same shared store.

**Why:** add-product previously succeeded via API but UI could render stale in-memory state.

### 8) Product API + Page Access
**Files:**
- `app/api/products/route.ts`
- `app/products/page.tsx`

**Behavior:**
- Auth checks on product API.
- Product page redirects if not authenticated.
- Product list reads persistent store through actions.

### 9) Add Product Form
**Files:**
- `app/components/AddProductForm.tsx`
- `app/components/AddProductForm.module.css`

**Behavior:**
- Client-side validation.
- POST to `/api/products`.
- Error/success handling with typed state.
- Uses page reload on success to avoid dev Suspense warning path.

**State design used:**
- `errors`: field-level and general error map.
- `isSubmitting`: request lock and button/input disable.
- `submitMessage`: explicit success/error banner.

### 10) Runtime Image Fix
**File:** `app/components/SafeImage.tsx`
- Auto-sets `unoptimized` for remote URLs.
- Prevents `next/image` runtime crash for unconfigured external hosts.

## Bugs Fixed During Work
- Next.js 16 async cookies usage (`await cookies()` required).
- Signup credentials not reusable due to in-memory auth store mismatch.
- Product added but not visible due to storage inconsistency.
- React dev warning after add (`router.refresh()` path).
- Dynamic external image host runtime error.

## Endpoints Implemented
### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products
- `GET /api/products` (auth required)
- `POST /api/products` (auth required)

## Files Added
- `proxy.ts`
- `lib/auth.ts`
- `lib/auth-users.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/me/route.ts`
- `app/api/auth/signup/route.ts`
- `app/login/page.tsx`
- `app/login/LoginForm.tsx`
- `app/signup/page.tsx`
- `app/signup/SignupForm.tsx`
- `app/components/AddProductForm.tsx`
- `app/components/AddProductForm.module.css`
- `data/users.json`
- `data/products.json`
- `IMPLEMENTATION_LEARNING_GUIDE.md`

## Existing Files Updated
- `app/actions/products.ts`
- `app/api/products/route.ts`
- `app/products/page.tsx`
- `app/components/Navbar.tsx`
- `app/components/navbar.module.css`
- `app/components/SafeImage.tsx`
- `app/login/page.module.css`

## Security Note
Current auth is demo-grade:
- Passwords are plain text in `data/users.json`.

Production upgrades needed:
1. Password hashing (`bcrypt`/`argon2`).
2. Database-backed users/products.
3. Rate limiting + brute-force protection.
4. CSRF strategy for cookie auth.
5. Role-based authorization.

## Study Order (Recommended)
1. `proxy.ts`
2. `lib/auth.ts`
3. `lib/auth-users.ts`
4. `app/api/auth/*`
5. `app/login/*` and `app/signup/*`
6. `app/actions/products.ts`
7. `app/api/products/route.ts`
8. `app/components/AddProductForm.tsx`
9. `app/components/SafeImage.tsx`
10. `app/components/Navbar.tsx`

## Related Docs
- `IMPLEMENTATION_LEARNING_GUIDE.md` (detailed walkthrough)
- `PROJECT_NOTES.md` (this file, concise review notes)