import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  HumanitarianApplication, 
  DonationRecord, 
  ApplicationStatus,
  ProgrammeCategory
} from '../types';
import { 
  INITIAL_APPLICATIONS, 
  INITIAL_DONATIONS 
} from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: UserProfile | null;
  applications: HumanitarianApplication[];
  donations: DonationRecord[];
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
  recordDonation: (data: Omit<DonationRecord, 'id' | 'date' | 'receiptNumber'>) => Promise<DonationRecord>;
  refreshData: () => void;
  stats: {
    totalApplications: number;
    pendingReview: number;
    approvedOrDisbursed: number;
    totalDisbursedUSD: number;
    totalDonationsUSD: number;
  };
}

const STORAGE_KEYS = {
  USER: 'whfs_auth_user',
  APPLICATIONS: 'whfs_applications_db',
  DONATIONS: 'whfs_donations_db'
};

const DEFAULT_DEMO_APPLICANT: UserProfile = {
  id: 'user-app-01',
  name: 'Amina Zainab Mwangi',
  email: 'amina.mwangi2026@gmail.com',
  role: 'applicant',
  country: 'Kenya',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
};

const DEFAULT_DEMO_ADMIN: UserProfile = {
  id: 'user-admin-01',
  name: 'Dr. Tariq Al-Hassan',
  email: 'tariq.hassan@whfs-aid.org',
  role: 'admin',
  country: 'Switzerland',
  organization: 'WHFS International Board of Trustees',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_APPLICANT;
    } catch {
      return DEFAULT_DEMO_APPLICANT;
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

  const [activeTab, setActiveTabState] = useState<string>('home');
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);
  const [preselectedProgramme, setPreselectedProgramme] = useState<{ name: string; category: ProgrammeCategory } | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
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

  const login = async (email: string, role: 'applicant' | 'admin' = 'applicant'): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    let user: UserProfile;

    if (role === 'admin' || normalizedEmail.includes('admin') || normalizedEmail.includes('whfs-aid.org')) {
      user = {
        id: 'admin-' + Math.random().toString(36).substring(2, 7),
        name: 'Dr. Tariq Al-Hassan',
        email: normalizedEmail || 'tariq.hassan@whfs-aid.org',
        role: 'admin',
        country: 'Switzerland',
        organization: 'WHFS International Board'
      };
      showToast('Welcome back, Foundation Officer Al-Hassan', 'success');
    } else {
      user = {
        id: 'user-' + Math.random().toString(36).substring(2, 7),
        name: normalizedEmail.split('@')[0].replace(/[._]/g, ' ') || 'Applicant User',
        email: normalizedEmail,
        role: 'applicant',
        country: 'Global Beneficiary'
      };
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
    showToast('You have been signed out', 'info');
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  const switchRoleDemo = (role: 'applicant' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(DEFAULT_DEMO_ADMIN);
      showToast('Switched to Administrator / Foundation Officer view', 'info');
    } else {
      setCurrentUser(DEFAULT_DEMO_APPLICANT);
      showToast('Switched to Applicant Portal view', 'info');
    }
  };

  const submitApplication = async (data: Partial<HumanitarianApplication>): Promise<HumanitarianApplication> => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const regionCode = data.country ? data.country.substring(0, 2).toUpperCase() : 'GL';
    const generatedId = `WHFS-2026-${regionCode}-${randomCode}`;
    const timestamp = new Date().toISOString();

    const newApp: HumanitarianApplication = {
      id: generatedId,
      userId: currentUser?.id || 'guest-' + Date.now(),
      fullName: data.fullName || (currentUser?.name ?? 'Applicant'),
      email: data.email || (currentUser?.email ?? 'applicant@whfs.org'),
      phone: data.phone || '',
      dateOfBirth: data.dateOfBirth || '2000-01-01',
      gender: data.gender || 'Not specified',
      country: data.country || 'Global',
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
      amountRequestedUSD: Number(data.amountRequestedUSD) || 2500,
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
          description: 'Official application received into WHFS worldwide grants registry.',
          officer: 'Automated Intake Desk'
        }
      ],
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setApplications(prev => [newApp, ...prev]);
    showToast(`Application ${generatedId} submitted successfully!`, 'success');
    return newApp;
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
    showToast('Database reset to initial humanitarian registry baseline', 'info');
  };

  // Aggregated Stats
  const stats = {
    totalApplications: applications.length,
    pendingReview: applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length,
    approvedOrDisbursed: applications.filter(a => a.status === 'Approved' || a.status === 'Disbursed').length,
    totalDisbursedUSD: applications.reduce((sum, a) => sum + (a.amountAwardedUSD || 0), 0),
    totalDonationsUSD: donations.reduce((sum, d) => sum + d.amount, 0)
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      applications,
      donations,
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
      register,
      logout,
      switchRoleDemo,
      submitApplication,
      updateApplicationStatus,
      recordDonation,
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
