# **App Name**: PriceNova

## Core Features:

- Live Federated Search: Trigger real-time requests across Amazon, Flipkart, and more, displaying live inventory and delivery windows immediately.
- AI Identity Matcher tool: Utilizes LLM reasoning to determine if disparate product titles from different platforms refer to the exact same model and variant.
- Real-time Comparison Engine: Displays side-by-side breakdowns of price, seller ratings, and coupon eligibility across all detected sources.
- Automated Scraper Middleware: Backend orchestration layer using browser automation to pull live data from platforms without official APIs.
- Intelligent Savings Tool: Generates a reasoning-based summary of the best value choice, factoring in shipping speed versus price discounts.
- Search Performance Layer: Utilizes Redis and indexing to cache frequent queries and provide sub-second search responses.
- Tiered Usage Management: A database-backed system that tracks search limits for free users and unlocks pro features via user profiles.

## Style Guidelines:

- A futuristic dark theme inspired by 'Nova' intelligence. Background: Deep Midnight Navy (#151624). Primary: Electric Violet (#7C6DFF). Accent: Cosmic Azure (#4CA8F0).
- A pairing of 'Space Grotesk' (sans-serif) for high-tech headlines and 'Inter' (sans-serif) for highly legible, data-heavy body text and price tables.
- Crisp, monolinear stroke icons with glowing accents, representing speed, connectivity, and artificial intelligence.
- Information-dense grid layout optimized for comparison; using 'Bento Box' style cards to group platform-specific data.
- Fluid, high-performance transitions powered by Framer Motion, specifically for shifting price rankings and real-time fetch loaders.