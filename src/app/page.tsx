"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, BarChart3, Globe, Shield, Star, ShoppingBag, ArrowRight, BrainCircuit, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isUserPro, getRemainingSearches } from "@/lib/search-store";
import { PricingModal } from "@/components/PricingModal";

export default function Home() {
  const [query, setQuery] = useState("");
  const [pro, setPro] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPro(isUserPro());
    setRemaining(getRemainingSearches());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-screen pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent blur-[120px] rounded-full" />
      </div>

      <nav className="container mx-auto px-4 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter text-white">
            Price<span className="text-primary">Nova</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <button onClick={() => setIsPricingOpen(true)} className="hover:text-primary transition-colors flex items-center gap-2">
            <Crown className="w-4 h-4" /> Pricing
          </button>
          <a href="#" className="hover:text-primary transition-colors">Marketplace Intel</a>
        </div>
        {!pro ? (
          <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-muted-foreground hidden sm:block">{remaining} FREE SEARCHES LEFT</span>
             <Button onClick={() => setIsPricingOpen(true)} className="glow-primary">Get Pro</Button>
          </div>
        ) : (
          <Badge className="bg-accent/20 text-accent border-accent/20 px-4 py-2">Pro Active</Badge>
        )}
      </nav>

      <main className="container mx-auto px-4 pt-20 pb-40 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md animate-bounce">
            <BrainCircuit className="w-3 h-3 mr-2 inline" />
            Next-Gen AI Market Intelligence Engine
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white leading-tight">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Shopping Intelligence</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly compare realistic market prices and product variants. 
            Powered by GenAI for accurate product matching and valuation.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-focus-within:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-card rounded-2xl border border-white/10 p-2 shadow-2xl">
              <div className="flex-1 flex items-center pl-4">
                <Search className="text-muted-foreground w-6 h-6" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you buying today? (e.g. iPhone 16)"
                  className="bg-transparent border-none text-lg h-14 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl font-bold glow-primary">
                Search Nova
              </Button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
          <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6" />}
            title="AI Market Intel"
            description="Our GenAI models simulate deep marketplace data to provide realistic price comparisons instantly."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-6 h-6" />}
            title="Intelligent Matching"
            description="LLM reasoning detects identical items across varied titles, variants and platform descriptions."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6" />}
            title="Category Aware"
            description="Our engine understands product categories to ensure accurate valuation from pens to luxury watches."
          />
        </div>
      </main>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />

      <footer className="border-t border-white/5 bg-black/20 py-12 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="text-primary w-5 h-5 fill-current" />
            <span className="font-headline font-bold">PriceNova</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 PriceNova Intelligence Systems.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="glass group hover:border-primary/50 transition-all duration-500">
      <CardContent className="p-8 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:glow-primary transition-all duration-500">
          {icon}
        </div>
        <h3 className="text-xl font-headline font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
