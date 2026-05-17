'use server';
/**
 * @fileOverview This file implements the AI product matching flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductSchema = z.object({
  platform: z.string(),
  title: z.string(),
  description: z.string().optional(),
  price: z.coerce.number(),
  productUrl: z.string().url(),
  imageUrl: z.string().url().optional(),
  specifications: z.string().optional(),
  rating: z.number().optional(),
  reviewsCount: z.number().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

const ProductMatcherInputSchema = z.object({
  products: z.array(ProductSchema),
});
export type ProductMatcherInput = z.infer<typeof ProductMatcherInputSchema>;

const MatchedProductGroupSchema = z.object({
  groupId: z.string(),
  products: z.array(ProductSchema),
});

const ProductMatcherOutputSchema = z.object({
  matchedGroups: z.array(MatchedProductGroupSchema),
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
  prompt: `Group identical products based on brand, model, and specifications.

Input Products:
{{#each products}}
- Platform: {{platform}}
  Title: {{title}}
  Price: {{price}}
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
