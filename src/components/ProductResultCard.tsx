"use client";

import { ExternalLink, Star, Truck, ShieldCheck, Store, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProductResultCardProps {
  product: any;
  isBestValue?: boolean;
}

export function ProductResultCard({ product, isBestValue }: ProductResultCardProps) {
  const discount = Math.floor(Math.random() * 15) + 5;
  const rating = product.rating || (4 + Math.random()).toFixed(1);
  const reviews = product.reviewsCount || Math.floor(Math.random() * 3000) + 100;
  const delivery = product.deliveryEstimate || "3-5 days";
  const stock = product.stockStatus || "In Stock";
  const specs = product.specifications ? product.specifications.split(',').map((s: string) => s.trim()) : [];
  const warranty = product.warranty || "Standard Brand Warranty";
  const seller = product.sellerName || "Authorized Retailer";
  const sellerRating = product.sellerRating || 4.2;

  return (
    <Card className={`relative overflow-hidden group border-white/5 transition-all hover:border-primary/50 ${isBestValue ? 'ring-2 ring-primary glow-primary' : ''}`}>
      {isBestValue && (
        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10">
          AI Top Value
        </div>
      )}
      
      <CardContent className="p-4 flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-56 h-56 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            data-ai-hint={product.imageHint || "product"}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-accent text-accent bg-accent/10 font-bold uppercase tracking-tight">
                  {product.platform}
                </Badge>
                <Badge variant="secondary" className={`text-[10px] font-bold ${stock.toLowerCase().includes('only') || stock.toLowerCase().includes('low') ? 'text-orange-400' : 'text-green-400'}`}>
                  {stock}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                {rating}
                <span className="text-muted-foreground text-[10px] ml-1">({reviews.toLocaleString()})</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-headline font-bold text-xl text-white line-clamp-2 leading-snug">
                {product.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground/80 mt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span>{warranty}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-accent" />
                <span className="font-medium">{seller}</span>
                <span className="text-[10px] bg-accent/10 text-accent px-1 rounded">{sellerRating}★</span>
              </div>
            </div>

            {specs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {specs.slice(0, 6).map((spec: string, i: number) => (
                  <span key={i} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-muted-foreground border border-white/5">
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white font-headline">
                ₹{product.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground line-through">
                  ₹{Math.round(product.price * (1 + discount / 100)).toLocaleString()}
                </span>
                <span className="text-green-400 font-bold">
                  {discount}% OFF
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="w-4 h-4 text-accent" />
                <span className="font-medium">Delivery: {delivery}</span>
              </div>
              <Button asChild className="glow-primary group-hover:glow-accent transition-all h-11 px-6 font-bold">
                <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  View Deal
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}