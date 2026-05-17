"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, LayoutDashboard, Settings, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { isUserPro, getRemainingSearches } from "@/lib/search-store";
import { PricingModal } from "./PricingModal";

export function SearchHeader() {
  const [query, setQuery] = useState("");
  const [pro, setPro] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setPro(isUserPro());
    setRemaining(getRemainingSearches());
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#16181d]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary transition-transform group-hover:scale-105">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-white hidden sm:block">
            Price<span className="text-primary">Nova</span>
          </span>
        </Link>

        <div className="flex-1 flex items-center gap-8">
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink icon={<Search className="w-4 h-4" />} label="Search" active />
            <button 
              onClick={() => setIsPricingOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white transition-colors"
            >
              <Crown className="w-4 h-4" />
              Pricing
            </button>
            <NavLink icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
          </nav>

          <form onSubmit={handleSearch} className="flex-1 max-w-md relative group">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="bg-[#252833] border-white/5 pl-10 h-10 focus:ring-primary focus:border-primary transition-all text-sm rounded-full"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
          </form>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {pro ? (
            <div className="flex items-center gap-1.5 text-accent text-[10px] font-bold uppercase tracking-wider bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
              <Zap className="w-3 h-3 fill-current" />
              PRO • UNLIMITED
            </div>
          ) : (
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-muted-foreground hidden md:block">
                {remaining} FREE LEFT
              </span>
              <button 
                onClick={() => setIsPricingOpen(true)}
                className="bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border border-primary/20"
              >
                Upgrade
              </button>
            </div>
          )}
        </div>
      </div>
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </header>
  );
}

function NavLink({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href="#" 
      className={`flex items-center gap-2 text-xs font-bold transition-colors ${active ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
    >
      {icon}
      {label}
    </Link>
  );
}
