import { 
  OnboardingRequest, 
  OnboardingTask, 
  FeeDefinition,
  OnboardingEmployee
} from "./types";

export const MOCK_FEES: FeeDefinition[] = [
  {
    id: "FEE-001",
    name: "Standard Service Fee (Fixed)",
    type: "service",
    calculationType: "fixed",
    value: 5.00,
    config: "Fixed fee of $5.00 per transaction"
  },
  {
    id: "FEE-002",
    name: "Standard Repayment Fee (%)",
    type: "repayment",
    calculationType: "percentage",
    value: 2.5,
    config: "2.5% of the total repayment amount"
  },
  {
    id: "FEE-003",
    name: "Premium Service Fee (Tiered)",
    type: "service",
    calculationType: "tiered",
    value: 0,
    config: "Up to $100: $3 | $100-$500: $7 | Above $500: $12"
  }
];

export const MOCK_EMPLOYEES: OnboardingEmployee[] = [
  { id: "EMP-101", name: "John Doe", phone: "091234567", nrc: "12/YAKANA(N)123456", position: "Software Engineer", salary: 1500000, department: "IT", office: "Main HQ", isEwaEligible: true, verificationStatus: "verified" },
  { id: "EMP-102", name: "Jane Smith", phone: "097654321", nrc: "9/MAMANA(N)654321", position: "HR Manager", salary: 1200000, department: "HR", office: "Main HQ", isEwaEligible: true, verificationStatus: "verified" },
  { id: "EMP-103", name: "Robert Brown", phone: "094445556", nrc: "14/WAKANA(N)111222", position: "Accountant", salary: 1000000, department: "Finance", office: "Branch A", isEwaEligible: false, verificationStatus: "unverified" },
  { id: "EMP-104", name: "Alice Green", phone: "093332221", nrc: "5/KALANA(N)333444", position: "Sales Representative", salary: 800000, department: "Sales", office: "Branch B", isEwaEligible: true, verificationStatus: "verified" },
];

export const MOCK_ONBOARDING_REQUESTS: OnboardingRequest[] = [
  {
    id: "REQ-2026-001",
    type: "onboarding",
    companyId: "COM-001",
    companyName: "Global Tech Solutions",
    currentStage: 6,
    status: "pending_review",
    submissionDate: "2026-07-10T10:00:00Z",
    progress: 66,
    documents: [
      { id: "DOC-001", name: "Business Registration", type: "pdf", status: "verified", uploadDate: "2026-07-10" },
      { id: "DOC-002", name: "Tax Clearance", type: "pdf", status: "verified", uploadDate: "2026-07-10" },
      { id: "DOC-003", name: "Director ID", type: "pdf", status: "verified", uploadDate: "2026-07-10" },
    ],
    payrollPolicy: {
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      salaryCutoffDay: 25,
      payDay: 30,
      ewaAllowStartDay: 1,
      ewaAllowEndDay: 20,
      repaymentDay: 30,
      effectiveDate: "2026-08-01",
      gapPolicy: "Standard 3-day verification gap"
    },
    corporateInfo: {
      companyName: "Global Tech Solutions",
      registrationNumber: "REG-123456",
      address: "123 Tech Park, Yangon",
      ownerName: "U Ba",
      ownerId: "12/MAGANA(N)123123",
      contactNumber: "095123456"
    },
    employees: MOCK_EMPLOYEES,
    budgetAmount: 4500000,
    selectedFees: [],
    auditTrail: [
      { id: "AUD-001", stage: 0, action: "Login Verified", actorName: "HR Manager", actorRole: "HR", timestamp: "2026-07-10T10:05:00Z" },
      { id: "AUD-002", stage: 1, action: "Documents Uploaded", actorName: "HR Manager", actorRole: "HR", timestamp: "2026-07-10T10:15:00Z", comment: "All required docs submitted" },
      { id: "AUD-003", stage: 5, action: "Budget Submitted", actorName: "HR Manager", actorRole: "HR", timestamp: "2026-07-10T10:45:00Z" },
    ]
  },
  {
    id: "REQ-2026-002",
    type: "onboarding",
    companyId: "COM-002",
    companyName: "Yangon Trading Co.",
    currentStage: 2,
    status: "returned",
    submissionDate: "2026-07-11T09:00:00Z",
    progress: 22,
    documents: [
      { id: "DOC-004", name: "Business Registration", type: "pdf", status: "verified", uploadDate: "2026-07-11" },
    ],
    employees: [],
    budgetAmount: 0,
    selectedFees: [],
    auditTrail: [
      { id: "AUD-004", stage: 1, action: "Documents Uploaded", actorName: "HR Staff", actorRole: "HR", timestamp: "2026-07-11T09:10:00Z" },
      { id: "AUD-005", stage: 6, action: "Returned to HR", actorName: "Operations Lead", actorRole: "Operations", timestamp: "2026-07-11T14:00:00Z", comment: "Tax clearance document is blurry. Please re-upload." },
    ]
  }
];

export const MOCK_TASKS: OnboardingTask[] = [
  {
    id: "TSK-001",
    requestId: "REQ-2026-001",
    requestType: "onboarding",
    companyName: "Global Tech Solutions",
    actionRequired: "Review Employee List & Budget",
    assignedRole: "Operations",
    priority: "high",
    dueDate: "2026-07-15",
    status: "pending"
  },
  {
    id: "TSK-002",
    requestId: "REQ-2026-002",
    requestType: "onboarding",
    companyName: "Yangon Trading Co.",
    actionRequired: "Re-upload Tax Clearance",
    assignedRole: "HR",
    priority: "medium",
    dueDate: "2026-07-14",
    status: "pending"
  }
];
