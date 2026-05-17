import { config } from 'dotenv';
config();

// Flows that don't depend on the failing Gemini agent configuration
import '@/ai/flows/live-scraper-flow.ts';
