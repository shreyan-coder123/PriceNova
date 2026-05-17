
"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Crown, Loader2, ShieldCheck, CheckCircle2, QrCode } from "lucide-react";
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
  const [txnId, setTxnId] = useState("");
  const { toast } = useToast();

  const qrImage = PlaceHolderImages.find(img => img.id === 'qr-code');

  const handleUpgrade = () => {
    if (txnId.length < 6) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a valid Transaction ID.",
      });
      return;
    }

    setStep("verifying");
    
    setTimeout(() => {
      setProStatus(true);
      if (onSuccess) onSuccess();
      toast({
        title: "Account Activated!",
        description: "Payment verified. Your Pro membership is now active!",
      });
      window.location.reload();
    }, 3500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#16181d] border-white/10 text-white p-0 overflow-hidden rounded-3xl">
        <DialogHeader className="p-8 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent border-b border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Crown className="text-white w-7 h-7" />
          </div>
          <DialogTitle className="text-3xl font-headline font-bold">
            {step === "plans" ? "Upgrade to Pro" : step === "payment" ? "Scan to Pay" : "Verifying Payment"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {step === "plans" 
              ? "Unlock unlimited real-time market scans and deep comparisons."
              : step === "payment"
              ? "Scan the QR code below and pay ₹500 to activate your account."
              : "Our automated system is verifying your transaction ID..."
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
                      src={qrImage?.imageUrl || ""} 
                      alt="Payment QR Code" 
                      fill 
                      className="object-contain"
                      data-ai-hint={qrImage?.imageHint}
                      unoptimized
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-black">
                     <QrCode className="w-4 h-4" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Scan with any UPI App</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      Transaction ID / Reference Number
                    </label>
                    <Input 
                      value={txnId}
                      onChange={(e) => setTxnId(e.target.value)}
                      placeholder="Enter the 12-digit Ref ID"
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary"
                    />
                    <p className="text-[10px] text-muted-foreground pl-1 italic">
                      Activation happens instantly once you submit the ID.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleUpgrade} className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Complete Upgrade
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
                <p className="font-bold text-lg">Verifying Payment</p>
                <p className="text-sm text-muted-foreground px-4">
                  Confirming Transaction ID: {txnId}
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
