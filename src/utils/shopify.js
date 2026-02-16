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
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
                productType
                vendor
                metafields(identifiers: [
                  { namespace: "custom", key: "frame_sizes" },
                  { namespace: "custom", key: "category" },
                  { namespace: "custom", key: "filter_home_style" },
                  { namespace: "custom", key: "filter_rooms" },
                  { namespace: "custom", key: "filter_artists" },
                  { namespace: "custom", key: "artwork_file" },
                  { namespace: "descriptors", key: "color" }
                ]) {
                  key
                  namespace
                  value
                  type
                  reference {
                    ... on MediaImage {
                      image {
                        url
                        altText
                      }
                    }
                    ... on GenericFile {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `

      const response = await fetch(
        `https://${shopifyConfig.domain}/api/2024-04/graphql.json`,
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
      
      // Debug: log raw metafield data from first batch to check artwork_file
      if (allProducts.length === 0 && products.length > 0) {
        const first5WithMeta = products.slice(0, 5).map(p => ({
          title: p.node.title,
          metafields: p.node.metafields
        }))
        console.log('[DEBUG] First 5 products raw metafields:', JSON.stringify(first5WithMeta, null, 2))
        
        // Specifically check for artwork_file
        const withArtwork = products.filter(p => 
          p.node.metafields.some(m => m && m.key === 'artwork_file')
        )
        console.log(`[DEBUG] Products with artwork_file in first batch: ${withArtwork.length}/${products.length}`)
        if (withArtwork.length > 0) {
          console.log('[DEBUG] First artwork_file data:', JSON.stringify(
            withArtwork[0].node.metafields.find(m => m && m.key === 'artwork_file'), null, 2
          ))
        }
      }
      
      allProducts = allProducts.concat(products)
      
      hasNextPage = data.data.products.pageInfo.hasNextPage
      cursor = data.data.products.pageInfo.endCursor
      
      console.log(`Fetched ${allProducts.length} products so far...`)
    }
    
    console.log(`Total products fetched: ${allProducts.length}`)
    
    // Count products with artwork_file metafield
    const artworkFileCount = allProducts.filter(p => 
      p.node.metafields.some(m => m && m.key === 'artwork_file' && m.namespace === 'custom')
    ).length
    console.log(`🖼️ Products with frameless artwork_file: ${artworkFileCount}/${allProducts.length}`)
    
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
    const colorMetafield = node.metafields.find(m => m && m.key === 'color' && m.namespace === 'descriptors')
    const styleMetafield = node.metafields.find(m => m && m.key === 'filter_home_style')
    const roomsMetafield = node.metafields.find(m => m && m.key === 'filter_rooms')
    const artistsMetafield = node.metafields.find(m => m && m.key === 'filter_artists')
    const artworkFileMetafield = node.metafields.find(m => m && m.key === 'artwork_file' && m.namespace === 'custom')
    
    // Debug: log artwork_file metafield for first few products
    if (artworkFileMetafield) {
      console.log(`[artwork_file] ${node.title}:`, JSON.stringify(artworkFileMetafield, null, 2))
    }
    
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
    
    // Get artwork image from artwork_file metafield (frameless), falling back to featured image
    // Try multiple paths: MediaImage reference, GenericFile reference, or direct URL in value
    let artworkFileUrl = ''
    if (artworkFileMetafield) {
      // Path 1: MediaImage reference (reference.image.url)
      artworkFileUrl = artworkFileMetafield.reference?.image?.url
        // Path 2: GenericFile reference (reference.url)
        || artworkFileMetafield.reference?.url
        // Path 3: Value is a direct CDN URL string
        || (artworkFileMetafield.value?.startsWith?.('http') ? artworkFileMetafield.value : '')
        || ''
    }
    const imageUrl = artworkFileUrl || node.featuredImage?.url || node.images.edges[0]?.node.url || ''
    
    // Extract size options from variants
    const sizeOptions = new Set()
    node.variants.edges.forEach(variant => {
      const sizeOption = variant.node.selectedOptions?.find(opt => opt.name.toLowerCase() === 'size')
      if (sizeOption?.value) {
        sizeOptions.add(sizeOption.value)
      }
    })
    
    // Helper function to parse metafield values (handles JSON arrays and comma-separated strings)
    const parseMetafieldArray = (metafield) => {
      if (!metafield?.value) return []
      try {
        const parsed = JSON.parse(metafield.value)
        // If it's an array, filter out empty values
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && typeof item === 'string' && item.trim())
        }
        // If it's a single string, wrap in array
        if (typeof parsed === 'string' && parsed.trim()) {
          return [parsed.trim()]
        }
        return []
      } catch (e) {
        // If JSON parse fails, try comma-separated
        return metafield.value.split(',')
          .map(s => s.trim())
          .filter(s => s) // Remove empty strings
      }
    }
    
    // Parse all metafields
    const colors = parseMetafieldArray(colorMetafield)
    const styles = parseMetafieldArray(styleMetafield)
    const rooms = parseMetafieldArray(roomsMetafield)
    const artists = parseMetafieldArray(artistsMetafield)
    
    const finalSizes = sizeOptions.size > 0 ? Array.from(sizeOptions) : sizes
    
    const product = {
      id: node.id,
      title: node.title,
      category: category,
      sizes: finalSizes,
      tags: node.tags || [], // Include tags for orientation filtering
      colors: colors, // Color metafield
      styles: styles, // Filter Home Style metafield
      rooms: rooms, // Filter Rooms metafield
      artists: artists, // Filter Artists metafield
      productType: node.productType || '', // Collection filtering
      vendor: node.vendor || '', // Vendor/Artist name
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
        available: v.node.availableForSale,
        selectedOptions: v.node.selectedOptions || []
      }))
    }
    
    // Log first 3 products for debugging (use index from map)
    const productIndex = shopifyProducts.findIndex(p => p.node.id === node.id)
    if (productIndex < 3 && productIndex >= 0) {
      console.log(`Product ${productIndex + 1}:`, {
        title: product.title,
        image: product.image,
        colors: product.colors,
        sizes: product.sizes,
        styles: product.styles,
        rooms: product.rooms,
        artists: product.artists,
        tags: product.tags,
        productType: product.productType
      })
    }
    
    return product
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
      `https://${shopifyConfig.domain}/api/2024-04/graphql.json`,
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
      `https://${shopifyConfig.domain}/api/2024-04/graphql.json`,
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
      `https://${shopifyConfig.domain}/api/2024-04/graphql.json`,
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
