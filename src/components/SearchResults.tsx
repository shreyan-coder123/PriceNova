"use client";

import { useEffect, useState } from "react";
import { searchProductNova, OrchestratorOutput } from "@/ai/flows/live-scraper-flow";
import { ProductResultCard } from "./ProductResultCard";
import { RefreshCcw, Lock } from "lucide-react";
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
      if (data.matchedGroups.length === 0) {
        setError("No realistic offers found.");
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error(err);
      setError("Engine encountered an error. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    performSearch();
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
        <Button size="lg" className="glow-primary" onClick={handleUpgrade}>Upgrade to Pro</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <RefreshCcw className="text-primary w-8 h-8 animate-spin" />
        <p className="mt-4 font-bold animate-pulse">Scraping market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-destructive font-bold">{error}</p>
        <Button variant="outline" onClick={performSearch}>Retry Search</Button>
      </div>
    );
  }

  const groups = results?.matchedGroups || [];

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
