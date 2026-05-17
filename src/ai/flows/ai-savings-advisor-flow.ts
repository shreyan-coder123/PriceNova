'use server';
/**
 * @fileOverview An AI shopping advisor that recommends the best product deal.
 *
 * - aiSavingsAdvisor - A function that generates a recommendation for the best product deal.
 * - AISavingsAdvisorInput - The input type for the aiSavingsAdvisor function.
 * - AISavingsAdvisorOutput - The return type for the aiSavingsAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductOfferSchema = z.object({
  platform: z.string().describe('The name of the e-commerce platform.'),
  productTitle: z.string().describe('The title of the product.'),
  price: z.number().describe('The price of the product.'),
  discount: z.number().optional().describe('The discount percentage or absolute amount, if any.'),
  rating: z.number().optional().describe('The average customer rating for the product.'),
  numberOfReviews: z.number().optional().describe('The total number of reviews for the product.'),
  deliveryEstimate: z.string().describe('The estimated delivery time or details.'),
  sellerName: z.string().optional().describe('The name of the seller.'),
  stockStatus: z.string().describe('The current stock availability status.'),
  productUrl: z.string().url().describe('The URL to the product page.'),
});

const AISavingsAdvisorInputSchema = z.object({
  productOffers: z.array(ProductOfferSchema).min(1).describe('A list of product offers from various platforms for comparison.'),
});
export type AISavingsAdvisorInput = z.infer<typeof AISavingsAdvisorInputSchema>;

const AISavingsAdvisorOutputSchema = z.object({
  recommendationSummary: z.string().describe('A summary explaining the best overall deal.'),
  bestOfferPlatform: z.string().describe('The platform name where the best offer is found.'),
  bestOfferProductTitle: z.string().describe('The title of the product corresponding to the best offer.'),
  reasoning: z.string().describe('A brief explanation of why this offer was selected as the best.'),
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
  prompt: `You are an intelligent shopping advisor for PriceNova. Your goal is to analyze a list of product offers and recommend the best overall deal. 

Consider price, delivery speed, and ratings. 

Product Offers:
{{#each productOffers}}
Platform: {{this.platform}}
Title: {{this.productTitle}}
Price: {{this.price}}
Rating: {{this.rating}}
Delivery: {{this.deliveryEstimate}}
Stock: {{this.stockStatus}}
---
{{/each}}

Identify the best offer and provide reasoning.`,
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
        recommendationSummary: `We recommend buying from ${cheapest.platform} as it offers the lowest price of ₹${cheapest.price.toLocaleString()}.`,
        bestOfferPlatform: cheapest.platform,
        bestOfferProductTitle: cheapest.productTitle,
        reasoning: "Cheapest price found among all available platforms.",
      };
    }
  }
);

export async function aiSavingsAdvisor(input: AISavingsAdvisorInput): Promise<AISavingsAdvisorOutput> {
  return aiSavingsAdvisorFlow(input);
}
