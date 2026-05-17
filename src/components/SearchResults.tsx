"use client";

import { useEffect, useState } from "react";
import { scrapeRealTimeProducts } from "@/ai/flows/live-scraper-flow";
import { matchProducts, ProductMatcherOutput } from "@/ai/flows/ai-product-matcher-flow";
import { aiSavingsAdvisor, AISavingsAdvisorOutput } from "@/ai/flows/ai-savings-advisor-flow";
import { ProductResultCard } from "./ProductResultCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingDown, Info, Lock, RefreshCcw } from "lucide-react";
import { incrementSearchCount, getSearchCount, isUserPro } from "@/lib/search-store";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [loading, setLoading] = useState(true);
  const [matchedResults, setMatchedResults] = useState<ProductMatcherOutput | null>(null);
  const [savingsAdvice, setSavingsAdvice] = useState<AISavingsAdvisorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");

  async function performSearch() {
    setLoading(true);
    setError(null);
    
    const pro = isUserPro();
    const count = getSearchCount();
    if (!pro && count >= 20) { // Increased limit for testing
      setLimitReached(true);
      setLoading(false);
      return;
    }

    try {
      incrementSearchCount();

      // 1. Live AI "Scraping"
      setCurrentStep("Fetching live details from Amazon, Flipkart, Croma...");
      const scraped = await scrapeRealTimeProducts({ query });
      
      // 2. AI Identity Matching
      setCurrentStep("Normalizing variants and matching products...");
      const matched = await matchProducts({ products: scraped.products });
      setMatchedResults(matched);

      // 3. AI Savings Advice
      if (matched.matchedGroups.length > 0) {
        setCurrentStep("Calculating best value with PriceNova Advisor...");
        const topGroup = matched.matchedGroups[0];
        const advice = await aiSavingsAdvisor({
          productOffers: topGroup.products.map(p => ({
            platform: p.platform,
            productTitle: p.title,
            price: p.price,
            deliveryEstimate: "2-4 days",
            stockStatus: "In Stock",
            productUrl: p.productUrl
          }))
        });
        setSavingsAdvice(advice);
      }
    } catch (err) {
      console.error(err);
      setError("The PriceNova engine encountered an error while fetching live data. Our scrapers might be blocked or the AI is busy.");
    } finally {
      setLoading(false);
      setCurrentStep("");
    }
  }

  useEffect(() => {
    performSearch();
  }, [query]);

  if (limitReached) {
    return (
      <div className="glass p-12 rounded-2xl text-center max-w-2xl mx-auto border-primary/20 shadow-2xl">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-primary w-8 h-8" />
        </div>
        <h2 className="text-3xl font-headline font-bold mb-4">Search Limit Reached</h2>
        <p className="text-muted-foreground mb-8">
          Free accounts are limited to 20 searches per month. Upgrade to Pro for unlimited real-time tracking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="glow-primary">Upgrade to Pro</Button>
          <Button size="lg" variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-6 h-6 animate-pulse" />
        </div>
        <p className="mt-6 font-headline font-medium text-lg animate-pulse-glow text-center">
          {currentStep || "Connecting to marketplaces..."}
        </p>
        <p className="text-sm text-muted-foreground mt-2">Using GenAI to bypass bot protection & fetch realistic data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 p-8 rounded-2xl text-center max-w-xl mx-auto">
        <p className="text-destructive font-medium mb-4">{error}</p>
        <Button variant="outline" className="flex items-center gap-2 mx-auto" onClick={performSearch}>
          <RefreshCcw className="w-4 h-4" />
          Retry Live Search
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {matchedResults?.matchedGroups.map((group, groupIdx) => (
          <div key={group.groupId} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Group {groupIdx + 1}: {group.products[0].title.split(' ').slice(0, 4).join(' ')}
              </h2>
              <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded-full uppercase tracking-tighter">
                {group.products.length} Platform Matches
              </span>
            </div>
            <div className="grid gap-4">
              {group.products
                .sort((a, b) => a.price - b.price)
                .map((product, idx) => (
                <ProductResultCard 
                  key={`${product.platform}-${idx}`} 
                  product={product} 
                  isBestValue={groupIdx === 0 && savingsAdvice?.bestOfferPlatform === product.platform && savingsAdvice?.bestOfferProductTitle === product.title}
                />
              ))}
            </div>
          </div>
        ))}
        
        {matchedResults?.matchedGroups.length === 0 && (
          <div className="text-center py-20 glass rounded-2xl">
            <p className="text-muted-foreground">No realistic offers found for this query. Try a more specific product name.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {savingsAdvice && (
          <Card className="border-primary/20 glass glow-primary sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <Sparkles className="text-primary w-5 h-5" />
                Nova Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/10">
                <p className="text-sm leading-relaxed text-foreground/90 italic">
                  "{savingsAdvice.recommendationSummary}"
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="text-accent w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Top Recommendation</p>
                    <p className="font-bold text-white">{savingsAdvice.bestOfferPlatform}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Info className="text-muted-foreground w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Reasoning</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {savingsAdvice.reasoning}
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full glow-primary font-bold">
                Monitor for Price Drops
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
