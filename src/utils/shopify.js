// Shopify Storefront API Configuration and Functions
// Replace these with your actual Shopify store credentials

const shopifyConfig = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'your-store.myshopify.com',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || 'YOUR_STOREFRONT_ACCESS_TOKEN'
}

/**
 * Fetch artwork products from Shopify Storefront API
 * @returns {Promise<Array>} Array of formatted artwork products
 */
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

  try {
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

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      throw new Error('Failed to fetch products from Shopify')
    }

    return transformShopifyProducts(data.data.products.edges)
  } catch (error) {
    console.error('Error fetching Shopify products:', error)
    throw error
  }
}

/**
 * Transform Shopify product data to match our application format
 * @param {Array} shopifyProducts - Raw Shopify product data
 * @returns {Array} Formatted products
 */
function transformShopifyProducts(shopifyProducts) {
  return shopifyProducts.map(({ node }) => {
    // Find metafields for sizes and category
    const sizesMetafield = node.metafields.find(m => m && m.key === 'frame_sizes')
    const categoryMetafield = node.metafields.find(m => m && m.key === 'category')
    
    // Parse frame sizes from metafield
    let sizes = ['50x70'] // default
    if (sizesMetafield?.value) {
      try {
        sizes = JSON.parse(sizesMetafield.value)
      } catch (e) {
        // If it's a comma-separated string instead of JSON
        sizes = sizesMetafield.value.split(',').map(s => s.trim())
      }
    }

    // Get category from metafield or tags
    let category = categoryMetafield?.value || 'Uncategorized'
    if (!categoryMetafield) {
      // Try to find category from tags
      const categoryTag = node.tags.find(tag => 
        ['Abstract', 'Botanical', 'Line Art', 'Geometric', 'Typography', 'Nature', 'Urban'].includes(tag)
      )
      if (categoryTag) category = categoryTag
    }
    
    return {
      id: node.id,
      title: node.title,
      category: category,
      sizes: sizes,
      image: node.images.edges[0]?.node.url || '',
      price: parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2),
      currency: node.priceRange.minVariantPrice.currencyCode,
      shopifyProductId: node.id,
      handle: node.handle,
      description: node.description,
      variants: node.variants.edges.map(v => ({
        id: v.node.id,
        title: v.node.title,
        price: parseFloat(v.node.priceV2.amount).toFixed(2),
        available: v.node.availableForSale
      }))
    }
  })
}

/**
 * Fetch a single product by handle
 * @param {string} handle - Product handle (URL slug)
 * @returns {Promise<Object>} Product details
 */
export async function fetchProductByHandle(handle) {
  const query = `
    {
      productByHandle(handle: "${handle}") {
        id
        title
        description
        images(first: 5) {
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
              priceV2 {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `

  try {
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
    return data.data.productByHandle
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

/**
 * Create a checkout with selected items
 * @param {Array} lineItems - Array of {variantId, quantity}
 * @returns {Promise<Object>} Checkout object with webUrl
 */
export async function createCheckout(lineItems) {
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 5) {
            edges {
              node {
                title
                quantity
              }
            }
          }
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `

  const variables = {
    input: {
      lineItems: lineItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }))
    }
  }

  try {
    const response = await fetch(
      `https://${shopifyConfig.domain}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken
        },
        body: JSON.stringify({ query: mutation, variables })
      }
    )

    const data = await response.json()
    
    if (data.data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.data.checkoutCreate.checkoutUserErrors[0].message)
    }

    return data.data.checkoutCreate.checkout
  } catch (error) {
    console.error('Error creating checkout:', error)
    throw error
  }
}

export default shopifyConfig
