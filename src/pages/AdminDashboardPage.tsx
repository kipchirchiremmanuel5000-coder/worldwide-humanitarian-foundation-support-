import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  FileText, 
  RefreshCw, 
  Database,
  Layers,
  ChevronRight,
  User,
  X
} from 'lucide-react';
import { HumanitarianApplication, ApplicationStatus } from '../types';

interface AdminDashboardPageProps {
  onOpenFirebaseModal: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onOpenFirebaseModal }) => {
  const { 
    applications, 
    donations, 
    stats, 
    updateApplicationStatus, 
    refreshData, 
    showToast,
    currentUser,
    switchRoleDemo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'applications' | 'donations' | 'firebase'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<HumanitarianApplication | null>(null);

  // Review Drawer state
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('Under Review');
  const [editNotes, setEditNotes] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);

  const handleOpenReview = (app: HumanitarianApplication) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.committeeNotes || '');
    setEditAmount(app.amountAwardedUSD || app.amountRequestedUSD);
  };

  const handleSaveEvaluation = () => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, editStatus, editNotes, Number(editAmount));
    setSelectedApp(null);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.programmeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || app.programmeCategory === filterCategory;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const exportApplicationsCSV = () => {
    const headers = ['ID', 'Applicant', 'Email', 'Country', 'Category', 'Programme', 'Status', 'Requested_USD', 'Awarded_USD', 'Created_At'];
    const rows = applications.map(a => [
      `"${a.id}"`,
      `"${a.fullName}"`,
      `"${a.email}"`,
      `"${a.country}"`,
      `"${a.programmeCategory}"`,
      `"${a.programmeName}"`,
      `"${a.status}"`,
      a.amountRequestedUSD,
      a.amountAwardedUSD || 0,
      `"${a.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WHFS_Grants_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported applications registry to CSV', 'success');
  };

  return (
    <div className="space-y-8 pb-24">
      
      {/* Top Admin Header Bar */}
      <section className="bg-[#0a1f38] text-white pt-8 pb-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Executive Grants & Philanthropy Governance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Foundation Officer Administration Console
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Impartial review, applicant background verification, grant scoring, and fund disbursement.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onOpenFirebaseModal}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Firestore Schema</span>
              </button>
              <button
                onClick={refreshData}
                title="Reset sample registry"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Seed</span>
              </button>
              <button
                onClick={exportApplicationsCSV}
                className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Operational Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-8">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Total Intake</span>
              <span className="text-2xl font-mono font-bold text-white mt-0.5 block tabular-nums">{stats.totalApplications}</span>
              <span className="text-[10px] text-slate-400 block">Worldwide cases</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 block font-semibold">Under Review</span>
              <span className="text-2xl font-mono font-bold text-amber-400 mt-0.5 block tabular-nums">{stats.pendingReview}</span>
              <span className="text-[10px] text-slate-400 block">Awaiting scoring</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 block font-semibold">Approved / Disbursed</span>
              <span className="text-2xl font-mono font-bold text-emerald-400 mt-0.5 block tabular-nums">{stats.approvedOrDisbursed}</span>
              <span className="text-[10px] text-slate-400 block">Grants finalized</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Grants Disbursed</span>
              <span className="text-2xl font-mono font-bold text-white mt-0.5 block tabular-nums">${stats.totalDisbursedUSD.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 block">Direct beneficiary aid</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 col-span-2 lg:col-span-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Public Donations</span>
              <span className="text-2xl font-mono font-bold text-amber-400 mt-0.5 block tabular-nums">${stats.totalDonationsUSD.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block">{donations.length} Contributions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'applications'
                ? 'border-[#0a1f38] text-[#0a1f38] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Grant Applications Registry ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'donations'
                ? 'border-[#0a1f38] text-[#0a1f38] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Donations Ledger ({donations.length})
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'firebase'
                ? 'border-[#0a1f38] text-[#0a1f38] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Firebase & Cloud Firestore Setup
          </button>
        </div>

        {/* Tab 1: Applications Registry */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applicant, ID, or country..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden"
                >
                  <option value="all">All Categories</option>
                  <option value="education">Education Support</option>
                  <option value="humanitarian">Humanitarian Relief</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Committee Evaluation">Committee Evaluation</option>
                  <option value="Approved">Approved</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Needs Clarification">Needs Clarification</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

            </div>

            {/* Applications Table (Desktop) & Cards (Mobile) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Applicant & Country</th>
                      <th className="py-3 px-4">Programme & Category</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#0a1f38]">
                          {app.id}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{app.fullName}</p>
                          <p className="text-[11px] text-slate-500">{app.country} · {app.region}</p>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">
                          <span className="font-semibold text-slate-800 truncate block">{app.programmeName}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">{app.programmeCategory}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900">${app.amountRequestedUSD}</span>
                          {app.amountAwardedUSD ? (
                            <span className="block text-[10px] font-mono text-emerald-700 font-bold">
                              Awarded: ${app.amountAwardedUSD}
                            </span>
                          ) : null}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded ${
                            app.status === 'Approved' || app.status === 'Disbursed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : app.status === 'Needs Clarification'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenReview(app)}
                            className="px-3 py-1 bg-[#0a1f38] hover:bg-[#133e87] text-white text-[11px] font-semibold rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Evaluate</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet Cards View */}
              <div className="lg:hidden divide-y divide-slate-100 p-3 space-y-3">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#0a1f38]">{app.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        app.status === 'Approved' || app.status === 'Disbursed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">{app.fullName}</p>
                      <p className="text-[11px] text-slate-500">{app.country} · {app.programmeName}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="font-mono font-bold text-slate-800">
                        Req: ${app.amountRequestedUSD} USD
                      </span>
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="px-3 py-1 bg-[#0a1f38] text-white rounded font-semibold cursor-pointer"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredApplications.length === 0 && (
                <div className="p-10 text-center text-slate-500 text-xs">
                  No applications found matching the selected filter criteria.
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 2: Donations Ledger */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0a1f38]">
                  Verified Donations Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Full list of contributed philanthropic capital and generated receipt tokens.
                </p>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                Total: ${stats.totalDonationsUSD.toLocaleString()} USD
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Donor / Trust</th>
                    <th className="py-3 px-4">Designation Cause</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {d.receiptNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{d.donorName}</span>
                        <span className="block text-[11px] text-slate-400">{d.donorEmail}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {d.cause}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {d.paymentMethod} ({d.frequency})
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {d.date}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-[#059669]">
                        ${d.amount} {d.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Firebase Integration Setup */}
        {activeTab === 'firebase' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#0a1f38]">
                  Firebase Authentication & Cloud Firestore Readiness
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Architecture conforms to production Firestore database models and security rules.
                </p>
              </div>
              <button
                onClick={onOpenFirebaseModal}
                className="px-4 py-2 bg-[#0a1f38] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                View Full Rules & Blueprint
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-[#0a1f38] block text-sm">Cloud Firestore Collections</span>
                <p className="text-slate-600 leading-relaxed">
                  The application is configured to persist records under the following structured Firestore collections:
                </p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-slate-700">
                  <li><code>/humanitarian_applications/{'{id}'}</code></li>
                  <li><code>/users/{'{userId}'}</code></li>
                  <li><code>/donations/{'{donationId}'}</code></li>
                  <li><code>/programmes/{'{programmeId}'}</code></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-[#0a1f38] block text-sm">Security & RBAC Enforcement</span>
                <p className="text-slate-600 leading-relaxed">
                  Security rules enforce role-based access control where applicants can only read/edit their own submissions, while Foundation Officers with the <code className="font-mono">role == 'admin'</code> claim can evaluate, approve, and disburse grant budgets.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Application Evaluation Modal / Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-[#0a1f38] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-amber-400">
                  Grants Committee Assessment
                </span>
                <h3 className="text-base font-bold text-white leading-tight">
                  {selectedApp.fullName} · {selectedApp.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                aria-label="Close"
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
              
              {/* Applicant Overview */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block">Location:</span>
                  <span className="font-bold text-slate-900">{selectedApp.country} ({selectedApp.region})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact:</span>
                  <span className="font-semibold text-slate-900">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Programme:</span>
                  <span className="font-bold text-[#0a1f38]">{selectedApp.programmeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Institution / Entity:</span>
                  <span className="font-bold text-slate-900">{selectedApp.institutionOrCommunity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Vulnerability Need:</span>
                  <span className="font-bold text-amber-700">{selectedApp.financialNeedLevel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Requested Amount:</span>
                  <span className="font-bold font-mono text-slate-900">${selectedApp.amountRequestedUSD} USD</span>
                </div>
              </div>

              {/* Statement */}
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Applicant Statement of Hardship:
                </span>
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 italic leading-relaxed">
                  "{selectedApp.statementOfNeed}"
                </p>
              </div>

              {/* Verified Documents */}
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Attached Verification Documents ({selectedApp.documents.length}):
                </span>
                <div className="space-y-1.5">
                  {selectedApp.documents.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{d.name} ({d.size})</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Controls */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <span className="font-bold text-slate-900 block text-sm">
                  Executive Determination & Funding Allocation:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Determination Status *
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold focus:outline-hidden focus:border-[#0a1f38]"
                    >
                      <option value="Submitted">Submitted (Intake)</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Committee Evaluation">Committee Evaluation</option>
                      <option value="Approved">Approved (Awaiting Disbursement)</option>
                      <option value="Disbursed">Disbursed (Funds Released)</option>
                      <option value="Needs Clarification">Needs Clarification</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Awarded Grant Amount ($ USD)
                    </label>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Committee Assessment Remarks & Verification Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter formal justification, academic ranking verification, or reasons for decision..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] leading-relaxed"
                  />
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEvaluation}
                className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Determination</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
