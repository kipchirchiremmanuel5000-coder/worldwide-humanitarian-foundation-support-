export type ProgrammeCategory = 'education' | 'humanitarian';

export type ApplicationStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'Submitted'
  | 'Under Review'
  | 'Committee Evaluation'
  | 'Approved'
  | 'Disbursed'
  | 'Needs Clarification'
  | 'Rejected';

export interface DocumentAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'verified' | 'pending' | 'review_required';
  uploadedAt: string;
}

export interface ApplicationTimelineEvent {
  date: string;
  title: string;
  description: string;
  officer: string;
}

export interface HumanitarianApplication {
  id: string; // e.g. WHFS-2026-ZM-94821
  userId: string;
  name?: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  region: string;
  address: string;
  programmeCategory: ProgrammeCategory;
  programmeName: string;
  institutionOrCommunity: string;
  need?: string;
  financialNeedLevel: 'Critical/Emergency' | 'High Need' | 'Moderate Need';
  householdIncomeBracket: string;
  dependentsCount: number;
  displacementStatus: 'Not Displaced' | 'Internally Displaced' | 'Refugee' | 'Crisis Affected';
  statementOfNeed: string;
  amount?: number;
  amountRequestedUSD: number;
  amountAwardedUSD?: number;
  amountRequestedLocal?: number;
  localCurrencyCode?: string;
  localCurrencySymbol?: string;
  localCurrencyRate?: number;
  localCurrencyDisplay?: string;
  countryFlag?: string;
  registrationFeeUSD?: number;
  registrationFeeLocal?: string;
  receiptImageUrl?: string;
  // Payment tracking attributes
  hasPaidRegistrationFee?: boolean;
  paymentMethod?: string;
  paymentTransactionId?: string;
  paymentStatus?: 'Paid' | 'Pending Verification' | 'Unpaid';
  paymentDate?: string;
  status: ApplicationStatus;
  date?: string;
  documents: DocumentAttachment[];
  timeline: ApplicationTimelineEvent[];
  committeeNotes?: string;
  createdAt: string;
  updatedAt: string;
  disbursementDate?: string;
}

export interface RegistrationFeePayment {
  id: string; // e.g. WHFS-PAY-2026-901
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  country: string;
  countryFlag: string;
  amountUSD: number;
  amountLocal: number;
  currencyCode: string;
  currencySymbol: string;
  paymentMethod: string; // Airtel Money, MTN Money, Bank, M-Pesa, PayPal, etc.
  transactionReference: string;
  receiptImageUrl?: string;
  date: string;
  status: 'Paid' | 'Pending Verification' | 'Refunded' | 'Unpaid';
  notes?: string;
}

export interface PayoutAccountSettings {
  // TREASURY PAYOUT ACCOUNT (Single Source of Truth)
  airtelKenyaNumber: string;
  airtelKenyaAccountName: string;
  updatedAt: string;
}

export interface WithdrawalRecord {
  id: string; // e.g. WTH-2026-8910
  amountUSD: number;
  amountZMW: number;
  method: 'Airtel Money' | 'MTN Mobile Money' | 'Bank Transfer' | 'PayPal' | 'M-Pesa';
  destinationAccount: string;
  recipientName: string;
  requestedBy: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Processing';
  referenceCode: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'applicant' | 'admin';
  country: string;
  organization?: string;
  avatar?: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'KES' | 'CAD';
  frequency: 'one-time' | 'monthly';
  cause: string;
  date: string;
  receiptNumber: string;
  isAnonymous: boolean;
  paymentMethod: string;
}

export interface ProgrammeItem {
  id: string;
  category: ProgrammeCategory;
  title: string;
  subtitle: string;
  description: string;
  targetBeneficiaries: string;
  annualBudget: string;
  impactMetrics: string;
  countries: string[];
  eligibility: string[];
  coverageIncludes: string[];
  deadline: string;
  featuredImage: string;
}
