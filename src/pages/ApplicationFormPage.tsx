import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { EDUCATION_PROGRAMMES, HUMANITARIAN_PROGRAMMES } from '../data/mockData';
import { HumanitarianApplication, ProgrammeCategory } from '../types';

export const ApplicationFormPage: React.FC = () => {
  const { 
    currentUser, 
    preselectedProgramme, 
    setPreselectedProgramme, 
    submitApplication, 
    setSelectedTrackingId, 
    setActiveTab,
    showToast 
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<HumanitarianApplication | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    dateOfBirth: '2002-05-18',
    gender: 'Female',
    country: currentUser?.country || 'Kenya',
    region: 'Nairobi County',
    address: 'P.O. Box 4020, Community Road',
    nationalIdNumber: 'ID-84920194',

    // Step 2: Programme
    programmeCategory: (preselectedProgramme?.category || 'education') as ProgrammeCategory,
    programmeName: preselectedProgramme?.name || EDUCATION_PROGRAMMES[0].title,
    institutionOrCommunity: 'Technical University of Kenya',
    amountRequestedUSD: 3200,

    // Step 3: Need Assessment
    financialNeedLevel: 'Critical/Emergency' as const,
    householdIncomeBracket: 'Under $1,500 USD annually',
    dependentsCount: 4,
    displacementStatus: 'Crisis Affected' as const,

    // Step 4: Statement & Documents
    statementOfNeed: 'I am applying for educational grant assistance to complete my tertiary coursework in electrical and renewable energy engineering. Following protracted droughts that severely impaired our household livelihoods, my family cannot cover semester laboratory fees and technical supplies. I am committed to dedicating my engineering skills to community solar installations.',
    uploadedDocs: [
      { id: 'doc-auto-1', name: 'National_Identification_Card.pdf', type: 'PDF', size: '1.2 MB', status: 'verified' as const, uploadedAt: '2026-10-30' },
      { id: 'doc-auto-2', name: 'Academic_Transcripts_Certified.pdf', type: 'PDF', size: '2.5 MB', status: 'verified' as const, uploadedAt: '2026-10-30' },
      { id: 'doc-auto-3', name: 'Chief_Recommendation_Affidavit.pdf', type: 'PDF', size: '940 KB', status: 'pending' as const, uploadedAt: '2026-10-30' }
    ],

    // Step 5: Affirmation
    declarationAccepted: false
  });

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

  const availablePrograms = formData.programmeCategory === 'education' 
    ? EDUCATION_PROGRAMMES 
    : HUMANITARIAN_PROGRAMMES;

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.country.trim()) {
        showToast('Please complete all required identity fields', 'error');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      const app = await submitApplication({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        country: formData.country,
        region: formData.region,
        address: formData.address,
        programmeCategory: formData.programmeCategory,
        programmeName: formData.programmeName,
        institutionOrCommunity: formData.institutionOrCommunity,
        financialNeedLevel: formData.financialNeedLevel,
        householdIncomeBracket: formData.householdIncomeBracket,
        dependentsCount: Number(formData.dependentsCount),
        displacementStatus: formData.displacementStatus,
        statementOfNeed: formData.statementOfNeed,
        amountRequestedUSD: Number(formData.amountRequestedUSD),
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
            <span>Official Grant Intake Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Worldwide Application Form
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            All WHFS grant applications undergo impartial review. Grants and scholarships are 100% non-repayable philanthropic awards.
          </p>
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
              {step === 2 && '2. Programme Selection'}
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
            
            {/* STEP 1: Personal Profile */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#0a1f38]">
                    1. Applicant Identity & Geographic Location
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Please provide your legal name and contact details as they appear on your official identity documents.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+254 712 345 678"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

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

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Country of Residence *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      placeholder="e.g. Kenya, Nigeria, Philippines, Ukraine..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      State / County / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.region}
                      onChange={(e) => handleChange('region', e.target.value)}
                      placeholder="e.g. Turkana, Kharkiv, Cebu..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

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

            {/* STEP 2: Programme Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#0a1f38]">
                    2. Select Assistance Programme
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose whether you are applying for academic educational grants or frontline humanitarian crisis assistance.
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
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] bg-white"
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
                      placeholder={formData.programmeCategory === 'education' ? 'e.g. University of Nairobi' : 'e.g. San Isidro Community Association'}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Total Grant Amount Requested (USD equivalent) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500 font-bold">$</span>
                      <input
                        type="number"
                        min="100"
                        max="25000"
                        required
                        value={formData.amountRequestedUSD}
                        onChange={(e) => handleChange('amountRequestedUSD', Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Grants typically range from $500 for emergency supply kits to $6,000 for full multi-year university scholarships.
                    </span>
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
                    WHFS prioritizes applicants facing the most severe economic hardships and crisis disruptions.
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
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] bg-white"
                    >
                      <option value="Critical/Emergency">Critical / Emergency (Immediate Crisis)</option>
                      <option value="High Need">High Need (Severe Hardship)</option>
                      <option value="Moderate Need">Moderate Need</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Annual Household Income Bracket *
                    </label>
                    <select
                      value={formData.householdIncomeBracket}
                      onChange={(e) => handleChange('householdIncomeBracket', e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] bg-white"
                    >
                      <option value="Under $800 USD annually">Under $800 USD annually</option>
                      <option value="Under $1,500 USD annually">Under $1,500 USD annually</option>
                      <option value="$1,500 – $3,000 USD annually">$1,500 – $3,000 USD annually</option>
                      <option value="$3,000 – $6,000 USD annually">$3,000 – $6,000 USD annually</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Number of Family Dependents
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={formData.dependentsCount}
                      onChange={(e) => handleChange('dependentsCount', e.target.value)}
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
                    Please verify your details before submitting to the WHFS Worldwide Intake Committee.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block">Applicant Name:</span>
                      <span className="font-bold text-slate-900">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Contact Email:</span>
                      <span className="font-bold text-slate-900">{formData.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Country & Region:</span>
                      <span className="font-bold text-slate-900">{formData.country}, {formData.region}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Assistance Category:</span>
                      <span className="font-bold text-emerald-700 uppercase">{formData.programmeCategory}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Programme:</span>
                      <span className="font-bold text-[#0a1f38]">{formData.programmeName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Requested Amount:</span>
                      <span className="font-extrabold text-slate-900 text-sm">${formData.amountRequestedUSD} USD</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Need Level:</span>
                      <span className="font-bold text-amber-700">{formData.financialNeedLevel}</span>
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
                      <strong>Solemn Declaration:</strong> I hereby declare that all information and attached documentation provided in this application are genuine, accurate, and complete to the best of my knowledge. I understand that any falsification constitutes immediate grounds for disqualification and forfeiture of grant awards.
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
                  <span>{isSubmitting ? 'Submitting to Registry...' : 'Submit Official Application'}</span>
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
                  <span className="text-slate-400 block text-[11px]">Programme:</span>
                  <span className="font-semibold truncate block">{submittedApp.programmeName}</span>
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

    </div>
  );
};
