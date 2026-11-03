import React, { useState, useEffect } from 'react';
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
  Check,
  Coins,
  Globe,
  CreditCard,
  ArrowDownToLine,
  ArrowUpRight,
  Wallet,
  Banknote,
  Landmark,
  Smartphone,
  Send,
  History,
  SlidersHorizontal,
  Filter,
  Clock,
  Building2,
  Sparkles
} from 'lucide-react';
import { 
  HumanitarianApplication, 
  ApplicationStatus,
  RegistrationFeePayment,
  PayoutAccountSettings,
  WithdrawalRecord
} from '../types';
import { getCurrency, formatFundingDisplay } from '../data/allCurrencies';

interface AdminProps {
  onOpenFirebaseModal?: () => void;
}

export const Admin: React.FC<AdminProps> = ({ onOpenFirebaseModal }) => {
  const { 
    applications, 
    donations, 
    payments,
    withdrawals,
    payoutSettings,
    financialMetrics,
    updatePaymentStatus,
    updatePayoutSettings,
    requestWithdrawal,
    updateWithdrawalStatus,
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
  const [activeTab, setActiveDashboardTab] = useState<'applications' | 'payments' | 'donations' | 'firebase'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<HumanitarianApplication | null>(null);

  // Payments & Withdrawals State
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [paymentCountryFilter, setPaymentCountryFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [activePaymentSubTab, setActivePaymentSubTab] = useState<'collection' | 'withdrawal' | 'settings'>('collection');

  // Payment Methods Setup Form State
  const [payoutForm, setPayoutForm] = useState<PayoutAccountSettings>(payoutSettings);
  const [isSavingPayoutSettings, setIsSavingPayoutSettings] = useState(false);

  // Keep payout form in sync when settings update
  useEffect(() => {
    if (payoutSettings) {
      setPayoutForm(payoutSettings);
    }
  }, [payoutSettings]);

  // Withdrawal Center State & Modal
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [withdrawAmountUSD, setWithdrawAmountUSD] = useState<number>(250);
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawalRecord['method']>('Airtel Money');
  const [withdrawRecipient, setWithdrawRecipient] = useState<string>('Kondwani Mulenga (Disbursement Liaison)');
  const [withdrawAccount, setWithdrawAccount] = useState<string>(payoutSettings?.airtelMoneyNumber || '+260 97 458 9210');
  const [withdrawNotes, setWithdrawNotes] = useState<string>('Disbursal for Lusaka students equipment and transit allowances');
  const [isExecutingWithdrawal, setIsExecutingWithdrawal] = useState(false);

  // Update destination account field dynamically when method changes
  const handleWithdrawMethodChange = (newMethod: WithdrawalRecord['method']) => {
    setWithdrawMethod(newMethod);
    if (newMethod === 'Airtel Money') {
      setWithdrawAccount(payoutSettings.airtelMoneyNumber || '+260 97 458 9210');
    } else if (newMethod === 'MTN Mobile Money') {
      setWithdrawAccount(payoutSettings.mtnMoneyNumber || '+260 96 312 8904');
    } else if (newMethod === 'Bank Transfer') {
      setWithdrawAccount(`${payoutSettings.bankName} - Acc #${payoutSettings.bankAccountNumber}`);
    } else if (newMethod === 'PayPal') {
      setWithdrawAccount(payoutSettings.paypalEmail || 'treasury@whfs.org');
    } else if (newMethod === 'M-Pesa') {
      setWithdrawAccount(payoutSettings.mpesaNumber || '+254 712 345 678');
    }
  };

  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmountUSD || withdrawAmountUSD <= 0) {
      showToast('Please specify a positive withdrawal amount.', 'error');
      return;
    }
    if (withdrawAmountUSD > financialMetrics.currentBalanceUSD) {
      showToast(`Cannot withdraw $${withdrawAmountUSD}. Available balance is $${financialMetrics.currentBalanceUSD.toLocaleString()} USD`, 'error');
      return;
    }
    if (!withdrawAccount.trim()) {
      showToast('Please specify a destination account or phone number.', 'error');
      return;
    }

    setIsExecutingWithdrawal(true);
    try {
      await requestWithdrawal({
        amountUSD: Number(withdrawAmountUSD),
        method: withdrawMethod,
        destinationAccount: withdrawAccount,
        recipientName: withdrawRecipient || 'Executive Payout Officer',
        notes: withdrawNotes
      });
      setIsWithdrawalModalOpen(false);
    } catch {
      // Toast message is handled inside requestWithdrawal
    } finally {
      setIsExecutingWithdrawal(false);
    }
  };

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
  const isAuthorizedAdmin = currentUser?.email === 'admin@whfs.org' || currentUser?.email === 'kipchirchiremmanuel5000@gmail.com' || currentUser?.role === 'admin';
  if (!currentUser || !isAuthorizedAdmin) {
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
            
            {/* Officer Access Notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-[#0a1f38]">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Authorized Administrative Access Only</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Please enter your designated foundation email (<span className="font-semibold text-slate-700">kipchirchiremmanuel5000@gmail.com</span>) and administrator password to authenticate.
              </p>
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
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveDashboardTab('applications')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'applications'
                ? 'border-[#0a1f38] text-[#0a1f38] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Aid Applications Table ({applications.length})
          </button>
          <button
            onClick={() => setActiveDashboardTab('payments')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'border-[#0a1f38] text-[#0a1f38] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Payments & Withdrawals</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
              ${financialMetrics.currentBalanceUSD.toLocaleString()}
            </span>
          </button>
          <button
            onClick={() => setActiveDashboardTab('donations')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'donations'
                ? 'border-[#0a1f38] text-[#0a1f38] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Donations Ledger ({donations.length})
          </button>
          <button
            onClick={() => setActiveDashboardTab('firebase')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
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
                      <th className="py-3 px-4">Funding Requested (USD & Local)</th>
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

                        {/* Applicant & Country with Flag */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{app.countryFlag || getCurrency(app.country).flag}</span>
                            <span>{app.fullName}</span>
                          </p>
                          <p className="text-[11px] text-slate-500">{app.country} · {app.region}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{app.email}</p>
                        </td>

                        {/* Programme */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="font-semibold text-slate-800 block truncate">{app.programmeName}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">{app.programmeCategory}</span>
                        </td>

                        {/* Amount in USD and Local Currency */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-900">${app.amountRequestedUSD.toLocaleString()} USD</div>
                          <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-0.5 inline-block">
                            {app.localCurrencyDisplay || formatFundingDisplay(app.amountRequestedUSD, app.country)}
                          </div>
                          {app.amountAwardedUSD ? (
                            <span className="block text-[11px] text-emerald-700 font-extrabold mt-0.5">
                              Awarded: ${app.amountAwardedUSD.toLocaleString()} USD
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

        {/* Tab 2: Payments & Withdrawals Dashboard */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            
            {/* Executive Treasury Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Available Balance & Action */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0a1f38] to-[#133e87] text-white shadow-md relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Current Treasury Balance</span>
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-400/30">
                      1 USD = 27 ZMW 🇿🇲
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-mono font-black text-white tracking-tight block">
                      ${financialMetrics.currentBalanceUSD.toLocaleString()} USD
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-300 block mt-0.5">
                      K {financialMetrics.currentBalanceZMW.toLocaleString()} ZMW
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 mt-1 block">
                    Available for immediate disbursement and regional operations
                  </span>
                </div>

                <div className="pt-4 mt-2 border-t border-white/10">
                  <button
                    onClick={() => setIsWithdrawalModalOpen(true)}
                    className="w-full py-2.5 px-3 bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                    <span>Withdraw Funds</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Total Registration Fees Collected */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Fees Collected
                    </span>
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                      <Coins className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-mono font-extrabold text-slate-900 block">
                      ${financialMetrics.totalCollectedUSD.toLocaleString()} USD
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-700 block mt-0.5">
                      K {financialMetrics.totalCollectedZMW.toLocaleString()} ZMW
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold">{financialMetrics.paidCount} Verified</span>
                    <span>·</span>
                    <span className="text-amber-700 font-bold">{financialMetrics.pendingCount} Pending</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-100">
                  Document verification fees across 52 countries
                </div>
              </div>

              {/* Card 3: Total Withdrawn */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Disbursed Payouts
                    </span>
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-mono font-extrabold text-slate-900 block">
                      ${financialMetrics.totalWithdrawnUSD.toLocaleString()} USD
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-700 block mt-0.5">
                      K {financialMetrics.totalWithdrawnZMW.toLocaleString()} ZMW
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    {withdrawals.length} Successful institutional payouts
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-100">
                  Via Airtel Money, MTN MoMo & Bank Wire
                </div>
              </div>

              {/* Card 4: Configured Payout Channels */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Active Receiving Channels
                    </span>
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                      <Landmark className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-slate-600">Airtel Money 🇿🇲:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[120px]">{payoutSettings.airtelMoneyNumber}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-slate-600">MTN MoMo 🇿🇲:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[120px]">{payoutSettings.mtnMoneyNumber}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-slate-600">Zanaco Bank:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[120px]">{payoutSettings.bankAccountNumber}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActivePaymentSubTab('settings')}
                  className="text-xs text-[#0a1f38] hover:underline font-bold text-left pt-2 border-t border-slate-100 cursor-pointer flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Configure Payment Methods →</span>
                </button>
              </div>

            </div>

            {/* Sub-navigation inside Payments */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-2 text-xs font-bold">
              <button
                onClick={() => setActivePaymentSubTab('collection')}
                className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activePaymentSubTab === 'collection'
                    ? 'bg-[#0a1f38] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Payment Collection Ledger ({payments.length})</span>
              </button>

              <button
                onClick={() => setActivePaymentSubTab('withdrawal')}
                className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activePaymentSubTab === 'withdrawal'
                    ? 'bg-[#0a1f38] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-400" />
                <span>Withdrawal Center ({withdrawals.length})</span>
              </button>

              <button
                onClick={() => setActivePaymentSubTab('settings')}
                className={`py-2 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activePaymentSubTab === 'settings'
                    ? 'bg-[#0a1f38] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <span>Payment Methods Setup</span>
              </button>
            </div>

            {/* SUB-VIEW 1: Payment Collection Ledger */}
            {activePaymentSubTab === 'collection' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
                
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={paymentSearchQuery}
                      onChange={(e) => setPaymentSearchQuery(e.target.value)}
                      placeholder="Search applicant name, email, or transaction reference..."
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Country & Currency Filter */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={paymentCountryFilter}
                        onChange={(e) => setPaymentCountryFilter(e.target.value)}
                        className="py-2 px-2.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden font-medium"
                      >
                        <option value="all">All Countries & Currencies</option>
                        <option value="Zambia">🇿🇲 Zambia (ZMW - K)</option>
                        <option value="Kenya">🇰🇪 Kenya (KES - KSh)</option>
                        <option value="Nigeria">🇳🇬 Nigeria (NGN - ₦)</option>
                        <option value="Philippines">🇵🇭 Philippines (PHP - ₱)</option>
                        <option value="Ukraine">🇺🇦 Ukraine (UAH - ₴)</option>
                        <option value="Jordan">🇯🇴 Jordan (JOD - JD)</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={paymentStatusFilter}
                        onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        className="py-2 px-2.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden font-medium"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Paid">Paid / Verified</option>
                        <option value="Pending Verification">Pending Verification</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table of all payments */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Transaction Ref & Date</th>
                        <th className="py-3 px-4">Applicant & Country</th>
                        <th className="py-3 px-4">Amount Paid (Local + USD)</th>
                        <th className="py-3 px-4">Payment Method / Channel</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Audit Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments
                        .filter(p => {
                          const matchesSearch = 
                            p.applicantName.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                            p.applicantEmail.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                            p.transactionReference.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                            p.id.toLowerCase().includes(paymentSearchQuery.toLowerCase());
                          const matchesCountry = paymentCountryFilter === 'all' || p.country.toLowerCase() === paymentCountryFilter.toLowerCase();
                          const matchesStatus = paymentStatusFilter === 'all' || p.status === paymentStatusFilter;
                          return matchesSearch && matchesCountry && matchesStatus;
                        })
                        .map(payment => (
                          <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                            
                            {/* Ref & Date */}
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0a1f38]">
                              <span>{payment.transactionReference}</span>
                              <span className="block font-sans text-[10px] text-slate-400 font-normal">
                                {payment.date} · {payment.id}
                              </span>
                            </td>

                            {/* Applicant Name & Country */}
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{payment.countryFlag}</span>
                                <span>{payment.applicantName}</span>
                              </p>
                              <p className="text-[11px] text-slate-500">{payment.country}</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{payment.applicantEmail}</p>
                            </td>

                            {/* Amount Paid (local + USD) */}
                            <td className="py-3.5 px-4 font-mono">
                              <span className="font-extrabold text-[#059669] text-sm block">
                                {payment.currencySymbol} {payment.amountLocal.toLocaleString()} {payment.currencyCode}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                (${payment.amountUSD.toLocaleString()} USD)
                              </span>
                            </td>

                            {/* Payment Method / Channel */}
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                                {payment.paymentMethod.includes('Airtel') || payment.paymentMethod.includes('MTN') || payment.paymentMethod.includes('M-Pesa') ? (
                                  <Smartphone className="w-3 h-3 text-emerald-600" />
                                ) : payment.paymentMethod.includes('Bank') ? (
                                  <Landmark className="w-3 h-3 text-blue-600" />
                                ) : (
                                  <CreditCard className="w-3 h-3 text-purple-600" />
                                )}
                                <span>{payment.paymentMethod}</span>
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md ${
                                payment.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : payment.status === 'Pending Verification'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-slate-100 text-slate-700'
                              }`}>
                                {payment.status}
                              </span>
                            </td>

                            {/* Verify / Toggle Action */}
                            <td className="py-3.5 px-4 text-center">
                              {payment.status === 'Pending Verification' ? (
                                <button
                                  onClick={() => updatePaymentStatus(payment.id, 'Paid')}
                                  className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Verify & Confirm</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => updatePaymentStatus(payment.id, 'Pending Verification')}
                                  title="Toggle status back to Pending"
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium rounded border border-slate-300 cursor-pointer"
                                >
                                  Mark Pending
                                </button>
                              )}
                            </td>

                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {payments.length === 0 && (
                  <div className="p-12 text-center text-slate-500 text-xs">
                    <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No payment records yet</p>
                    <p className="text-slate-400 mt-0.5">When real applicants submit registration fees (Airtel, MTN, M-Pesa, Bank, PayPal), records will populate here automatically.</p>
                  </div>
                )}

              </div>
            )}

            {/* SUB-VIEW 2: Withdrawal Center */}
            {activePaymentSubTab === 'withdrawal' && (
              <div className="space-y-6">
                
                {/* Header Banner */}
                <div className="p-6 bg-gradient-to-r from-[#0a1f38] via-[#133e87] to-[#0a1f38] rounded-2xl text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block">
                      Institutional Payouts & Disbursal Window
                    </span>
                    <h3 className="text-xl font-bold font-serif text-white mt-0.5">
                      Available Balance: ${financialMetrics.currentBalanceUSD.toLocaleString()} USD (K {financialMetrics.currentBalanceZMW.toLocaleString()} ZMW)
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Treasury balances accumulate through verified applicant intake fees and can be released to regional bank accounts, Airtel Money, MTN MoMo, or PayPal.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsWithdrawalModalOpen(true)}
                    className="px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                    <span>Withdraw Funds</span>
                  </button>
                </div>

                {/* Withdrawals Transaction History Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#0a1f38] flex items-center gap-1.5">
                        <History className="w-4 h-4 text-emerald-600" />
                        <span>Withdrawals & Payout Transaction History ({withdrawals.length})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Official audit record of all funds withdrawn and disbursed to authorized field coordinators and partners.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-3 px-4">Payout ID & Date</th>
                          <th className="py-3 px-4">Disbursed Amount</th>
                          <th className="py-3 px-4">Payout Method & Account</th>
                          <th className="py-3 px-4">Recipient & Authorizer</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Reference Code</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {withdrawals.map((w) => (
                          <tr key={w.id} className="hover:bg-slate-50/80">
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0a1f38]">
                              <span>{w.id}</span>
                              <span className="block font-sans text-[10px] text-slate-400 font-normal">{w.date}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono">
                              <span className="text-sm font-extrabold text-[#0a1f38] block">${w.amountUSD.toLocaleString()} USD</span>
                              <span className="text-[11px] font-bold text-emerald-700 block">K {w.amountZMW.toLocaleString()} ZMW</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-900 block">{w.method}</span>
                              <span className="text-[11px] font-mono text-slate-500 block truncate max-w-[200px]">{w.destinationAccount}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block">{w.recipientName}</span>
                              <span className="text-[10px] text-slate-400 block">By: {w.requestedBy}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md ${
                                w.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : w.status === 'Processing'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {w.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700 text-[11px]">
                              {w.referenceCode}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {withdrawals.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      <p className="font-semibold text-slate-700">No withdrawal records yet</p>
                      <p className="text-slate-400 mt-0.5">Disbursement ledger records will appear here as treasury payouts are initiated.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SUB-VIEW 3: Payment Methods Setup Form */}
            {activePaymentSubTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#0a1f38] flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                    <span>Payment Methods Setup (Where Money Should Go)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Configure the receiving destination accounts shown to applicants when paying registration fees and used for authorized treasury withdrawals.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  updatePayoutSettings(payoutForm);
                }} className="space-y-6">
                  
                  {/* Section 1: Mobile Money Receivers */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <span className="text-xs uppercase tracking-wider text-[#0a1f38] font-bold flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>1. Mobile Money Accounts (Zambia & Regional East Africa)</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Airtel Money Number (Zambia 🇿🇲) *
                        </label>
                        <input
                          type="text"
                          required
                          value={payoutForm.airtelMoneyNumber}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, airtelMoneyNumber: e.target.value }))}
                          placeholder="+260 97 458 9210"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Airtel Account / Merchant Name
                        </label>
                        <input
                          type="text"
                          value={payoutForm.airtelAccountName}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, airtelAccountName: e.target.value }))}
                          placeholder="WHFS Zambia Relief Operations"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          MTN Money Number (for Zambia 🇿🇲) *
                        </label>
                        <input
                          type="text"
                          required
                          value={payoutForm.mtnMoneyNumber}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, mtnMoneyNumber: e.target.value }))}
                          placeholder="+260 96 312 8904"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          MTN Account / MoMo Name
                        </label>
                        <input
                          type="text"
                          value={payoutForm.mtnAccountName}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, mtnAccountName: e.target.value }))}
                          placeholder="WHFS Regional Grants Desk"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          M-Pesa Number (Kenya 🇰🇪)
                        </label>
                        <input
                          type="text"
                          value={payoutForm.mpesaNumber}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, mpesaNumber: e.target.value }))}
                          placeholder="+254 712 345 678"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Airtel Kenya Number (Admin Samuel Soi 🇰🇪)
                        </label>
                        <input
                          type="text"
                          value={payoutForm.airtelKenyaNumber || '0762641585'}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, airtelKenyaNumber: e.target.value }))}
                          placeholder="0762641585"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Airtel Kenya Account Name
                        </label>
                        <input
                          type="text"
                          value={payoutForm.airtelKenyaAccountName || 'Samuel Soi'}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, airtelKenyaAccountName: e.target.value }))}
                          placeholder="Samuel Soi"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Bank Account Details */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <span className="text-xs uppercase tracking-wider text-[#0a1f38] font-bold flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-blue-600" />
                      <span>2. Institutional Bank Account (Zambia & International Wires)</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={payoutForm.bankName}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, bankName: e.target.value }))}
                          placeholder="Zambia National Commercial Bank (Zanaco)"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Account Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={payoutForm.bankAccountName}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, bankAccountName: e.target.value }))}
                          placeholder="Worldwide Humanitarian Foundation Support Trust"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={payoutForm.bankAccountNumber}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                          placeholder="048201948201"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Branch Name / Location
                        </label>
                        <input
                          type="text"
                          value={payoutForm.bankBranch}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, bankBranch: e.target.value }))}
                          placeholder="Lusaka Corporate Branch, Cairo Road"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          SWIFT / BIC Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={payoutForm.bankSwiftCode}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, bankSwiftCode: e.target.value }))}
                          placeholder="ZNCOZMLU"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38] font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: PayPal & Stripe */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <span className="text-xs uppercase tracking-wider text-[#0a1f38] font-bold flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span>3. PayPal & Card Payment Gateways</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          PayPal Receiving Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={payoutForm.paypalEmail}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, paypalEmail: e.target.value }))}
                          placeholder="treasury@whfs.org"
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-6">
                        <input
                          type="checkbox"
                          id="stripeActive"
                          checked={payoutForm.stripeActive}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, stripeActive: e.target.checked }))}
                          className="rounded text-[#059669] focus:ring-[#059669] cursor-pointer"
                        />
                        <label htmlFor="stripeActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                          Enable Stripe / Direct Card Gateway for Global Intake
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSavingPayoutSettings}
                      className="px-6 py-3 bg-[#0a1f38] hover:bg-[#133e87] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>{isSavingPayoutSettings ? 'Saving Settings...' : 'Save Payment Methods & Receiving Accounts'}</span>
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        )}

        {/* Tab 3: Donations Ledger */}
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
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <span>{selectedApp.countryFlag || getCurrency(selectedApp.country).flag}</span>
                    <span>{selectedApp.fullName} ({selectedApp.country})</span>
                  </span>
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
                  <span className="text-slate-400 block">Requested Amount (USD & Local):</span>
                  <span className="font-bold font-mono text-slate-900 block">${selectedApp.amountRequestedUSD.toLocaleString()} USD</span>
                  <span className="text-[11px] font-semibold text-emerald-700 font-mono block">
                    {selectedApp.localCurrencyDisplay || formatFundingDisplay(selectedApp.amountRequestedUSD, selectedApp.country)}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">
                    Official Exchange Rate: 1 USD = {selectedApp.localCurrencyRate || getCurrency(selectedApp.country).rate} {selectedApp.localCurrencyCode || getCurrency(selectedApp.country).code}
                  </span>
                  <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Registration Fee: {selectedApp.registrationFeeLocal || `${getCurrency(selectedApp.country).symbol} ${(15 * getCurrency(selectedApp.country).rate).toLocaleString()} ${getCurrency(selectedApp.country).code}`} ($15 USD)
                  </span>
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

      {/* 3. WITHDRAWAL FUNDS MODAL */}
      {isWithdrawalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0a1f38] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <ArrowDownToLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-base text-white">Execute Treasury Withdrawal</h3>
                  <p className="text-xs text-slate-300">Disburse funds to authorized mobile money or bank accounts</p>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawalModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleExecuteWithdrawal} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Current Balance Banner */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Available Balance</span>
                  <span className="text-base font-extrabold text-[#0a1f38] font-mono">
                    ${financialMetrics.currentBalanceUSD.toLocaleString()} USD
                  </span>
                  <span className="text-xs font-bold text-emerald-700 block font-mono">
                    (K {financialMetrics.currentBalanceZMW.toLocaleString()} ZMW 🇿🇲)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Official Rate</span>
                  <span className="text-xs font-bold text-slate-700 font-mono">1 USD = 27 ZMW</span>
                </div>
              </div>

              {/* Amount to Withdraw */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-800">
                    Amount to Withdraw ($ USD) *
                  </label>
                  <span className="text-[11px] font-bold text-emerald-700 font-mono">
                    = K {Math.round((withdrawAmountUSD || 0) * 27).toLocaleString()} ZMW
                  </span>
                </div>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min="1"
                    max={financialMetrics.currentBalanceUSD}
                    required
                    value={withdrawAmountUSD || ''}
                    onChange={(e) => setWithdrawAmountUSD(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                  />
                </div>
                {/* Quick preset buttons */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Presets:</span>
                  {[50, 100, 250, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWithdrawAmountUSD(preset)}
                      className={`px-2.5 py-1 text-[11px] rounded border font-mono font-semibold transition-colors cursor-pointer ${
                        withdrawAmountUSD === preset
                          ? 'bg-[#0a1f38] text-white border-[#0a1f38]'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWithdrawAmountUSD(financialMetrics.currentBalanceUSD)}
                    className="px-2.5 py-1 text-[11px] rounded border font-mono font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 cursor-pointer"
                  >
                    Max (${financialMetrics.currentBalanceUSD.toLocaleString()})
                  </button>
                </div>
              </div>

              {/* Payout Method */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Select Payout Method *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Airtel Money', 'MTN Mobile Money', 'Bank Transfer', 'PayPal', 'M-Pesa'] as WithdrawalRecord['method'][]).map((method) => {
                    const isSelected = withdrawMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => handleWithdrawMethodChange(method)}
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between text-xs ${
                          isSelected
                            ? 'border-[#0a1f38] bg-[#0a1f38]/5 ring-1 ring-[#0a1f38] text-[#0a1f38] font-bold'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="truncate">{method}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Destination Account / Phone Number */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Destination Account / Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  placeholder="e.g. +260 97 458 9210 or Zanaco Acc 048201948201"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-[#0a1f38]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Auto-populated from configured Treasury payment methods. You may also edit for one-off field dispatches.
                </p>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Recipient Name / Authorized Field Liaison *
                </label>
                <input
                  type="text"
                  required
                  value={withdrawRecipient}
                  onChange={(e) => setWithdrawRecipient(e.target.value)}
                  placeholder="e.g. Kondwani Mulenga (Disbursement Liaison)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                />
              </div>

              {/* Notes / Purpose */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Disbursal Purpose / Reference Memo
                </label>
                <input
                  type="text"
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  placeholder="e.g. Field stipend for Copperbelt emergency aid team"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#0a1f38]"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWithdrawalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isExecutingWithdrawal || !withdrawAmountUSD || withdrawAmountUSD <= 0 || withdrawAmountUSD > financialMetrics.currentBalanceUSD}
                  className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white text-xs font-bold uppercase rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isExecutingWithdrawal ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Payout...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Confirm & Withdraw Funds</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
