import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Globe2, 
  BookOpen, 
  Heart, 
  Scale, 
  Eye, 
  ArrowRight,
  FileCheck2,
  Users2,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { GLOBAL_OFFICES, IMPACT_STATISTICS } from '../data/mockData';

export const AboutUsPage: React.FC = () => {
  const { setActiveTab } = useApp();

  const principles = [
    {
      title: 'Humanity',
      icon: Heart,
      desc: 'Human suffering must be addressed wherever it is found. The purpose of WHFS is to protect life, health, and ensure respect for human beings regardless of background.'
    },
    {
      title: 'Impartiality',
      icon: Scale,
      desc: 'Aid is given purely on the basis of need, making no discrimination on nationality, race, religious beliefs, class, or political opinions. Priority is given to the most urgent cases.'
    },
    {
      title: 'Neutrality',
      icon: ShieldCheck,
      desc: 'WHFS does not take sides in hostilities or engage at any time in controversies of a political, racial, religious, or ideological nature.'
    },
    {
      title: 'Independence',
      icon: Globe2,
      desc: 'Our humanitarian action is autonomous from the political, economic, or military objectives that any actor may hold in areas where humanitarian action is being implemented.'
    },
    {
      title: 'Verifiable Transparency',
      icon: Eye,
      desc: 'Every dollar, grant, and shipment is catalogued with independent external audit oversight, open public reporting, and zero tolerance for corruption.'
    }
  ];

  const trustees = [
    {
      name: 'Dr. Tariq Al-Hassan',
      role: 'President & Chairman of the Board of Trustees',
      background: 'Former Senior Advisor to UN OCHA, 28 years directing emergency humanitarian corridors across the Middle East and Africa.',
      location: 'Geneva, Switzerland'
    },
    {
      name: 'Director Elena Rostova',
      role: 'Global Education Grant Director',
      background: 'Professor of International Development, formerly leading UNESCO higher education equity initiatives.',
      location: 'London, UK'
    },
    {
      name: 'Dr. Babajide Adeleke, MD',
      role: 'Chief Medical & Field Logistics Officer',
      background: 'Tropical medicine specialist, directing mobile clinic programs and epidemic response across West and Central Africa.',
      location: 'Nairobi, Kenya'
    },
    {
      name: 'Sophia Chen, CPA',
      role: 'Head of Global Audit & Financial Governance',
      background: 'Senior partner in institutional non-profit compliance, ensuring strict adherence to Swiss and international charity law.',
      location: 'Singapore'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Editorial Header */}
      <section className="bg-[#0a1f38] text-white pt-14 pb-16 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <span>Institutional Charter & Mandate</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Worldwide Humanitarian Foundation Support
          </h1>
          <p className="text-lg text-amber-300 font-medium italic">
            Education • Opportunity • Brighter Futures
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
            Chartered to mobilize global philanthropic capital and field logistics into verifiable educational grants and frontline humanitarian relief across 52 nations.
          </p>
        </div>
      </section>

      {/* Mission & Vision Long-form Column */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
              FOUNDATIONAL PURPOSE
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0a1f38] mb-4">
              Our Mission
            </h2>
            <p className="text-base text-slate-700 leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#0a1f38] first-letter:leading-none">
              The Worldwide Humanitarian Foundation Support (WHFS) exists to liberate individuals and vulnerable communities from the traps of extreme poverty and crisis. We believe that unconditional emergency relief saves lives today, while rigorous access to education, technical innovation, and clean infrastructure guarantees independence for generations tomorrow.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0a1f38] mb-4">
              Our Vision
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              A world where geographic birthplace, armed conflict, or environmental calamity never dictates a human being’s potential. We envision an equitable global community where every talented child has a pathway to higher education, every drought-stricken village possesses permanent solar clean water, and every family displaced by disaster receives swift, dignified shelter and sustenance.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Core Principles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
            Guiding Framework
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0a1f38] mt-1">
            Five Core Humanitarian Principles
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Adopted under our constitutional charter and strictly enforced across all 52 countries of operation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.title} 
                className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3 ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0a1f38] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-[#0a1f38]">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Financial Transparency & Budget Allocation */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Accountability & Trust
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#0a1f38] mt-1">
              Financial Stewardship & Audit Statement
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              We maintain one of the highest direct-to-field program efficiency ratios in the humanitarian sector.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Allocation bar representation */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">Frontline Direct Humanitarian & Education Grants</span>
                    <span className="text-[#059669]">94.2% ($17.38M)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#059669] rounded-full" style={{ width: '94.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">Field Logistics & Verification Audits</span>
                    <span className="text-amber-600">3.8% ($700K)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '3.8%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">General Governance & Administration</span>
                    <span className="text-slate-600">2.0% ($370K)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: '2.0%' }} />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    PwC Audited Fiscal Year 2025/2026
                  </span>
                  <span>·</span>
                  <span>Zero Commercial Borrowing</span>
                  <span>·</span>
                  <span>Non-Profit Swiss Registry ID: CHE-491.209.112</span>
                </div>
              </div>

              {/* Independent seal badge */}
              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0a1f38] text-amber-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#0a1f38]">AAA Transparency Rating</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Certified by international charity evaluators for open data publishing, traceable receipt issuance, and recipient dignity charters.
                </p>
                <button
                  onClick={() => setActiveTab('donate')}
                  className="px-4 py-2 bg-[#059669] text-white text-xs font-semibold rounded-lg hover:bg-[#047857] transition-colors cursor-pointer w-full"
                >
                  Join as an Institutional Supporter
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Board of Trustees & Executive Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
            Governance Board
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0a1f38] mt-1">
            Board of Trustees & Executive Officers
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Seasoned international humanitarians, university chancellors, and public health directors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustees.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#0a1f38] text-white flex items-center justify-center font-bold text-lg">
                  {t.name.split(' ').slice(1, 3).map(n => n[0]).join('') || 'TR'}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {t.name}
                </h3>
                <p className="text-xs font-medium text-emerald-700">
                  {t.role}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {t.background}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                {t.location}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Regional Offices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Worldwide Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0a1f38]">
                Global Operational Secretariats
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('contact')}
              className="text-xs font-bold uppercase tracking-wider text-[#059669] hover:underline flex items-center gap-1"
            >
              <span>View full directory & hotline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GLOBAL_OFFICES.slice(0, 3).map((office) => (
              <div key={office.city} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0a1f38]">{office.city}, {office.country}</span>
                  <Building2 className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs font-medium text-slate-700">{office.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{office.address}</p>
                <p className="text-xs font-mono text-[#059669] pt-1">{office.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
