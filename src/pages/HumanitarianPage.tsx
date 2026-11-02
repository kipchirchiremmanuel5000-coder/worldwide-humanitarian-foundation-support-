import React from 'react';
import { useApp } from '../context/AppContext';
import { HUMANITARIAN_PROGRAMMES } from '../data/mockData';
import { 
  LifeBuoy, 
  ArrowRight, 
  Droplet, 
  Truck, 
  Stethoscope, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  PhoneCall 
} from 'lucide-react';
import { ProgrammeItem } from '../types';

export const HumanitarianPage: React.FC = () => {
  const { setActiveTab, setPreselectedProgramme } = useApp();

  const handleRequestAid = (prog: ProgrammeItem) => {
    setPreselectedProgramme({
      name: prog.title,
      category: 'humanitarian'
    });
    setActiveTab('apply');
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-[#0a1f38] text-white pt-14 pb-16 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
            <span>WHFS Frontline Operations</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Humanitarian Assistance Programmes
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Rapid, impartial life-saving aid deployed in areas devastated by armed conflict, protracted droughts, earthquakes, and acute food shortages.
          </p>
        </div>
      </section>

      {/* Emergency Hotline Alert Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-200/80 rounded-xl text-amber-900 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                24/7 Rapid Emergency Response Desk
              </h3>
              <p className="text-xs text-amber-900 mt-0.5">
                Acute crisis requests (famine, natural disaster displacement) undergo expedited triage within 48 hours.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('apply')}
              className="px-4 py-2 bg-[#0a1f38] text-white text-xs font-bold uppercase rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Request Urgent Aid
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-4 py-2 bg-white border border-amber-300 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Contact Operations Desk
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Programmes List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {HUMANITARIAN_PROGRAMMES.map((prog, index) => (
          <div 
            key={prog.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Image */}
              <div className="lg:col-span-5 relative bg-slate-900 min-h-[280px] lg:min-h-full">
                <img
                  src={prog.featuredImage}
                  alt={prog.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#059669]/90 text-white backdrop-blur-xs px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                  Field Mission 0{index + 1}
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span>Annual Budget: {prog.annualBudget}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-semibold">{prog.deadline}</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-[#0a1f38]">
                      {prog.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                      {prog.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Requirements & Field Supplies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <h4 className="font-bold text-[#0a1f38] uppercase tracking-wider mb-2">
                        Vulnerability Criteria
                      </h4>
                      <ul className="space-y-1.5 text-slate-600">
                        {prog.eligibility.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#0a1f38] uppercase tracking-wider mb-2">
                        Relief Package Includes
                      </h4>
                      <ul className="space-y-1.5 text-slate-600">
                        {prog.coverageIncludes.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700">Active Deployment Zones: </span>
                    <span>{prog.countries.join(', ')}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded font-medium">
                    {prog.impactMetrics}
                  </span>

                  <button
                    onClick={() => handleRequestAid(prog)}
                    className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Request Emergency Assistance</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </section>

      {/* Field Distribution Protocol Statement */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-[#0a1f38]">
            Do No Harm & Community Dignity Protocol
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All WHFS emergency distributions are conducted with the highest respect for beneficiary human dignity. We ensure equitable distribution queues with prioritized access for nursing mothers, the elderly, and persons with disabilities, verified with biometric or photographic identity tokens.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('donate')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
            >
              Sponsor an Emergency Food Basket ($50)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
