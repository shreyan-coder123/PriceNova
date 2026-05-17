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
  recommendationSummary: z.string().describe('A summary explaining the best overall deal, considering price, delivery, ratings, and discounts.'),
  bestOfferPlatform: z.string().describe('The platform name where the best offer is found.'),
  bestOfferProductTitle: z.string().describe('The title of the product corresponding to the best offer.'),
  reasoning: z.string().describe('A brief explanation of why this offer was selected as the best.'),
});
export type AISavingsAdvisorOutput = z.infer<typeof AISavingsAdvisorOutputSchema>;

const prompt = ai.definePrompt({
  name: 'aiSavingsAdvisorPrompt',
  input: {schema: AISavingsAdvisorInputSchema},
  output: {schema: AISavingsAdvisorOutputSchema},
  prompt: `You are an intelligent shopping advisor for PriceNova. Your goal is to analyze a list of product offers from different e-commerce platforms and recommend the best overall deal to the user. The best deal is not just about the lowest price; it also considers factors like delivery speed, seller ratings, and available discounts. If a product is out of stock or has limited stock, factor that into your recommendation, potentially penalizing it unless it's an exceptional deal worth waiting for.

Here are the product offers:

{{#each productOffers}}
Platform: {{{this.platform}}}
Product Title: {{{this.productTitle}}}
Price: {{{this.price}}}
{{#if this.discount}}Discount: {{{this.discount}}}{{/if}}
{{#if this.rating}}Rating: {{{this.rating}}} ({{{this.numberOfReviews}}} reviews){{/if}}
Delivery Estimate: {{{this.deliveryEstimate}}}
{{#if this.sellerName}}Seller: {{{this.sellerName}}}{{/if}}
Stock Status: {{{this.stockStatus}}}
Product URL: {{{this.productUrl}}}
---
{{/each}}

Based on these offers, provide a comprehensive recommendation summary, identify the platform and product title of the best offer, and explain your reasoning. Prioritize overall value, combining price, reliability, and speed.`,
});

const aiSavingsAdvisorFlow = ai.defineFlow(
  {
    name: 'aiSavingsAdvisorFlow',
    inputSchema: AISavingsAdvisorInputSchema,
    outputSchema: AISavingsAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function aiSavingsAdvisor(input: AISavingsAdvisorInput): Promise<AISavingsAdvisorOutput> {
  return aiSavingsAdvisorFlow(input);
}
