
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { isUserPro, setProStatus } from "@/lib/search-store";

export function SearchHeader() {
  const [query, setQuery] = useState("");
  const [pro, setPro] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPro(isUserPro());
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleUpgrade = () => {
    setProStatus(true);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary transition-transform group-hover:scale-110">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-white hidden sm:block">
            Price<span className="text-primary">Nova</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative group">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search live prices: iPhone 16, RTX 4080, Nike Air..."
            className="bg-secondary/50 border-white/10 pl-10 h-10 focus:ring-primary focus:border-primary transition-all group-hover:bg-secondary"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
          <button type="submit" className="hidden" />
        </form>

        <div className="flex items-center gap-3">
          {pro ? (
            <div className="flex items-center gap-1 text-accent text-xs font-bold uppercase tracking-widest bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
              <ShieldCheck className="w-3 h-3" />
              Pro
            </div>
          ) : (
            <Button 
              onClick={handleUpgrade}
              variant="outline" 
              size="sm" 
              className="hidden sm:flex border-primary/50 text-primary hover:bg-primary/10"
            >
              Upgrade
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
