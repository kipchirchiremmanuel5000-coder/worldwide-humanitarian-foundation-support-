import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  FIRESTORE_COLLECTIONS,
  OperationType,
  handleFirestoreError,
  isAdminEmail,
  PRIMARY_ADMIN_EMAIL
} from '../firebase/config';
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
  authReady: boolean;
  firebaseAuthError: string | null;
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
  login: (email: string, password?: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminGoogleLogin: () => Promise<boolean>;
  register: (name: string, email: string, country: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  submitApplication: (data: Partial<HumanitarianApplication>) => Promise<HumanitarianApplication>;
  lookupApplicationById: (trackingId: string) => Promise<HumanitarianApplication | null>;
  updateApplicationStatus: (
    id: string,
    status: ApplicationStatus,
    officerNotes?: string,
    amountAwardedUSD?: number
  ) => Promise<void>;
  approveApplication: (id: string, amount?: number) => Promise<void>;
  rejectApplication: (id: string, reason?: string) => Promise<void>;
  recordDonation: (data: Omit<DonationRecord, 'id' | 'date' | 'receiptNumber'>) => Promise<DonationRecord>;
  recordRegistrationPayment: (payment: Partial<RegistrationFeePayment>) => Promise<RegistrationFeePayment>;
  updatePaymentStatus: (paymentId: string, status: RegistrationFeePayment['status']) => Promise<void>;
  updatePayoutSettings: (newSettings: Partial<PayoutAccountSettings>) => Promise<void>;
  requestWithdrawal: (data: {
    amountUSD: number;
    method: WithdrawalRecord['method'];
    destinationAccount: string;
    recipientName: string;
    notes?: string;
  }) => Promise<WithdrawalRecord>;
  updateWithdrawalStatus: (withdrawalId: string, status: WithdrawalRecord['status']) => Promise<void>;
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
  APPLICATIONS: 'whfs_applications_local_cache',
  DONATIONS: 'whfs_donations_db',
  PAYMENTS: 'whfs_payments_ledger',
  WITHDRAWALS: 'whfs_withdrawals_ledger',
  PAYOUT_SETTINGS: 'whfs_payout_settings'
};

// Remove legacy mock/demo caches on boot
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('demo_applicants');
    localStorage.removeItem('mock_payments');
    localStorage.removeItem('whfs_auth_user');
    localStorage.removeItem('whfs_admin_authenticated');

    const CLEAN_PAYOUT_FLAG = 'whfs_clean_airtel_ke_v1';
    if (!localStorage.getItem(CLEAN_PAYOUT_FLAG)) {
      localStorage.removeItem(STORAGE_KEYS.PAYOUT_SETTINGS);
      localStorage.setItem(CLEAN_PAYOUT_FLAG, 'true');
    }
  } catch (e) {
    console.warn('Storage cleanup warning:', e);
  }
}

// Strip undefined properties before Firestore writes
function removeUndefinedFields<T extends Record<string, unknown>>(obj: T): T {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned as T;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [firebaseAuthError, setFirebaseAuthError] = useState<string | null>(null);

  const [applications, setApplications] = useState<HumanitarianApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [payments, setPayments] = useState<RegistrationFeePayment[]>(INITIAL_PAYMENTS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(INITIAL_WITHDRAWALS);
  const [payoutSettings, setPayoutSettings] = useState<PayoutAccountSettings>(DEFAULT_PAYOUT_SETTINGS);

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
      const route = path.replace(/^\//, '').split('/')[0];
      return route || 'home';
    }
    return 'home';
  });

  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);
  const [preselectedProgramme, setPreselectedProgramme] = useState<{
    name: string;
    category: ProgrammeCategory;
  } | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const email = (firebaseUser.email || '').toLowerCase();
        const isAdmin = isAdminEmail(email);
        const profile: UserProfile = {
          id: firebaseUser.uid,
          name:
            firebaseUser.displayName ||
            (email === PRIMARY_ADMIN_EMAIL
              ? 'Emmanuel Kipchirchir'
              : email === 'admin@whfs.org'
                ? 'Executive Foundation Officer'
                : email.split('@')[0] || 'Applicant'),
          email,
          role: isAdmin ? 'admin' : 'applicant',
          country: isAdmin ? 'Kenya' : 'Global Beneficiary'
        };
        setCurrentUser(profile);
      } else {
        setCurrentUser(null);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Load public payout settings document once on boot
  useEffect(() => {
    const loadPayout = async () => {
      try {
        const snap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.SETTINGS, 'payout'));
        if (snap.exists()) {
          setPayoutSettings(snap.data() as PayoutAccountSettings);
        }
      } catch {
        // Fallback to DEFAULT_PAYOUT_SETTINGS if document doesn't exist yet
      }
    };
    loadPayout();
  }, []);

  // 2. Real-Time Firestore Listeners (Only attached when authReady and Admin is authenticated)
  useEffect(() => {
    const isAdmin = Boolean(currentUser && (isAdminEmail(currentUser.email) || currentUser.role === 'admin'));
    if (!authReady || !isAdmin) return;

    const unsubApps = onSnapshot(
      collection(db, FIRESTORE_COLLECTIONS.APPLICATIONS),
      (snapshot) => {
        const list: HumanitarianApplication[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as HumanitarianApplication;
          return {
            ...data,
            id: data.id || docSnap.id,
            fullName: data.fullName || data.name || 'Applicant',
            name: data.name || data.fullName || 'Applicant',
            amountRequestedUSD: Number(data.amountRequestedUSD ?? data.amount ?? 0),
            amount: Number(data.amount ?? data.amountRequestedUSD ?? 0),
            createdAt: data.createdAt || data.date || new Date().toISOString(),
            updatedAt: data.updatedAt || data.date || new Date().toISOString(),
            documents: Array.isArray(data.documents) ? data.documents : [],
            timeline: Array.isArray(data.timeline) ? data.timeline : []
          };
        });

        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setApplications(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, FIRESTORE_COLLECTIONS.APPLICATIONS);
      }
    );

    const unsubPayments = onSnapshot(
      collection(db, FIRESTORE_COLLECTIONS.PAYMENTS),
      (snapshot) => {
        const list: RegistrationFeePayment[] = snapshot.docs.map((d) => d.data() as RegistrationFeePayment);
        list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setPayments(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, FIRESTORE_COLLECTIONS.PAYMENTS);
      }
    );

    const unsubDonations = onSnapshot(
      collection(db, FIRESTORE_COLLECTIONS.DONATIONS),
      (snapshot) => {
        const list: DonationRecord[] = snapshot.docs.map((d) => d.data() as DonationRecord);
        list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setDonations(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, FIRESTORE_COLLECTIONS.DONATIONS);
      }
    );

    const unsubWithdrawals = onSnapshot(
      collection(db, FIRESTORE_COLLECTIONS.WITHDRAWALS),
      (snapshot) => {
        const list: WithdrawalRecord[] = snapshot.docs.map((d) => d.data() as WithdrawalRecord);
        list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setWithdrawals(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, FIRESTORE_COLLECTIONS.WITHDRAWALS);
      }
    );

    const unsubSettings = onSnapshot(
      doc(db, FIRESTORE_COLLECTIONS.SETTINGS, 'payout'),
      (docSnap) => {
        if (docSnap.exists()) {
          setPayoutSettings(docSnap.data() as PayoutAccountSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${FIRESTORE_COLLECTIONS.SETTINGS}/payout`);
      }
    );

    return () => {
      unsubApps();
      unsubPayments();
      unsubDonations();
      unsubWithdrawals();
      unsubSettings();
    };
  }, [authReady, currentUser?.id, currentUser?.email, currentUser?.role]);

  // Listen for browser navigation changes
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

  // Cache submitted applications locally for same-device /track fallback when not admin
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications.slice(0, 50)));
    } catch {
      // Ignore quota exceeded for large local caches
    }
  }, [applications]);

  // 3. Admin Login with Firebase Authentication (creates user if not exists)
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setFirebaseAuthError(null);
    const normalizedEmail = email.trim().toLowerCase();

    if (!isAdminEmail(normalizedEmail)) {
      const msg = 'Unauthorized email. Only authorized Foundation Administrators can access /admin.';
      setFirebaseAuthError(msg);
      showToast(msg, 'error');
      return false;
    }

    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      showToast('Firebase Admin authentication verified. Welcome back.', 'success');
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      const message = (err as { message?: string })?.message || 'Authentication failed';

      // Create the requested Admin user in Firebase Auth if it does not exist yet
      if (
        (code === 'auth/user-not-found' || code === 'auth/invalid-credential') &&
        normalizedEmail === PRIMARY_ADMIN_EMAIL &&
        password === 'Kipchirchir5000'
      ) {
        try {
          const created = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          await updateProfile(created.user, { displayName: 'Emmanuel Kipchirchir' });
          showToast('Admin account created in Firebase Auth and signed in!', 'success');
          return true;
        } catch (createErr: unknown) {
          const createCode = (createErr as { code?: string })?.code || '';
          const createMsg = (createErr as { message?: string })?.message || 'Could not create admin account';

          if (createCode === 'auth/email-already-in-use') {
            const msg = 'Admin account already exists in Firebase Auth with a different password, or sign in with Google below.';
            setFirebaseAuthError(msg);
            showToast(msg, 'error');
            return false;
          }
          if (createCode === 'auth/operation-not-allowed') {
            const msg =
              'Email/Password sign-in is disabled in Firebase Console (whfs-3f347). Enable Email/Password under Authentication > Sign-in method, or use Sign in with Google below.';
            setFirebaseAuthError(msg);
            showToast(msg, 'error');
            return false;
          }
          setFirebaseAuthError(createMsg);
          showToast(createMsg, 'error');
          return false;
        }
      }

      if (code === 'auth/operation-not-allowed') {
        const msg =
          'Email/Password sign-in is disabled in Firebase Console (whfs-3f347). Enable Email/Password under Authentication > Sign-in method, or click Sign in with Google below.';
        setFirebaseAuthError(msg);
        showToast(msg, 'error');
        return false;
      }

      const friendly =
        code === 'auth/wrong-password' || code === 'auth/invalid-credential'
          ? 'Incorrect admin password or account credentials. You can also sign in with Google.'
          : message;
      setFirebaseAuthError(friendly);
      showToast(friendly, 'error');
      return false;
    }
  };

  const adminGoogleLogin = async (): Promise<boolean> => {
    setFirebaseAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = (result.user.email || '').toLowerCase();
      if (!isAdminEmail(email)) {
        await signOut(auth);
        const msg = `Access denied for ${email}. Only ${PRIMARY_ADMIN_EMAIL} is authorized.`;
        setFirebaseAuthError(msg);
        showToast(msg, 'error');
        return false;
      }
      showToast(`Signed in via Google as ${email}`, 'success');
      return true;
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Google sign-in cancelled or failed.';
      setFirebaseAuthError(msg);
      showToast(msg, 'error');
      return false;
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (isAdminEmail(normalizedEmail)) {
      return adminLogin(normalizedEmail, password || '');
    }
    try {
      if (password) {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
      showToast('Signed in successfully to Applicant Portal', 'success');
      return true;
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Sign in failed. Please verify your credentials.';
      showToast(msg, 'error');
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    _country: string,
    password?: string
  ): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (isAdminEmail(normalizedEmail)) {
      showToast('Administrator accounts must sign in via /admin.', 'error');
      return false;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password || 'WhfsApplicant2026!');
      await updateProfile(cred.user, { displayName: name });
      showToast(`Account created successfully for ${name}`, 'success');
      return true;
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Account creation failed.';
      showToast(msg, 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setCurrentUser(null);
    setApplications([]);
    setPayments([]);
    setWithdrawals([]);
    setDonations([]);
    showToast('You have been signed out', 'info');
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // 4. Submit Application -> Saves to Cloud Firestore "applications" collection
  const submitApplication = async (
    data: Partial<HumanitarianApplication>
  ): Promise<HumanitarianApplication> => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const countryName = data.country || 'Zambia';
    const regionCode = countryName.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'XX');
    const generatedId = `WHFS-2026-${regionCode}-${randomCode}`;
    const timestamp = new Date().toISOString();

    const curr = getCurrency(countryName);
    const usdAmount = Number(data.amountRequestedUSD ?? data.amount) || 100;
    const localAmount = data.amountRequestedLocal || Math.round(usdAmount * curr.rate);
    const localFee = Math.round(DEFAULT_REGISTRATION_FEE_USD * curr.rate);
    const localDisplay = data.localCurrencyDisplay || formatFundingDisplay(usdAmount, countryName);
    const feeDisplay = data.registrationFeeLocal || `${curr.symbol} ${localFee.toLocaleString()} ${curr.code}`;
    const applicantName = (data.fullName || data.name || currentUser?.name || 'Applicant').trim();
    const applicantNeed = (data.need || data.statementOfNeed || data.programmeName || 'Humanitarian support').trim();

    const newApp: HumanitarianApplication = removeUndefinedFields({
      id: generatedId,
      userId: auth.currentUser?.uid || currentUser?.id || `guest-${Date.now()}`,
      name: applicantName,
      fullName: applicantName,
      email: (data.email || currentUser?.email || 'applicant@whfs.org').trim(),
      phone: (data.phone || '').trim(),
      dateOfBirth: data.dateOfBirth || '2000-01-01',
      gender: data.gender || 'Not specified',
      country: countryName,
      region: data.region || 'Metropolitan',
      address: data.address || '',
      programmeCategory: data.programmeCategory || 'education',
      programmeName: data.programmeName || 'Global Academic Scholarship Programme (GASP)',
      institutionOrCommunity: data.institutionOrCommunity || '',
      need: applicantNeed,
      financialNeedLevel: data.financialNeedLevel || 'High Need',
      householdIncomeBracket: data.householdIncomeBracket || 'Under $1,500 USD',
      dependentsCount: Number(data.dependentsCount) || 1,
      displacementStatus: data.displacementStatus || 'Not Displaced',
      statementOfNeed: data.statementOfNeed || applicantNeed,
      amount: usdAmount,
      amountRequestedUSD: usdAmount,
      amountRequestedLocal: localAmount,
      localCurrencyCode: data.localCurrencyCode || curr.code,
      localCurrencySymbol: data.localCurrencySymbol || curr.symbol,
      localCurrencyRate: data.localCurrencyRate || curr.rate,
      localCurrencyDisplay: localDisplay,
      countryFlag: data.countryFlag || curr.flag,
      registrationFeeUSD: data.registrationFeeUSD || DEFAULT_REGISTRATION_FEE_USD,
      registrationFeeLocal: feeDisplay,
      receiptImageUrl: data.receiptImageUrl || '',
      status: 'pending' as ApplicationStatus,
      date: timestamp,
      documents: data.documents || [],
      timeline: [
        {
          date: timestamp.split('T')[0],
          title: 'Application Lodged Online',
          description: `Official application saved to WHFS Cloud Registry (${curr.flag} ${curr.country} intake).`,
          officer: 'Automated Intake Desk'
        }
      ],
      hasPaidRegistrationFee: Boolean(data.hasPaidRegistrationFee),
      paymentMethod: data.paymentMethod || 'Airtel Money',
      paymentTransactionId:
        data.paymentTransactionId ||
        (data.hasPaidRegistrationFee ? `TXN-${Math.floor(100000 + Math.random() * 900000)}` : ''),
      paymentStatus: data.hasPaidRegistrationFee ? data.paymentStatus || 'Paid' : 'Unpaid',
      paymentDate: data.hasPaidRegistrationFee ? timestamp.split('T')[0] : '',
      createdAt: timestamp,
      updatedAt: timestamp
    });

    const appPath = `${FIRESTORE_COLLECTIONS.APPLICATIONS}/${generatedId}`;
    try {
      await setDoc(doc(db, FIRESTORE_COLLECTIONS.APPLICATIONS, generatedId), newApp);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, appPath);
    }

    // Write PII-free public status mirror for /track lookup
    const publicStatusDoc = removeUndefinedFields({
      id: generatedId,
      country: countryName,
      countryFlag: curr.flag,
      programmeCategory: newApp.programmeCategory,
      programmeName: newApp.programmeName,
      amountRequestedUSD: usdAmount,
      localCurrencyDisplay: localDisplay,
      status: 'pending',
      date: timestamp,
      updatedAt: timestamp,
      timeline: newApp.timeline
    });

    try {
      await setDoc(doc(db, FIRESTORE_COLLECTIONS.APPLICATION_STATUS, generatedId), publicStatusDoc);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${FIRESTORE_COLLECTIONS.APPLICATION_STATUS}/${generatedId}`);
    }

    // Record payment into Firestore payments collection if fee paid
    if (data.hasPaidRegistrationFee) {
      const payId = `WHFS-PAY-2026-${Math.floor(100 + Math.random() * 900)}`;
      const paymentRef =
        data.paymentTransactionId?.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      const newPayment: RegistrationFeePayment = removeUndefinedFields({
        id: payId,
        applicationId: generatedId,
        applicantName,
        applicantEmail: newApp.email,
        country: countryName,
        countryFlag: curr.flag,
        amountUSD: data.registrationFeeUSD || DEFAULT_REGISTRATION_FEE_USD,
        amountLocal: localFee,
        currencyCode: curr.code,
        currencySymbol: curr.symbol,
        paymentMethod: data.paymentMethod || 'Airtel Money',
        transactionReference: paymentRef,
        receiptImageUrl: data.receiptImageUrl || '',
        date: timestamp.split('T')[0],
        status: data.paymentStatus || 'Paid',
        notes: `Application registration intake fee for ${generatedId}`
      });

      try {
        await setDoc(doc(db, FIRESTORE_COLLECTIONS.PAYMENTS, payId), newPayment);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `${FIRESTORE_COLLECTIONS.PAYMENTS}/${payId}`);
      }
    }

    setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
    showToast(`Application ${generatedId} saved to Firestore!`, 'success');
    return newApp;
  };

  // Lookup application for TrackingPage (checks local cache + public Firestore status mirror)
  const lookupApplicationById = async (trackingId: string): Promise<HumanitarianApplication | null> => {
    const cleanId = trackingId.trim();
    const localHit = applications.find(
      (a) => a.id.toLowerCase() === cleanId.toLowerCase()
    );
    if (localHit) return localHit;

    try {
      const snap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.APPLICATION_STATUS, cleanId));
      if (!snap.exists()) return null;
      const pub = snap.data();
      return {
        id: pub.id,
        userId: 'public-lookup',
        fullName: 'Verified Applicant',
        name: 'Verified Applicant',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        country: pub.country || 'Zambia',
        countryFlag: pub.countryFlag || '🌍',
        region: '',
        address: '',
        programmeCategory: pub.programmeCategory || 'education',
        programmeName: pub.programmeName || 'WHFS Grant Programme',
        institutionOrCommunity: '',
        financialNeedLevel: 'High Need',
        householdIncomeBracket: '',
        dependentsCount: 0,
        displacementStatus: 'Not Displaced',
        statementOfNeed: '',
        amountRequestedUSD: Number(pub.amountRequestedUSD || 0),
        amountAwardedUSD: pub.amountAwardedUSD ? Number(pub.amountAwardedUSD) : undefined,
        localCurrencyDisplay: pub.localCurrencyDisplay || '',
        status: pub.status as ApplicationStatus,
        committeeNotes: pub.committeeNotes,
        documents: [],
        timeline: Array.isArray(pub.timeline) ? pub.timeline : [],
        createdAt: pub.date || new Date().toISOString(),
        updatedAt: pub.updatedAt || pub.date || new Date().toISOString()
      };
    } catch {
      return null;
    }
  };

  const updateApplicationStatus = async (
    id: string,
    newStatus: ApplicationStatus,
    officerNotes?: string,
    amountAwardedUSD?: number
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();
    const existingApp = applications.find((a) => a.id === id);

    const newEvent = {
      date: today,
      title: `Status updated to ${newStatus}`,
      description: officerNotes || 'Evaluation completed by Foundation Grants Officer.',
      officer: currentUser?.name || 'Foundation Review Officer'
    };

    const nextTimeline = existingApp ? [newEvent, ...(existingApp.timeline || [])] : [newEvent];
    const nextAward =
      amountAwardedUSD !== undefined
        ? amountAwardedUSD
        : newStatus === 'Approved' || newStatus === 'approved' || newStatus === 'Disbursed'
          ? existingApp?.amountRequestedUSD || 0
          : existingApp?.amountAwardedUSD;

    const appUpdate = removeUndefinedFields({
      status: newStatus,
      committeeNotes: officerNotes !== undefined ? officerNotes : existingApp?.committeeNotes || '',
      amountAwardedUSD: nextAward,
      updatedAt: nowIso,
      timeline: nextTimeline
    });

    try {
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.APPLICATIONS, id), appUpdate);
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.APPLICATION_STATUS, id), appUpdate).catch(() => {});
      showToast(`Application ${id} updated to "${newStatus}" in Firestore`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.APPLICATIONS}/${id}`);
    }
  };

  const approveApplication = async (id: string, amount?: number) => {
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();
    const existingApp = applications.find((a) => a.id === id);
    const awarded = amount !== undefined ? amount : existingApp?.amountRequestedUSD || 100;

    const newEvent = {
      date: today,
      title: 'Grant Proposal Approved',
      description: `Executive Grant Committee approved full aid allocation of $${awarded.toLocaleString()} USD.`,
      officer: currentUser?.name || 'Executive Foundation Officer'
    };

    const nextTimeline = existingApp ? [newEvent, ...(existingApp.timeline || [])] : [newEvent];
    const payload = {
      status: 'approved' as ApplicationStatus,
      amountAwardedUSD: awarded,
      committeeNotes:
        'Application approved by Foundation Review Board. Dispatches authorized pursuant to compliance criteria.',
      updatedAt: nowIso,
      timeline: nextTimeline
    };

    try {
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.APPLICATIONS, id), payload);
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.APPLICATION_STATUS, id), payload).catch(() => {});
      showToast(`Application ${id} Approved in Firestore!`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.APPLICATIONS}/${id}`);
    }
  };

  const rejectApplication = async (id: string, reason?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();
    const existingApp = applications.find((a) => a.id === id);
    const rejectionReason =
      reason || 'Proposal does not satisfy current cohort regional allocation criteria.';

    const newEvent = {
      date: today,
      title: 'Application Rejected',
      description: rejectionReason,
      officer: currentUser?.name || 'Executive Foundation Officer'
    };

    const nextTimeline = existingApp ? [newEvent, ...(existingApp.timeline || [])] : [newEvent];
    const payload = {
      status: 'rejected' as ApplicationStatus,
      committeeNotes: rejectionReason,
      updatedAt: nowIso,
      timeline: nextTimeline
    };

    try {
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.APPLICATIONS, id), payload);
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.APPLICATION_STATUS, id), payload).catch(() => {});
      showToast(`Application ${id} marked Rejected in Firestore.`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.APPLICATIONS}/${id}`);
    }
  };

  const recordRegistrationPayment = async (
    paymentData: Partial<RegistrationFeePayment>
  ): Promise<RegistrationFeePayment> => {
    const payId = `WHFS-PAY-2026-${Math.floor(100 + Math.random() * 900)}`;
    const date = new Date().toISOString().split('T')[0];
    const curr = getCurrency(paymentData.country || 'Zambia');

    const newPayment: RegistrationFeePayment = removeUndefinedFields({
      id: payId,
      applicationId: paymentData.applicationId || 'INTAKE-MANUAL',
      applicantName: paymentData.applicantName || 'Applicant',
      applicantEmail: paymentData.applicantEmail || 'applicant@whfs.org',
      country: paymentData.country || 'Zambia',
      countryFlag: paymentData.countryFlag || curr.flag,
      amountUSD: Number(paymentData.amountUSD) || 10,
      amountLocal: Number(paymentData.amountLocal) || 10 * curr.rate,
      currencyCode: paymentData.currencyCode || curr.code,
      currencySymbol: paymentData.currencySymbol || curr.symbol,
      paymentMethod: paymentData.paymentMethod || 'Airtel Money',
      transactionReference:
        paymentData.transactionReference || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      receiptImageUrl: paymentData.receiptImageUrl || '',
      date: paymentData.date || date,
      status: paymentData.status || 'Paid',
      notes: paymentData.notes || 'Recorded via WHFS Intake Portal'
    });

    try {
      await setDoc(doc(db, FIRESTORE_COLLECTIONS.PAYMENTS, payId), newPayment);
      showToast(
        `Payment ${payId} saved (${newPayment.currencySymbol} ${newPayment.amountLocal.toLocaleString()} ${newPayment.currencyCode})`,
        'success'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${FIRESTORE_COLLECTIONS.PAYMENTS}/${payId}`);
    }
    return newPayment;
  };

  const updatePaymentStatus = async (
    paymentId: string,
    status: RegistrationFeePayment['status']
  ) => {
    try {
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.PAYMENTS, paymentId), { status });
      showToast(`Payment ${paymentId} status updated to ${status}`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.PAYMENTS}/${paymentId}`);
    }
  };

  const updatePayoutSettings = async (newSettings: Partial<PayoutAccountSettings>) => {
    const updated: PayoutAccountSettings = {
      ...payoutSettings,
      ...newSettings,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, FIRESTORE_COLLECTIONS.SETTINGS, 'payout'), updated);
      setPayoutSettings(updated);
      showToast('Treasury payout account saved to Firestore!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.SETTINGS}/payout`);
    }
  };

  const requestWithdrawal = async (data: {
    amountUSD: number;
    method: WithdrawalRecord['method'];
    destinationAccount: string;
    recipientName: string;
    notes?: string;
  }): Promise<WithdrawalRecord> => {
    const amountUSD = Number(data.amountUSD);
    const zmwRate = 27;
    const amountZMW = Math.round(amountUSD * zmwRate);

    if (amountUSD <= 0) {
      showToast('Please specify a positive withdrawal amount.', 'error');
      throw new Error('Invalid withdrawal amount');
    }

    const availableUSD = financialMetrics.currentBalanceUSD;
    if (amountUSD > availableUSD) {
      showToast(
        `Insufficient balance. Current balance is $${availableUSD.toLocaleString()} USD`,
        'error'
      );
      throw new Error('Insufficient balance');
    }

    const wthId = `WTH-2026-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];
    const cleanMethod = data.method.toUpperCase().replace(/\s+/g, '');
    const refCode = `TXN-${cleanMethod}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newWithdrawal: WithdrawalRecord = removeUndefinedFields({
      id: wthId,
      amountUSD,
      amountZMW,
      method: data.method,
      destinationAccount: data.destinationAccount,
      recipientName: data.recipientName,
      requestedBy: currentUser?.name || 'Executive Foundation Officer',
      date: today,
      status: 'Completed' as const,
      referenceCode: refCode,
      notes: data.notes || `Withdrawal payout to ${data.recipientName} via ${data.method}`
    });

    try {
      await setDoc(doc(db, FIRESTORE_COLLECTIONS.WITHDRAWALS, wthId), newWithdrawal);
      showToast(
        `Withdrawal of $${amountUSD.toLocaleString()} USD processed! Ref: ${refCode}`,
        'success'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${FIRESTORE_COLLECTIONS.WITHDRAWALS}/${wthId}`);
    }
    return newWithdrawal;
  };

  const updateWithdrawalStatus = async (
    withdrawalId: string,
    status: WithdrawalRecord['status']
  ) => {
    try {
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.WITHDRAWALS, withdrawalId), { status });
      showToast(`Withdrawal ${withdrawalId} status set to ${status}`, 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.WITHDRAWALS}/${withdrawalId}`);
    }
  };

  const recordDonation = async (
    data: Omit<DonationRecord, 'id' | 'date' | 'receiptNumber'>
  ): Promise<DonationRecord> => {
    const recNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const donId = `WHFS-DON-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: DonationRecord = removeUndefinedFields({
      ...data,
      id: donId,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: recNumber
    });

    try {
      await setDoc(doc(db, FIRESTORE_COLLECTIONS.DONATIONS, donId), newDonation);
      showToast(`Thank you! Official donation receipt #${recNumber} generated.`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${FIRESTORE_COLLECTIONS.DONATIONS}/${donId}`);
    }
    return newDonation;
  };

  const refreshData = () => {
    showToast('Live Firestore stream is active.', 'info');
  };

  // Financial Metrics
  const totalCollectedUSD = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amountUSD, 0);
  const totalCollectedZMW = totalCollectedUSD * 27;

  const totalWithdrawnUSD = withdrawals
    .filter((w) => w.status === 'Completed')
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
    paidCount: payments.filter((p) => p.status === 'Paid').length,
    pendingCount: payments.filter((p) => p.status === 'Pending Verification').length
  };

  // Aggregated Stats
  const approvedCount = applications.filter((a) => {
    const s = String(a.status).toLowerCase();
    return s === 'approved' || s === 'disbursed';
  }).length;
  const pendingCount = applications.filter((a) => {
    const s = String(a.status).toLowerCase();
    return s === 'pending' || s === 'submitted' || s === 'under review';
  }).length;
  const computedLives = approvedCount * 1250;
  const stats = {
    totalApplications: applications.length,
    pendingReview: pendingCount,
    approvedOrDisbursed: approvedCount,
    totalDisbursedUSD: applications.reduce((sum, a) => sum + (a.amountAwardedUSD || 0), 0),
    totalDonationsUSD: donations.reduce((sum, d) => sum + d.amount, 0),
    livesImpacted: computedLives > 0 ? `${computedLives.toLocaleString()}+` : '0'
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authReady,
        firebaseAuthError,
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
        adminGoogleLogin,
        register,
        logout,
        submitApplication,
        lookupApplicationById,
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
      }}
    >
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
