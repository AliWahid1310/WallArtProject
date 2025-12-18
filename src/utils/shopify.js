// Shopify Storefront API Configuration and Functions
// Replace these with your actual Shopify store credentials

const shopifyConfig = {
  domain: import.meta.env.VITE_SHOPIFY_DOMAIN || 'your-store.myshopify.com',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || 'YOUR_STOREFRONT_ACCESS_TOKEN'
}

/**
 * Fetch artwork products from Shopify Storefront API with pagination
 * @returns {Promise<Array>} Array of formatted artwork products
 */
export async function fetchArtworkProducts() {
  let allProducts = []
  let hasNextPage = true
  let cursor = null
  
  try {
    while (hasNextPage && allProducts.length < 2000) {
      const query = `
        {
          products(first: 250${cursor ? `, after: "${cursor}"` : ''}) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              cursor
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
                featuredImage {
                  url
                  altText
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

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.errors) {
        console.error('GraphQL errors:', data.errors)
        throw new Error('Failed to fetch products from Shopify')
      }

      const products = data.data.products.edges
      allProducts = allProducts.concat(products)
      
      hasNextPage = data.data.products.pageInfo.hasNextPage
      cursor = data.data.products.pageInfo.endCursor
      
      console.log(`Fetched ${allProducts.length} products so far...`)
    }
    
    console.log(`Total products fetched: ${allProducts.length}`)
    const transformedProducts = transformShopifyProducts(allProducts)
    console.log('Transformed products:', transformedProducts)
    
    return transformedProducts
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
    
    // Get image - try featuredImage first, then fall back to images array
    const imageUrl = node.featuredImage?.url || node.images.edges[0]?.node.url || ''
    
    return {
      id: node.id,
      title: node.title,
      category: category,
      sizes: sizes,
      tags: node.tags || [], // Include tags for filtering
      image: imageUrl,
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
 * Create a cart and get checkout URL (using new Cart API)
 * @param {Array} lineItems - Array of {variantId, quantity}
 * @returns {Promise<Object>} Cart object with checkoutUrl
 */
export async function createCheckout(lineItems) {
  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      lines: lineItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }))
    }
  }

  try {
    console.log('Creating checkout with config:', shopifyConfig)
    console.log('Line items:', lineItems)
    
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

    if (!response.ok) {
      const errorText = await response.text()
      console.error('HTTP error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Full Checkout API response:', JSON.stringify(data, null, 2))
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      throw new Error(`GraphQL Error: ${data.errors[0].message}`)
    }
    
    if (!data.data) {
      console.error('No data in response:', data)
      throw new Error('Invalid response from Shopify API - no data field')
    }
    
    if (!data.data.cartCreate) {
      console.error('No cartCreate in response:', data)
      throw new Error('Invalid response from Shopify API - no cartCreate field')
    }
    
    if (data.data.cartCreate.userErrors && data.data.cartCreate.userErrors.length > 0) {
      console.error('Cart user errors:', data.data.cartCreate.userErrors)
      throw new Error(`Cart Error: ${data.data.cartCreate.userErrors[0].message}`)
    }

    if (!data.data.cartCreate.cart) {
      console.error('No cart object in response:', data.data.cartCreate)
      throw new Error('Cart creation failed - no cart object returned')
    }

    // Return cart with checkoutUrl (matches the old checkout.webUrl structure)
    return {
      ...data.data.cartCreate.cart,
      webUrl: data.data.cartCreate.cart.checkoutUrl
    }
  } catch (error) {
    console.error('Error creating checkout:', error)
    throw error
  }
}

/**
 * Fetch frame products from Shopify
 * @returns {Promise<Array>} Array of frame products with variants
 */
export async function fetchFrameProducts() {
  const query = `
    {
      products(first: 10, query: "tag:frame") {
        edges {
          node {
            id
            title
            handle
            variants(first: 20) {
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
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      return []
    }

    return data.data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      variants: node.variants.edges.map(v => ({
        id: v.node.id,
        title: v.node.title,
        price: parseFloat(v.node.priceV2.amount).toFixed(2),
        available: v.node.availableForSale
      }))
    }))
  } catch (error) {
    console.error('Error fetching frame products:', error)
    return []
  }
}

export default shopifyConfig
