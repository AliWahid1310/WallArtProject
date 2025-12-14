# Shopify Integration Guide

This document explains how to integrate your Shopify store with the Gallery Wall Configurator to fetch artwork products dynamically.

## Overview

The application is already structured to work with Shopify's API. You'll need to replace the mock `artworkProducts` array with actual data from your Shopify store.

## Prerequisites

1. A Shopify store with products (artwork/prints)
2. Shopify Storefront API access token
3. Products tagged/categorized properly in Shopify

## Setup Steps

### 1. Install Shopify Dependencies

```bash
npm install @shopify/shopify-api
# or
npm install shopify-buy
```

### 2. Create Shopify Configuration File

Create `src/utils/shopify.js`:

```javascript
const shopifyConfig = {
  domain: 'your-store.myshopify.com',
  storefrontAccessToken: 'YOUR_STOREFRONT_ACCESS_TOKEN'
}

// Using Shopify Storefront API
export async function fetchArtworkProducts() {
  const query = `
    {
      products(first: 50, query: "tag:artwork OR tag:print") {
        edges {
          node {
            id
            title
            handle
            description
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
            metafields(identifiers: [
              { namespace: "custom", key: "frame_sizes" },
              { namespace: "custom", key: "category" }
            ]) {
              key
              value
            }
          }
        }
      }
    }
  `

  const response = await fetch(
    `https://${shopifyConfig.domain}/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken
      },
      body: JSON.stringify({ query })
    }
  )

  const data = await response.json()
  return transformShopifyProducts(data.data.products.edges)
}

function transformShopifyProducts(shopifyProducts) {
  return shopifyProducts.map(({ node }) => {
    // Find size metafield
    const sizesMetafield = node.metafields.find(m => m.key === 'frame_sizes')
    const categoryMetafield = node.metafields.find(m => m.key === 'category')
    
    return {
      id: node.id,
      title: node.title,
      category: categoryMetafield?.value || 'Uncategorized',
      sizes: sizesMetafield 
        ? JSON.parse(sizesMetafield.value) 
        : ['50x70'], // default size
      image: node.images.edges[0]?.node.url || '',
      price: node.priceRange.minVariantPrice.amount,
      shopifyProductId: node.id,
      handle: node.handle,
      variants: node.variants.edges.map(v => ({
        id: v.node.id,
        title: v.node.title,
        price: v.node.priceV2.amount,
        available: v.node.availableForSale
      }))
    }
  })
}

export default shopifyConfig
```

### 3. Update LandingPage.jsx

Replace the mock data with Shopify data:

```javascript
import { useState, useEffect } from "react"
import { fetchArtworkProducts } from '../utils/shopify'

export default function LandingPage() {
  // ... existing state ...
  const [artworkProducts, setArtworkProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch products from Shopify on component mount
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true)
        const products = await fetchArtworkProducts()
        setArtworkProducts(products)
      } catch (error) {
        console.error('Error fetching Shopify products:', error)
        // Fallback to mock data if needed
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  // ... rest of component ...
}
```

## Shopify Product Setup

### Required Product Structure

Each artwork product in Shopify should have:

1. **Title**: Display name of the artwork
2. **Tags**: Include "artwork" or "print" for filtering
3. **Images**: At least one product image
4. **Variants**: Different sizes (30x40, 50x70, 70x100, etc.)
5. **Metafields** (custom fields):
   - `custom.frame_sizes`: JSON array like `["30x40", "50x70", "70x100"]`
   - `custom.category`: String like "Abstract", "Botanical", "Line Art"

### Setting Up Metafields

1. Go to Shopify Admin → Settings → Custom Data
2. Add definition for Products:
   - Name: Frame Sizes
   - Namespace: custom
   - Key: frame_sizes
   - Type: List of single line text
   
3. Add another definition:
   - Name: Category
   - Namespace: custom
   - Key: category
   - Type: Single line text

### Product Example

```
Title: Abstract Mountains
Price: £29.99
Tags: artwork, abstract, modern
Image: [Upload image]
Variants:
  - 30x40 (£24.99)
  - 50x70 (£29.99)
  - 70x100 (£39.99)
Metafields:
  - frame_sizes: ["30x40", "50x70", "70x100"]
  - category: "Abstract"
```

## API Access Setup

### Get Storefront API Access Token

1. Go to Shopify Admin
2. Apps → Develop apps → Create an app
3. Configure Storefront API scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
4. Install app and copy the Storefront Access Token

## Testing

1. Replace `PLACEHOLDER_ARTWORK_IMAGE_X` URLs with actual Shopify product images
2. Test the artwork selection in Step 4
3. Verify size filtering works correctly

## Cart Integration (Future Step)

For adding selected artworks to Shopify cart:

```javascript
async function addToCart(variantId, quantity) {
  // Use Shopify Storefront API to create/update cart
  // This will be implemented in the checkout flow
}
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
```

Update shopify.js to use these:

```javascript
const shopifyConfig = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
}
```

## Notes

- The current implementation uses mock data with placeholders
- Replace `artworkProducts` array with the Shopify fetch function
- Ensure product metafields are properly configured
- Test with different frame sizes to verify filtering works
- Consider implementing caching for better performance
