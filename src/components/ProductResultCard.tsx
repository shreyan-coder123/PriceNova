
"use client";

import { Star, Truck, ShieldCheck, TrendingDown, ArrowRight, ExternalLink, Globe, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ProductResultCardProps {
  group: {
    groupId: string;
    products: any[];
  };
  isBestValue?: boolean;
}

export function ProductResultCard({ group, isBestValue }: ProductResultCardProps) {
  // Sorting to find the best offer (lowest price)
  const products = [...group.products].sort((a, b) => a.price - b.price);
  const bestOffer = products[0];
  const platformCount = products.length;

  const rating = bestOffer.rating || 4.2;
  const reviews = bestOffer.reviewsCount || 0;
  const delivery = bestOffer.deliveryDays || 3;
  const trust = bestOffer.trustScore || 90;

  return (
    <Card className={`relative overflow-hidden group border-white/5 bg-[#1a1c24] hover:bg-[#1e212b] transition-all duration-300 ${isBestValue ? 'ring-2 ring-primary/40' : ''}`}>
      {isBestValue && (
        <div className="absolute top-0 right-0 z-20">
          <Badge className="bg-primary text-white rounded-none rounded-bl-lg font-bold text-[10px] px-3 py-1">
            TOP MATCH
          </Badge>
        </div>
      )}
      
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] w-full bg-[#16181d] overflow-hidden border-b border-white/5">
          <Image
            src={bestOffer.imageUrl}
            alt={bestOffer.title}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
            unoptimized={true}
          />
          {platformCount > 1 && (
            <Badge className="absolute bottom-3 left-3 bg-accent/90 text-white border-none backdrop-blur-md px-3 py-1 text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
              <Globe className="w-3 h-3" />
              COMPARED ON {platformCount} STORES
            </Badge>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{bestOffer.platform}</span>
              {platformCount > 1 && (
                <span className="text-[10px] font-bold text-muted-foreground/40">+ {platformCount - 1} MORE STORES</span>
              )}
            </div>
            <h3 className="font-headline font-bold text-lg text-white leading-snug min-h-[3.5rem] line-clamp-2 mt-1">
              {bestOffer.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#252833] rounded-xl p-3 flex flex-col gap-1 border border-white/5 shadow-inner">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 uppercase tracking-tighter">
                <TrendingDown className="w-3 h-3" />
                Best Price
              </div>
              <p className="text-xl font-bold text-white">₹{bestOffer.price.toLocaleString()}</p>
            </div>
            
            <div className="bg-[#252833] rounded-xl p-3 flex flex-col justify-center border border-white/5 opacity-80">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-tighter">
                <Star className="w-3 h-3 fill-current" />
                Rating
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-white">{rating}</span>
                <span className="text-[10px] text-muted-foreground">({reviews})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
             <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Fastest Delivery</span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Truck className="w-3 h-3 text-accent" /> {delivery} Days
                </span>
             </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="h-10 px-5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all text-xs font-bold flex items-center gap-2 group/btn border border-primary/20">
                  {platformCount > 1 ? `Compare ${platformCount} Offers` : `View Details`}
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl bg-[#16181d] border-white/10 text-white shadow-2xl overflow-hidden rounded-2xl p-0">
                <DialogHeader className="p-6 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-white/5">
                  <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                    <Layers className="text-primary w-6 h-6" />
                    Market Comparison: {platformCount} Marketplace Offers
                  </DialogTitle>
                </DialogHeader>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-white/5">
                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-white p-4 flex-shrink-0 border border-white/10 shadow-lg">
                      <Image 
                        src={bestOffer.imageUrl} 
                        alt={bestOffer.title} 
                        fill 
                        className="object-contain p-2"
                        unoptimized={true}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold px-3 py-1">
                          {bestOffer.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold px-3 py-1 border-white/10">
                          Real-time Market Scan
                        </Badge>
                      </div>
                      <h4 className="font-headline font-bold text-2xl leading-tight">{bestOffer.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{bestOffer.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Platform Price Comparison
                      </h5>
                    </div>
                    <div className="grid gap-3">
                      {products.map((p, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl transition-all border ${idx === 0 ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20 shadow-lg' : 'bg-[#252833] border-white/5 hover:border-white/10'}`}>
                          <div className="flex items-center gap-8 flex-1">
                            <div className="min-w-[120px]">
                              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{p.platform}</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold">₹{p.price.toLocaleString()}</span>
                                {idx === 0 && <Badge className="bg-green-500/10 text-green-400 border-none text-[8px] px-2 h-4 uppercase font-black">Best Value</Badge>}
                              </div>
                            </div>
                            <div className="hidden sm:grid grid-cols-2 gap-x-8 gap-y-1">
                              <span className="flex items-center gap-2 text-xs text-accent font-medium">
                                <Truck className="w-4 h-4" /> {p.deliveryDays} Day Delivery
                              </span>
                              <span className="flex items-center gap-2 text-xs text-purple-400 font-medium">
                                <ShieldCheck className="w-4 h-4" /> {p.trustScore}% Trust Score
                              </span>
                            </div>
                          </div>
                          <a 
                            href={p.productUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-primary text-white p-4 rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
