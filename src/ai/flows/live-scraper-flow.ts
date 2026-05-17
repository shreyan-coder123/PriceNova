'use server';
/**
 * @fileOverview This flow is the main PriceNova AI Orchestrator.
 * It now fetches real-time data from SerpApi (Google Shopping) and uses
 * Gemini to group identical products into matched sets for comparison.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SERPAPI_KEY = '49bc32a0f0059a489b59c21d27e56a67c34619f08f77b6de9643a601753e2676';

const ProductSchema = z.object({
  platform: z.string().describe('The platform name (e.g. Amazon, Flipkart, Myntra)'),
  title: z.string().describe('The full specific title of the product'),
  description: z.string().describe('A realistic product description.'),
  price: z.coerce.number().describe('The price in INR'),
  productUrl: z.string().describe('The direct link to the product'),
  imageUrl: z.string().describe('The thumbnail URL provided by the search results'),
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
  savingsAdvice: z.object({
    recommendationSummary: z.string(),
    bestOfferPlatform: z.string(),
    bestOfferProductTitle: z.string(),
    reasoning: z.string(),
  }).optional(),
});

export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;

/**
 * Fetches real shopping results from SerpApi
 */
async function fetchLiveShoppingData(query: string) {
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&hl=en&gl=in&google_domain=google.co.in`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.shopping_results || [];
  } catch (error) {
    console.error('SerpApi Fetch Error:', error);
    return [];
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
    temperature: 0.2,
  },
  prompt: `You are the PriceNova AI Market Intelligence Orchestrator. 
I have fetched real-time shopping results for: "{{query}}" from Google Shopping.

YOUR TASK:
1. Analyze the raw shopping results provided below.
2. GROUP identical products (same Brand, same Model, same specs) into "matchedGroups".
3. Each group should contain the same product being sold on different platforms (sources).
4. If a product is unique or doesn't have a match, put it in its own group.
5. Standardize the data into the requested output schema.
6. Ensure prices are treated as raw numbers in INR.
7. For deliveryDays and trustScore, estimate realistic values if not provided (e.g., Amazon/Flipkart usually 2-4 days, 90+ trust).

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
    const rawResults = await fetchLiveShoppingData(input.query);
    
    if (!rawResults || rawResults.length === 0) {
      throw new Error('No real-time results found for this query.');
    }

    try {
      const { output } = await orchestratorPrompt({ 
        query: input.query, 
        rawResults: rawResults.slice(0, 20) // Limit to top 20 for grouping efficiency
      });
      
      if (!output || !output.matchedGroups || output.matchedGroups.length === 0) {
        throw new Error('AI failed to process live data.');
      }
      return output;
    } catch (error: any) {
      console.error('Orchestrator Processing Error:', error);
      throw error;
    }
  }
);

export async function searchProductNova(query: string): Promise<OrchestratorOutput> {
  return priceNovaOrchestratorFlow({ query });
}
