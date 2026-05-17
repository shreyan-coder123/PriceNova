
'use server';
/**
 * @fileOverview This file handles real-time product data fetching and intelligent grouping.
 * It maps raw SerpApi results and groups identical items to provide price comparison.
 */

import { z } from 'zod';

const SERPAPI_KEY = '49bc32a0f0059a489b59c21d27e56a67c34619f08f77b6de9643a601753e2676';

const ProductSchema = z.object({
  platform: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  productUrl: z.string(),
  imageUrl: z.string(),
  category: z.string(),
  rating: z.number().optional(),
  reviewsCount: z.number().optional(),
  deliveryDays: z.number(),
  trustScore: z.number(),
});

const MatchedGroupSchema = z.object({
  groupId: z.string(),
  products: z.array(ProductSchema),
});

const OrchestratorOutputSchema = z.object({
  matchedGroups: z.array(MatchedGroupSchema),
});

export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;

const TARGET_PLATFORMS = ["Amazon", "Flipkart", "Myntra", "Ajio", "Croma", "Nykaa", "Reliance Digital"];

/**
 * Fetches real shopping results from SerpApi
 */
async function fetchLiveShoppingData(query: string) {
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&hl=en&gl=in&google_domain=google.co.in&num=40`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Market data request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.shopping_results || [];
  } catch (error) {
    console.error('Market Data Fetch Error:', error);
    throw error;
  }
}

/**
 * Normalizes title for grouping by removing noise words and focusing on model/brand
 */
function getGroupingKey(title: string): string {
  const noiseWords = [
    'pack', 'of', 'blue', 'black', 'red', 'green', 'ink', 'pen', 'set', 'pcs', 
    'genuine', 'original', 'free', 'shipping', 'multi', 'color', 'new', 'latest',
    'buy', 'online', 'india', 'best', 'price'
  ];
  
  const clean = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !noiseWords.includes(word));
  
  // Return the first 3 core identifying words to cluster variants
  return clean.slice(0, 3).join(' ');
}

/**
 * Orchestrates the search process and groups similar products.
 */
export async function searchProductNova(query: string): Promise<OrchestratorOutput> {
  try {
    const rawResults = await fetchLiveShoppingData(query);
    
    if (!rawResults || rawResults.length === 0) {
      throw new Error('No real-time market data found for this product.');
    }

    const groupsMap = new Map<string, any[]>();

    rawResults.forEach((item: any) => {
      const priceStr = String(item.price || "0").replace(/[^0-9.]/g, "");
      const price = parseFloat(priceStr) || 0;
      
      const source = item.source || "Marketplace";
      const matchedPlatform = TARGET_PLATFORMS.find(p => 
        source.toLowerCase().includes(p.toLowerCase())
      ) || source;

      const product = {
        platform: matchedPlatform,
        title: item.title,
        description: item.description || `Verified offer from ${matchedPlatform}. High-quality ${item.title} available with fast shipping.`,
        price: price,
        productUrl: item.link,
        imageUrl: item.thumbnail,
        category: item.category || "General",
        rating: item.rating ? parseFloat(item.rating) : 4.2,
        reviewsCount: item.reviews ? parseInt(String(item.reviews).replace(/[^0-9]/g, "")) : 100,
        deliveryDays: TARGET_PLATFORMS.includes(matchedPlatform) ? 2 : 4,
        trustScore: TARGET_PLATFORMS.includes(matchedPlatform) ? 98 : 82,
      };

      const groupKey = getGroupingKey(item.title);
      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, []);
      }
      groupsMap.get(groupKey)?.push(product);
    });

    const matchedGroups = Array.from(groupsMap.entries()).map(([key, products], index) => {
      // Sort within the group by price (ascending)
      const sortedProducts = products.sort((a, b) => a.price - b.price);
      
      // Ensure unique platforms per group
      const uniquePlatformProducts = [];
      const seenPlatforms = new Set();
      
      for (const p of sortedProducts) {
        if (!seenPlatforms.has(p.platform)) {
          uniquePlatformProducts.push(p);
          seenPlatforms.add(p.platform);
        }
      }

      return {
        groupId: `group-${index}`,
        products: uniquePlatformProducts,
      };
    });

    // Prioritize groups that have multiple platforms
    matchedGroups.sort((a, b) => {
      const aPlatforms = a.products.length;
      const bPlatforms = b.products.length;
      
      if (bPlatforms !== aPlatforms) {
        return bPlatforms - aPlatforms;
      }
      
      return a.products[0].price - b.products[0].price;
    });

    return { matchedGroups };
  } catch (error: any) {
    console.error('Orchestrator Error:', error);
    throw new Error(error.message || 'The PriceNova engine encountered an unexpected error.');
  }
}
