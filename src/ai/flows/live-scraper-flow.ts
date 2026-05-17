'use server';
/**
 * @fileOverview This flow is the main PriceNova Orchestrator.
 * It uses Gemini to provide realistic market data, group identical products,
 * and generate shopping advice in a single efficient server-side call.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductSchema = z.object({
  platform: z.string().describe('The platform name (e.g. Amazon, Flipkart)'),
  title: z.string().describe('The full title of the product'),
  description: z.string().describe('A brief realistic description'),
  price: z.number().describe('The raw price as a number (no symbols or commas)'),
  productUrl: z.string().describe('A realistic URL to the product'),
  imageUrl: z.string().optional().describe('A realistic image URL'),
  specifications: z.string().optional().describe('Key specs of the product'),
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
    temperature: 0.5,
  },
  prompt: `You are the PriceNova AI Search Orchestrator. Your task is to provide realistic, current market data for the product: "{{query}}".

INSTRUCTIONS:
1. SIMULATE SEARCH: Generate 6-10 realistic product listings as they would appear TODAY on major Indian platforms (Amazon, Flipkart, Myntra, Ajio, Croma, Nykaa, Meesho). 
   - Even for simple items like a "pen" or "notebook", provide realistic brand names (e.g. Parker, Reynolds, Classmate).
   - Prices MUST be realistic raw numbers (e.g. 50 for a pen, 70000 for a laptop). DO NOT use commas or currency symbols.

2. MATCH & GROUP: Analyze the simulated listings and group identical items together. 
   - Identical items MUST have the same model, size, or specific variant.
   - Products with different variants (e.g. Blue vs Black ink, 128GB vs 256GB) MUST be in separate groups.

3. SHOPPING ADVICE: Analyze the results and identify the best overall deal based on price and platform reliability.

Generate the output in the specified JSON format. If you cannot find a specific match, simulate the most common market results for that category.`,
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
      if (!output || output.matchedGroups.length === 0) {
        // Fallback for very obscure queries
        return {
          matchedGroups: [
            {
              groupId: 'fallback-group',
              products: [
                {
                  platform: 'Marketplace',
                  title: `${input.query} - Standard Edition`,
                  description: `High quality ${input.query} with standard features.`,
                  price: 999,
                  productUrl: 'https://example.com',
                  specifications: 'Standard weight and size'
                }
              ]
            }
          ],
          savingsAdvice: {
            recommendationSummary: "Standard marketplace offer found.",
            bestOfferPlatform: "Marketplace",
            bestOfferProductTitle: `${input.query} - Standard Edition`,
            reasoning: "Best available price for this specific query."
          }
        };
      }
      return output;
    } catch (error: any) {
      console.error('Orchestrator Error:', error);
      throw error; // Rethrow to let the UI handler catch it
    }
  }
);

export async function searchProductNova(query: string): Promise<OrchestratorOutput> {
  return priceNovaOrchestratorFlow({ query });
}
