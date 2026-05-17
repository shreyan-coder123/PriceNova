"use client";

import { Star, Truck, ShieldCheck, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ProductResultCardProps {
  product: any;
  isBestValue?: boolean;
  platformCount?: number;
}

export function ProductResultCard({ product, isBestValue, platformCount = 1 }: ProductResultCardProps) {
  const rating = product.rating || 4.2;
  const reviews = product.reviewsCount || 0;
  const delivery = product.deliveryDays || 3;
  const trust = product.trustScore || 75;

  return (
    <Card className={`relative overflow-hidden group border-white/5 bg-[#1a1c24] hover:bg-[#1e212b] transition-all duration-300 ${isBestValue ? 'ring-1 ring-primary/50' : ''}`}>
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] w-full bg-[#1a1c24] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            data-ai-hint={product.imageHint || "product"}
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
              {product.platform} • {product.category || 'Shopping'}
            </p>
            <h3 className="font-headline font-bold text-base text-white leading-tight min-h-[2.5rem] line-clamp-2">
              {product.title}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#252833] rounded-md p-2 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[9px] font-bold text-green-400 uppercase tracking-tight">
                <TrendingDown className="w-2.5 h-2.5" />
                Price
              </div>
              <p className="text-sm font-bold text-white">₹{product.price.toLocaleString()}</p>
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
            <button className="text-[11px] font-bold text-accent hover:text-white transition-colors flex items-center gap-1">
              {platformCount > 1 ? `Selling on ${platformCount} platforms` : `Buy on ${product.platform}`}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
