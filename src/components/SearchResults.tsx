"use client";

import { useEffect, useState } from "react";
import { searchProductNova, OrchestratorOutput } from "@/ai/flows/live-scraper-flow";
import { ProductResultCard } from "./ProductResultCard";
import { RefreshCcw, AlertCircle, ShoppingBag } from "lucide-react";
import { incrementSearchCount } from "@/lib/search-store";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<OrchestratorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function performSearch() {
    setLoading(true);
    setError(null);
    setResults(null);
    
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
