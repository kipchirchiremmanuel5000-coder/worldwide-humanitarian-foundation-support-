import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EDUCATION_PROGRAMMES } from '../data/mockData';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Users, 
  BookOpen, 
  Laptop, 
  Building 
} from 'lucide-react';
import { ProgrammeItem } from '../types';

export const EducationPage: React.FC = () => {
  const { setActiveTab, setPreselectedProgramme } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProg, setActiveModalProg] = useState<ProgrammeItem | null>(null);

  const handleApplyToProgram = (prog: ProgrammeItem) => {
    setPreselectedProgramme({
      name: prog.title,
      category: 'education'
    });
    setActiveTab('apply');
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-[#0a1f38] text-white pt-14 pb-16 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>WHFS Education Division</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Education Support Programmes
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminating economic hurdles to quality learning. We sponsor university degrees, equip girls with digital coding tools, build off-grid solar classrooms, and protect displaced students from school drop-outs.
          </p>
        </div>
      </section>

      {/* Program Highlights Overview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs uppercase font-semibold text-slate-500">Graduated Scholars</span>
            <span className="text-3xl font-extrabold text-[#0a1f38] tabular-nums block mt-1">14,200+</span>
            <span className="text-xs text-emerald-700 font-medium mt-1 block">91% Post-grad employment</span>
          </div>
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs uppercase font-semibold text-slate-500">Active Annual Education Budget</span>
            <span className="text-3xl font-extrabold text-[#0a1f38] tabular-nums block mt-1">$13.5M USD</span>
            <span className="text-xs text-amber-700 font-medium mt-1 block">Full tuition + equipment grants</span>
          </div>
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs uppercase font-semibold text-slate-500">Solar Schools Modernized</span>
            <span className="text-3xl font-extrabold text-[#059669] tabular-nums block mt-1">142 Hubs</span>
            <span className="text-xs text-slate-600 font-medium mt-1 block">Computer labs & clean power</span>
          </div>
        </div>

        {/* Detailed Program Cards */}
        <div className="space-y-12">
          {EDUCATION_PROGRAMMES.map((prog, index) => (
            <div 
              key={prog.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Visual Image */}
                <div className="lg:col-span-5 relative bg-slate-900 min-h-[280px] lg:min-h-full">
                  <img
                    src={prog.featuredImage}
                    alt={prog.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#0a1f38]/90 text-amber-400 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                    Track {index + 1}
                  </div>
                </div>

                {/* Content Details */}
                <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span>Annual Allocation: {prog.annualBudget}</span>
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

                    {/* Eligibility & Coverage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <h4 className="font-bold text-[#0a1f38] uppercase tracking-wider mb-2">
                          Key Eligibility Criteria
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
                          Grant Coverage Includes
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
                      <span className="font-semibold text-slate-700">Eligible Regions: </span>
                      <span>{prog.countries.join(', ')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded font-medium">
                      {prog.impactMetrics}
                    </span>

                    <button
                      onClick={() => handleApplyToProgram(prog)}
                      className="px-5 py-2.5 bg-[#0a1f38] hover:bg-[#133e87] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span>Apply for this Grant</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verification Protocol Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-center space-y-3">
          <h3 className="text-base font-bold text-[#0a1f38]">
            Need guidance preparing your academic documents?
          </h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
            Our admissions liaisons review academic transcripts, indigency certificates, and refugee papers on a rolling quarterly cycle. Review guidelines or ask our admissions desk.
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => setActiveTab('apply')}
              className="px-4 py-2 bg-[#059669] text-white text-xs font-semibold rounded-lg hover:bg-[#047857] transition-colors cursor-pointer"
            >
              Start General Application
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Admissions Inquiries
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
