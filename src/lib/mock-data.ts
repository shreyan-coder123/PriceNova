
import { Product } from "@/ai/flows/ai-product-matcher-flow";

export const MOCK_PLATFORMS = ["Amazon", "Flipkart", "Myntra", "Ajio", "Meesho", "Nykaa", "Croma"];

export const generateMockProducts = (query: string): Product[] => {
  const products: Product[] = [];
  
  MOCK_PLATFORMS.forEach((platform, idx) => {
    // Generate 1-2 products per platform to simulate varied inventory
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      const basePrice = 50000 + Math.random() * 20000;
      const variation = (Math.random() - 0.5) * 5000;
      
      products.push({
        platform,
        title: `${query} ${i > 0 ? 'Plus' : ''} ${platform === 'Flipkart' ? '(Certified)' : ''}`.trim(),
        description: `Premium ${query} from ${platform} with official warranty.`,
        price: Math.round(basePrice + variation),
        productUrl: `https://www.${platform.toLowerCase()}.com/s?q=${encodeURIComponent(query)}`,
        imageUrl: `https://picsum.photos/seed/${platform}-${i}/400/400`,
        specifications: `Storage: 128GB, Color: Space Grey, Platform specific: ${platform}`
      });
    }
  });

  return products;
};
