
"use client";

import { useEffect, useState, useMemo } from "react";
import { generateMockProducts } from "@/lib/mock-data";
import { matchProducts, Product, ProductMatcherOutput } from "@/ai/flows/ai-product-matcher-flow";
import { aiSavingsAdvisor, AISavingsAdvisorOutput } from "@/ai/flows/ai-savings-advisor-flow";
import { ProductResultCard } from "./ProductResultCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingDown, Info, Lock } from "lucide-react";
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

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      setError(null);
      
      const pro = isUserPro();
      const count = getSearchCount();
      if (!pro && count >= 10) {
        setLimitReached(true);
        setLoading(false);
        return;
      }

      try {
        // Increment search count
        incrementSearchCount();

        // 1. Fetch real-time data (Simulated federated search)
        const rawProducts = generateMockProducts(query);
        
        // 2. AI Identity Matching
        const matched = await matchProducts({ products: rawProducts });
        setMatchedResults(matched);

        // 3. AI Savings Advice (using the top group's offers)
        if (matched.matchedGroups.length > 0) {
          const topGroup = matched.matchedGroups[0];
          const advisorInput = {
            productOffers: topGroup.products.map(p => ({
              platform: p.platform,
              productTitle: p.title,
              price: p.price,
              deliveryEstimate: "2-4 days",
              stockStatus: "In Stock",
              productUrl: p.productUrl
            }))
          };
          const advice = await aiSavingsAdvisor(advisorInput);
          setSavingsAdvice(advice);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch live data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

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
          Free accounts are limited to 10 searches per month. Upgrade to Pro for unlimited real-time tracking, 
          historical price charts, and advanced AI insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="glow-primary">Upgrade to Pro</Button>
          <Button size="lg" variant="outline">Learn More</Button>
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
        <p className="mt-6 font-headline font-medium text-lg animate-pulse-glow">
          Searching Amazon, Flipkart, Myntra, Ajio...
        </p>
        <p className="text-sm text-muted-foreground mt-2">Bypassing bot protection & normalizing data with AI</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-xl text-center">
        <p className="text-destructive font-medium">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry Search</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {matchedResults?.matchedGroups.map((group, groupIdx) => (
          <div key={group.groupId} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Group {groupIdx + 1}: {group.products[0].title.split(' ').slice(0, 3).join(' ')}
              </h2>
              <span className="text-xs bg-white/5 px-2 py-1 rounded">
                {group.products.length} Offers Found
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
      </div>

      <div className="space-y-6">
        {savingsAdvice && (
          <Card className="border-primary/20 glass glow-primary sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <Sparkles className="text-primary w-5 h-5" />
                PriceNova Advisor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/10">
                <p className="text-sm leading-relaxed text-foreground/90">
                  {savingsAdvice.recommendationSummary}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="text-accent w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-accent uppercase tracking-wider">Top Recommendation</p>
                    <p className="font-bold text-white">{savingsAdvice.bestOfferPlatform}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Info className="text-muted-foreground w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Reasoning</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {savingsAdvice.reasoning}
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full glow-primary">
                Activate Price Tracker
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
