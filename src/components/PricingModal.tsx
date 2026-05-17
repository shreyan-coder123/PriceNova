"use client";

import { useState, useRef } from "react";
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
import { Crown, Smartphone, Loader2, ShieldCheck, Upload, X, CheckCircle2 } from "lucide-react";
import { setProStatus } from "@/lib/search-store";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PricingModal({ isOpen, onClose, onSuccess }: PricingModalProps) {
  const [step, setStep] = useState<"plans" | "payment" | "verifying">("plans");
  const [txnId, setTxnId] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
        setIsUploading(false);
        toast({
          title: "Screenshot uploaded",
          description: "Proof of payment has been attached.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpgrade = () => {
    if (txnId.length < 6) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a valid UPI transaction ID.",
      });
      return;
    }

    if (!screenshot) {
      toast({
        variant: "destructive",
        title: "Screenshot Required",
        description: "Please upload a screenshot of your payment for verification.",
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
            {step === "plans" ? "Upgrade to Pro" : step === "payment" ? "Complete Payment" : "Verifying Payment"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {step === "plans" 
              ? "Unlock unlimited real-time market scans and deep comparisons."
              : step === "payment"
              ? "Pay ₹500 to the UPI number below and upload the screenshot."
              : "Our automated system is verifying your payment and screenshot..."
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
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-muted-foreground">UPI Number</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-headline font-bold text-white tracking-widest">9849575920</span>
                    <Badge className="bg-green-500/10 text-green-400 border-none">Online</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      1. Transaction ID
                    </label>
                    <Input 
                      value={txnId}
                      onChange={(e) => setTxnId(e.target.value)}
                      placeholder="Enter the UPI Txn ID"
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      2. Payment Screenshot
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${screenshot ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-primary/30 bg-white/5'}`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      
                      {screenshot ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                          <Image src={screenshot} alt="Payment Proof" fill className="object-cover" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); setScreenshot(null); }}
                            className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {isUploading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Upload className="w-5 h-5 text-primary" />}
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold">Click to Upload</p>
                            <p className="text-[10px] text-muted-foreground mt-1">JPEG, PNG up to 5MB</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleUpgrade} className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Submit for Verification
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
                <p className="font-bold text-lg">Verifying Screenshot & Txn ID</p>
                <p className="text-sm text-muted-foreground px-4">
                  Our system is analyzing your screenshot for ID {txnId}.
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
