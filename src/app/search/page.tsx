
import { Suspense } from "react";
import { SearchHeader } from "@/components/SearchHeader";
import { SearchResults } from "@/components/SearchResults";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <SearchHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-headline font-bold mb-4">What are you looking for?</h1>
          <p className="text-muted-foreground">Enter a product name to see live comparisons.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <SearchHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-headline font-bold flex items-center gap-3">
            Showing results for <span className="text-primary">"{query}"</span>
          </h1>
          <p className="text-sm text-muted-foreground">Fetched real-time from 7 major platforms.</p>
        </div>

        <Suspense fallback={<LoadingState />}>
          <SearchResults query={query} />
        </Suspense>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-xl animate-pulse">
        <div className="h-6 w-1/3 bg-white/5 rounded mb-4" />
        <div className="h-20 w-full bg-white/5 rounded" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 w-full bg-white/5 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
