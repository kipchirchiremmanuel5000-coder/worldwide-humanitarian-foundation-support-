import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  FileText, 
  RefreshCw, 
  Database,
  Lock,
  Mail,
  KeyRound,
  LogOut,
  Users,
  HeartHandshake,
  ArrowLeft,
  X,
  Check
} from 'lucide-react';
import { HumanitarianApplication, ApplicationStatus } from '../types';

interface AdminProps {
  onOpenFirebaseModal?: () => void;
}

export const Admin: React.FC<AdminProps> = ({ onOpenFirebaseModal }) => {
  const { 
    applications, 
    donations, 
    stats, 
    updateApplicationStatus, 
    approveApplication,
    rejectApplication,
    refreshData, 
    showToast,
    currentUser,
    adminLogin,
    logout,
    setActiveTab
  } = useApp();

  // Admin Login Credentials Form State
  const [loginEmail, setLoginEmail] = useState('admin@whfs.org');
  const [loginPassword, setLoginPassword] = useState('WHFS2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveDashboardTab] = useState<'applications' | 'donations' | 'firebase'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<HumanitarianApplication | null>(null);

  // Review & Evaluation state
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('Approved');
  const [editNotes, setEditNotes] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const success = await adminLogin(loginEmail, loginPassword);
      if (!success) {
        setLoginError('Invalid credentials. Required: email: admin@whfs.org and password: WHFS2026!');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setLoginEmail('admin@whfs.org');
    setLoginPassword('WHFS2026!');
    setLoginError(null);
    showToast('Admin credentials loaded: admin@whfs.org / WHFS2026!', 'info');
  };

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

  const handleDirectApprove = (app: HumanitarianApplication) => {
    approveApplication(app.id, app.amountRequestedUSD);
  };

  const handleDirectReject = (app: HumanitarianApplication) => {
    rejectApplication(app.id, 'Application does not meet current funding cohort criteria.');
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
    link.setAttribute('download', `WHFS_Aid_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported aid applications table to CSV', 'success');
  };

  // 1. PROTECTED ROUTE GATEWAY: Require Admin Authentication
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-md w-full space-y-6 animate-in fade-in">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#0a1f38] text-amber-400 flex items-center justify-center mx-auto shadow-md ring-8 ring-amber-400/10">
              <ShieldCheck className="w-9 h-9 text-amber-400" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Worldwide Humanitarian Foundation Support
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#0a1f38]">
              Executive Admin Login
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Protected /admin route. Access restricted to authorized Foundation Officers & Board Reviewers.
            </p>
          </div>

          {/* Secure Login Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Credentials Callout Card */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[11px] text-amber-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Official Admin Credentials
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
                >
                  Auto-Fill Credentials
                </button>
              </div>
              <div className="font-mono text-[11px] space-y-0.5 pt-1 text-slate-800 bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                <p>Email: <strong className="text-[#0a1f38]">admin@whfs.org</strong></p>
                <p>Password: <strong className="text-[#0a1f38]">WHFS2026!</strong></p>
              </div>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Administrator Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@whfs.org"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] focus:ring-1 focus:ring-[#0a1f38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Password *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="WHFS2026!"
                    className="w-full pl-9 pr-16 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] focus:ring-1 focus:ring-[#0a1f38]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 bg-[#0a1f38] hover:bg-[#133e87] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>{isLoggingIn ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Homepage</span>
              </button>
            </div>

          </div>

          <p className="text-[11px] text-center text-slate-400">
            Protected Admin Route · WHFS International Secretariat Geneva
          </p>
        </div>
      </div>
    );
  }

  // 2. PROTECTED ADMIN DASHBOARD (When Authenticated as Admin)
  return (
    <div className="space-y-8 pb-24">
      
      {/* Top Admin Header Bar */}
      <section className="bg-[#0a1f38] text-white pt-8 pb-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Executive Administration Console · /admin</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Worldwide Aid Applications Dashboard
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-semibold">● Session Active</span>
                <span aria-hidden="true">·</span>
                <span>Administrator: <strong>{currentUser.email}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Geneva International Secretariat</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveTab('home')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Public Website</span>
              </button>

              {onOpenFirebaseModal && (
                <button
                  onClick={onOpenFirebaseModal}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <span>Firestore Rules</span>
                </button>
              )}

              <button
                onClick={exportApplicationsCSV}
                className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={logout}
                className="px-3 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-300" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>

          {/* STATS STRIP: Total Applications, Lives Impacted, Donations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            
            {/* Stat 1: Total Applications */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xs flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">
                  Total Applications
                </span>
                <span className="text-3xl font-mono font-bold text-white mt-1 block tabular-nums">
                  {stats.totalApplications}
                </span>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">{stats.pendingReview} Pending</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-bold">{stats.approvedOrDisbursed} Approved</span>
                </div>
              </div>
              <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 2: Lives Impacted */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xs flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">
                  Lives Impacted
                </span>
                <span className="text-3xl font-mono font-bold text-emerald-400 mt-1 block tabular-nums">
                  {stats.livesImpacted}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Beneficiaries across 52 nations
                </span>
              </div>
              <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 3: Donations */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xs flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">
                  Total Donations
                </span>
                <span className="text-3xl font-mono font-bold text-amber-400 mt-1 block tabular-nums">
                  ${stats.totalDonationsUSD.toLocaleString()} USD
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {donations.length} Philanthropic contributions
                </span>
              </div>
              <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400">
                <HeartHandshake className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 4: Aid Disbursed */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xs flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">
                  Grants Disbursed
                </span>
                <span className="text-3xl font-mono font-bold text-white mt-1 block tabular-nums">
                  ${stats.totalDisbursedUSD.toLocaleString()} USD
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block font-medium">
                  94.2% Frontline efficiency ratio
                </span>
              </div>
              <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Admin Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveDashboardTab('applications')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'applications'
                ? 'border-[#0a1f38] text-[#0a1f38] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Aid Applications Table ({applications.length})
          </button>
          <button
            onClick={() => setActiveDashboardTab('donations')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'donations'
                ? 'border-[#0a1f38] text-[#0a1f38] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Donations Ledger ({donations.length})
          </button>
          <button
            onClick={() => setActiveDashboardTab('firebase')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'firebase'
                ? 'border-[#0a1f38] text-[#0a1f38] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Firebase & Firestore Architecture
          </button>
        </div>

        {/* Tab 1: Applications Table & Direct Actions */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            
            {/* Search & Filter Toolbar */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, applicant name, or country..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden font-medium"
                >
                  <option value="all">All Programmes</option>
                  <option value="education">Education Support</option>
                  <option value="humanitarian">Humanitarian Relief</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted (Intake)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Committee Evaluation">Committee Evaluation</option>
                  <option value="Approved">Approved</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Needs Clarification">Needs Clarification</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  onClick={refreshData}
                  title="Reload Registry Seed"
                  className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Applications Table (Desktop) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Application ID</th>
                      <th className="py-3 px-4">Applicant & Location</th>
                      <th className="py-3 px-4">Grant Programme</th>
                      <th className="py-3 px-4">Funding Requested</th>
                      <th className="py-3 px-4">Decision Status</th>
                      <th className="py-3 px-4 text-center">Approve / Reject Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* ID & Date */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0a1f38]">
                          {app.id}
                          <span className="block font-sans text-[10px] text-slate-400 font-normal">
                            {app.createdAt.split('T')[0]}
                          </span>
                        </td>

                        {/* Applicant & Country */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{app.fullName}</p>
                          <p className="text-[11px] text-slate-500">{app.country} · {app.region}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{app.email}</p>
                        </td>

                        {/* Programme */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="font-semibold text-slate-800 block truncate">{app.programmeName}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">{app.programmeCategory}</span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-slate-900">${app.amountRequestedUSD.toLocaleString()}</span>
                          {app.amountAwardedUSD ? (
                            <span className="block text-[11px] text-emerald-700 font-extrabold">
                              Awarded: ${app.amountAwardedUSD.toLocaleString()}
                            </span>
                          ) : null}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md ${
                            app.status === 'Approved' || app.status === 'Disbursed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : app.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : app.status === 'Needs Clarification'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}>
                            {app.status}
                          </span>
                        </td>

                        {/* Direct Working Actions: Approve, Reject, Evaluate */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            
                            {/* APPROVE BUTTON */}
                            <button
                              onClick={() => handleDirectApprove(app)}
                              title="Approve this aid application"
                              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 ${
                                app.status === 'Approved' || app.status === 'Disbursed'
                                  ? 'bg-emerald-100 text-emerald-800 opacity-60 cursor-default'
                                  : 'bg-[#059669] hover:bg-[#047857] text-white shadow-xs'
                              }`}
                              disabled={app.status === 'Approved' || app.status === 'Disbursed'}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            {/* REJECT BUTTON */}
                            <button
                              onClick={() => handleDirectReject(app)}
                              title="Reject this aid application"
                              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 ${
                                app.status === 'Rejected'
                                  ? 'bg-rose-100 text-rose-800 opacity-60 cursor-default'
                                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                              }`}
                              disabled={app.status === 'Rejected'}
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>

                            {/* EVALUATE / DOSSIER BUTTON */}
                            <button
                              onClick={() => handleOpenReview(app)}
                              title="Inspect full dossier and documents"
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 border border-slate-300"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                              <span>Dossier</span>
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet Cards View (with Approve/Reject buttons) */}
              <div className="lg:hidden divide-y divide-slate-100 p-3 space-y-3">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3 text-xs">
                    
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#0a1f38] text-sm">{app.id}</span>
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
                      <p className="font-bold text-slate-900 text-sm">{app.fullName}</p>
                      <p className="text-[11px] text-slate-500">{app.country} · {app.region}</p>
                      <p className="text-xs text-[#0a1f38] font-semibold mt-1">{app.programmeName}</p>
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono pt-1 border-t border-slate-200">
                      <span className="text-slate-600">Requested: ${app.amountRequestedUSD.toLocaleString()}</span>
                      {app.amountAwardedUSD && (
                        <span className="text-emerald-700 font-bold">Awarded: ${app.amountAwardedUSD.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button
                        onClick={() => handleDirectApprove(app)}
                        disabled={app.status === 'Approved' || app.status === 'Disbursed'}
                        className="py-2.5 px-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleDirectReject(app)}
                        disabled={app.status === 'Rejected'}
                        className="py-2.5 px-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleOpenReview(app)}
                        className="py-2.5 px-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {filteredApplications.length === 0 && (
                <div className="p-12 text-center text-slate-500 text-xs">
                  No applications found matching the selected search and filter criteria.
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
                  Verified Philanthropic Contributions Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time record of incoming donor gifts, currency conversions, and generated tax receipts.
                </p>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                Total Received: ${stats.totalDonationsUSD.toLocaleString()} USD
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Donor / Trust</th>
                    <th className="py-3 px-4">Cause Designation</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80">
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
                        ${d.amount.toLocaleString()} {d.currency}
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
                  Firebase Authentication & Cloud Firestore Integration Status
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Database architecture ready for live deployment with secure role-based rules.
                </p>
              </div>
              {onOpenFirebaseModal && (
                <button
                  onClick={onOpenFirebaseModal}
                  className="px-4 py-2 bg-[#0a1f38] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Inspect Full firestore.rules
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-[#0a1f38] block text-sm">Firestore Collections Mapping</span>
                <p className="text-slate-600 leading-relaxed">
                  The application is configured to synchronize directly with the following root collections:
                </p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-slate-700">
                  <li><code>/humanitarian_applications/{'{id}'}</code></li>
                  <li><code>/users/{'{userId}'}</code></li>
                  <li><code>/donations/{'{donationId}'}</code></li>
                  <li><code>/programmes/{'{programmeId}'}</code></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-[#0a1f38] block text-sm">Role-Based Access Enforcement</span>
                <p className="text-slate-600 leading-relaxed">
                  The admin role (credentials <code>admin@whfs.org</code>) maps to the Firebase custom claim <code className="font-mono">admin: true</code>, granting full write permissions for status transitions, award amounts, and fund releases.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Application Evaluation Dossier Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-[#0a1f38] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-amber-400">
                  Grants Committee Assessment Dossier
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
                  <span className="text-slate-400 block">Applicant & Location:</span>
                  <span className="font-bold text-slate-900">{selectedApp.fullName} ({selectedApp.country})</span>
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
                  <span className="text-slate-400 block">Institution / Community:</span>
                  <span className="font-bold text-slate-900">{selectedApp.institutionOrCommunity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Vulnerability Need:</span>
                  <span className="font-bold text-amber-700">{selectedApp.financialNeedLevel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Requested Amount:</span>
                  <span className="font-bold font-mono text-slate-900">${selectedApp.amountRequestedUSD.toLocaleString()} USD</span>
                </div>
              </div>

              {/* Statement */}
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Applicant Statement of Hardship:
                </span>
                <p className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 italic leading-relaxed">
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
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDirectReject(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
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
        </div>
      )}

    </div>
  );
};
