"use client";

import { useEffect, useState } from "react";
import { searchProductNova, OrchestratorOutput } from "@/ai/flows/live-scraper-flow";
import { ProductResultCard } from "./ProductResultCard";
import { RefreshCcw, Lock, AlertCircle } from "lucide-react";
import { incrementSearchCount, getSearchCount, isUserPro, setProStatus } from "@/lib/search-store";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<OrchestratorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  async function performSearch() {
    setLoading(true);
    setError(null);
    setResults(null);
    
    const pro = isUserPro();
    const count = getSearchCount();
    if (!pro && count >= 20) {
      setLimitReached(true);
      setLoading(false);
      return;
    }

    try {
      incrementSearchCount();
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

  const handleUpgrade = () => {
    setProStatus(true);
    window.location.reload();
  };

  if (limitReached) {
    return (
      <div className="glass p-12 rounded-2xl text-center max-w-2xl mx-auto border-primary/20">
        <Lock className="text-primary w-8 h-8 mx-auto mb-6" />
        <h2 className="text-3xl font-headline font-bold mb-4">Limit Reached</h2>
        <p className="text-muted-foreground mb-8">You've reached your search limit. Upgrade to Pro for unlimited real-time market intelligence.</p>
        <Button size="lg" className="glow-primary" onClick={handleUpgrade}>Upgrade to Pro</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <RefreshCcw className="text-primary w-12 h-12 animate-spin mb-4" />
        <p className="font-headline font-bold text-xl animate-pulse">Scanning Global Marketplaces...</p>
        <p className="text-sm text-muted-foreground mt-2">Fetching real-time prices for "{query}"</p>
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
      <div className="text-center py-20">
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
