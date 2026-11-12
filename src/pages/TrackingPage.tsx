import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Printer, 
  Copy, 
  Calendar, 
  ShieldCheck, 
  User, 
  Download,
  Award,
  ArrowRight
} from 'lucide-react';
import { HumanitarianApplication, ApplicationStatus } from '../types';

export const TrackingPage: React.FC = () => {
  const { 
    applications, 
    selectedTrackingId, 
    setSelectedTrackingId, 
    setActiveTab,
    lookupApplicationById,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(selectedTrackingId || '');
  const [activeApp, setActiveApp] = useState<HumanitarianApplication | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Sync if selectedTrackingId changes
  useEffect(() => {
    if (selectedTrackingId) {
      setSearchQuery(selectedTrackingId);
      const found = applications.find(a => a.id.toLowerCase() === selectedTrackingId.toLowerCase());
      if (found) {
        setActiveApp(found);
      } else {
        lookupApplicationById(selectedTrackingId).then((res) => {
          if (res) setActiveApp(res);
        });
      }
    } else if (applications.length > 0) {
      setActiveApp(applications[0]);
    }
  }, [selectedTrackingId, applications]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) {
      showToast('Please enter an application reference ID', 'error');
      return;
    }

    const localMatch = applications.find(
      a => a.id.toUpperCase() === query || (a.fullName || '').toLowerCase().includes(query.toLowerCase())
    );
    if (localMatch) {
      setActiveApp(localMatch);
      setSelectedTrackingId(localMatch.id);
      showToast(`Loaded application: ${localMatch.id}`, 'success');
      return;
    }

    const remoteMatch = await lookupApplicationById(query);
    if (remoteMatch) {
      setActiveApp(remoteMatch);
      setSelectedTrackingId(remoteMatch.id);
      showToast(`Loaded application from Firestore: ${remoteMatch.id}`, 'success');
    } else {
      showToast(`No application found for "${query}"`, 'error');
    }
  };

  const getStageNumber = (status: ApplicationStatus): number => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'pending':
      case 'submitted': return 1;
      case 'under review':
      case 'needs clarification': return 2;
      case 'committee evaluation': return 3;
      case 'approved':
      case 'disbursed':
      case 'rejected': return 4;
      default: return 1;
    }
  };

  const currentStage = activeApp ? getStageNumber(activeApp.status) : 1;

  const copyRefCode = () => {
    if (activeApp) {
      navigator.clipboard.writeText(activeApp.id);
      showToast('Reference number copied to clipboard', 'success');
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Header Banner */}
      <section className="bg-[#0a1f38] text-white pt-12 pb-14 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <span>Worldwide Transparency Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Applicant Application Tracking
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Track real-time evaluation stages, document verification, reviewer committee notes, and official grant disbursement certificates.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Application Reference ID or Applicant Name"
                className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0a1f38] uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0a1f38] hover:bg-[#133e87] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Search Registry
            </button>
          </form>
        </div>

        {/* Detailed Application View */}
        {activeApp ? (
          <div className="space-y-8 animate-in fade-in">
            
            {/* Status Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Application Reference</span>
                    <button
                      onClick={copyRefCode}
                      className="text-[#059669] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-mono font-extrabold text-[#0a1f38] tracking-wider">
                    {activeApp.id}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
                    <span className="font-semibold text-slate-900">{activeApp.fullName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeApp.country} ({activeApp.region})</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{activeApp.programmeCategory} Grant</span>
                  </div>
                </div>

                {/* Status Indicator & Certificate Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Current Decision Status
                    </span>
                    <span className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-md capitalize ${
                      String(activeApp.status).toLowerCase() === 'approved' || String(activeApp.status).toLowerCase() === 'disbursed'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : String(activeApp.status).toLowerCase() === 'rejected'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : String(activeApp.status).toLowerCase() === 'needs clarification'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {activeApp.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Official Letter</span>
                  </button>
                </div>

              </div>

              {/* 4-Stage Visual Progress Timeline */}
              <div className="pt-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                  Four-Stage Grant Evaluation Pipeline
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  
                  {/* Stage 1: Submitted */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    currentStage >= 1 
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">Stage 1</span>
                      {currentStage >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <h4 className="text-sm font-bold">Application Lodged</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Intake validation & duplicate checks.
                    </p>
                  </div>

                  {/* Stage 2: Document Verification */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    currentStage >= 2 
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">Stage 2</span>
                      {currentStage > 2 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : currentStage === 2 ? (
                        <Clock className="w-4 h-4 text-amber-600" />
                      ) : null}
                    </div>
                    <h4 className="text-sm font-bold">Document Verification</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Field liaison & school validation.
                    </p>
                  </div>

                  {/* Stage 3: Committee Evaluation */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    currentStage >= 3 
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">Stage 3</span>
                      {currentStage > 3 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : currentStage === 3 ? (
                        <Clock className="w-4 h-4 text-amber-600" />
                      ) : null}
                    </div>
                    <h4 className="text-sm font-bold">Board Evaluation</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Grants Committee scoring & allocation.
                    </p>
                  </div>

                  {/* Stage 4: Disbursement */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    currentStage >= 4 
                      ? String(activeApp.status).toLowerCase() === 'rejected' 
                        ? 'bg-rose-50 border-rose-300 text-rose-950' 
                        : 'bg-emerald-50/60 border-emerald-300 text-emerald-950' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">Stage 4</span>
                      {currentStage >= 4 && (
                        String(activeApp.status).toLowerCase() === 'rejected' ? (
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )
                      )}
                    </div>
                    <h4 className="text-sm font-bold">
                      {String(activeApp.status).toLowerCase() === 'disbursed' ? 'Funds Disbursed' : 'Award Decision'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Official grant release to institution.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Grant Details & Reviewer Committee Findings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Grant Overview & Financial Details */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#0a1f38]">
                    Programme & Allocation Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Programme:</span>
                      <span className="font-bold text-slate-900">{activeApp.programmeName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Institution / Community:</span>
                      <span className="font-bold text-slate-900">{activeApp.institutionOrCommunity}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Amount Requested:</span>
                      <span className="font-bold text-slate-900">${activeApp.amountRequestedUSD} USD</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Amount Awarded:</span>
                      <span className="font-extrabold text-[#059669] text-sm">
                        {activeApp.amountAwardedUSD ? `$${activeApp.amountAwardedUSD} USD` : 'Pending final allocation'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Vulnerability Need:</span>
                      <span className="font-semibold text-amber-800">{activeApp.financialNeedLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Displacement Status:</span>
                      <span className="font-semibold text-slate-700">{activeApp.displacementStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Statement of Need */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Applicant Statement of Purpose
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                    "{activeApp.statementOfNeed}"
                  </p>
                </div>

                {/* Committee Notes */}
                {activeApp.committeeNotes && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                      Official Committee Assessment Remarks
                    </h4>
                    <p className="text-xs text-slate-700 bg-amber-50/70 p-3 rounded-lg border border-amber-200">
                      {activeApp.committeeNotes}
                    </p>
                  </div>
                )}

                {/* Document Verification Checklist */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Verified Documents on File ({activeApp.documents.length})
                  </h4>
                  <div className="space-y-2">
                    {activeApp.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium text-slate-800">{doc.name}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Historical Audit Log Timeline */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#0a1f38]">
                    Activity & Audit Log
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Traceable event record generated by foundation officers.
                  </p>
                </div>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeApp.timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-8 space-y-1 text-xs">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#059669] ring-4 ring-white" />
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>{event.date}</span>
                        <span>{event.officer}</span>
                      </div>
                      <h4 className="font-bold text-slate-900">{event.title}</h4>
                      <p className="text-slate-600 leading-snug">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">
              No application selected. Enter a reference number above or submit a new application.
            </p>
            <button
              onClick={() => setActiveTab('apply')}
              className="mt-4 px-5 py-2.5 bg-[#0a1f38] text-white text-xs font-bold uppercase rounded-lg"
            >
              Start New Application
            </button>
          </div>
        )}

      </div>

      {/* Official Status Letter / Award Certificate Modal */}
      {showCertificateModal && activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden p-8 space-y-6">
            
            {/* Certificate Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                OFFICIAL DETERMINATION STATEMENT
              </span>
              <h2 className="text-2xl font-serif font-extrabold text-[#0a1f38]">
                Worldwide Humanitarian Foundation Support
              </h2>
              <p className="text-xs text-slate-600">
                Avenue de la Paix 14, 1202 Genève, Switzerland · CHE-491.209.112
              </p>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
              <div className="flex justify-between text-xs font-sans text-slate-500 pb-2 border-b border-slate-100">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Ref: {activeApp.id}</span>
              </div>

              <p>
                <strong>To: {activeApp.fullName}</strong><br />
                {activeApp.address}, {activeApp.region}, {activeApp.country}
              </p>

              <p>
                <strong>Re: Official Determination for Grant Proposal — {activeApp.programmeName}</strong>
              </p>

              <p>
                The Board of Trustees and the Regional Grants Committee of the Worldwide Humanitarian Foundation Support (WHFS) hereby certifies that your application for assistance under reference number <strong>{activeApp.id}</strong> has been officially evaluated and is categorized as:
              </p>

              <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg text-center font-sans">
                <span className="text-xs uppercase tracking-wider text-slate-500 block">Status Finding</span>
                <span className="text-xl font-bold text-[#0a1f38] block mt-1">{activeApp.status}</span>
                {activeApp.amountAwardedUSD && (
                  <span className="text-sm font-extrabold text-emerald-700 block mt-1">
                    Grant Allocation: ${activeApp.amountAwardedUSD} USD
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                WHFS awards are non-repayable philanthropic grants disbursed directly to verified tertiary institutions, regional water trusts, and emergency supply consignments pursuant to international humanitarian governance covenants.
              </p>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 gap-8 font-sans text-xs">
                <div>
                  <div className="h-10 border-b border-slate-400 flex items-end">
                    <span className="font-serif italic font-bold text-[#0a1f38]">Dr. Tariq Al-Hassan</span>
                  </div>
                  <p className="font-bold text-slate-900 mt-1">Dr. Tariq Al-Hassan</p>
                  <p className="text-slate-500 text-[11px]">President, Board of Trustees</p>
                </div>
                <div>
                  <div className="h-10 border-b border-slate-400 flex items-end">
                    <span className="font-serif italic font-bold text-[#059669]">Elena Rostova</span>
                  </div>
                  <p className="font-bold text-slate-900 mt-1">Elena Rostova</p>
                  <p className="text-slate-500 text-[11px]">Director of Grants Administration</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0a1f38] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close Letter
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
