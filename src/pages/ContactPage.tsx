import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GLOBAL_OFFICES, FAQS } from '../data/mockData';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  MessageSquare,
  HelpCircle,
  Building
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Grant Application Question');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !message.trim()) {
      showToast('Please fill out all contact fields', 'error');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showToast('Your message has been dispatched to the relevant regional desk', 'success');
      setContactName('');
      setContactEmail('');
      setMessage('');
    }, 800);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-[#0a1f38] text-white pt-12 pb-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Worldwide Liaison Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Contact Worldwide Support
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Reach our international secretariat, submit grant inquiries, or connect with 24/7 frontline operations across Africa, Europe, Asia, and the Americas.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Emergency Assistance Hotline Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-200/80 rounded-xl text-rose-900 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                Emergency Crisis Dispatch Hotline (Active Conflict & Acute Famine)
              </h3>
              <p className="text-xs text-rose-900 mt-0.5">
                For verified life-threatening field crises requiring 24-hour response triage.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-950 bg-white px-3.5 py-2 rounded-lg border border-rose-300">
            <Phone className="w-4 h-4 text-rose-600" />
            <span>+41 22 791 2999 (24/7 International Desk)</span>
          </div>
        </div>

        {/* Contact Form & Regional Headquarters Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
                Send an Inquiry
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0a1f38] mt-1">
                Direct Message to Foundation Secretariat
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Our admissions, grants review, and partnership teams respond within 24 to 48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your full legal name"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your.email@example.org"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Inquiry Category *
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-[#0a1f38]"
                >
                  <option value="Grant Application Question">Grant Application or Documentation Status</option>
                  <option value="Education Scholarship Admissions">Education & Academic Scholarship Admissions (GASP)</option>
                  <option value="Philanthropic Partnership">Philanthropic Partnership or Large Gift</option>
                  <option value="Humanitarian Emergency">Humanitarian Emergency Relief Request</option>
                  <option value="Audit and Transparency">Audit, Compliance & Media Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Message / Details *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your question or proposal in detail..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 px-6 bg-[#0a1f38] hover:bg-[#133e87] text-white font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>{isSending ? 'Transmitting Message...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Regional Offices Directory */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold font-serif text-[#0a1f38]">
              Global Regional Secretariats
            </h3>

            <div className="space-y-3">
              {GLOBAL_OFFICES.map((office) => (
                <div key={office.city} className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0a1f38] text-sm">{office.city}, {office.country}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Hub</span>
                  </div>
                  <p className="font-medium text-slate-700">{office.title}</p>
                  <p className="text-slate-500 leading-snug">{office.address}</p>
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="font-mono text-emerald-700">{office.phone}</span>
                    <span className="text-slate-400">{office.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Frequently Asked Questions Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
              Knowledge Base
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0a1f38]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear information on eligibility, selection criteria, grant disbursements, and transparency.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 pt-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 bg-slate-50/50 hover:bg-slate-100/50 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
