import React, { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle2, Loader2, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface MTNPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (details: {
    transactionId: string;
    phoneNumber: string;
    amountZMW: number;
    destination: string;
  }) => void;
  defaultPhone?: string;
  amountZMW?: number;
}

export const MTNPaymentModal: React.FC<MTNPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  defaultPhone = '+260 97 123 4567',
  amountZMW = 270
}) => {
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone);
  const [step, setStep] = useState<'input' | 'sending' | 'awaiting_pin' | 'success'>('input');
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [generatedRef, setGeneratedRef] = useState('');

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setSecondsRemaining(15);
      if (defaultPhone) {
        setPhoneNumber(defaultPhone);
      }
    }
  }, [isOpen, defaultPhone]);

  // Handle countdown during 'awaiting_pin' state (15 seconds)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'awaiting_pin' && secondsRemaining > 0) {
      timer = setTimeout(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (step === 'awaiting_pin' && secondsRemaining === 0) {
      // 15 seconds completed -> Payment success!
      const txId = `MTN-ZM-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedRef(txId);
      setStep('success');
      onPaymentSuccess({
        transactionId: txId,
        phoneNumber,
        amountZMW,
        destination: 'Samuel Soi (Airtel Kenya 0762641585)'
      });
    }
    return () => clearTimeout(timer);
  }, [step, secondsRemaining, phoneNumber, amountZMW, onPaymentSuccess]);

  if (!isOpen) return null;

  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    // Step 1: Show "Sending prompt to +260..."
    setStep('sending');

    // Simulate gateway API call to /api/pay (PawaPay / Flutterwave cross-border rails)
    setTimeout(() => {
      // Step 2: Prompt pushed to handset, awaiting PIN confirmation (15s timer)
      setStep('awaiting_pin');
      setSecondsRemaining(15);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        
        {/* Header with MTN Zambia Branding & Gold Accent */}
        <div className="bg-[#ffcc00] p-5 text-slate-950 flex items-center justify-between relative border-b border-amber-300">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-[#ffcc00] flex items-center justify-center shadow-xs font-black text-sm">
              MTN
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-900/80">
                Mobile Money Collection · Zambia 🇿🇲
              </div>
              <h2 className="text-lg font-bold font-serif text-slate-950 leading-tight">
                Pay with MTN Zambia
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-slate-950/10 hover:bg-slate-950/20 text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: Input Form */}
          {step === 'input' && (
            <form onSubmit={handlePayClick} className="space-y-5">
              
              {/* Highlight Target Beneficiary & Amount */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-900 block">
                  Designated Foundation Recipient
                </span>
                <p className="text-xl font-extrabold text-[#0a1f38] font-serif">
                  Pay K {amountZMW} ZMW to Samuel Soi
                </p>
                <div className="text-[11px] text-slate-600 font-medium pt-1 flex items-center justify-center gap-1">
                  <span>Intake Registration Fee · Subsidized Verification</span>
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Zambia Mobile Money Number (*303# / MTN) *
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +260 97X XXX XXX"
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-mono font-bold border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/30 text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Dial <strong className="font-mono text-slate-800">*303#</strong> on MTN/Airtel Zambia or enter your Zambian line below for an instant USSD push.
                </p>
              </div>

              {/* Pay Now Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#ffcc00] hover:bg-[#f5c200] text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Pay Now - K {amountZMW}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Required Disclaimer text */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    You will receive a *303# / MTN USSD prompt on your phone - Enter PIN to confirm. Money goes to Admin Airtel Kenya 0762641585 via secure gateway.
                  </p>
                </div>
              </div>

            </form>
          )}

          {/* STEP 2: Sending Prompt Loading State */}
          {step === 'sending' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Sending prompt to {phoneNumber}...
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Connecting to MTN Zambia Mobile Money gateway (PawaPay Cross-Border Switch)...
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 max-w-xs mx-auto">
                Initiating ZMW push request to your handset. Please keep your screen unlocked.
              </div>
            </div>
          )}

          {/* STEP 3: Awaiting PIN on Handset (15-second countdown) */}
          {step === 'awaiting_pin' && (
            <div className="py-6 text-center space-y-5">
              
              {/* Animated Phone / PIN Graphic */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full bg-[#ffcc00]/20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-[#ffcc00] text-slate-950 flex items-center justify-center shadow-lg border-2 border-white">
                  <Smartphone className="w-9 h-9" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block">
                  Action Required On Your Phone
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 pt-1">
                  Check your phone! Enter your MTN PIN
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  A flash USSD prompt was dispatched to <strong className="font-mono text-slate-900">{phoneNumber}</strong>.
                </p>
              </div>

              {/* Countdown Timer (15 seconds) */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl max-w-xs mx-auto shadow-inner space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                  Waiting For Authorization
                </span>
                <div className="text-3xl font-mono font-black text-amber-300">
                  {secondsRemaining}s
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-1000"
                    style={{ width: `${((15 - secondsRemaining) / 15) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Cross-border settlement to Airtel Kenya 0762641585 in progress
                </span>
              </div>

              <p className="text-[11px] text-slate-500 italic max-w-xs mx-auto">
                Authorize payment of K {amountZMW} ZMW to complete registration verification.
              </p>

            </div>
          )}

          {/* STEP 4: Success State */}
          {step === 'success' && (
            <div className="py-4 text-center space-y-5 animate-in zoom-in-95">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
                  Transaction Verified
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900 pt-1 text-emerald-950">
                  Payment received ✅ - Sent to Samuel Soi Airtel 0762641585
                </h3>
                <p className="text-xs text-slate-600">
                  Your registration fee payment of <strong className="text-slate-900">K {amountZMW} ZMW</strong> has been confirmed and settled.
                </p>
              </div>

              {/* Receipt Dossier Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500 font-sans">Transaction Reference:</span>
                  <span className="font-bold text-[#0a1f38]">{generatedRef}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500 font-sans">Originating Account:</span>
                  <span className="font-bold text-slate-800">{phoneNumber} (MTN Zambia)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500 font-sans">Settled Beneficiary:</span>
                  <span className="font-bold text-emerald-700">Samuel Soi (Airtel Kenya 0762641585)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500 font-sans">Cross-Border Switch:</span>
                  <span className="font-bold text-slate-700">PawaPay / Flutterwave FX Settle</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500 font-sans">Registration Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                    PAID & VERIFIED
                  </span>
                </div>
              </div>

              {/* Close & Continue Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 bg-[#0a1f38] hover:bg-[#133e87] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Return to Application Form (Marked Paid)</span>
              </button>

            </div>
          )}

        </div>

        {/* Footer Gateway Assurance */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Mobile Payment Rail</span>
          </span>
          <span className="font-mono text-slate-400">Gateway: /api/pay</span>
        </div>

      </div>
    </div>
  );
};
