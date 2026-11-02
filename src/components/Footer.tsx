import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Heart, Shield, Mail, ArrowRight, ExternalLink, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please provide a valid email address', 'error');
      return;
    }
    showToast('Subscribed to WHFS Global Humanitarian Dispatch', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#07172c] text-slate-300 border-t border-slate-800 pb-20 lg:pb-12">
      {/* Slogan & Mission Marquee Strip */}
      <div className="bg-[#0a1f38] border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-1">
              Official Foundation Slogan
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Education • Opportunity • Brighter Futures
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('apply')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Apply for Aid
            </button>
            <button
              onClick={() => setActiveTab('donate')}
              className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Support Our Work
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0f2c4e] text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-400/20">
                <Globe className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight block">WHFS</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  Worldwide Humanitarian Foundation Support
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A chartered non-governmental humanitarian organisation dedicated to eradicating extreme poverty through high-impact academic scholarships, emergency crisis nutrition, clean water infrastructure, and sustainable community empowerment across 52 countries.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>UN ECOSOC Consultative Status & ISO 9001 Certified NGO</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>PricewaterhouseCoopers Independent Audit · AAA Transparency Rating</span>
              </div>
            </div>
          </div>

          {/* Col 3: Programmes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Programmes
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => setActiveTab('education')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Global Academic Scholarships
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('education')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  STEM & Digital for Girls
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('humanitarian')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Emergency Food Security
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('humanitarian')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Clean Water Boreholes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('humanitarian')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mobile Health Clinics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Applicant & Donor Portal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Portals & Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => setActiveTab('apply')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Worldwide Application Form
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('track')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Application Status
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('donate')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Make a Tax-Deductible Gift
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('about')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Annual Financial Reports
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('contact')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Global Offices & Hotlines
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Dispatch */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Humanitarian Dispatch
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive quarterly audit disclosures, frontline field dispatches, and emergency relief alerts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-3 pr-9 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 p-1 bg-[#059669] hover:bg-[#047857] text-white rounded cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-slate-500 block">
                Strict privacy. Zero spam. Unsubscribe anytime.
              </span>
            </form>
          </div>
        </div>

        {/* Global UN SDG Alignment row */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-300">Aligned with UN Sustainable Development Goals:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">SDG 1: No Poverty</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">SDG 3: Good Health</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">SDG 4: Quality Education</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">SDG 6: Clean Water & Sanitation</span>
          </div>
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} Worldwide Humanitarian Foundation Support (WHFS). All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
