import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  Copy, 
  Printer, 
  ShieldCheck, 
  Sparkles,
  Search,
  DollarSign,
  Coins,
  ChevronDown,
  Globe,
  Check,
  RotateCcw,
  CreditCard,
  Wallet,
  Smartphone,
  Landmark,
  Image as ImageIcon
} from 'lucide-react';
import { EDUCATION_PROGRAMMES, HUMANITARIAN_PROGRAMMES } from '../data/mockData';
import { HumanitarianApplication, ProgrammeCategory } from '../types';
import { 
  getCurrency, 
  formatFundingDisplay, 
  countryList, 
  DEFAULT_REGISTRATION_FEE_USD,
  CurrencyInfo 
} from '../data/allCurrencies';
import { MTNPaymentModal } from '../components/MTNPaymentModal';
import { RegionalPaymentModal, RegionalPaymentChannel } from '../components/RegionalPaymentModal';

export const Application: React.FC = () => {
  const { 
    currentUser, 
    preselectedProgramme, 
    setPreselectedProgramme, 
    submitApplication, 
    setSelectedTrackingId, 
    setActiveTab,
    showToast,
    payoutSettings
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<HumanitarianApplication | null>(null);
  const [isMTNModalOpen, setIsMTNModalOpen] = useState(false);
  const [regionalModalChannel, setRegionalModalChannel] = useState<RegionalPaymentChannel | null>(null);

  // Local currency & Country State - Default country Zambia as specified
  const [selectedCountry, setSelectedCountry] = useState<string>('Zambia');
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [autoDetectedCountry, setAutoDetectedCountry] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+260 97 123 4567',
    dateOfBirth: '2002-05-18',
    gender: 'Female',
    country: 'Zambia',
    region: 'Lusaka Province',
    address: 'Plot 4820, Great East Road, Lusaka',
    nationalIdNumber: 'NRC-849201/11/1',

    // Step 2: Programme
    programmeCategory: (preselectedProgramme?.category || 'education') as ProgrammeCategory,
    programmeName: preselectedProgramme?.name || EDUCATION_PROGRAMMES[0].title,
    institutionOrCommunity: 'University of Zambia (UNZA)',
    amountRequestedUSD: 100, // Default $100 USD corresponding to "K 2,700 ZMW ($100 USD) 🇿🇲" example

    // Step 3: Need Assessment
    financialNeedLevel: 'Critical/Emergency' as const,
    householdIncomeBracket: 'Under $1,500 USD annually',
    dependentsCount: 4,
    displacementStatus: 'Crisis Affected' as const,

    // Step 4: Statement & Documents
    statementOfNeed: 'I am applying for educational grant assistance to complete my tertiary coursework in agricultural engineering and renewable systems at the University of Zambia. Due to unprecedented drought affecting our community farming livelihoods, my family is unable to pay upcoming semester laboratory fees. I intend to deploy solar irrigation solutions for smallholder farmers upon graduation.',
    uploadedDocs: [
      { id: 'doc-auto-1', name: 'National_Registration_Card_Zambia.pdf', type: 'PDF', size: '1.2 MB', status: 'verified' as const, uploadedAt: '2026-10-30' },
      { id: 'doc-auto-2', name: 'Certified_Academic_Transcripts.pdf', type: 'PDF', size: '2.5 MB', status: 'verified' as const, uploadedAt: '2026-10-30' },
      { id: 'doc-auto-3', name: 'Community_Chief_Indigency_Affidavit.pdf', type: 'PDF', size: '940 KB', status: 'pending' as const, uploadedAt: '2026-10-30' }
    ],

    // Step 5: Registration Payment & Affirmation
    hasPaidRegistrationFee: false,
    paymentMethod: 'MTN Zambia',
    paymentTransactionId: '',
    receiptImageUrl: '',
    declarationAccepted: false
  });

  // Derived Currency Data
  const curr: CurrencyInfo = getCurrency(selectedCountry);
  const usdAmount = Number(formData.amountRequestedUSD) || 0;
  const localAmount = Math.round(usdAmount * curr.rate);
  const localFee = Math.round(DEFAULT_REGISTRATION_FEE_USD * curr.rate);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Auto-detect country via fetch('https://ipapi.co/json/') on page load
  useEffect(() => {
    let isCancelled = false;
    const detectCountry = async () => {
      setIsDetectingLocation(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) return;
        const data = await res.json();
        if (data && data.country_name && !isCancelled) {
          const matched = getCurrency(data.country_name);
          if (matched && matched.country) {
            setAutoDetectedCountry(matched.country);
            setSelectedCountry(matched.country);
            setFormData(prev => ({
              ...prev,
              country: matched.country,
              region: data.region || prev.region
            }));
            showToast(`Auto-detected country: ${matched.flag} ${matched.country}`, 'info');
          }
        }
      } catch {
        // Network or ad-blocker prevented IP lookup, silently keep default Zambia
      } finally {
        if (!isCancelled) setIsDetectingLocation(false);
      }
    };

    detectCountry();
    return () => { isCancelled = true; };
  }, []);

  // Keep preselected program synced if passed in context
  useEffect(() => {
    if (preselectedProgramme) {
      setFormData(prev => ({
        ...prev,
        programmeCategory: preselectedProgramme.category,
        programmeName: preselectedProgramme.name
      }));
    }
  }, [preselectedProgramme]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setFormData(prev => ({ ...prev, country: countryName }));
    setIsCountryDropdownOpen(false);
    setCountrySearchQuery('');
  };

  const availablePrograms = formData.programmeCategory === 'education' 
    ? EDUCATION_PROGRAMMES 
    : HUMANITARIAN_PROGRAMMES;

  // Filtered country list for searchable dropdown
  const filteredCountries = countryList.filter(c => 
    c.country.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.country.trim()) {
        showToast('Please complete all required identity and country fields', 'error');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.institutionOrCommunity.trim() || Number(formData.amountRequestedUSD) <= 0) {
        showToast('Please provide your institution/community and funding amount', 'error');
        return false;
      }
    }
    if (currentStep === 4) {
      if (formData.statementOfNeed.trim().length < 30) {
        showToast('Please write a statement of need (minimum 30 characters)', 'error');
        return false;
      }
    }
    if (currentStep === 5) {
      if (!formData.declarationAccepted) {
        showToast('You must affirm the declaration of truthfulness to proceed', 'error');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleAddSimulatedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newDoc = {
        id: 'doc-user-' + Date.now(),
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'PDF',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'pending' as const,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      setFormData(prev => ({
        ...prev,
        uploadedDocs: [...prev.uploadedDocs, newDoc]
      }));
      showToast(`Document "${file.name}" uploaded successfully`, 'success');
    }
  };

  const handleReceiptImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 720;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
          handleChange('receiptImageUrl', compressedDataUrl);
          showToast('Payment receipt image attached successfully!', 'success');
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      const formattedLocalDisplay = `${curr.symbol} ${localAmount.toLocaleString()} ${curr.code} ($${usdAmount.toLocaleString()} USD) ${curr.flag}`;
      const formattedFeeLocal = `${curr.symbol} ${localFee.toLocaleString()} ${curr.code}`;
      const nowDate = new Date().toISOString();

      const app = await submitApplication({
        name: formData.fullName,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        country: selectedCountry,
        region: formData.region,
        address: formData.address,
        programmeCategory: formData.programmeCategory,
        programmeName: formData.programmeName,
        institutionOrCommunity: formData.institutionOrCommunity,
        need: formData.statementOfNeed,
        financialNeedLevel: formData.financialNeedLevel,
        householdIncomeBracket: formData.householdIncomeBracket,
        dependentsCount: Number(formData.dependentsCount),
        displacementStatus: formData.displacementStatus,
        statementOfNeed: formData.statementOfNeed,
        amount: usdAmount,
        amountRequestedUSD: usdAmount,
        // Local currency mappings saved to database / state
        amountRequestedLocal: localAmount,
        localCurrencyCode: curr.code,
        localCurrencySymbol: curr.symbol,
        localCurrencyRate: curr.rate,
        localCurrencyDisplay: formattedLocalDisplay,
        countryFlag: curr.flag,
        registrationFeeUSD: DEFAULT_REGISTRATION_FEE_USD,
        registrationFeeLocal: formattedFeeLocal,
        receiptImageUrl: formData.receiptImageUrl,
        hasPaidRegistrationFee: formData.hasPaidRegistrationFee,
        paymentMethod: formData.paymentMethod,
        paymentTransactionId: formData.paymentTransactionId,
        paymentStatus: formData.hasPaidRegistrationFee ? 'Paid' : 'Unpaid',
        date: nowDate,
        documents: formData.uploadedDocs
      });

      setSubmittedApp(app);
      setPreselectedProgramme(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Header Banner */}
      <section className="bg-[#0a1f38] text-white pt-12 pb-14 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5" />
            <span>Worldwide Intake Portal · Multi-Currency Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Worldwide Application Form
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            All WHFS grant applications undergo impartial review. Grants and scholarships are 100% non-repayable philanthropic awards calculated in your local currency.
          </p>

          {/* Quick Active Country Badge */}
          <div className="pt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
            <span>You selected:</span>
            <span className="font-bold text-white flex items-center gap-1">
              <span>{curr.flag}</span>
              <span>{selectedCountry}</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400 font-mono">1 USD = {curr.symbol} {curr.rate} {curr.code}</span>
          </div>
        </div>
      </section>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Progress Stepper */}
        <div className="mb-10 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Step {step} of 5</span>
            <span className="text-[#0a1f38] font-bold">
              {step === 1 && '1. Personal & Geographic Profile'}
              {step === 2 && '2. Programme & Funding Selection'}
              {step === 3 && '3. Financial Need Assessment'}
              {step === 4 && '4. Statement of Need & Documents'}
              {step === 5 && '5. Affirmation & Review'}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#059669] rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: Personal Profile & Country Selector */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-[#0a1f38]">
                      1. Applicant Identity & Geographic Location
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Select your country to calculate funding awards and intake documentation in your national currency.
                    </p>
                  </div>
                  {autoDetectedCountry && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <Check className="w-3 h-3" />
                      Auto-detected location: {autoDetectedCountry}
                    </span>
                  )}
                </div>

                {/* Country Selection Highlight Banner */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="font-semibold text-slate-700">
                      You selected: <span className="font-bold text-[#0a1f38] text-sm">{curr.flag} {selectedCountry}</span>
                    </span>
                    <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Official Currency: <strong>{curr.code} ({curr.symbol})</strong> · 1 USD = {curr.symbol} {curr.rate} {curr.code}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="First, Middle, and Last Name"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your.email@example.org"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  {/* Searchable Country Dropdown */}
                  <div className="sm:col-span-2 relative" ref={dropdownRef}>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Country of Residence & Local Currency *
                    </label>
                    
                    {/* Trigger Button */}
                    <div 
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg flex items-center justify-between cursor-pointer hover:border-[#0a1f38] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{curr.flag}</span>
                        <span className="font-bold text-slate-900">{curr.country}</span>
                        <span className="text-slate-500 font-mono">({curr.code} - {curr.symbol})</span>
                        <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                          1 USD = {curr.symbol} {curr.rate} {curr.code}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown Menu */}
                    {isCountryDropdownOpen && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-72 flex flex-col">
                        {/* Search Input */}
                        <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            placeholder="Search by country name or currency code (e.g. Zambia, ZMW, Kenya, United States)..."
                            className="w-full text-xs bg-transparent border-0 focus:outline-hidden text-slate-800 placeholder-slate-400"
                            autoFocus
                          />
                          {countrySearchQuery && (
                            <button
                              type="button"
                              onClick={() => setCountrySearchQuery('')}
                              className="text-[10px] text-slate-400 hover:text-slate-700"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto divide-y divide-slate-100">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => {
                              const isSelected = c.country === selectedCountry;
                              return (
                                <button
                                  key={c.country}
                                  type="button"
                                  onClick={() => handleCountrySelect(c.country)}
                                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${
                                    isSelected ? 'bg-amber-50/60 font-bold text-[#0a1f38]' : 'text-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-lg">{c.flag}</span>
                                    <span>{c.country}</span>
                                    <span className="text-slate-400 font-mono text-[11px]">({c.code})</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-slate-500 text-[11px]">
                                      {c.symbol} {c.rate} / USD
                                    </span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <div className="p-4 text-center text-slate-400 text-xs">
                              No countries found matching "{countrySearchQuery}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+260 97 123 4567"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      State / Province / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.region}
                      onChange={(e) => handleChange('region', e.target.value)}
                      placeholder="e.g. Lusaka Province, Copperbelt, Turkana..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  {/* National ID */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      National ID / Passport Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nationalIdNumber}
                      onChange={(e) => handleChange('nationalIdNumber', e.target.value)}
                      placeholder="e.g. NRC-849201/11/1"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  {/* Physical Address */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Town / Community Physical Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Village, township, or postal address"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Programme Selection & Currency Conversion */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#0a1f38]">
                    2. Select Assistance Programme & Funding Amount
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Grant funding is displayed in both your national currency (<strong>{curr.code}</strong>) and United States Dollars (<strong>USD</strong>).
                  </p>
                </div>

                {/* Category Pill Switch */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('programmeCategory', 'education');
                      handleChange('programmeName', EDUCATION_PROGRAMMES[0].title);
                    }}
                    className={`py-2.5 rounded-lg transition-all cursor-pointer ${
                      formData.programmeCategory === 'education'
                        ? 'bg-white text-[#0a1f38] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Education Support Grants
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('programmeCategory', 'humanitarian');
                      handleChange('programmeName', HUMANITARIAN_PROGRAMMES[0].title);
                    }}
                    className={`py-2.5 rounded-lg transition-all cursor-pointer ${
                      formData.programmeCategory === 'humanitarian'
                        ? 'bg-white text-[#059669] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Humanitarian Assistance
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Specific Programme Title *
                    </label>
                    <select
                      value={formData.programmeName}
                      onChange={(e) => handleChange('programmeName', e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] bg-white font-medium"
                    >
                      {availablePrograms.map(p => (
                        <option key={p.id} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {formData.programmeCategory === 'education' 
                        ? 'Target School, College, or University *' 
                        : 'Target Affected Community or Village *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.institutionOrCommunity}
                      onChange={(e) => handleChange('institutionOrCommunity', e.target.value)}
                      placeholder={formData.programmeCategory === 'education' ? 'e.g. University of Zambia' : 'e.g. Mwembeshi Relief Committee'}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  {/* Total Funding Requested with Real-time Local Currency Conversion */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Total Grant Funding Requested (USD equivalent) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500 font-bold">$</span>
                      <input
                        type="number"
                        min="50"
                        max="25000"
                        required
                        value={formData.amountRequestedUSD}
                        onChange={(e) => handleChange('amountRequestedUSD', Number(e.target.value))}
                        className="w-full pl-8 pr-16 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] font-bold text-slate-900"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">USD</span>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
                      <span className="text-slate-400 font-medium">Quick Presets:</span>
                      {[100, 500, 1000, 2700, 5000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleChange('amountRequestedUSD', preset)}
                          className={`px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-colors ${
                            formData.amountRequestedUSD === preset
                              ? 'bg-[#0a1f38] text-white border-[#0a1f38]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          ${preset.toLocaleString()} USD
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* REQUIRED LOCAL CURRENCY HIGHLIGHT BOX */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-amber-600" />
                        <span>Calculated in Your Local Currency ({curr.country})</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Exchange Rate: 1 USD = {curr.symbol} {curr.rate} {curr.code}
                      </span>
                    </div>

                    {/* Funding representation requested in prompt */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200/80 shadow-xs space-y-1">
                      <div className="text-xs text-slate-500 font-medium">Official Funding Value:</div>
                      <div className="text-lg font-bold font-mono text-[#0a1f38] flex items-center gap-2">
                        <span>Funding: {curr.symbol} {localAmount.toLocaleString()} {curr.code} = ${usdAmount.toLocaleString()} USD</span>
                        <span className="text-xl">{curr.flag}</span>
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                        <span>Formatted:</span>
                        <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {formatFundingDisplay(usdAmount, selectedCountry)}
                        </span>
                      </div>
                    </div>

                    {/* Registration Fee notice in Local Currency */}
                    <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs text-xs space-y-4">
                      
                      {/* Highlighted Fee Header */}
                      <div className="flex items-start justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                            Subsidized Intake Verification
                          </span>
                          <span className="text-base font-bold font-mono text-[#0a1f38] block mt-0.5">
                            Pay Registration Fee: {curr.symbol} {localFee.toLocaleString()} {curr.code}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            (${DEFAULT_REGISTRATION_FEE_USD} USD equivalent · Impoverishment-subsidized credential authentication)
                          </span>
                        </div>
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                          {curr.flag} {curr.code} Intake Account
                        </span>
                      </div>

                      {/* Official Receiving Accounts Display */}
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <span className="font-bold text-[#0a1f38] block flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Official Treasury Receiving Account:</span>
                        </span>
                        
                        <div className="text-[11px] text-slate-700 space-y-1.5 leading-relaxed font-mono">
                          <p className="bg-white p-2.5 rounded-lg border border-emerald-200 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                            <span className="text-slate-800">
                              Airtel Kenya: <strong className="text-emerald-700 text-xs font-bold">{payoutSettings?.airtelKenyaNumber || '0762641585'}</strong> · <span className="font-semibold text-slate-700">{payoutSettings?.airtelKenyaAccountName || 'Samuel Soi'}</span>
                            </span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-sans font-bold px-2 py-0.5 rounded border border-emerald-300">
                              🇰🇪 Primary Treasury Channel
                            </span>
                          </p>
                          <p className="text-slate-600 text-[10.5px] font-sans">
                            • Cross-border gateway automated via PawaPay: All applicant fees (ZMW, etc.) settle directly to Admin Airtel Kenya <strong className="font-mono text-slate-800">{payoutSettings?.airtelKenyaNumber || '0762641585'}</strong>.
                          </p>
                        </div>
                      </div>

                      {/* Method Selector */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                          Select Channel You Have Used / Want to Pay With:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {['MTN Zambia', 'Malawi *211#', 'Kenya M-Pesa', 'Airtel Money'].map(method => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => handleChange('paymentMethod', method)}
                              className={`py-2 px-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all text-center ${
                                formData.paymentMethod === method
                                  ? 'bg-[#0a1f38] text-white border-[#0a1f38] shadow-xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Regional Quick Payment Popups (Malawi *211#, Zambia *303#, Kenya M-Pesa 0705198083) */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                          Instant Mobile Money Payment Popups
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setRegionalModalChannel('malawi_211')}
                            className="py-2.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <span>🇲🇼</span>
                            <span>Malawi *211#</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRegionalModalChannel('zambia_303')}
                            className="py-2.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <span>🇿🇲</span>
                            <span>Zambia *303#</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRegionalModalChannel('kenya_mpesa')}
                            className="py-2.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <span>🇰🇪</span>
                            <span>M-Pesa 0705198083</span>
                          </button>
                        </div>
                      </div>

                      {/* Interactive Pay Now Card when MTN Zambia or Zambia is selected */}
                      {(formData.paymentMethod === 'MTN Zambia' || selectedCountry === 'Zambia') && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border-2 border-[#ffcc00] space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-[#ffcc00] text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                                MTN
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-900 block">
                                  Pay with MTN Zambia (*303#)
                                </span>
                                <span className="text-[11px] text-slate-600 block">
                                  Settles to Samuel Soi (Airtel Kenya 0762641585) via secure gateway
                                </span>
                              </div>
                            </div>
                            <span className="font-mono font-extrabold text-sm text-[#0a1f38] bg-white px-2.5 py-1 rounded-lg border border-amber-300">
                              K {localFee || 270} ZMW
                            </span>
                          </div>

                          {!formData.hasPaidRegistrationFee ? (
                            <button
                              type="button"
                              onClick={() => setIsMTNModalOpen(true)}
                              className="w-full py-3 px-4 bg-[#ffcc00] hover:bg-[#f5c200] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                              <Smartphone className="w-4 h-4 text-slate-950" />
                              <span>Pay K {localFee || 270} ZMW</span>
                              <ArrowRight className="w-4 h-4 text-slate-950" />
                            </button>
                          ) : (
                            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div>
                                  <span className="text-xs font-bold text-emerald-950 block">Payment received ✅</span>
                                  <span className="text-[11px] text-emerald-800 font-mono">
                                    Ref: {formData.paymentTransactionId || 'MTN-ZM-PAWAPAY'} · Sent to Samuel Soi Airtel 0762641585
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setIsMTNModalOpen(true)}
                                className="text-[11px] text-emerald-800 font-bold underline hover:text-emerald-950 cursor-pointer"
                              >
                                View Receipt
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* "I have paid" checkbox + Transaction ID + Payment Receipt Image Upload/URL */}
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formData.hasPaidRegistrationFee}
                            onChange={(e) => handleChange('hasPaidRegistrationFee', e.target.checked)}
                            className="mt-0.5 rounded text-[#059669] focus:ring-[#059669] cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">
                              I have paid the registration fee ({curr.symbol} {localFee.toLocaleString()} {curr.code})
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              Affirming payment allows instant intake priority and expedited identity dossier queuing.
                            </span>
                          </div>
                        </label>

                        {formData.hasPaidRegistrationFee && (
                          <div className="pl-6 space-y-3">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-semibold text-slate-700">
                                Transaction ID / Mobile Money Reference *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.paymentTransactionId}
                                onChange={(e) => handleChange('paymentTransactionId', e.target.value)}
                                placeholder="e.g. MTN-ZM-849201 or MPESA-REF"
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#0a1f38] bg-amber-50/20"
                              />
                              <span className="text-[10px] text-slate-400 block">
                                Reference received via SMS / USSD confirmation.
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Payment Receipt Image URL or Upload Screenshot</span>
                              </label>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  value={formData.receiptImageUrl.startsWith('data:image') ? 'Uploaded screenshot attached' : formData.receiptImageUrl}
                                  onChange={(e) => handleChange('receiptImageUrl', e.target.value)}
                                  placeholder="Paste receipt image URL (https://...) or upload below"
                                  className="flex-1 p-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-[#0a1f38]"
                                />
                                <label className="px-3 py-2 bg-[#0a1f38] hover:bg-[#133e87] text-white text-[11px] font-semibold rounded-lg cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0">
                                  <UploadCloud className="w-3.5 h-3.5" />
                                  <span>Upload Receipt</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleReceiptImageUpload}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                              {formData.receiptImageUrl && (
                                <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img
                                      src={formData.receiptImageUrl}
                                      alt="Payment receipt preview"
                                      className="w-10 h-10 object-cover rounded border border-emerald-300 bg-white shrink-0"
                                    />
                                    <span className="text-[11px] font-semibold text-emerald-900 truncate">
                                      Receipt attached and ready for Firestore submission
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleChange('receiptImageUrl', '')}
                                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer shrink-0"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* STEP 3: Socio-Economic Need */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#0a1f38]">
                    3. Socio-Economic Vulnerability Assessment
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    WHFS prioritizes applicants facing severe economic hardship, displacement, or humanitarian disruptions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Urgency / Need Level *
                    </label>
                    <select
                      value={formData.financialNeedLevel}
                      onChange={(e) => handleChange('financialNeedLevel', e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] bg-white font-medium"
                    >
                      <option value="Critical/Emergency">Critical / Emergency (Immediate Threat)</option>
                      <option value="High Need">High Need (Severe Hardship)</option>
                      <option value="Moderate Need">Moderate Need</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Annual Household Income (USD equivalent) *
                    </label>
                    <select
                      value={formData.householdIncomeBracket}
                      onChange={(e) => handleChange('householdIncomeBracket', e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] bg-white"
                    >
                      <option value="Under $800 USD annually">Under $800 USD annually</option>
                      <option value="Under $1,500 USD annually">Under $1,500 USD annually</option>
                      <option value="$1,500 - $3,000 USD annually">$1,500 - $3,000 USD annually</option>
                      <option value="$3,000 - $5,000 USD annually">$3,000 - $5,000 USD annually</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Number of Financial Dependents in Household *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={formData.dependentsCount}
                      onChange={(e) => handleChange('dependentsCount', Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Displacement / Conflict Status
                    </label>
                    <select
                      value={formData.displacementStatus}
                      onChange={(e) => handleChange('displacementStatus', e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] bg-white"
                    >
                      <option value="Not Displaced">Not Displaced</option>
                      <option value="Internally Displaced">Internally Displaced Person (IDP)</option>
                      <option value="Refugee">Registered Refugee / Asylum Seeker</option>
                      <option value="Crisis Affected">Affected by Natural Disaster / Drought</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Statement & Documents */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#0a1f38]">
                    4. Statement of Need & Supporting Documents
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Explain your background, the obstacles you face, and how this grant will impact your community.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="block font-semibold text-slate-700">
                    Statement of Need & Future Commitment * (Minimum 30 characters)
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.statementOfNeed}
                    onChange={(e) => handleChange('statementOfNeed', e.target.value)}
                    placeholder="Describe your circumstances, why you require assistance, and how you will use this opportunity..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] leading-relaxed"
                  />
                  <span className="text-[11px] text-slate-400">
                    Character count: {formData.statementOfNeed.length}
                  </span>
                </div>

                {/* Simulated Document Upload Area */}
                <div className="space-y-3 pt-2 text-xs">
                  <label className="block font-semibold text-slate-700">
                    Upload Supporting Documents (National ID, Transcripts, Proof of Hardship)
                  </label>
                  
                  <div className="p-5 border-2 border-dashed border-slate-300 hover:border-[#0a1f38] rounded-xl text-center bg-slate-50 transition-colors">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">
                      Click to upload files or drag & drop
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      PDF, JPG, PNG up to 10MB each
                    </p>
                    <input
                      type="file"
                      onChange={handleAddSimulatedFile}
                      className="mt-3 text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0a1f38] file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />
                  </div>

                  {/* Uploaded Documents List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Attached Documents ({formData.uploadedDocs.length})
                    </span>
                    <div className="space-y-1.5">
                      {formData.uploadedDocs.map(doc => (
                        <div 
                          key={doc.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                            <span className="text-[11px] text-slate-400">({doc.size})</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Affirmation */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#0a1f38]">
                    5. Review Application & Legal Affirmation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Please verify your details and currency conversions before lodging with the WHFS Worldwide Intake Committee.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block">Applicant Name:</span>
                      <span className="font-bold text-slate-900">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Contact Email:</span>
                      <span className="font-bold text-slate-900">{formData.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Country of Residence:</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{curr.flag}</span>
                        <span>{selectedCountry} ({formData.region})</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Assistance Category:</span>
                      <span className="font-bold text-emerald-700 uppercase">{formData.programmeCategory}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block">Programme:</span>
                      <span className="font-bold text-[#0a1f38]">{formData.programmeName}</span>
                    </div>

                    {/* Requested Funding with both USD and Local Currency */}
                    <div className="sm:col-span-2 p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <span className="text-slate-500 block font-medium">Requested Funding Value:</span>
                      <div className="text-base font-bold font-mono text-[#0a1f38]">
                        Funding: {curr.symbol} {localAmount.toLocaleString()} {curr.code} = ${usdAmount.toLocaleString()} USD {curr.flag}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Official Display: <strong className="text-emerald-700">{formatFundingDisplay(usdAmount, selectedCountry)}</strong>
                      </div>
                    </div>

                    {/* Registration Fee */}
                    <div className="sm:col-span-2 p-3 bg-amber-50/70 rounded-lg border border-amber-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-slate-600 block text-[11px]">Intake Registration Fee:</span>
                        <span className="font-bold font-mono text-[#0a1f38] text-sm">
                          Registration Fee: {curr.symbol} {localFee.toLocaleString()} {curr.code}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          (${DEFAULT_REGISTRATION_FEE_USD} USD subsidized intake verification)
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded">
                        {curr.flag} {curr.code}
                      </span>
                    </div>

                    {/* Payment Status Summary */}
                    {formData.hasPaidRegistrationFee ? (
                      <div className="sm:col-span-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-emerald-950 block">
                              Registration Fee Paid via {formData.paymentMethod}
                            </span>
                            <span className="text-[11px] font-mono text-emerald-700">
                              Transaction Reference: {formData.paymentTransactionId || 'Pending SMS Check'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                          Paid & Logged
                        </span>
                      </div>
                    ) : (
                      <div className="sm:col-span-2 p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-amber-950 font-bold block">
                            Registration Fee: {curr.symbol} {localFee.toLocaleString()} {curr.code} Pending
                          </span>
                          <span className="text-[11px] text-amber-700 block">
                            Pay via MTN Zambia with USSD push to settle to Samuel Soi (Airtel Kenya 0762641585).
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsMTNModalOpen(true)}
                          className="py-2 px-3.5 bg-[#ffcc00] hover:bg-[#f5c200] text-slate-950 font-black rounded-lg shadow-sm text-xs cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Pay K {localFee || 270} ZMW</span>
                        </button>
                      </div>
                    )}

                    <div>
                      <span className="text-slate-500 block">Need Level:</span>
                      <span className="font-bold text-amber-700">{formData.financialNeedLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Attached Documents:</span>
                      <span className="font-bold text-slate-900">{formData.uploadedDocs.length} files verified</span>
                    </div>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs space-y-2">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="declarationAccepted"
                      checked={formData.declarationAccepted}
                      onChange={(e) => handleChange('declarationAccepted', e.target.checked)}
                      className="mt-1 rounded text-[#059669] focus:ring-[#059669] cursor-pointer"
                    />
                    <label htmlFor="declarationAccepted" className="text-slate-700 leading-relaxed cursor-pointer">
                      <strong>Solemn Declaration:</strong> I hereby declare that all information and attached documentation provided in this application are genuine, accurate, and complete to the best of my knowledge. I understand that grant allocations are denominated in local currency and non-repayable.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>
              ) : <div />}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-[#0a1f38] hover:bg-[#133e87] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Lodging Application...' : 'Submit Official Application'}</span>
                </button>
              )}
            </div>

          </form>
        </div>

      </div>

      {/* Submission Success Confirmation Modal */}
      {submittedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8 space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
                Application Successfully Lodged
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0a1f38] mt-1">
                Official Intake Confirmation
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Your humanitarian application has been registered into the Worldwide Humanitarian Foundation Support global grants registry.
              </p>
            </div>

            {/* Reference Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Your Unique Tracking Reference:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(submittedApp.id);
                    showToast('Reference code copied to clipboard!', 'success');
                  }}
                  className="text-xs text-[#059669] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>
              <p className="text-xl font-mono font-extrabold text-[#0a1f38] tracking-wider">
                {submittedApp.id}
              </p>
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Applicant:</span>
                  <span className="font-semibold">{submittedApp.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Country:</span>
                  <span className="font-semibold">{submittedApp.countryFlag} {submittedApp.country}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Funding Amount:</span>
                  <span className="font-bold font-mono text-[#0a1f38]">
                    {submittedApp.localCurrencyDisplay || formatFundingDisplay(submittedApp.amountRequestedUSD, submittedApp.country)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSelectedTrackingId(submittedApp.id);
                  setActiveTab('track');
                }}
                className="flex-1 py-3 px-4 bg-[#0a1f38] hover:bg-[#133e87] text-white text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Track Application Live</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Confirmation Slip</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MTN Zambia Payment Modal with Cross-Border Settlement to Airtel Kenya */}
      <MTNPaymentModal
        isOpen={isMTNModalOpen}
        onClose={() => setIsMTNModalOpen(false)}
        onPaymentSuccess={(details) => {
          setFormData(prev => ({
            ...prev,
            hasPaidRegistrationFee: true,
            paymentMethod: 'MTN Zambia',
            paymentTransactionId: details.transactionId
          }));
          showToast('Payment received ✅ - Sent to Samuel Soi Airtel 0762641585', 'success');
        }}
        defaultPhone={formData.phone}
        amountZMW={localFee || 270}
      />

      {/* Regional Payment Popups: Malawi *211#, Zambia *303#, Kenya M-Pesa 0705198083 */}
      <RegionalPaymentModal
        isOpen={regionalModalChannel !== null}
        channel={regionalModalChannel}
        onClose={() => setRegionalModalChannel(null)}
        onPaymentSuccess={(details) => {
          setFormData(prev => ({
            ...prev,
            hasPaidRegistrationFee: true,
            paymentMethod: details.paymentMethod,
            paymentTransactionId: details.transactionId
          }));
          showToast(`Payment confirmed (${details.transactionId}) via ${details.paymentMethod}`, 'success');
        }}
        defaultPhone={formData.phone}
        amountLocal={localFee}
        currencySymbol={curr.symbol}
        currencyCode={curr.code}
      />

    </div>
  );
};

export default Application;
