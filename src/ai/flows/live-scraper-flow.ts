'use server';
/**
 * @fileOverview This file handles the real-time product data fetching and processing.
 * The AI agent has been removed to ensure stability and resolve model resolution errors.
 * It now uses a direct mapping logic to provide consistent search results.
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

/**
 * Fetches real shopping results from SerpApi
 */
async function fetchLiveShoppingData(query: string) {
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&hl=en&gl=in&google_domain=google.co.in`;
  
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
 * Orchestrates the search process without an AI agent.
 * Maps raw SerpApi results directly to the application schema.
 */
export async function searchProductNova(query: string): Promise<OrchestratorOutput> {
  try {
    const rawResults = await fetchLiveShoppingData(query);
    
    if (!rawResults || rawResults.length === 0) {
      throw new Error('No real-time market data found for this product.');
    }

    // Process raw results into the expected format
    const matchedGroups = rawResults.slice(0, 40).map((item: any, index: number) => {
      // Clean price string (e.g., "₹4,599" -> 4599)
      const priceStr = String(item.price || "0").replace(/[^0-9.]/g, "");
      const price = parseFloat(priceStr) || 0;
      
      // Basic heuristic for delivery and trust
      const platform = item.source || "Marketplace";
      const isTopSite = ["Amazon", "Flipkart", "Myntra", "Croma", "Ajio"].some(site => 
        platform.toLowerCase().includes(site.toLowerCase())
      );

      const product = {
        platform: platform,
        title: item.title,
        description: item.description || `Available on ${platform}. Professional grade ${item.title} with competitive pricing.`,
        price: price,
        productUrl: item.link,
        imageUrl: item.thumbnail,
        category: item.category || "General",
        rating: item.rating ? parseFloat(item.rating) : 4.0,
        reviewsCount: item.reviews ? parseInt(String(item.reviews).replace(/[^0-9]/g, "")) : 0,
        deliveryDays: isTopSite ? 3 : 5,
        trustScore: isTopSite ? 96 : 78,
      };

      return {
        groupId: `group-${index}`,
        products: [product],
      };
    });

    return { matchedGroups };
  } catch (error: any) {
    console.error('Orchestrator Error:', error);
    throw new Error(error.message || 'The PriceNova engine encountered an unexpected error.');
  }
}
