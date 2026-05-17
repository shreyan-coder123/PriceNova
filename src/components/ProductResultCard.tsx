"use client";

import { Star, Truck, ShieldCheck, TrendingDown, ArrowRight, ExternalLink } from "lucide-react";
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
            data-ai-hint={bestOffer.imageHint || "product"}
          />
          {isBestValue && (
            <Badge className="absolute top-3 left-3 bg-primary/20 text-primary border-primary/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI matched
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-muted-foreground/60 flex items-center gap-1">
              {bestOffer.platform} • {bestOffer.category || 'Shopping'}
            </p>
            <h3 className="font-headline font-bold text-base text-white leading-tight min-h-[2.5rem] line-clamp-2">
              {bestOffer.title}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#252833] rounded-md p-2 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[9px] font-bold text-green-400 uppercase tracking-tight">
                <TrendingDown className="w-2.5 h-2.5" />
                Price
              </div>
              <p className="text-sm font-bold text-white">₹{bestOffer.price.toLocaleString()}</p>
              <p className="text-[8px] text-muted-foreground">Best Deal</p>
            </div>
            
            <div className="bg-[#252833] rounded-md p-2 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[9px] font-bold text-accent uppercase tracking-tight">
                <Truck className="w-2.5 h-2.5" />
                Ship
              </div>
              <p className="text-sm font-bold text-white">{delivery}d</p>
              <p className="text-[8px] text-muted-foreground">Delivery</p>
            </div>

            <div className="bg-[#252833] rounded-md p-2 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[9px] font-bold text-purple-400 uppercase tracking-tight">
                <ShieldCheck className="w-2.5 h-2.5" />
                Trust
              </div>
              <p className="text-sm font-bold text-white">{trust}%</p>
              <p className="text-[8px] text-muted-foreground">Rating</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
              <span className="text-sm font-bold text-white">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviews})</span>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-[11px] font-bold text-accent hover:text-white transition-colors flex items-center gap-1 outline-none">
                  {platformCount > 1 ? `Selling on ${platformCount} platforms` : `Buy on ${bestOffer.platform}`}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-[#16181d] border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-headline font-bold">Market Comparison</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex gap-4 items-start pb-6 border-b border-white/5">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[#252833] flex-shrink-0">
                      <Image 
                        src={bestOffer.imageUrl} 
                        alt={bestOffer.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg leading-tight">{bestOffer.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{bestOffer.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">All Available Offers</h5>
                    <div className="space-y-2">
                      {products.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-[#252833] border border-white/5 hover:border-primary/30 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[80px]">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">{p.platform}</p>
                              <p className="text-lg font-bold">₹{p.price.toLocaleString()}</p>
                            </div>
                            <div className="h-8 w-px bg-white/5" />
                            <div className="space-y-1">
                              <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1 text-accent">
                                  <Truck className="w-3 h-3" /> {p.deliveryDays}d delivery
                                </span>
                                <span className="flex items-center gap-1 text-purple-400">
                                  <ShieldCheck className="w-3 h-3" /> {p.trustScore}% Trust
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="bg-white/5 hover:bg-primary hover:text-white p-2 rounded-lg transition-all">
                            <ExternalLink className="w-4 h-4" />
                          </button>
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
