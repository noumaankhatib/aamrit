# Aamrit — Premium Mango Pulp eCommerce (Shopify Headless)

Full-stack Next.js storefront for **Aamrit**, a premium mango pulp brand by Yeskay Mango Farms Pvt. Ltd. — family-grown across 10 farms in Ratnagiri & Raigad since 2008.

This is a **headless Shopify** implementation where the frontend is built with Next.js and all product, cart, and checkout data comes from the Shopify Storefront API.

## Tech Stack

- **Next.js 16** (App Router, Server Components + Server Actions)
- **TypeScript** + **Tailwind CSS** + **Framer Motion**
- **Shopify Storefront API** — products, collections, cart, checkout
- **Zod** — server action validation

## Architecture

- **Products & Collections**: Fetched from Shopify via GraphQL Storefront API
- **Cart**: Managed via Shopify Cart API, cart ID stored in httpOnly cookie
- **Checkout**: Redirects to Shopify hosted checkout
- **Orders**: Handled entirely by Shopify (customer accounts, order history, tracking)
- **No custom database**: All data lives in Shopify

## Run locally

```bash
# 1. Install deps
npm install

# 2. Copy env template
cp .env.example .env.local

# 3. Add your Shopify credentials (see below)

# 4. Run the dev server
npm run dev
```

Visit <http://localhost:3000>.

## Shopify Setup

### 1. Create a Storefront API app

1. Go to your Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps" → "Create an app"
3. Configure **Storefront API** scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_content`
4. Install the app and copy the **Storefront API access token**

### 2. Environment Variables

| Variable | Description |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | Your store domain: `your-store.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token from step above |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Same as above (for client-side if needed) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for SEO/metadata) |

## Routes

### Public
- `/` — marketing homepage
- `/shop` — product catalog with category filtering
- `/shop/[slug]` — product detail page (SSR, JSON-LD `Product` schema)
- `/cart` — shopping cart (Shopify cart API)
- `/checkout` — order review + redirect to Shopify checkout
- `/orders` — link to Shopify customer account for order history

### SEO
- `/sitemap.xml` — auto-generated from Shopify products
- `/robots.txt` — disallows cart/checkout
- Per-product JSON-LD `Product` schema
- Site-wide `Organization` JSON-LD

## Key Files

```
lib/
├── shopify.ts          # Shopify Storefront API client & data transformations
├── shopify-cart.ts     # Cart operations with cookie persistence
├── env.ts              # Environment configuration
└── money.ts            # Currency formatting utilities

app/
├── shop/
│   ├── page.tsx        # Product listing (from Shopify)
│   └── [slug]/page.tsx # Product detail (from Shopify)
├── cart/
│   ├── page.tsx        # Cart page (Shopify cart)
│   └── actions.ts      # Server actions for cart mutations
├── checkout/page.tsx   # Checkout review → Shopify redirect
└── orders/page.tsx     # Links to Shopify account
```

## Shopify Product Setup

For the frontend to display all fields correctly, set up these **product metafields** in Shopify:

| Namespace | Key | Type | Description |
| --- | --- | --- | --- |
| `custom` | `variety` | Single line text | Product variety (e.g., "Alphonso") |
| `custom` | `benefits` | Multi-line text | Product benefits |
| `custom` | `nutrition` | Multi-line text | Nutritional information |

Products tagged with `featured` will appear first in listings.

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Components (RSC)                              │   │
│  │  • Fetch products/collections from Shopify           │   │
│  │  • Read cart from Shopify via cart ID cookie        │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Actions                                       │   │
│  │  • Add/update/remove cart items                      │   │
│  │  • Mutations go to Shopify Storefront API           │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Checkout                                             │   │
│  │  • User clicks checkout → redirect to Shopify       │   │
│  │  • Payment, shipping handled by Shopify             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Shopify Storefront API                   │
│  • Products, Collections, Cart, Checkout                   │
│  • GraphQL endpoint: /api/2024-01/graphql.json             │
└─────────────────────────────────────────────────────────────┘
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into Vercel
3. Set environment variables:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
4. Deploy!

No database setup required — everything is powered by Shopify.

## Useful Scripts

```bash
npm run dev          # next dev
npm run build        # next build
npm run start        # next start (production)
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
```
