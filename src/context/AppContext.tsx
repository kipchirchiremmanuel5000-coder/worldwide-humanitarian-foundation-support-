import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  HumanitarianApplication, 
  DonationRecord, 
  ApplicationStatus,
  ProgrammeCategory,
  RegistrationFeePayment,
  PayoutAccountSettings,
  WithdrawalRecord
} from '../types';
import { 
  INITIAL_APPLICATIONS, 
  INITIAL_DONATIONS,
  DEFAULT_PAYOUT_SETTINGS,
  INITIAL_PAYMENTS,
  INITIAL_WITHDRAWALS
} from '../data/mockData';
import { 
  getCurrency, 
  formatFundingDisplay, 
  DEFAULT_REGISTRATION_FEE_USD 
} from '../data/allCurrencies';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface FinancialMetrics {
  totalCollectedUSD: number;
  totalCollectedZMW: number;
  totalWithdrawnUSD: number;
  totalWithdrawnZMW: number;
  currentBalanceUSD: number;
  currentBalanceZMW: number;
  paidCount: number;
  pendingCount: number;
}

interface AppContextType {
  currentUser: UserProfile | null;
  applications: HumanitarianApplication[];
  donations: DonationRecord[];
  payments: RegistrationFeePayment[];
  withdrawals: WithdrawalRecord[];
  payoutSettings: PayoutAccountSettings;
  financialMetrics: FinancialMetrics;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTrackingId: string | null;
  setSelectedTrackingId: (id: string | null) => void;
  preselectedProgramme: { name: string; category: ProgrammeCategory } | null;
  setPreselectedProgramme: (prog: { name: string; category: ProgrammeCategory } | null) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  login: (email: string, role?: 'applicant' | 'admin') => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, country: string, role?: 'applicant' | 'admin') => Promise<boolean>;
  logout: () => void;
  switchRoleDemo: (role: 'applicant' | 'admin') => void;
  submitApplication: (data: Partial<HumanitarianApplication>) => Promise<HumanitarianApplication>;
  updateApplicationStatus: (
    id: string, 
    status: ApplicationStatus, 
    officerNotes?: string, 
    amountAwardedUSD?: number
  ) => void;
  approveApplication: (id: string, amount?: number) => void;
  rejectApplication: (id: string, reason?: string) => void;
  recordDonation: (data: Omit<DonationRecord, 'id' | 'date' | 'receiptNumber'>) => Promise<DonationRecord>;
  recordRegistrationPayment: (payment: Partial<RegistrationFeePayment>) => Promise<RegistrationFeePayment>;
  updatePaymentStatus: (paymentId: string, status: RegistrationFeePayment['status']) => void;
  updatePayoutSettings: (newSettings: Partial<PayoutAccountSettings>) => void;
  requestWithdrawal: (data: {
    amountUSD: number;
    method: WithdrawalRecord['method'];
    destinationAccount: string;
    recipientName: string;
    notes?: string;
  }) => Promise<WithdrawalRecord>;
  updateWithdrawalStatus: (withdrawalId: string, status: WithdrawalRecord['status']) => void;
  refreshData: () => void;
  stats: {
    totalApplications: number;
    pendingReview: number;
    approvedOrDisbursed: number;
    totalDisbursedUSD: number;
    totalDonationsUSD: number;
    livesImpacted: string;
  };
}

const STORAGE_KEYS = {
  USER: 'whfs_auth_user',
  APPLICATIONS: 'whfs_applications_db',
  DONATIONS: 'whfs_donations_db',
  ADMIN_AUTH: 'whfs_admin_authenticated',
  PAYMENTS: 'whfs_payments_ledger',
  WITHDRAWALS: 'whfs_withdrawals_ledger',
  PAYOUT_SETTINGS: 'whfs_payout_settings'
};

// Automatic cleanup on load: Remove any legacy demo / mock data
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('demo_applicants');
    localStorage.removeItem('mock_payments');

    const CLEAN_REGISTRY_FLAG = 'whfs_clean_registry_v1';
    if (!localStorage.getItem(CLEAN_REGISTRY_FLAG)) {
      localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
      localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
      localStorage.removeItem(STORAGE_KEYS.WITHDRAWALS);
      localStorage.removeItem(STORAGE_KEYS.DONATIONS);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser && (savedUser.includes('amina.mwangi') || savedUser.includes('user-app-01'))) {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      }
      localStorage.setItem(CLEAN_REGISTRY_FLAG, 'true');
    }

    const CLEAN_PAYOUT_FLAG = 'whfs_clean_airtel_ke_v1';
    if (!localStorage.getItem(CLEAN_PAYOUT_FLAG)) {
      localStorage.removeItem(STORAGE_KEYS.PAYOUT_SETTINGS);
      localStorage.setItem(CLEAN_PAYOUT_FLAG, 'true');
    }
  } catch (e) {
    console.warn('Storage purge error:', e);
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [applications, setApplications] = useState<HumanitarianApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const [payments, setPayments] = useState<RegistrationFeePayment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
      return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
    } catch {
      return INITIAL_WITHDRAWALS;
    }
  });

  const [payoutSettings, setPayoutSettings] = useState<PayoutAccountSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYOUT_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_PAYOUT_SETTINGS;
    } catch {
      return DEFAULT_PAYOUT_SETTINGS;
    }
  });

  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin')) {
        return 'admin';
      }
      const hash = window.location.hash;
      if (hash === '#admin' || hash === '#/admin') {
        return 'admin';
      }
    }
    return 'home';
  });
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);
  const [preselectedProgramme, setPreselectedProgramme] = useState<{ name: string; category: ProgrammeCategory } | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Listen for browser navigation changes (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin') || window.location.hash === '#admin' || window.location.hash === '#/admin') {
        setActiveTabState('admin');
      } else {
        const route = path.replace('/', '').trim() || 'home';
        setActiveTabState(route);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      }
    } catch (e) {
      console.warn('Storage sync failed:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (e) {
      console.warn('Applications storage failed:', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
    } catch (e) {
      console.warn('Donations storage failed:', e);
    }
  }, [donations]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    const authorizedAdminEmails = ['admin@whfs.org', 'kipchirchiremmanuel5000@gmail.com'];
    if (authorizedAdminEmails.includes(normalizedEmail) && password === 'WHFS2026!') {
      const adminUser: UserProfile = {
        id: 'admin-whfs-01',
        name: normalizedEmail === 'kipchirchiremmanuel5000@gmail.com' ? 'Emmanuel Kipchirchir' : 'Executive Foundation Officer',
        email: normalizedEmail,
        role: 'admin',
        country: 'Switzerland',
        organization: 'WHFS International Board of Trustees',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      };
      setCurrentUser(adminUser);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      showToast('Admin authentication verified. Welcome, Executive Officer.', 'success');
      return true;
    } else {
      showToast('Invalid admin credentials. Use authorized email and password', 'error');
      return false;
    }
  };

  const login = async (email: string, role: 'applicant' | 'admin' = 'applicant'): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    let user: UserProfile;

    if (normalizedEmail === 'admin@whfs.org' || normalizedEmail === 'kipchirchiremmanuel5000@gmail.com' || (role === 'admin' && normalizedEmail.includes('whfs-aid.org'))) {
      user = {
        id: 'admin-whfs-01',
        name: normalizedEmail === 'kipchirchiremmanuel5000@gmail.com' ? 'Emmanuel Kipchirchir' : 'Executive Foundation Officer',
        email: normalizedEmail,
        role: 'admin',
        country: 'Switzerland',
        organization: 'WHFS International Board'
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      showToast('Welcome back, Foundation Officer', 'success');
    } else {
      user = {
        id: 'user-' + Math.random().toString(36).substring(2, 7),
        name: normalizedEmail.split('@')[0].replace(/[._]/g, ' ') || 'Applicant User',
        email: normalizedEmail,
        role: 'applicant',
        country: 'Global Beneficiary'
      };
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      showToast('Signed in successfully to Applicant Portal', 'success');
    }

    setCurrentUser(user);
    return true;
  };

  const register = async (name: string, email: string, country: string, role: 'applicant' | 'admin' = 'applicant'): Promise<boolean> => {
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      name,
      email: email.trim().toLowerCase(),
      country,
      role
    };
    setCurrentUser(newUser);
    showToast(`Account created successfully for ${name}`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    showToast('You have been signed out', 'info');
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  const switchRoleDemo = (role: 'applicant' | 'admin') => {
    if (role === 'admin') {
      const adminUser: UserProfile = {
        id: 'admin-whfs-01',
        name: 'Emmanuel Kipchirchir',
        email: 'kipchirchiremmanuel5000@gmail.com',
        role: 'admin',
        country: 'Switzerland'
      };
      setCurrentUser(adminUser);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      showToast('Switched to Administrator view', 'info');
    } else {
      setCurrentUser(null);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      showToast('Signed out of admin view', 'info');
    }
  };

  const submitApplication = async (data: Partial<HumanitarianApplication>): Promise<HumanitarianApplication> => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const countryName = data.country || 'Zambia';
    const regionCode = countryName.substring(0, 2).toUpperCase();
    const generatedId = `WHFS-2026-${regionCode}-${randomCode}`;
    const timestamp = new Date().toISOString();

    const curr = getCurrency(countryName);
    const usdAmount = Number(data.amountRequestedUSD) || 100;
    const localAmount = data.amountRequestedLocal || Math.round(usdAmount * curr.rate);
    const localFee = Math.round(DEFAULT_REGISTRATION_FEE_USD * curr.rate);
    const localDisplay = data.localCurrencyDisplay || formatFundingDisplay(usdAmount, countryName);
    const feeDisplay = data.registrationFeeLocal || `${curr.symbol} ${localFee.toLocaleString()} ${curr.code}`;

    const newApp: HumanitarianApplication = {
      id: generatedId,
      userId: currentUser?.id || 'guest-' + Date.now(),
      fullName: data.fullName || (currentUser?.name ?? 'Applicant'),
      email: data.email || (currentUser?.email ?? 'applicant@whfs.org'),
      phone: data.phone || '',
      dateOfBirth: data.dateOfBirth || '2000-01-01',
      gender: data.gender || 'Not specified',
      country: countryName,
      region: data.region || 'Metropolitan',
      address: data.address || '',
      programmeCategory: data.programmeCategory || 'education',
      programmeName: data.programmeName || 'Global Academic Scholarship Programme (GASP)',
      institutionOrCommunity: data.institutionOrCommunity || '',
      financialNeedLevel: data.financialNeedLevel || 'High Need',
      householdIncomeBracket: data.householdIncomeBracket || 'Under $1,500 USD',
      dependentsCount: data.dependentsCount || 1,
      displacementStatus: data.displacementStatus || 'Not Displaced',
      statementOfNeed: data.statementOfNeed || '',
      amountRequestedUSD: usdAmount,
      // Local currency saved to database & state
      amountRequestedLocal: localAmount,
      localCurrencyCode: data.localCurrencyCode || curr.code,
      localCurrencySymbol: data.localCurrencySymbol || curr.symbol,
      localCurrencyRate: data.localCurrencyRate || curr.rate,
      localCurrencyDisplay: localDisplay,
      countryFlag: data.countryFlag || curr.flag,
      registrationFeeUSD: data.registrationFeeUSD || DEFAULT_REGISTRATION_FEE_USD,
      registrationFeeLocal: feeDisplay,
      status: 'Submitted',
      documents: data.documents || [
        {
          id: 'doc-auto-1',
          name: 'Identity_Verification_Document.pdf',
          type: 'PDF',
          size: '1.4 MB',
          status: 'verified',
          uploadedAt: timestamp.split('T')[0]
        },
        {
          id: 'doc-auto-2',
          name: 'Statement_of_Hardship_Certificate.pdf',
          type: 'PDF',
          size: '2.1 MB',
          status: 'pending',
          uploadedAt: timestamp.split('T')[0]
        }
      ],
      timeline: [
        {
          date: timestamp.split('T')[0],
          title: 'Application Lodged Online',
          description: `Official application received into WHFS worldwide grants registry (${curr.flag} ${curr.country} intake).`,
          officer: 'Automated Intake Desk'
        }
      ],
      // Payment state attributes
      hasPaidRegistrationFee: Boolean(data.hasPaidRegistrationFee),
      paymentMethod: data.paymentMethod || 'Airtel Money',
      paymentTransactionId: data.paymentTransactionId || (data.hasPaidRegistrationFee ? `TXN-${Math.floor(100000 + Math.random() * 900000)}` : undefined),
      paymentStatus: data.hasPaidRegistrationFee ? (data.paymentStatus || 'Paid') : 'Unpaid',
      paymentDate: data.hasPaidRegistrationFee ? timestamp.split('T')[0] : undefined,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setApplications(prev => [newApp, ...prev]);

    // If applicant checked 'I have paid' or provided payment transaction reference, add entry into Payments Ledger
    if (data.hasPaidRegistrationFee) {
      const paymentRef = data.paymentTransactionId?.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      const newPayment: RegistrationFeePayment = {
        id: `WHFS-PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
        applicationId: generatedId,
        applicantName: data.fullName || (currentUser?.name ?? 'Applicant'),
        applicantEmail: data.email || (currentUser?.email ?? 'applicant@whfs.org'),
        country: countryName,
        countryFlag: curr.flag,
        amountUSD: data.registrationFeeUSD || DEFAULT_REGISTRATION_FEE_USD,
        amountLocal: localFee,
        currencyCode: curr.code,
        currencySymbol: curr.symbol,
        paymentMethod: data.paymentMethod || 'Airtel Money',
        transactionReference: paymentRef,
        date: timestamp.split('T')[0],
        status: data.paymentStatus || 'Paid',
        notes: `Application registration intake fee for ${generatedId}`
      };
      setPayments(prev => [newPayment, ...prev]);
    }

    showToast(`Application ${generatedId} lodged in local currency (${curr.code})!`, 'success');
    return newApp;
  };

  // Sync payments and withdrawals to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (e) {
      console.warn('LocalStorage error saving payments', e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
    } catch (e) {
      console.warn('LocalStorage error saving withdrawals', e);
    }
  }, [withdrawals]);

  const recordRegistrationPayment = async (paymentData: Partial<RegistrationFeePayment>): Promise<RegistrationFeePayment> => {
    const payId = `WHFS-PAY-2026-${Math.floor(100 + Math.random() * 900)}`;
    const date = new Date().toISOString().split('T')[0];
    const curr = getCurrency(paymentData.country || 'Zambia');

    const newPayment: RegistrationFeePayment = {
      id: payId,
      applicationId: paymentData.applicationId || 'INTAKE-MANUAL',
      applicantName: paymentData.applicantName || 'Applicant',
      applicantEmail: paymentData.applicantEmail || 'applicant@whfs.org',
      country: paymentData.country || 'Zambia',
      countryFlag: paymentData.countryFlag || curr.flag,
      amountUSD: Number(paymentData.amountUSD) || 10,
      amountLocal: Number(paymentData.amountLocal) || (10 * curr.rate),
      currencyCode: paymentData.currencyCode || curr.code,
      currencySymbol: paymentData.currencySymbol || curr.symbol,
      paymentMethod: paymentData.paymentMethod || 'Airtel Money',
      transactionReference: paymentData.transactionReference || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: paymentData.date || date,
      status: paymentData.status || 'Paid',
      notes: paymentData.notes || 'Recorded via WHFS Intake Portal'
    };

    setPayments(prev => [newPayment, ...prev]);
    showToast(`Payment ${payId} recorded successfully (${newPayment.currencySymbol} ${newPayment.amountLocal.toLocaleString()} ${newPayment.currencyCode})`, 'success');
    return newPayment;
  };

  const updatePaymentStatus = (paymentId: string, status: RegistrationFeePayment['status']) => {
    setPayments(prev => prev.map(p => {
      if (p.id !== paymentId) return p;
      return { ...p, status };
    }));
    showToast(`Payment ${paymentId} status updated to ${status}`, 'info');
  };

  const updatePayoutSettings = (newSettings: Partial<PayoutAccountSettings>) => {
    setPayoutSettings(prev => {
      const updated: PayoutAccountSettings = {
        ...prev,
        ...newSettings,
        updatedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem(STORAGE_KEYS.PAYOUT_SETTINGS, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error saving payout settings', e);
      }
      return updated;
    });
    showToast('Payment methods and receiving accounts updated successfully!', 'success');
  };

  const requestWithdrawal = async (data: {
    amountUSD: number;
    method: WithdrawalRecord['method'];
    destinationAccount: string;
    recipientName: string;
    notes?: string;
  }): Promise<WithdrawalRecord> => {
    const amountUSD = Number(data.amountUSD);
    const zmwRate = 27; // Zambia official rate
    const amountZMW = Math.round(amountUSD * zmwRate);

    if (amountUSD <= 0) {
      showToast('Please specify a positive withdrawal amount.', 'error');
      throw new Error('Invalid withdrawal amount');
    }

    // Check available balance
    const availableUSD = financialMetrics.currentBalanceUSD;
    if (amountUSD > availableUSD) {
      showToast(`Insufficient balance. Current balance is $${availableUSD.toLocaleString()} USD (K ${Math.round(availableUSD * zmwRate).toLocaleString()} ZMW)`, 'error');
      throw new Error('Insufficient balance');
    }

    const wthId = `WTH-2026-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];
    const cleanMethod = data.method.toUpperCase().replace(/\s+/g, '');
    const refCode = `TXN-${cleanMethod}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newWithdrawal: WithdrawalRecord = {
      id: wthId,
      amountUSD,
      amountZMW,
      method: data.method,
      destinationAccount: data.destinationAccount,
      recipientName: data.recipientName,
      requestedBy: currentUser?.name || 'Executive Foundation Officer',
      date: today,
      status: 'Completed',
      referenceCode: refCode,
      notes: data.notes || `Withdrawal payout to ${data.recipientName} via ${data.method}`
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    showToast(`Withdrawal of $${amountUSD.toLocaleString()} USD (K ${amountZMW.toLocaleString()} ZMW) processed! Ref: ${refCode}`, 'success');
    return newWithdrawal;
  };

  const updateWithdrawalStatus = (withdrawalId: string, status: WithdrawalRecord['status']) => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id !== withdrawalId) return w;
      return { ...w, status };
    }));
    showToast(`Withdrawal ${withdrawalId} status set to ${status}`, 'info');
  };

  const updateApplicationStatus = (
    id: string, 
    newStatus: ApplicationStatus, 
    officerNotes?: string, 
    amountAwardedUSD?: number
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app;
      
      const newEvent = {
        date: today,
        title: `Status updated to ${newStatus}`,
        description: officerNotes || `Evaluation completed by Foundation Grants Officer.`,
        officer: currentUser?.name || 'Foundation Review Officer'
      };

      return {
        ...app,
        status: newStatus,
        committeeNotes: officerNotes !== undefined ? officerNotes : app.committeeNotes,
        amountAwardedUSD: amountAwardedUSD !== undefined ? amountAwardedUSD : (newStatus === 'Approved' || newStatus === 'Disbursed' ? app.amountRequestedUSD : app.amountAwardedUSD),
        updatedAt: new Date().toISOString(),
        timeline: [newEvent, ...app.timeline]
      };
    }));

    showToast(`Application ${id} updated to "${newStatus}"`, 'success');
  };

  const approveApplication = (id: string, amount?: number) => {
    const today = new Date().toISOString().split('T')[0];
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app;
      const awarded = amount !== undefined ? amount : (app.amountRequestedUSD || 2500);
      const newEvent = {
        date: today,
        title: 'Grant Proposal Approved',
        description: `Executive Grant Committee approved full aid allocation of $${awarded.toLocaleString()} USD.`,
        officer: currentUser?.name || 'Executive Foundation Officer'
      };
      return {
        ...app,
        status: 'Approved' as ApplicationStatus,
        amountAwardedUSD: awarded,
        committeeNotes: 'Application approved by Foundation Review Board. Dispatches authorized pursuant to compliance criteria.',
        updatedAt: new Date().toISOString(),
        timeline: [newEvent, ...app.timeline]
      };
    }));
    showToast(`Application ${id} has been Approved!`, 'success');
  };

  const rejectApplication = (id: string, reason?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app;
      const rejectionReason = reason || 'Proposal does not satisfy current cohort regional allocation criteria.';
      const newEvent = {
        date: today,
        title: 'Application Rejected',
        description: rejectionReason,
        officer: currentUser?.name || 'Executive Foundation Officer'
      };
      return {
        ...app,
        status: 'Rejected' as ApplicationStatus,
        committeeNotes: rejectionReason,
        updatedAt: new Date().toISOString(),
        timeline: [newEvent, ...app.timeline]
      };
    }));
    showToast(`Application ${id} has been marked as Rejected.`, 'info');
  };

  const recordDonation = async (data: Omit<DonationRecord, 'id' | 'date' | 'receiptNumber'>): Promise<DonationRecord> => {
    const recNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: DonationRecord = {
      ...data,
      id: `WHFS-DON-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: recNumber
    };

    setDonations(prev => [newDonation, ...prev]);
    showToast(`Thank you! Official donation receipt #${recNumber} generated.`, 'success');
    return newDonation;
  };

  const refreshData = () => {
    setApplications(INITIAL_APPLICATIONS);
    setDonations(INITIAL_DONATIONS);
    setPayments(INITIAL_PAYMENTS);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setPayoutSettings(DEFAULT_PAYOUT_SETTINGS);
    showToast('Database reset to initial humanitarian registry baseline', 'info');
  };

  // Financial Metrics (Registration Fees & Withdrawals)
  const totalCollectedUSD = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amountUSD, 0);
  const totalCollectedZMW = totalCollectedUSD * 27;

  const totalWithdrawnUSD = withdrawals
    .filter(w => w.status === 'Completed')
    .reduce((sum, w) => sum + w.amountUSD, 0);
  const totalWithdrawnZMW = totalWithdrawnUSD * 27;

  const currentBalanceUSD = Math.max(0, totalCollectedUSD - totalWithdrawnUSD);
  const currentBalanceZMW = currentBalanceUSD * 27;

  const financialMetrics: FinancialMetrics = {
    totalCollectedUSD,
    totalCollectedZMW,
    totalWithdrawnUSD,
    totalWithdrawnZMW,
    currentBalanceUSD,
    currentBalanceZMW,
    paidCount: payments.filter(p => p.status === 'Paid').length,
    pendingCount: payments.filter(p => p.status === 'Pending Verification').length
  };

  // Aggregated Stats
  const approvedCount = applications.filter(a => a.status === 'Approved' || a.status === 'Disbursed').length;
  const computedLives = approvedCount * 1250;
  const stats = {
    totalApplications: applications.length,
    pendingReview: applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length,
    approvedOrDisbursed: approvedCount,
    totalDisbursedUSD: applications.reduce((sum, a) => sum + (a.amountAwardedUSD || 0), 0),
    totalDonationsUSD: donations.reduce((sum, d) => sum + d.amount, 0),
    livesImpacted: computedLives > 0 ? `${computedLives.toLocaleString()}+` : '0'
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      applications,
      donations,
      payments,
      withdrawals,
      payoutSettings,
      financialMetrics,
      activeTab,
      setActiveTab,
      selectedTrackingId,
      setSelectedTrackingId,
      preselectedProgramme,
      setPreselectedProgramme,
      toasts,
      showToast,
      removeToast,
      login,
      adminLogin,
      register,
      logout,
      switchRoleDemo,
      submitApplication,
      updateApplicationStatus,
      approveApplication,
      rejectApplication,
      recordDonation,
      recordRegistrationPayment,
      updatePaymentStatus,
      updatePayoutSettings,
      requestWithdrawal,
      updateWithdrawalStatus,
      refreshData,
      stats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
