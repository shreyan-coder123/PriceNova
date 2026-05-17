'use server';
/**
 * @fileOverview This flow is the main PriceNova Orchestrator.
 * It uses Gemini to provide realistic market data, group identical products,
 * and generate shopping advice in a single efficient server-side call.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductSchema = z.object({
  platform: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  productUrl: z.string(),
  imageUrl: z.string().optional(),
  specifications: z.string().optional(),
});

const MatchedGroupSchema = z.object({
  groupId: z.string(),
  products: z.array(ProductSchema),
});

const OrchestratorOutputSchema = z.object({
  matchedGroups: z.array(MatchedGroupSchema).describe('Products grouped by identity (e.g. same model/variant).'),
  savingsAdvice: z.object({
    recommendationSummary: z.string(),
    bestOfferPlatform: z.string(),
    bestOfferProductTitle: z.string(),
    reasoning: z.string(),
  }).optional(),
});

export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;

const orchestratorPrompt = ai.definePrompt({
  name: 'orchestratorPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: z.object({ query: z.string() }) },
  output: { schema: OrchestratorOutputSchema },
  config: {
    temperature: 0.4,
  },
  prompt: `You are the PriceNova AI Search Orchestrator. Your task is to provide realistic market data for the product: "{{query}}".

INSTRUCTIONS:
1. SIMULATE SEARCH: Generate 8-12 realistic product listings from major Indian platforms (Amazon, Flipkart, Myntra, Ajio, Croma, Nykaa, Meesho). 
   - Ensure titles, prices, and specs are realistic for the current market.
   - Prices MUST be raw numbers (no commas, no ₹).

2. MATCH & GROUP: Analyze the simulated listings and group identical items together. Identical items have the same model, storage, or variant.
   - Products with different variants (e.g. 128GB vs 256GB) MUST be in separate groups.

3. SHOPPING ADVICE: Analyze the first (most relevant) group of products and identify the best overall deal based on price, platform reliability, and typical delivery speed.

Generate the output in the specified JSON format.`,
});

const priceNovaOrchestratorFlow = ai.defineFlow(
  {
    name: 'priceNovaOrchestratorFlow',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: OrchestratorOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await orchestratorPrompt(input);
      if (!output) throw new Error('AI failed to generate results.');
      return output;
    } catch (error: any) {
      console.error('Orchestrator Error:', error);
      // Fallback: Return empty but valid structure
      return {
        matchedGroups: [],
      };
    }
  }
);

export async function searchProductNova(query: string): Promise<OrchestratorOutput> {
  return priceNovaOrchestratorFlow({ query });
}
