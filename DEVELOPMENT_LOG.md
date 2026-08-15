# Development Log — الحرفيين

## DAY 1 — PROJECT FOUNDATION ✅ COMPLETE

**Completed:**
- Vite + React 19 + TypeScript + Tailwind CSS v4 project scaffolded, builds cleanly (`npm run build` passes, 0 type errors)
- Folder architecture: `components/{ui,layout,product,admin}`, `pages/{customer,admin,auth}`, `layouts`, `data`, `hooks`, `services`, `types`, `styles`, `utils`
- RTL configured globally (`<html dir="rtl" lang="ar">`), Cairo font loaded
- Design tokens in `src/index.css` (`@theme`) — derived from the actual colors/spacing found in the original Figma file (`#f59e0b` brand, `#0b0f19` ink, Cairo type) rather than invented from scratch
- Brand: **الحرفيين** logo built as a scalable SVG React component (`components/ui/Logo.tsx`) — geometric interlocking-facet mark, deliberately not a wrench/car/gear cliché — with `icon` / `wordmark` / `full` variants and `dark` / `light` / `mono` themes. Favicon added.
- Reusable component library (Day 1 subset): `Button`, `Input`, `Badge` / `VerificationBadge` / `StatusBadge`, `Card`, `Rating`, `Modal`, `Drawer`, `EmptyState` / `ErrorState`, `Skeleton` / `ProductCardSkeleton`, `ToastViewport`
- Layouts: `CustomerLayout` (header + bottom nav, mobile-first, capped width on desktop for now), `AdminLayout` (sidebar), `AuthLayout`
- Client state (Zustand + localStorage persistence): cart, favorites, selected vehicle, auth
- Centralized typed mock data (`src/data/mockData.ts`) — products, sellers, categories, vehicles, orders, promotions — matches `src/types/index.ts`
- Full route map wired in `App.tsx` (every route from the brief exists and is navigable) — routes not yet built show a placeholder screen rather than 404ing
- **Home screen fully implemented** end-to-end as proof of the foundation: search card, vehicle-compatibility card, categories, deals carousel, popular products using real `ProductCard` component with working "add to cart" (persists, shows toast)

**Not yet done (upcoming days per the plan):**
- Day 2: Splash, Onboarding, Login, Register, Forgot Password, OTP, Reset Password, Search, Categories, Vehicle selection/management
- Day 3: Product listing, Product details, Price comparison, Seller profile, Favorites
- Day 4: Cart (full), Checkout, Order confirmation, Orders, Notifications, Profile
- Day 5: Responsive desktop layouts for the customer website
- Day 6: Admin dashboard screens (currently placeholders behind a working sidebar/shell)
- Day 7+: Backend/API integration (out of scope until frontend is stable, per the plan)

**Next task:** Day 2 — customer authentication + core navigation screens.

---

## DAY 2 — CUSTOMER AUTH + CORE NAVIGATION ✅ COMPLETE

**Completed:**
- **Splash** — standalone full-bleed screen (not inside the auth white-sheet layout), auto-navigates to Onboarding after a beat
- **Onboarding** — 3-step in-page carousel with dot indicator, skip, and next/start actions
- **Login** — phone + password, persisted auth state via Zustand, redirects to Home
- **Register** — name/phone/password, routes into OTP verification
- **Forgot Password** — phone entry, routes into OTP
- **OTP** — 4-digit auto-advancing code input (LTR digit entry inside RTL page, as is standard), routes to Reset Password (from forgot-password flow) or Home (from register flow)
- **Reset Password** — new password + confirm with live mismatch validation
- **Search** — live query, recent searches (persisted to localStorage), category filter drawer, results using the real `ProductCard`, proper empty state when nothing matches
- **Categories** — full category grid, links into...
- **Category Detail** (`/categories/:id`) — filtered product list per category with empty state
- **Vehicle Selection** (`/vehicles`) — list of saved vehicles with active-selection state, add-new-vehicle inline form, persisted via `useVehicleStore`, redirects to Home on selection with a confirmation toast

Build verified clean (`npm run build`, 0 type errors) after each addition.

**Not yet done (Day 3+):**
- Product listing, Product details, Price comparison, Seller profile, Favorites (Day 3)
- Cart UI, Checkout, Orders, Notifications, Profile (Day 4)
- Responsive desktop website layouts (Day 5)
- Admin dashboard screens (Day 6)
- Backend/API (Day 7+)

**Next task:** Day 3 — product listing, product details, price comparison, seller profile, favorites.

---

## DAY 3 — MARKETPLACE CORE ✅ COMPLETE

**Completed:**
- **Product Listing** (`/products`) — category filter chips, sort toggle (popular / price asc / price desc), empty state
- **Product Details** (`/products/:slug`) — gallery placeholder, compatibility banner, price, seller card linking to seller profile, delivery estimate, comparison entry point (only shown when 2+ offers exist), description, specs table, related products, sticky add-to-cart/request-quote bar, favorite toggle
- **Price Comparison** (`/products/:slug/compare`) — added a real `ProductOffer` model + mock multi-seller offers per product so this isn't hollow; sorts by price, highlights the best offer with a badge, shows condition/delivery/stock/warranty per seller, each offer independently addable to cart
- **Seller Profile** (`/sellers/:id`) — verification, rating, location, response rate, product count, seller's product list
- **Favorites** (`/favorites`) — reads from the persisted favorites store, proper empty state with CTA back to products

Build verified clean (`npm run build`, 0 type errors).

**Not yet done (Day 4+):**
- Cart UI, Checkout, Orders, Notifications, Profile (Day 4)
- Responsive desktop website layouts (Day 5)
- Admin dashboard screens (Day 6)
- Backend/API (Day 7+)

**Next task:** Day 4 — cart, checkout, orders, notifications, profile.

---

## DAY 4 — CART + CHECKOUT + ORDERS ✅ COMPLETE

**Completed:**
- **Cart** (`/cart`) — items grouped by seller (per the brief), quantity +/-, remove, subtotal/delivery/total, proper empty state, sticky checkout bar
- **Checkout** (`/checkout`) — real 4-step flow (address → delivery method → payment → review), delivery method affects fee, review step shows full summary, submit creates a real order via a new persisted `useOrdersStore`, clears the cart, and redirects to confirmation
- **Order Confirmation** (`/order-confirmation`) — shows the generated order ID, routes into order tracking
- **Orders** (`/orders`) — all/active/completed/cancelled tabs, empty state per tab
- **Order Detail** (`/orders/:id`) — status timeline (pending → confirmed → preparing → shipped → delivered), line items, address/payment/total
- **Notifications** (`/notifications`) — typed mock notification feed (order/promo/price/system), read/unread styling
- **Profile** (`/profile`) — menu into vehicles/addresses/orders/favorites/notifications/settings/help, working logout that clears auth and redirects to login

The full "browse → cart → checkout → track" loop is now real: an order placed in Checkout actually appears in Orders and Order Detail with live status timeline.

Build verified clean (`npm run build`, 0 type errors).

**Not yet done:**
- Day 5: Responsive desktop website layouts
- Day 6: Admin dashboard screens
- Day 7+: Backend/API

**Next task:** Day 5 — responsive desktop layouts for the customer website.

---

## DAY 5 — CUSTOMER WEBSITE / RESPONSIVE FRONTEND ✅ COMPLETE

**Completed:**
- Deliberately did **not** just stretch the mobile layout — built real desktop-specific structure per the brief's example (header/nav/large search/product grid/sidebar filters vs. compact mobile header/bottom nav)
- **`DesktopHeader`** — logo, nav links, inline search bar, vehicle selector, cart/notifications/profile icons, sticky top
- **`Footer`** — desktop-only, company/customer/legal link columns
- **`CustomerLayout`** now renders one `<Outlet/>` shared between both chromes (mobile header+bottom-nav vs. desktop header+footer, toggled with `md:hidden` / default-hidden classes) — avoids double-mounting pages
- **`ProductCard`** rebuilt responsive: horizontal row layout on mobile → vertical image-on-top grid card on desktop, single component via Tailwind breakpoints rather than two components to maintain
- **Product grids**: Product Listing, Category Detail, Favorites, Seller Profile, Home's popular/deals sections all switch from a stacked column to a real `md:grid md:grid-cols-3/4` grid on desktop
- **Home** — added a genuine desktop hero section (big headline, inline search, CTA buttons "اختر سيارتك" / "تصفح الأقسام" per the brief's suggested copy) instead of just widening the mobile search card
- **Product Listing** — desktop gets a persistent category **sidebar** instead of horizontal scroll chips
- **Product Details** — desktop gets a real two-column layout (sticky gallery + buy-box) instead of a single stretched column; buy actions live inline in the buy-box instead of a fixed bottom bar
- **Cart** — desktop gets a sticky order-summary sidebar instead of a fixed bottom sheet
- **Checkout** — bottom action bar becomes an inline button on desktop, content column capped at a readable width
- **Auth screens** (Splash/Login/Register/etc.) — centered as a card on desktop instead of stretching edge-to-edge, since a full-bleed auth form at 1440px would look broken

Build verified clean (`npm run build`, 0 type errors) throughout.

**Not yet done:**
- Day 6: Admin dashboard screens
- Day 7+: Backend/API

**Next task:** Day 6 — admin dashboard: overview, products, price management, promotions, sellers, orders, inventory, categories/vehicles, analytics, settings.

---

## DAY 6 — ADMIN FRONTEND ✅ COMPLETE

**Completed:**
- New admin-scoped stores (persisted): `useAdminProductsStore` (adds `stock` + `archived` to products, individual + bulk price edit, stock edit), `useAdminSellersStore` (verification/suspend/activate workflow), `useAdminPromotionsStore` (create/delete). `useOrdersStore` extended with `updateStatus` so admin and customer share one source of truth for orders — an admin status change is reflected on the customer's Order Detail page.
- **Dashboard** (`/admin`) — revenue/orders/sellers/products stat cards, low-stock and pending-verification alert cards linking to their sections, recent orders table. Every metric ties to an actual operational action per the brief ("no meaningless charts").
- **Products** (`/admin/products`) — searchable table, archive/restore, quick-view modal
- **Price Management** (`/admin/pricing`) — the operationally important one: multi-select + bulk percentage adjustment, and independent per-row price edits, both backed by real state changes
- **Promotions** (`/admin/promotions`) — card grid by status (active/scheduled/expired), create modal, delete
- **Sellers** (`/admin/sellers`) — table with verify/suspend/reactivate actions that actually change state
- **Orders** (`/admin/orders`) — status-filtered table, one-click "advance to next status" (pending → confirmed → preparing → shipped → delivered)
- **Inventory** (`/admin/inventory`) — stock table with low/out-of-stock badges, inline editable stock
- **Categories & Vehicles** (`/admin/categories`) — tabbed view of both
- **Analytics** (`/admin/analytics`) — added `recharts` for real charts: weekly revenue bar chart, category-mix pie chart, plus revenue/AOV/order-count stat cards
- **Settings** (`/admin/settings`) — sectioned settings shell (general/marketplace/payment/delivery/notifications/users)

Build verified clean (`npm run build`, 0 type errors). Note: bundle crossed the 500kB chunk-size advisory after adding recharts — not an error, but worth code-splitting the admin bundle later (Day 9/10 polish) if this matters for load time.

**Not yet done:**
- Day 7+: Backend/API — everything so far is mock data + client state, by design per the brief's "frontend before backend" instruction
- Empty/error states could use one more pass on the admin side specifically
- Admin login screen (route exists, still a placeholder — admin routes aren't currently gated behind auth)

**Next task:** Per the brief, Day 7 onward moves into backend/API architecture — but that's a much bigger decision (what backend, what hosting, what database) that's worth discussing with you directly rather than assuming. Alternatively I can spend the next session on Day 10-style polish: empty/error states across the admin, admin login gating, and a full QA pass across desktop/tablet/mobile/RTL first, and defer backend until you're ready to talk infrastructure.

---

## DAY 7 — BACKEND ✅ COMPLETE (separate project: `alharafyeen-api/`)

Built as **Node.js + TypeScript + Express + SQLite (better-sqlite3) + JWT + Zod**, layered `routes → controllers → services → db`. Originally planned Prisma, but its engine binary download is blocked by this sandbox's network allowlist — pivoted to `better-sqlite3` directly, verified working.

- Full schema: users, addresses, vehicles, categories, sellers, products, offers, favorites, cart, orders/order items, promotions, notifications
- JWT auth with `CUSTOMER`/`ADMIN` roles, bcrypt password hashing
- Complete REST API: auth (register/login/OTP-mock/reset-password), catalog (search/filter/sort/pagination), vehicles, favorites, cart, orders, notifications, promotions, and a full `/api/admin/*` surface
- Checkout is a real DB transaction — order + items + stock decrement succeed or fail together
- Seed script with demo accounts and data matching the original frontend mocks
- **Verified live**, not just written: full curl-based flow (login → browse → offers → cart → checkout → order in history), confirmed 403/401 role gating, confirmed Zod validation errors, confirmed the compiled production build actually runs (caught and fixed a real bug: `tsc` doesn't copy `schema.sql` into `dist/`)

## DAY 8 — FRONTEND ⇄ BACKEND INTEGRATION ✅ COMPLETE

This is the big one: every mock-data flow in the frontend now talks to the real API.

- **`src/services/api.ts`** — typed fetch client, JWT auto-attached from storage
- **`src/services/catalog.ts`** — data-fetching hooks (`useCategories`, `useProducts`, `useProduct`, `useOffers`, `useRelatedProducts`, `useSeller`, `useSellerProducts`) with loading/error state
- **Auth store rewritten**: real register/login against the API, token persisted, role-based redirect (admin → `/admin`, customer → `/home`)
- **Cart, Favorites, Vehicles, Orders stores rewritten**: no more localStorage-as-database — these now call the API and hold server responses as a client-side cache. Vehicle *selection* (which of your saved cars is "active") stays as small persisted UI-only state since the backend has no concept of that.
- **Every customer page rewired**: Home, Search, Categories, Category Detail, Product Listing, Product Details, Price Comparison, Seller Profile, Favorites, Cart, Checkout, Orders, Order Detail, Notifications, Vehicle Selection, Profile — all fetch real data, show loading skeletons, and handle empty/error states
- **Every admin page rewired**: Dashboard, Products, Price Management, Sellers, Orders, Inventory, Promotions, Categories & Vehicles, Analytics — all hit `/api/admin/*`. Analytics' revenue chart now aggregates *actual* order data instead of hardcoded weekly numbers.
- **Admin routes are now actually gated**: added `AdminGuard` — unauthenticated users bounce to `/login`, authenticated non-admins bounce to `/home`. This wasn't enforced before; now it is, both client-side (guard) and server-side (`requireAdmin` middleware, already verified in Day 7).
- **Backend improvement made during integration**: product and offer queries now join seller name/verification/rating directly, so `ProductCard` and `PriceComparison` don't need N+1 client-side lookups — this was a real design fix, not just plumbing.
- Deleted the frontend's `mockData.ts` and static `notifications.ts` entirely — nothing in the app reads from local fixtures anymore.
- Full stack verified together: type-checked frontend (`tsc -b`) and backend (`tsc --noEmit`) clean, production builds succeed on both, and I re-ran the live curl-based flow against the final schema (including the seller-enriched product/offer responses) to confirm the shapes the frontend expects match exactly what the backend returns.

**Known gaps, stated plainly:**
- `/profile/addresses` and `/profile/settings` are still placeholder screens — the `addresses` table exists in the schema but has no routes yet.
- The "vehicle master data" (makes/models/years as a real reference table, for a proper dropdown instead of free text) doesn't exist — `admin/categories` now says so honestly instead of showing fake data.
- OTP is still mocked (fixed code `1234`) — no real SMS provider, as originally scoped.
- Registration flow creates the account immediately, then treats OTP as a soft phone-verification step rather than blocking account creation on it — a deliberate simplification worth revisiting if phone verification needs to be a hard gate.
- Bundle size crossed the 500kB warning threshold (recharts) — fine for now, worth code-splitting before a real launch.

**Next reasonable steps:** wire up addresses/settings, decide on real SMS/OTP provider, and — when ready to actually deploy — swap SQLite for hosted Postgres (the query layer is simple raw SQL, so this is a real but bounded migration, not a rewrite).


---





