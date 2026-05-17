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
import { Zap, Crown, Smartphone, CreditCard, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { setProStatus } from "@/lib/search-store";
import { useToast } from "@/hooks/use-toast";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PricingModal({ isOpen, onClose, onSuccess }: PricingModalProps) {
  const [step, setStep] = useState<"plans" | "payment" | "verifying">("plans");
  const [txnId, setTxnId] = useState("");
  const { toast } = useToast();

  const handleUpgrade = () => {
    if (txnId.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid Transaction ID",
        description: "Please enter a valid 6-12 digit UPI transaction ID.",
      });
      return;
    }

    setStep("verifying");
    
    // Simulate payment verification delay
    setTimeout(() => {
      setProStatus(true);
      if (onSuccess) onSuccess();
      toast({
        title: "Account Activated!",
        description: "Your Pro membership is now active. Enjoy unlimited searches!",
      });
      window.location.reload();
    }, 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#16181d] border-white/10 text-white p-0 overflow-hidden rounded-3xl">
        <DialogHeader className="p-8 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent border-b border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 glow-primary">
            <Crown className="text-white w-7 h-7" />
          </div>
          <DialogTitle className="text-3xl font-headline font-bold">
            {step === "plans" ? "Upgrade to Pro" : step === "payment" ? "Complete Payment" : "Verifying Payment"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {step === "plans" 
              ? "Unlock unlimited real-time market scans and deep comparisons."
              : step === "payment"
              ? "Pay using any UPI app to activate your Pro account."
              : "Our automated system is verifying your transaction..."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          {step === "plans" ? (
            <>
              <div className="space-y-4">
                <FeatureItem text="Unlimited Real-time Searches" />
                <FeatureItem text="7+ Platform Comparisons" />
                <FeatureItem text="Advanced Price Analytics" />
                <FeatureItem text="Priority Market Intelligence" />
              </div>

              <div className="bg-[#252833] rounded-2xl p-6 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Lifetime Access</p>
                  <h4 className="text-4xl font-headline font-bold mt-1">₹500</h4>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">Best Value</Badge>
              </div>

              <Button onClick={() => setStep("payment")} className="w-full h-14 rounded-xl text-lg font-bold glow-primary">
                Choose Pro Plan
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
                    <Badge className="bg-green-500/10 text-green-400 border-none">Active</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                    Enter Transaction ID (from your UPI App)
                  </label>
                  <Input 
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="e.g. 40561234..."
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <PaymentMethod icon={<Smartphone className="w-4 h-4" />} label="Google Pay" />
                  <PaymentMethod icon={<CreditCard className="w-4 h-4" />} label="PhonePe" />
                </div>
              </div>

              <Button onClick={handleUpgrade} className="w-full h-14 rounded-xl text-lg font-bold bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20">
                Submit & Activate
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
                <p className="font-bold text-lg">Validating Transaction {txnId}</p>
                <p className="text-sm text-muted-foreground px-4">
                  Checking with your UPI provider. Please do not close this window.
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

function PaymentMethod({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider">
      {icon}
      {label}
    </div>
  );
}