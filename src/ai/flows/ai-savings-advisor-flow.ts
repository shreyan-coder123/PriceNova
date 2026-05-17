'use server';
/**
 * @fileOverview An AI shopping advisor that recommends the best product deal.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductOfferSchema = z.object({
  platform: z.string(),
  productTitle: z.string(),
  price: z.coerce.number(),
  productUrl: z.string().url(),
});

const AISavingsAdvisorInputSchema = z.object({
  productOffers: z.array(ProductOfferSchema).min(1),
});
export type AISavingsAdvisorInput = z.infer<typeof AISavingsAdvisorInputSchema>;

const AISavingsAdvisorOutputSchema = z.object({
  recommendationSummary: z.string(),
  bestOfferPlatform: z.string(),
  bestOfferProductTitle: z.string(),
  reasoning: z.string(),
});
export type AISavingsAdvisorOutput = z.infer<typeof AISavingsAdvisorOutputSchema>;

const advisorPrompt = ai.definePrompt({
  name: 'aiSavingsAdvisorPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: AISavingsAdvisorInputSchema},
  output: {schema: AISavingsAdvisorOutputSchema},
  config: {
    temperature: 0.2,
  },
  prompt: `Identify the best deal from these offers:

{{#each productOffers}}
Platform: {{this.platform}}
Title: {{this.productTitle}}
Price: {{this.price}}
---
{{/each}}`,
});

const aiSavingsAdvisorFlow = ai.defineFlow(
  {
    name: 'aiSavingsAdvisorFlow',
    inputSchema: AISavingsAdvisorInputSchema,
    outputSchema: AISavingsAdvisorOutputSchema,
  },
  async input => {
    try {
      const {output} = await advisorPrompt(input);
      if (!output) throw new Error('AI failed to generate advice.');
      return output;
    } catch (error) {
      console.error('Error in aiSavingsAdvisorFlow:', error);
      const cheapest = [...input.productOffers].sort((a, b) => a.price - b.price)[0];
      return {
        recommendationSummary: `We recommend buying from ${cheapest.platform} for the best price.`,
        bestOfferPlatform: cheapest.platform,
        bestOfferProductTitle: cheapest.productTitle,
        reasoning: "Cheapest price found.",
      };
    }
  }
);

export async function aiSavingsAdvisor(input: AISavingsAdvisorInput): Promise<AISavingsAdvisorOutput> {
  return aiSavingsAdvisorFlow(input);
}
