
"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Loader2, ShieldCheck, CheckCircle2, QrCode, Smartphone } from "lucide-react";
import { setProStatus } from "@/lib/search-store";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PricingModal({ isOpen, onClose, onSuccess }: PricingModalProps) {
  const [step, setStep] = useState<"plans" | "payment" | "verifying">("plans");
  const { toast } = useToast();

  const qrImage = PlaceHolderImages.find(img => img.id === 'qr-code');

  const handlePaymentSimulation = () => {
    setStep("verifying");
    
    // Simulating automatic payment detection
    setTimeout(() => {
      setProStatus(true);
      if (onSuccess) onSuccess();
      toast({
        title: "Payment Received!",
        description: "Your Pro membership has been activated automatically. Enjoy unlimited searches!",
      });
      window.location.reload();
    }, 4000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#16181d] border-white/10 text-white p-0 overflow-hidden rounded-3xl">
        <DialogHeader className="p-8 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent border-b border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Crown className="text-white w-7 h-7" />
          </div>
          <DialogTitle className="text-3xl font-headline font-bold">
            {step === "plans" ? "Upgrade to Pro" : step === "payment" ? "Scan to Pay" : "Detecting Payment"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {step === "plans" 
              ? "Unlock unlimited real-time market scans and deep comparisons."
              : step === "payment"
              ? "Scan the QR code below using any UPI app to pay ₹500."
              : "Connecting to bank servers to confirm your transaction..."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          {step === "plans" ? (
            <>
              <div className="space-y-4">
                <FeatureItem text="Unlimited Real-time Searches" />
                <FeatureItem text="7+ Platform Comparisons" />
                <FeatureItem text="Priority Market Intelligence" />
                <FeatureItem text="Ad-Free Comparison Dashboard" />
              </div>

              <div className="bg-[#252833] rounded-2xl p-6 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Lifetime Access</p>
                  <h4 className="text-4xl font-headline font-bold mt-1">₹500</h4>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">Instant Activation</Badge>
              </div>

              <Button onClick={() => setStep("payment")} className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Get Lifetime Pro
              </Button>
            </>
          ) : step === "payment" ? (
            <>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 shadow-inner">
                  <div className="relative w-full aspect-square max-w-[240px]">
                    <Image 
                      src={qrImage?.imageUrl || "https://placehold.co/400x400/white/black?text=SCAN+TO+PAY+₹500"} 
                      alt="Payment QR Code" 
                      fill 
                      className="object-contain"
                      data-ai-hint="qr code payment"
                      unoptimized
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-black">
                     <QrCode className="w-4 h-4" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Scan with GPay, PhonePe, or Paytm</span>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Once you've scanned and completed the payment in your app, click the button below. Our system will automatically verify and upgrade your account.
                  </p>
                </div>
              </div>

              <Button 
                onClick={handlePaymentSimulation} 
                className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                I Have Paid
              </Button>
              <button 
                onClick={() => setStep("plans")}
                className="w-full text-xs text-muted-foreground hover:text-white transition-colors py-2"
              >
                Go Back
              </button>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-accent" />
              </div>
              <div className="space-y-2">
                <p className="font-bold text-lg">Waiting for Confirmation</p>
                <p className="text-sm text-muted-foreground px-4 animate-pulse">
                  Detecting UPI payment flow...
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-primary" />
      <span className="text-sm font-medium text-white/80">{text}</span>
    </div>
  );
}
