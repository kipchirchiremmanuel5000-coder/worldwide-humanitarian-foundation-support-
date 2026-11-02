import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  Search, 
  GraduationCap, 
  LifeBuoy, 
  ShieldCheck, 
  CheckCircle, 
  HeartHandshake,
  Users,
  Building,
  Award
} from 'lucide-react';
import { IMPACT_STATISTICS } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { setActiveTab, setSelectedTrackingId, showToast } = useApp();
  const [quickSearchId, setQuickSearchId] = useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchId.trim()) {
      showToast('Please enter an application reference ID', 'error');
      return;
    }
    setSelectedTrackingId(quickSearchId.trim().toUpperCase());
    setActiveTab('track');
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-100 to-white pt-8 pb-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Mission Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
                <span className="w-6 h-0.5 bg-amber-600 inline-block" />
                <span>Worldwide Humanitarian Foundation Support</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#0a1f38] leading-[1.12] tracking-tight text-balance">
                Education • Opportunity • Brighter Futures
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                WHFS is an international chartered non-governmental foundation delivering direct academic scholarships, emergency crisis nutrition, clean water infrastructure, and sustainable community empowerment across 52 countries.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('apply')}
                  className="px-6 py-3.5 bg-[#0a1f38] hover:bg-[#133e87] active:bg-[#07172c] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <span>Submit Worldwide Application</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={() => setActiveTab('donate')}
                  className="px-6 py-3.5 bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Support Our Mission</span>
                </button>
              </div>

              {/* Quick Tracker Search Card right in Hero */}
              <div className="pt-4 max-w-lg">
                <form 
                  onSubmit={handleQuickTrack}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
                  <input
                    type="text"
                    value={quickSearchId}
                    onChange={(e) => setQuickSearchId(e.target.value)}
                    placeholder="Enter Reference Code (e.g. WHFS-2026-AF-94821)"
                    className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#0a1f38] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  >
                    Track Aid
                  </button>
                </form>
                <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-2">
                  <span>Demo search:</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setQuickSearchId('WHFS-2026-AF-94821');
                      setSelectedTrackingId('WHFS-2026-AF-94821');
                      setActiveTab('track');
                    }}
                    className="font-mono text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                  >
                    WHFS-2026-AF-94821
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Framing */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-16/11 sm:aspect-16/10 lg:aspect-auto lg:h-[460px]">
                <img
                  src="/src/assets/images/whfs_hero_banner_1793388479803.jpg"
                  alt="WHFS global education and humanitarian relief mission in action"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating caption card */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-white/50 text-xs shadow-lg">
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="font-bold text-[#0a1f38]">Frontline Global Support</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Audited Transparency
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Over 485,000 lives touched across 52 nations through verified academic scholarships and acute crisis relief.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Operational Metrics Strip */}
          <div className="mt-14 pt-10 border-t border-slate-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
                  Lives Impacted
                </span>
                <span className="text-3xl font-extrabold text-[#0a1f38] tabular-nums mt-1 block">
                  {IMPACT_STATISTICS.livesImpacted}
                </span>
                <span className="text-xs text-emerald-700 font-medium mt-1 block">
                  Across 52 partner countries
                </span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
                  Total Aid Disbursed
                </span>
                <span className="text-3xl font-extrabold text-[#0a1f38] tabular-nums mt-1 block">
                  {IMPACT_STATISTICS.grantsDisbursedUSD}
                </span>
                <span className="text-xs text-amber-700 font-medium mt-1 block">
                  100% Non-repayable grants
                </span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
                  Scholars Graduated
                </span>
                <span className="text-3xl font-extrabold text-[#0a1f38] tabular-nums mt-1 block">
                  {IMPACT_STATISTICS.scholarshipsGraduated}
                </span>
                <span className="text-xs text-blue-700 font-medium mt-1 block">
                  Higher education & STEM
                </span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
                  Direct Frontline Ratio
                </span>
                <span className="text-3xl font-extrabold text-[#059669] tabular-nums mt-1 block">
                  {IMPACT_STATISTICS.directAidRatio}
                </span>
                <span className="text-xs text-slate-600 font-medium mt-1 block">
                  Minimal overhead, audited
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Core Dual Pillars Section: Education & Humanitarian */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
            Our Foundational Mandate
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0a1f38] text-balance">
            Two Pillars of Transformational Support
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We bridge immediate life-saving humanitarian assistance with permanent intergenerational transformation through higher education and technological literacy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Pillar 1: Education Support */}
          <div className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src="/src/assets/images/whfs_education_program_1793388480799.jpg"
                  alt="WHFS education scholarship classroom program"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#0a1f38]/90 text-amber-400 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education Support</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-2xl font-serif font-bold text-[#0a1f38]">
                  Global Academic Scholarships & School Empowerment
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Removing financial barriers for talented youth from underserved communities. We fund full university tuition, technical vocational certifications, secondary school STEM labs, and digital infrastructure for off-grid schools.
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full tuition + living stipends + laptop learning packs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated STEM & Digital Future for Girls Initiative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Emergency continuity grants for displaced & refugee students</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('education')}
                className="text-xs font-bold uppercase tracking-wider text-[#0a1f38] hover:text-[#059669] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Explore Education Grants</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('apply')}
                className="px-4 py-2 bg-[#0a1f38] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Apply for Scholarship
              </button>
            </div>
          </div>

          {/* Pillar 2: Humanitarian Assistance */}
          <div className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src="/src/assets/images/whfs_humanitarian_relief_1793388481543.jpg"
                  alt="WHFS emergency water and food distribution mission"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#059669]/90 text-white backdrop-blur-xs px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4" />
                  <span>Humanitarian Assistance</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-2xl font-serif font-bold text-[#0a1f38]">
                  Crisis Relief, Clean Water & Essential Healthcare
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Delivering rapid life-saving assistance in zones hit by climate droughts, acute conflict, and natural disasters. We drill solar boreholes, dispatch mobile medical clinics, and distribute therapeutic food rations.
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Solar-powered deep water boreholes (390k+ daily users)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Acute crisis food basket delivery & child malnutrition packs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All-terrain mobile medical clinics & free pharmaceuticals</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('humanitarian')}
                className="text-xs font-bold uppercase tracking-wider text-[#059669] hover:text-[#047857] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Relief Missions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('apply')}
                className="px-4 py-2 bg-[#059669] text-white text-xs font-semibold rounded-lg hover:bg-[#047857] transition-colors cursor-pointer"
              >
                Request Relief Aid
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Urgent Field Dispatch Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0a1f38] text-white p-6 sm:p-10 border border-slate-700/80 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <span>Field Dispatch · 2026 Winter Crisis Response</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                Emergency Solar Water Boreholes Operational in East Africa
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                WHFS engineering teams have successfully commissioned 12 new 220-meter deep aquifer solar wells across Turkana and Garissa counties, ensuring reliable drinking water for 48,000 pastoralist families.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Verified by WHO WASH Standards</span>
                <span aria-hidden="true">·</span>
                <span>Zero Operating Fuel Cost</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => setActiveTab('donate')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors text-center cursor-pointer shadow-md"
              >
                Fund a Water Borehole
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors text-center cursor-pointer"
              >
                Track Relief Shipments
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Claim-to-Proof & Transparency Section */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
                Governance & Impartiality
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#0a1f38]">
                Rigorous Accountability & Zero-Wiggle-Room Transparency
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                WHFS operates under strict Swiss and international charity governance frameworks. All grant allocations undergo multi-stage committee review, physical verification, and independent external auditing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Triple-Layer Verification</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Every beneficiary is verified via administrative records, local liaisons, and photo IDs.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <Award className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Direct Financial Flow</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Tuition fees are paid directly to universities, preventing diversion of funds.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('about')}
                  className="text-xs font-bold uppercase tracking-wider text-[#0a1f38] hover:text-[#059669] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Read our Annual Audit & Leadership Charter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Testimonial / Story Card with image */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-md">
                <div className="h-60 overflow-hidden bg-slate-900">
                  <img
                    src="/src/assets/images/whfs_about_impact_1793388481965.jpg"
                    alt="WHFS community healthcare beneficiary"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Beneficiary Spotlight</span>
                    <span aria-hidden="true">·</span>
                    <span>Turkana Health & Scholarship Project</span>
                  </div>
                  <blockquote className="text-sm text-slate-800 italic leading-relaxed font-serif">
                    "When recurrent drought wiped out our community herds, my university aspirations seemed impossible. WHFS stepped in with a 100% engineering scholarship and laptop. Today I am designing solar water treatment kiosks for my home district."
                  </blockquote>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Amina Zainab Mwangi</p>
                      <p className="text-slate-500">WHFS Scholar & Civil Engineering Graduate</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded font-semibold text-[11px]">
                      Grant WHFS-2026-AF-94821
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#0a1f38] to-[#133e87] text-white p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white max-w-2xl mx-auto leading-tight text-balance">
            Education • Opportunity • Brighter Futures
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
            Whether you are an aspiring student in need of a scholarship, a community leader facing urgent humanitarian disaster, or a partner seeking to create lasting global change, WHFS is here to support you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('apply')}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
            >
              Start Your Application Today
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Contact Global Offices
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
