
"use client";

import { Star, Truck, ShieldCheck, TrendingDown, ArrowRight, ExternalLink, Globe } from "lucide-react";
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
  // The best offer is usually the one with the lowest price
  const products = [...group.products].sort((a, b) => a.price - b.price);
  const bestOffer = products[0];
  const platformCount = products.length;

  const rating = bestOffer.rating || 4.2;
  const reviews = bestOffer.reviewsCount || 0;
  const delivery = bestOffer.deliveryDays || 3;
  const trust = bestOffer.trustScore || 75;

  return (
    <Card className={`relative overflow-hidden group border-white/5 bg-[#1a1c24] hover:bg-[#1e212b] transition-all duration-300 ${isBestValue ? 'ring-1 ring-primary/50' : ''}`}>
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] w-full bg-[#1a1c24] overflow-hidden">
          <Image
            src={bestOffer.imageUrl}
            alt={bestOffer.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized={bestOffer.imageUrl.includes('gstatic.com')}
          />
          {platformCount > 1 && (
            <Badge className="absolute top-3 left-3 bg-accent text-white border-accent/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />
              {platformCount} PLATFORMS COMPARED
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-muted-foreground/60 flex items-center gap-1 uppercase tracking-wider">
              {bestOffer.platform} • {bestOffer.category || 'Marketplace'}
            </p>
            <h3 className="font-headline font-bold text-base text-white leading-tight min-h-[3rem] line-clamp-2">
              {bestOffer.title}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#252833] rounded-md p-2 flex flex-col gap-1 border border-white/5">
              <div className="flex items-center gap-1 text-[9px] font-bold text-green-400 uppercase tracking-tight">
                <TrendingDown className="w-2.5 h-2.5" />
                Price
              </div>
              <p className="text-sm font-bold text-white">₹{bestOffer.price.toLocaleString()}</p>
              <p className="text-[8px] text-muted-foreground">Best Offer</p>
            </div>
            
            <div className="bg-[#252833] rounded-md p-2 flex flex-col gap-1 border border-white/5">
              <div className="flex items-center gap-1 text-[9px] font-bold text-accent uppercase tracking-tight">
                <Truck className="w-2.5 h-2.5" />
                Ship
              </div>
              <p className="text-sm font-bold text-white">{delivery}d</p>
              <p className="text-[8px] text-muted-foreground">Est. Time</p>
            </div>

            <div className="bg-[#252833] rounded-md p-2 flex flex-col gap-1 border border-white/5">
              <div className="flex items-center gap-1 text-[9px] font-bold text-purple-400 uppercase tracking-tight">
                <ShieldCheck className="w-2.5 h-2.5" />
                Trust
              </div>
              <p className="text-sm font-bold text-white">{trust}%</p>
              <p className="text-[8px] text-muted-foreground">Reliability</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
              <span className="text-sm font-bold text-white">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviews.toLocaleString()})</span>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-[11px] font-bold text-accent hover:text-white transition-colors flex items-center gap-1 outline-none group/btn">
                  {platformCount > 1 ? `Compare all ${platformCount} stores` : `Check on ${bestOffer.platform}`}
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-[#16181d] border-white/10 text-white shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-headline font-bold flex items-center gap-2">
                    <ShieldCheck className="text-primary w-5 h-5" />
                    Market Intelligence: {platformCount} Stores Found
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div className="flex gap-6 items-start pb-6 border-b border-white/5">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-[#252833] flex-shrink-0 border border-white/10">
                      <Image 
                        src={bestOffer.imageUrl} 
                        alt={bestOffer.title} 
                        fill 
                        className="object-cover"
                        unoptimized={bestOffer.imageUrl.includes('gstatic.com')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold">
                        {bestOffer.category}
                      </Badge>
                      <h4 className="font-headline font-bold text-xl leading-tight">{bestOffer.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{bestOffer.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available Marketplace Offers</h5>
                      <span className="text-[10px] text-muted-foreground italic">Real-time Comparison</span>
                    </div>
                    <div className="grid gap-3">
                      {products.map((p, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-4 rounded-xl transition-all border ${idx === 0 ? 'bg-primary/5 border-primary/30' : 'bg-[#252833] border-white/5 hover:border-white/10'}`}>
                          <div className="flex items-center gap-6">
                            <div className="min-w-[100px]">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">{p.platform}</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold">₹{p.price.toLocaleString()}</span>
                                {idx === 0 && <Badge variant="outline" className="text-[8px] py-0 h-4 border-green-500/50 text-green-400">BEST PRICE</Badge>}
                              </div>
                            </div>
                            <div className="h-10 w-px bg-white/5" />
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                              <span className="flex items-center gap-1.5 text-[11px] text-accent font-medium">
                                <Truck className="w-3.5 h-3.5" /> {p.deliveryDays}d delivery
                              </span>
                              <span className="flex items-center gap-1.5 text-[11px] text-purple-400 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5" /> {p.trustScore}% Trust
                              </span>
                            </div>
                          </div>
                          <a 
                            href={p.productUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/5 hover:bg-primary hover:text-white p-3 rounded-xl transition-all border border-white/5"
                          >
                            <ExternalLink className="w-4 h-4" />
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
