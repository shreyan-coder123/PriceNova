
"use client";

import { Product } from "@/ai/flows/ai-product-matcher-flow";
import { ExternalLink, Star, Truck, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProductResultCardProps {
  product: Product;
  isBestValue?: boolean;
}

export function ProductResultCard({ product, isBestValue }: ProductResultCardProps) {
  const discount = Math.floor(Math.random() * 20) + 5;
  const rating = (4 + Math.random()).toFixed(1);
  const reviews = Math.floor(Math.random() * 5000) + 100;

  return (
    <Card className={`relative overflow-hidden group border-white/5 transition-all hover:border-primary/50 ${isBestValue ? 'ring-2 ring-primary glow-primary' : ''}`}>
      {isBestValue && (
        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10">
          AI Best Choice
        </div>
      )}
      
      <CardContent className="p-4 flex flex-col sm:flex-row gap-6">
        <div className="relative w-full sm:w-48 h-48 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={product.imageUrl || `https://picsum.photos/seed/${product.platform}/400/400`}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-accent text-accent bg-accent/10">
                {product.platform}
              </Badge>
              {Math.random() > 0.5 && (
                <Badge variant="secondary" className="text-[10px] font-bold">
                  FREE DELIVERY
                </Badge>
              )}
            </div>
            
            <h3 className="font-headline font-bold text-lg text-white line-clamp-2">
              {product.title}
            </h3>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star className="w-3 h-3 fill-current" />
                {rating}
              </div>
              <span>{reviews.toLocaleString()} reviews</span>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
                <Truck className="w-3 h-3" />
                Delivers in 2-4 days
              </div>
              <Button asChild className="glow-primary group-hover:glow-accent transition-all">
                <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  View on {product.platform}
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
