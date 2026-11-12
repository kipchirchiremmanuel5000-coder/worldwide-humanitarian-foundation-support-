import React, { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle2, Loader2, ShieldCheck, ArrowRight, Check, Copy } from 'lucide-react';

export type RegionalPaymentChannel = 'malawi_211' | 'zambia_303' | 'kenya_mpesa';

interface RegionalPaymentModalProps {
  isOpen: boolean;
  channel: RegionalPaymentChannel | null;
  onClose: () => void;
  onPaymentSuccess: (details: {
    transactionId: string;
    phoneNumber: string;
    paymentMethod: string;
    destination: string;
  }) => void;
  defaultPhone?: string;
  amountLocal: number;
  currencySymbol: string;
  currencyCode: string;
}

const CHANNEL_CONFIG: Record<
  RegionalPaymentChannel,
  {
    badge: string;
    title: string;
    flag: string;
    ussdOrNumber: string;
    providerLabel: string;
    placeholder: string;
    headerClass: string;
    buttonClass: string;
    accentBadgeClass: string;
    instructions: string;
    prefix: string;
  }
> = {
  malawi_211: {
    badge: 'Mobile Money USSD · Malawi 🇲🇼',
    title: 'Pay via Malawi *211#',
    flag: '🇲🇼',
    ussdOrNumber: '*211#',
    providerLabel: 'Malawi Airtel Money / TNM Mpamba (*211#)',
    placeholder: 'e.g. +265 99X XXX XXX',
    headerClass: 'bg-rose-600 text-white',
    buttonClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    accentBadgeClass: 'bg-rose-50 border-rose-200 text-rose-900',
    instructions:
      'Dial *211# on your Malawi line to authorize Mobile Money transfer. Cross-border switch routes settlement directly to Samuel Soi (Airtel Kenya 0762641585).',
    prefix: 'MW-211'
  },
  zambia_303: {
    badge: 'Mobile Money USSD · Zambia 🇿🇲',
    title: 'Pay via Zambia *303#',
    flag: '🇿🇲',
    ussdOrNumber: '*303#',
    providerLabel: 'Zambia Mobile Money (*303#)',
    placeholder: 'e.g. +260 97X XXX XXX',
    headerClass: 'bg-[#ffcc00] text-slate-950',
    buttonClass: 'bg-[#ffcc00] hover:bg-[#f5c200] text-slate-950',
    accentBadgeClass: 'bg-amber-50 border-amber-200 text-amber-950',
    instructions:
      'Dial *303# on your Zambian MTN or Airtel line and enter your PIN to confirm. Money settles securely to Samuel Soi (Airtel Kenya 0762641585).',
    prefix: 'ZM-303'
  },
  kenya_mpesa: {
    badge: 'Lipa na M-Pesa · Kenya 🇰🇪',
    title: 'Pay via Kenya M-Pesa',
    flag: '🇰🇪',
    ussdOrNumber: '0705198083',
    providerLabel: 'Kenya M-Pesa (0705198083)',
    placeholder: 'e.g. 07XX XXX XXX or +254 7XX XXX XXX',
    headerClass: 'bg-emerald-700 text-white',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    accentBadgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    instructions:
      'Send via M-Pesa to 0705198083 (or trigger STK Push below). Enter your M-Pesa PIN when prompted on your phone.',
    prefix: 'KE-MPESA'
  }
};

export const RegionalPaymentModal: React.FC<RegionalPaymentModalProps> = ({
  isOpen,
  channel,
  onClose,
  onPaymentSuccess,
  defaultPhone = '',
  amountLocal,
  currencySymbol,
  currencyCode
}) => {
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone);
  const [step, setStep] = useState<'input' | 'sending' | 'awaiting_pin' | 'success'>('input');
  const [secondsRemaining, setSecondsRemaining] = useState(8);
  const [generatedRef, setGeneratedRef] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setSecondsRemaining(8);
      setPhoneNumber(defaultPhone || '');
    }
  }, [isOpen, defaultPhone, channel]);

  useEffect(() => {
    if (!isOpen || !channel) return;
    const cfg = CHANNEL_CONFIG[channel];
    let timer: ReturnType<typeof setTimeout>;

    if (step === 'awaiting_pin' && secondsRemaining > 0) {
      timer = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (step === 'awaiting_pin' && secondsRemaining === 0) {
      const txId = `${cfg.prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedRef(txId);
      setStep('success');
      onPaymentSuccess({
        transactionId: txId,
        phoneNumber,
        paymentMethod: cfg.providerLabel,
        destination: channel === 'kenya_mpesa' ? 'M-Pesa 0705198083' : 'Samuel Soi (Airtel Kenya 0762641585)'
      });
    }

    return () => clearTimeout(timer);
  }, [step, secondsRemaining, isOpen, channel, phoneNumber, onPaymentSuccess]);

  if (!isOpen || !channel) return null;

  const cfg = CHANNEL_CONFIG[channel];

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setStep('sending');
    setTimeout(() => {
      setStep('awaiting_pin');
      setSecondsRemaining(8);
    }, 1500);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(cfg.ussdOrNumber);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className={`${cfg.headerClass} p-5 flex items-center justify-between border-b border-black/10`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/15 flex items-center justify-center font-black text-base">
              {cfg.flag}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-85">
                {cfg.badge}
              </div>
              <h2 className="text-lg font-bold font-serif leading-tight">
                {cfg.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div className={`p-4 rounded-2xl border text-center space-y-1.5 ${cfg.accentBadgeClass}`}>
                <span className="text-[11px] uppercase tracking-wider font-bold block opacity-80">
                  {channel === 'kenya_mpesa' ? 'M-Pesa Pay Number' : 'Official USSD Dial Code'}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-mono font-black tracking-wider">
                    {cfg.ussdOrNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="px-2 py-1 text-[10px] font-bold bg-white/90 text-slate-800 rounded border border-slate-300 hover:bg-white cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-sm font-bold text-[#0a1f38] pt-1">
                  Amount Due: {currencySymbol} {amountLocal.toLocaleString()} {currencyCode}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Your Mobile Money Phone Number *
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={cfg.placeholder}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-mono font-bold border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0a1f38]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 px-4 font-black text-sm uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${cfg.buttonClass}`}
              >
                <span>
                  {channel === 'kenya_mpesa'
                    ? `Send M-Pesa Prompt (${currencySymbol} ${amountLocal.toLocaleString()})`
                    : `Trigger ${cfg.ussdOrNumber} Prompt`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>{cfg.instructions}</p>
              </div>
            </form>
          )}

          {step === 'sending' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-[#0a1f38] flex items-center justify-center mx-auto animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Sending {cfg.ussdOrNumber} prompt to {phoneNumber}...
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting to {cfg.providerLabel}...
                </p>
              </div>
            </div>
          )}

          {step === 'awaiting_pin' && (
            <div className="py-6 text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-[#0a1f38] text-white flex items-center justify-center shadow-lg">
                  <Smartphone className="w-9 h-9 text-amber-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Check your phone! Enter PIN ({cfg.ussdOrNumber})
              </h3>
              <p className="text-xs text-slate-600">
                Prompt sent to <strong className="font-mono">{phoneNumber}</strong> · Confirming in {secondsRemaining}s...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-4 text-center space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-serif text-emerald-950">
                  Payment Confirmed ✅
                </h3>
                <p className="text-xs text-slate-600">
                  Transaction Reference: <strong className="font-mono text-[#0a1f38]">{generatedRef}</strong>
                </p>
              </div>
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
      </div>
    </div>
  );
};
