'use server';
/**
 * @fileOverview This file implements the AI product matching flow.
 * It takes a list of products from various e-commerce platforms and uses AI
 * to identify and group identical items, even with varying titles or descriptions.
 *
 * - matchProducts - A function that handles the product matching process.
 * - ProductMatcherInput - The input type for the matchProducts function.
 * - ProductMatcherOutput - The return type for the matchProducts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductSchema = z.object({
  platform: z
    .string()
    .describe('The e-commerce platform the product is from (e.g., "Amazon", "Flipkart").'),
  title: z.string().describe('The title of the product.'),
  description: z.string().optional().describe('An optional description of the product.'),
  price: z.coerce.number().describe('The price of the product.'),
  productUrl: z.string().url().describe('The URL to the product page.'),
  imageUrl: z.string().url().optional().describe('An optional URL to the product image.'),
  specifications: z
    .string()
    .optional()
    .describe('Detailed specifications of the product, if available, in a string format.'),
  rating: z.number().optional().describe('Average customer rating (out of 5).'),
  reviewsCount: z.number().optional().describe('Total number of reviews.'),
  stockStatus: z.string().optional().describe('Current availability status.'),
  deliveryEstimate: z.string().optional().describe('Estimated delivery time.'),
});

export type Product = z.infer<typeof ProductSchema>;

const ProductMatcherInputSchema = z.object({
  products:
    z.array(ProductSchema).describe('An array of products from different e-commerce platforms to be matched.'),
});
export type ProductMatcherInput = z.infer<typeof ProductMatcherInputSchema>;

const MatchedProductGroupSchema = z.object({
  groupId: z.string().describe('A unique identifier for this group of identical products.'),
  products:
    z.array(ProductSchema).describe('A list of product objects identified as belonging to the same item.'),
});

const ProductMatcherOutputSchema = z.object({
  matchedGroups:
    z.array(MatchedProductGroupSchema)
      .describe('An array of groups, where each group contains products identified as identical.'),
});
export type ProductMatcherOutput = z.infer<typeof ProductMatcherOutputSchema>;

const productMatcherPrompt = ai.definePrompt({
  name: 'productMatcherPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: ProductMatcherInputSchema },
  output: { schema: ProductMatcherOutputSchema },
  config: {
    temperature: 0.1,
  },
  prompt: `You are an intelligent AI product matcher. Your primary goal is to analyze a given list of products and accurately group identical items.

Input Products:
{{#each products}}
- Platform: {{platform}}
  Title: {{title}}
  Price: {{price}}
  Description: {{description}}
---
{{/each}}`,
});

const aiProductMatcherFlow = ai.defineFlow(
  {
    name: 'aiProductMatcherFlow',
    inputSchema: ProductMatcherInputSchema,
    outputSchema: ProductMatcherOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await productMatcherPrompt(input);
      return output || { matchedGroups: [] };
    } catch (error) {
      console.error('Error in aiProductMatcherFlow:', error);
      return {
        matchedGroups: input.products.map((p, i) => ({
          groupId: `group-${i}`,
          products: [p],
        })),
      };
    }
  },
);

export async function matchProducts(input: ProductMatcherInput): Promise<ProductMatcherOutput> {
  return aiProductMatcherFlow(input);
}