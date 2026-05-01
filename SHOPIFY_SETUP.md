# Shopify Integration Setup Guide

This document outlines the required Shopify configuration for the Aamrit headless storefront.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# --- Shopify Storefront API ---
SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="public_access_token"
SHOPIFY_STOREFRONT_PRIVATE_TOKEN="shpat_private_token"  # Optional, more secure

# Public domain for client-side (same as above)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"

# --- Shopify Shop ID (required for Customer Account API) ---
# Extract from your Customer Account API endpoints
SHOPIFY_SHOP_ID="12345678901"

# --- Shopify Customer Account API ---
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID="your-client-id-uuid"

# --- Shopify Admin API (for backend operations) ---
SHOPIFY_ADMIN_ACCESS_TOKEN="shpat_admin_token"
```

## Shopify Admin Configuration

### 1. Storefront API Setup

1. Go to **Settings → Apps and sales channels → Develop apps**
2. Create a new app or select existing
3. Configure Storefront API access scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_customers`
   - `unauthenticated_write_customers`

### 2. Customer Account API Setup

1. Go to **Settings → Customer accounts**
2. Select **"New customer accounts"** (not classic)
3. Go to **Settings → Apps and sales channels → Develop apps**
4. Create a **Headless** app with Customer Account API access
5. Configure permissions:
   - `customer_read_customers`
   - `customer_write_customers`
   - `customer_read_orders`
   - `customer_write_orders`
   - `customer_read_draft_orders`
   - `customer_read_markets`

### 3. Callback URIs (REQUIRED)

Add these callback URIs in your Headless app configuration:

**Production:**
```
https://aamrit-smoky.vercel.app/api/auth/shopify-account/callback
```

**Local Development:**
```
http://localhost:3000/api/auth/shopify-account/callback
```

### 4. JavaScript Origins (Optional)

```
https://aamrit-smoky.vercel.app
http://localhost:3000
```

### 5. Logout URI (Optional)

```
https://aamrit-smoky.vercel.app
```

## Finding Your Shop ID

The Shop ID is visible in your Customer Account API endpoint URLs:

```
https://shopify.com/authentication/65906901086/oauth/authorize
                              ↑↑↑↑↑↑↑↑↑↑↑
                              This is your Shop ID
```

Set this as `SHOPIFY_SHOP_ID` in your environment.

## Admin API Setup (for Order Management)

1. Go to **Settings → Apps and sales channels → Develop apps**
2. Create or select an Admin app
3. Configure Admin API access scopes:
   - `read_orders`
   - `write_orders`
   - `read_customers`
   - `read_products`
   - `read_inventory`

## Vercel Environment Variables

Add the same environment variables in your Vercel project:

1. Go to your Vercel project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Make sure `NODE_ENV=production` is set

## Testing the Integration

### Test Storefront API:
```bash
curl -X POST https://your-store.myshopify.com/api/2024-10/graphql.json \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: your_token" \
  -d '{"query": "{ shop { name } }"}'
```

### Test Customer Account API:
Visit `https://your-domain.com/api/auth/shopify-account/start` - you should be redirected to Shopify's login page.

## Troubleshooting

### "api_token_exchange_..." Error
- Ensure `SHOPIFY_SHOP_ID` is set correctly
- Verify Customer Account API is enabled in Shopify Admin
- Check that your Client ID is from a Headless app with Customer Account API access

### "discovery_failed" Error
- Verify `SHOPIFY_SHOP_ID` is correct
- Ensure the shop has Customer Account API enabled

### "oauth_not_configured" Error
- Set `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` in environment variables

### Orders Not Loading
- Check Admin API token has `read_orders` permission
- Verify `SHOPIFY_ADMIN_ACCESS_TOKEN` is set correctly
