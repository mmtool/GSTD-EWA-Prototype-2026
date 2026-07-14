/**
 * Company Onboarding Module Types
 */

export type OnboardingStatus = 'draft' | 'pending_review' | 'returned' | 'approved' | 'completed' | 'rejected';

export interface AuditEntry {
  id: string;
  stage: number;
  action: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  comment?: string;
}

export interface OnboardingDocument {
  id: string;
  name: string;
  type: string;
  status: 'uploaded' | 'missing' | 'verified';
  uploadDate?: string;
  fileUrl?: string;
}

export interface PayrollPolicy {
  workingDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  salaryCutoffDay: number; // 25
  payDay: number; // 30
  ewaAllowStartDay: number; // 1
  ewaAllowEndDay: number; // 15
  repaymentDay: number; // 30
  effectiveDate: string;
  endDate?: string;
  gapPolicy: string;
}

export interface CorporateInfo {
  companyName: string;
  registrationNumber: string;
  address: string;
  ownerName: string;
  ownerId: string;
  contactNumber: string;
}

export interface OnboardingEmployee {
  id: string;
  name: string;
  phone: string;
  nrc: string;
  position: string;
  salary: number;
  department: string;
  office: string;
  isEwaEligible: boolean;
  verificationStatus: 'verified' | 'unverified';
}

export interface OnboardingLimitation {
  minAmount: number;
  maxAmount: number;
  dailyLimitCount: number;
  weeklyLimitCount: number;
  monthlyLimitCount: number;
}

export interface FeeDefinition {
  id: string;
  name: string;
  type: 'service' | 'repayment';
  calculationType: 'fixed' | 'percentage' | 'tiered';
  value: number;
  config: string; // JSON string or detailed description
}

export interface OnboardingRequest {
  id: string;
  type: 'onboarding' | 'budget_request';
  companyId: string;
  companyName: string;
  currentStage: number;
  status: OnboardingStatus;
  submissionDate: string;
  documents: OnboardingDocument[];
  payrollPolicy?: PayrollPolicy;
  corporateInfo?: CorporateInfo;
  employees: OnboardingEmployee[];
  budgetAmount: number;
  selectedFees: FeeDefinition[];
  limitations?: OnboardingLimitation;
  auditTrail: AuditEntry[];
  progress: number; // 0-100
}

export interface OnboardingTask {
  id: string;
  requestId: string;
  requestType: 'onboarding' | 'budget_request';
  companyName: string;
  actionRequired: string;
  assignedRole: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'completed';
}

export const STAGE_NAMES = [
  "Login Verification",
  "Document Upload",
  "Payroll Policy",
  "Corporate Info",
  "Employee Data",
  "Budget Request",
  "Operation Review",
  "Risk Review",
  "Finance Action"
];

export const BUDGET_STAGE_NAMES = [
  "Login Verification",
  "Employee Data",
  "Budget Request",
  "Operation Review",
  "Risk Review",
  "Finance Action"
];
