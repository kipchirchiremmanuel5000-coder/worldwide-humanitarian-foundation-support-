import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Lock, 
  CreditCard, 
  Building, 
  Smartphone,
  Globe,
  Sparkles
} from 'lucide-react';
import { DonationRecord } from '../types';

export const DonationPage: React.FC = () => {
  const { donations, recordDonation, showToast, stats } = useApp();

  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'KES' | 'CAD'>('USD');
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [cause, setCause] = useState<string>('Where Most Needed');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<DonationRecord | null>(null);

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    KES: 'KSh ',
    CAD: '$'
  };

  const impactTiers = [
    {
      amount: 25,
      title: 'Family Nutrition Pack',
      desc: 'Provides 2 weeks of emergency staple grains, pulses, and fortified cooking oil for a family in an acute food insecurity zone.'
    },
    {
      amount: 60,
      title: 'School Supplies & Uniforms',
      desc: 'Supplies 3 secondary students with complete textbook packages, stationery sets, and school uniforms for an entire year.'
    },
    {
      amount: 150,
      title: 'Emergency Mobile Clinic Kit',
      desc: 'Stocks a mobile clinic with prenatal diagnostics, malaria medications, and antibiotics treating up to 50 rural patients.'
    },
    {
      amount: 500,
      title: 'Semester College Tuition Grant',
      desc: 'Sponsors full tuition, examination fees, and digital learning data bundles for a vulnerable engineering or medical scholar.'
    }
  ];

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAmount || currentAmount <= 0) {
      showToast('Please select or enter a valid donation amount', 'error');
      return;
    }

    if (!isAnonymous && !donorName.trim()) {
      showToast('Please enter your donor name or select anonymous', 'error');
      return;
    }

    if (!donorEmail.trim()) {
      showToast('Please enter an email address to receive your tax receipt', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const receipt = await recordDonation({
        donorName: isAnonymous ? 'Anonymous Philanthropist' : donorName,
        donorEmail,
        amount: currentAmount,
        currency,
        frequency,
        cause,
        isAnonymous,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card (Visa/Mastercard)' : paymentMethod === 'wire' ? 'Direct Bank Wire (SWIFT/SEPA)' : 'Mobile Money (M-Pesa)'
      });

      setGeneratedReceipt(receipt);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Editorial Header */}
      <section className="bg-[#0a1f38] text-white pt-12 pb-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Philanthropic Partnerships</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Support Frontline Humanitarian Action
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            94.2% of all gifts directly fund academic scholarships, emergency famine food dispatches, and clean water boreholes worldwide.
          </p>
        </div>
      </section>

      {/* Main Donation Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form: Donation Configuration */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            
            {/* Frequency Toggle & Currency */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              
              {/* One-time vs Monthly */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFrequency('one-time')}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    frequency === 'one-time'
                      ? 'bg-white text-[#0a1f38] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  One-Time Gift
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    frequency === 'monthly'
                      ? 'bg-white text-[#059669] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly Sustainer
                </button>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="p-1.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-800 focus:outline-hidden"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>

            </div>

            {/* Impact Amount Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Select Contribution Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {impactTiers.map((tier) => {
                  const isSelected = !customAmount && selectedAmount === tier.amount;
                  return (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(tier.amount);
                        setCustomAmount('');
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0a1f38] bg-slate-50 ring-2 ring-[#0a1f38]/20 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg sm:text-xl font-extrabold text-[#0a1f38] block tabular-nums">
                        {currencySymbols[currency]}{tier.amount}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block truncate mt-0.5">
                        {tier.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount input */}
              <div className="mt-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                    {currencySymbols[currency]} Custom Amount:
                  </span>
                  <input
                    type="number"
                    min="5"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (e.target.value) setSelectedAmount(0);
                    }}
                    placeholder="Enter custom gift amount..."
                    className="w-full pl-36 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                  />
                </div>
              </div>
            </div>

            {/* Selected Impact Description */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Direct Impact of {currencySymbols[currency]}{currentAmount || 100}:</strong>{' '}
                {currentAmount >= 500
                  ? 'Funds university tuition, learning tablets, and semester living allowances for a vulnerable scholar.'
                  : currentAmount >= 150
                    ? 'Supplies clinical diagnostics, sterile delivery packs, and mobile pharmaceuticals.'
                    : currentAmount >= 60
                      ? 'Provides school uniforms, curriculum textbooks, and digital connectivity for students.'
                      : 'Delivers emergency therapeutic food rations and clean drinking water to families in acute stress.'}
              </div>
            </div>

            {/* Cause Allocation */}
            <div className="space-y-1 text-xs">
              <label className="block font-bold text-slate-700">
                Direct My Gift To:
              </label>
              <select
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-[#0a1f38]"
              >
                <option value="Where Most Needed">Where Most Urgently Needed (General Relief Fund)</option>
                <option value="Education & Scholarships">Education & Academic Scholarships (GASP)</option>
                <option value="Emergency Food Relief">Emergency Food Security & Acute Nutrition</option>
                <option value="Clean Water Access">Solar Clean Water Boreholes & Sanitation</option>
                <option value="Medical Camps">Mobile Health Clinics & Infant Immunization</option>
              </select>
            </div>

            {/* Donor Identity Fields */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Donor Information</label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-[#059669] focus:ring-[#059669]"
                  />
                  <span>Give anonymously</span>
                </label>
              </div>

              {!isAnonymous && (
                <div>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Full Legal Name (or Trust/Foundation Name)"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Official Email Address (for Tax-Exempt Receipt)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                />
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2 pt-2 text-xs">
              <label className="block font-bold text-slate-700">Payment Instrument</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'border-[#0a1f38] bg-slate-50 font-bold text-[#0a1f38]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Card (Visa/MC)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wire')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'wire'
                      ? 'border-[#0a1f38] bg-slate-50 font-bold text-[#0a1f38]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Building className="w-4 h-4 text-amber-600" />
                  <span>Bank Wire / SEPA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'mobile'
                      ? 'border-[#0a1f38] bg-slate-50 font-bold text-[#0a1f38]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Mobile Money</span>
                </button>
              </div>
            </div>

            {/* Submit Donation Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleDonate}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing 
                    ? 'Generating Official Receipt...' 
                    : `Complete Gift of ${currencySymbols[currency]}${currentAmount || 100} ${currency}`}
                </span>
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL Encrypted · Tax Deductible (501(c)(3) & Swiss Art. 80 compliant)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Trust Proof & Recent Donor Honor Roll */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Efficiency Card */}
            <div className="p-6 rounded-2xl bg-[#0a1f38] text-white border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase">
                <span>Frontline Efficiency</span>
                <span>94.2% Direct</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white leading-tight">
                Every Dollar Catalogued with Precision
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By maintaining minimal Swiss governance overhead and partnering with grassroots community leaders, WHFS ensures that more than 94 cents of every contributed dollar goes directly into field aid and scholar stipends.
              </p>
              <div className="pt-2 border-t border-slate-700 flex justify-between text-xs text-slate-300">
                <span>Total Grants Disbursed:</span>
                <span className="font-extrabold text-amber-400">${(stats.totalDisbursedUSD + 18450000).toLocaleString()} USD</span>
              </div>
            </div>

            {/* Recent Contributions Honor Roll */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0a1f38]">
                  Recent Humanitarian Supporters
                </h4>
                <span className="text-[11px] text-slate-500">Live Registry</span>
              </div>

              <div className="space-y-2.5">
                {donations.slice(0, 5).map((d) => (
                  <div key={d.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 truncate max-w-[180px]">{d.donorName}</p>
                      <p className="text-[11px] text-slate-500">{d.cause} · {d.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700">
                        +${d.amount} {d.currency}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {d.receiptNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Official Tax-Deductible Donation Receipt Modal */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-6">
            
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                Transaction Verified & Approved
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0a1f38]">
                Official Donation Receipt
              </h2>
              <p className="text-xs text-slate-500">
                Worldwide Humanitarian Foundation Support (WHFS)
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 font-mono">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-bold text-slate-900">{generatedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="text-slate-800">{generatedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Benefactor:</span>
                <span className="font-bold text-slate-900">{generatedReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Designated Cause:</span>
                <span className="text-slate-800">{generatedReceipt.cause}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Instrument:</span>
                <span className="text-slate-800">{generatedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-sans">
                <span className="font-bold text-slate-900">Total Gift Amount:</span>
                <span className="font-extrabold text-[#059669]">
                  ${generatedReceipt.amount} {generatedReceipt.currency}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              This electronic receipt serves as official documentation for income tax deductibility under applicable non-profit foundation statutes.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 bg-[#0a1f38] text-white text-xs font-bold uppercase rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => setGeneratedReceipt(null)}
                className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
