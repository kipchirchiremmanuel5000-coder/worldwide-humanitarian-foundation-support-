export type ProgrammeCategory = 'education' | 'humanitarian';

export type ApplicationStatus = 
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
  id: string; // e.g. WHFS-2026-AF-94821
  userId: string;
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
  financialNeedLevel: 'Critical/Emergency' | 'High Need' | 'Moderate Need';
  householdIncomeBracket: string;
  dependentsCount: number;
  displacementStatus: 'Not Displaced' | 'Internally Displaced' | 'Refugee' | 'Crisis Affected';
  statementOfNeed: string;
  amountRequestedUSD: number;
  amountAwardedUSD?: number;
  status: ApplicationStatus;
  documents: DocumentAttachment[];
  timeline: ApplicationTimelineEvent[];
  committeeNotes?: string;
  createdAt: string;
  updatedAt: string;
  disbursementDate?: string;
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
