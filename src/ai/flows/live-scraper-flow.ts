'use server';
/**
 * @fileOverview This flow is the main PriceNova AI Orchestrator.
 * It fetches real-time data from SerpApi (Google Shopping) and uses
 * Gemini to group identical products into matched sets for comparison.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SERPAPI_KEY = '49bc32a0f0059a489b59c21d27e56a67c34619f08f77b6de9643a601753e2676';

const ProductSchema = z.object({
  platform: z.string().describe('The platform name (e.g. Amazon, Flipkart, Myntra)'),
  title: z.string().describe('The full specific title starting with Brand then Model (e.g., "Campus TRINO Women Sneakers")'),
  description: z.string().describe('A realistic product description.'),
  price: z.coerce.number().describe('The price in INR (number only)'),
  productUrl: z.string().describe('The direct link to the product'),
  imageUrl: z.string().describe('The thumbnail URL'),
  category: z.string().describe('Product category'),
  rating: z.number().optional().describe('Average customer rating'),
  reviewsCount: z.number().optional().describe('Total number of reviews'),
  deliveryDays: z.number().describe('Estimated delivery in days'),
  trustScore: z.number().describe('Reliability score (0-100)'),
});

const MatchedGroupSchema = z.object({
  groupId: z.string(),
  products: z.array(ProductSchema),
});

const OrchestratorOutputSchema = z.object({
  matchedGroups: z.array(MatchedGroupSchema).describe('Products grouped by identity.'),
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
      throw new Error(`SerpApi request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.shopping_results || [];
  } catch (error) {
    console.error('SerpApi Fetch Error:', error);
    throw error;
  }
}

const orchestratorPrompt = ai.definePrompt({
  name: 'orchestratorPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { 
    schema: z.object({ 
      query: z.string(),
      rawResults: z.array(z.any())
    }) 
  },
  output: { schema: OrchestratorOutputSchema },
  config: {
    temperature: 0.1,
  },
  prompt: `You are the PriceNova AI Market Intelligence Orchestrator. 
I have fetched real-time shopping results for: "{{query}}" from Google Shopping.

YOUR TASK:
1. Analyze the raw shopping results provided below.
2. GROUP identical products (EXACT same brand, model, and specs) into "matchedGroups".
3. For each group, the "products" array should contain the offers for that specific item across different sources.
4. IMPORTANT: Extract the price as a raw number. If the input is "₹4,599", the output must be 4599.
5. MANDATORY BRAND NAMING: Every product title MUST start with the BRAND NAME followed by the MODEL.
   - CORRECT: "Campus TRINO Women Sneakers"
   - CORRECT: "Apple iPhone 16 Pro 256GB"
   - INCORRECT: "Women's Sneakers (Trino)"
   - INCORRECT: "Latest iPhone 16"
   If the source title is messy, you MUST reconstruct it using this "[Brand] [Model] [Version/Specs]" format.
6. Use the highest quality thumbnail available.
7. For deliveryDays and trustScore, use realistic estimates (Amazon/Flipkart: 2-4 days, 95% trust; smaller sites: 5-7 days, 75% trust).

RAW RESULTS FROM SEARCH:
{{#each rawResults}}
- Source: {{source}}
  Title: {{title}}
  Price: {{price}}
  Link: {{link}}
  Thumbnail: {{thumbnail}}
  Rating: {{rating}}
  Reviews: {{reviews}}
---
{{/each}}`,
});

const priceNovaOrchestratorFlow = ai.defineFlow(
  {
    name: 'priceNovaOrchestratorFlow',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: OrchestratorOutputSchema,
  },
  async (input) => {
    try {
      const rawResults = await fetchLiveShoppingData(input.query);
      
      if (!rawResults || rawResults.length === 0) {
        throw new Error('No real-time market data found for this product.');
      }

      const { output } = await orchestratorPrompt({ 
        query: input.query, 
        rawResults: rawResults.slice(0, 30) 
      });
      
      if (!output || !output.matchedGroups || output.matchedGroups.length === 0) {
        throw new Error('Our AI engine could not group the market data. Please try a different search.');
      }

      return output;
    } catch (error: any) {
      console.error('Orchestrator Processing Error:', error);
      throw new Error(error.message || 'The PriceNova engine encountered an unexpected error.');
    }
  }
);

export async function searchProductNova(query: string): Promise<OrchestratorOutput> {
  return priceNovaOrchestratorFlow({ query });
}