"use client";

import { useEffect, useState } from "react";
import { searchProductNova, OrchestratorOutput } from "@/ai/flows/live-scraper-flow";
import { ProductResultCard } from "./ProductResultCard";
import { RefreshCcw, AlertCircle, ShoppingBag, Crown, Lock } from "lucide-react";
import { incrementSearchCount, isUserPro, getSearchCount } from "@/lib/search-store";
import { Button } from "@/components/ui/button";
import { PricingModal } from "./PricingModal";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<OrchestratorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  async function performSearch() {
    setLoading(true);
    setError(null);
    setResults(null);
    setIsLimitReached(false);
    
    // Check if limit is already reached before trying
    if (!isUserPro() && getSearchCount() >= 10) {
      setIsLimitReached(true);
      setLoading(false);
      return;
    }

    try {
      // Attempt to increment
      const limitReached = incrementSearchCount();
      if (limitReached) {
        setIsLimitReached(true);
        setLoading(false);
        return;
      }

      const data = await searchProductNova(query);
      setResults(data);
    } catch (err: any) {
      console.error('Search Component Error:', err);
      setError(err.message || "The PriceNova engine encountered an error while fetching live data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <RefreshCcw className="text-primary w-12 h-12 animate-spin mb-4" />
        <p className="font-headline font-bold text-xl animate-pulse">Scanning Global Marketplaces...</p>
        <p className="text-sm text-muted-foreground mt-2">Fetching real-time prices for "{query}"</p>
      </div>
    );
  }

  if (isLimitReached) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-lg mx-auto space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-3xl opacity-20 animate-pulse" />
          <div className="relative w-24 h-24 bg-card rounded-3xl border border-primary/20 flex items-center justify-center">
            <Lock className="text-primary w-10 h-10" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-headline font-bold">Search Limit Reached</h2>
          <p className="text-muted-foreground leading-relaxed">
            You've used your 10 free searches. Upgrade to Pro for unlimited real-time market scans and deep comparisons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Button onClick={() => setIsPricingOpen(true)} className="h-14 rounded-xl text-lg font-bold glow-primary">
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Pro
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'} className="h-14 rounded-xl">
            Go Back Home
          </Button>
        </div>

        <PricingModal 
          isOpen={isPricingOpen} 
          onClose={() => setIsPricingOpen(false)} 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-4 space-y-6 max-w-lg mx-auto">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="text-destructive w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-headline font-bold">Search Interrupted</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <Button variant="outline" className="w-full" onClick={performSearch}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry Market Scan
        </Button>
      </div>
    );
  }

  const groups = results?.matchedGroups || [];

  if (groups.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
        <p className="text-muted-foreground">No matches found for your search. Try a more general term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {groups.map((group, idx) => (
        <ProductResultCard 
          key={group.groupId} 
          group={group} 
          isBestValue={idx === 0}
        />
      ))}
    </div>
  );
}
