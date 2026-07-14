/**
 * Company Onboarding Wizard
 * A 9-stage state-driven stepper for corporate onboarding and budget requests.
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Users, 
  FileCheck, 
  ShieldCheck, 
  Building2, 
  CreditCard,
  Search,
  Download,
  AlertCircle,
  Calculator,
  PlayCircle,
  Clock,
  User,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { STAGE_NAMES, OnboardingRequest, BUDGET_STAGE_NAMES } from "./types";
import { MOCK_FEES, MOCK_EMPLOYEES } from "./mockData";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  initialMode?: "onboarding" | "budget_request";
  onRequestClose: () => void;
}

export default function OnboardingWizard({ initialMode = "onboarding", onRequestClose }: OnboardingWizardProps) {
  const [mode] = useState(initialMode);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const stages = mode === "onboarding" ? STAGE_NAMES : BUDGET_STAGE_NAMES;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < stages.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="modal-enterprise">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="modal-enterprise-content max-w-4xl h-[78vh]"
      >
        {/* Wizard Header — Modal Enterprise Header */}
        <div className="modal-enterprise-header">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[3px] bg-[#1e3a5f] flex items-center justify-center border border-[#1e3a5f]">
              {mode === "onboarding" ? <Building2 size={16} className="text-white" /> : <CreditCard size={16} className="text-white" />}
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wide">
                {mode === "onboarding" ? "Company Onboarding" : "Recurring Budget Request"}
              </h2>
              <p className="text-[9px] text-[#5a6b7c] uppercase tracking-widest font-bold">
                Stage {currentStep + 1} of {stages.length}: {stages[currentStep]}
              </p>
            </div>
          </div>
          <button 
            onClick={onRequestClose}
            className="text-[#90a4ae] hover:text-[#1e3a5f] transition-colors p-1"
          >
            <ChevronRight className="w-5 h-5 rotate-90" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation — Enterprise Progress Stepper */}
          <div className="w-56 border-r border-[#d1d9e0] bg-[#f8fafc] flex flex-col p-4 overflow-y-auto">
            <div className="space-y-3">
              {stages.map((name, index) => {
                const isActive = currentStep === index;
                const isCompleted = completedSteps.includes(index);
                const isLocked = index > Math.max(...completedSteps, -1) + 1;

                return (
                  <button
                    key={name}
                    disabled={isLocked}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "w-full flex items-center gap-3 text-left transition-all group relative py-1",
                      isLocked ? "opacity-40 cursor-not-allowed" : "opacity-100"
                    )}
                  >
                    <div className={cn(
                      "step-node shrink-0",
                      isActive ? "step-node-active" : isCompleted ? "step-node-completed" : "step-node-pending"
                    )}>
                      {isCompleted ? <Check size={12} /> : index + 1}
                    </div>
                    <div className="min-w-0">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider block truncate",
                        isActive ? "text-[#0ea5e9]" : isCompleted ? "text-[#2e7d32]" : "text-[#5a6b7c]"
                      )}>
                        {name}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div layoutId="active-marker" className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0ea5e9] rounded-l-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-3xl mx-auto h-full flex flex-col"
                >
                  {renderStepContent(currentStep, mode === "onboarding" ? "onboarding" : "budget")}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Modal Footer — Enterprise Styles */}
            <div className="modal-enterprise-footer">
              <button 
                onClick={handleBack}
                disabled={currentStep === 0}
                className="btn-enterprise-secondary"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <button 
                onClick={handleNext}
                className="btn-enterprise-primary"
              >
                <span>{currentStep === stages.length - 1 ? "Complete Process" : "Save & Continue"}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function renderStepContent(step: number, type: "onboarding" | "budget") {
  const actualStep = type === "budget" && step > 0 ? step + 3 : step;

  switch (actualStep) {
    case 0: return <LoginStage />;
    case 1: return <DocumentStage />;
    case 2: return <PayrollPolicyStage />;
    case 3: return <CorporateInfoStage />;
    case 4: return <EmployeeDataStage />;
    case 5: return <BudgetCalculationStage />;
    case 6: return <ReviewStage role="Operation" />;
    case 7: return <RiskReviewStage />;
    case 8: return <ReviewStage role="Finance" final />;
    default: return <div>Stage Content Placeholder</div>;
  }
}

// --- SUB-COMPONENTS FOR STAGES ---

function LoginStage() {
  return (
    <div className="space-y-4">
      <div className="message-strip-info">
        <AlertCircle size={14} className="shrink-0" />
        <div>
          <p className="font-bold uppercase tracking-wider text-[10px]">Verification Required</p>
          <p className="mt-0.5 opacity-80">Please provide the registered phone number to verify your company account.</p>
        </div>
      </div>
      
      <div className="card-enterprise p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest">Phone Number</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="+95 9..." 
              className="input-enterprise flex-1"
            />
            <button className="btn-enterprise-primary">
              Verify Account
            </button>
          </div>
        </div>
        
        <div className="status-badge-success !px-3 !py-2 w-full justify-start rounded-[3px]">
          <CheckCircle2 size={14} />
          <div className="text-left">
            <p className="text-[11px] font-bold">Account Verified: Global Tech Solutions</p>
            <p className="text-[9px] opacity-80 font-mono mt-0.5">Registration ID: COM-2026-X881</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentStage() {
  const docs = [
    { name: "Business Registration (Form 6/26)", required: true, status: "uploaded" },
    { name: "Tax Clearance Certificate", required: true, status: "pending" },
    { name: "Director Identity Card / NRIC", required: true, status: "pending" },
    { name: "Bank Account Details (Company)", required: true, status: "pending" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#d1d9e0] pb-2">
        <h3 className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide">Required Documents</h3>
        <span className="text-[10px] text-[#5a6b7c] font-mono">Stage 1 of 4: Documentation</span>
      </div>
      <div className="grid gap-2.5">
        {docs.map((doc, i) => (
          <div key={i} className="card-enterprise p-2.5 flex items-center justify-between hover:bg-[#f8fafc] transition-all">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-1.5 rounded-[2px] border",
                doc.status === "uploaded" ? "bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]" : "bg-[#f5f5f5] text-[#90a4ae] border-[#e0e0e0]"
              )}>
                <FileCheck size={14} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1e3a5f]">{doc.name}</p>
                <p className="text-[9px] text-[#90a4ae] uppercase font-bold tracking-tight mt-0.5">{doc.required ? "Mandatory" : "Optional"}</p>
              </div>
            </div>
            {doc.status === "uploaded" ? (
              <div className="flex items-center gap-2">
                <span className="status-badge-success">Verified</span>
                <button className="text-[#90a4ae] hover:text-[#1e3a5f]"><Download size={14} /></button>
              </div>
            ) : (
              <button className="btn-enterprise-secondary !px-2.5 !py-1 !text-[10px]">
                <Upload size={12} />
                <span>Upload</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PayrollPolicyStage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">Working Days</label>
          <div className="flex flex-wrap gap-1">
            {days.map(day => (
              <button 
                key={day}
                className={cn(
                  "w-7 h-7 rounded-[2px] text-[9px] font-bold border transition-all",
                  ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day) 
                    ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" 
                    : "bg-white text-[#90a4ae] border-[#d1d9e0] hover:border-[#1e3a5f]"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">Repayment Day</label>
          <select className="select-enterprise w-full">
            <option>Last Day of Month (30th/31st)</option>
            <option>25th of Month</option>
            <option>5th of Next Month</option>
          </select>
        </div>
      </div>

      <div className="card-enterprise p-4 space-y-3 border-t-3 border-t-[#0ea5e9]">
        <h4 className="text-[10px] font-bold text-[#0ea5e9] uppercase tracking-[0.2em] flex items-center gap-2">
          <Clock size={14} />
          Payroll Cycle Configuration
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] text-[#5a6b7c] uppercase font-bold tracking-wider">Cycle Start / Cut-off</label>
            <input type="number" defaultValue={25} className="input-enterprise" />
            <p className="text-[9px] text-[#90a4ae] italic">Day of month calculation ends.</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] text-[#5a6b7c] uppercase font-bold tracking-wider">EWA Eligibility Range</label>
            <div className="flex items-center gap-2">
              <input type="number" defaultValue={1} className="input-enterprise text-center" />
              <span className="text-[#90a4ae] text-[10px]">to</span>
              <input type="number" defaultValue={24} className="input-enterprise text-center" />
            </div>
            <p className="text-[9px] text-[#90a4ae] italic">Advance request window.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">Effective Date</label>
          <input type="date" className="input-enterprise" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">End Date (Optional)</label>
          <input type="date" className="input-enterprise" />
        </div>
      </div>
    </div>
  );
}

function CorporateInfoStage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">Company Legal Name</label>
          <input type="text" defaultValue="Global Tech Solutions Co., Ltd" className="input-enterprise" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">Registration Number</label>
          <input type="text" defaultValue="REG-123456789" className="input-enterprise" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">Headquarters Address</label>
          <textarea rows={2} className="input-enterprise resize-none"></textarea>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">Owner / Representative</label>
          <input type="text" className="input-enterprise" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">NRIC / Passport ID</label>
          <input type="text" className="input-enterprise" />
        </div>
      </div>
    </div>
  );
}

function EmployeeDataStage() {
  const [employees] = useState(MOCK_EMPLOYEES);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="btn-enterprise-secondary !px-2.5 !py-1 !text-[10px]">
            <Download size={12} />
            <span>Template</span>
          </button>
          <button className="btn-enterprise-primary !px-2.5 !py-1 !text-[10px]">
            <Upload size={12} />
            <span>Upload CSV</span>
          </button>
        </div>
        <div className="relative w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#90a4ae]" size={12} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="input-enterprise pl-8 !py-1 !text-[10px]"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 card-enterprise overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#f8fafc] z-10 border-b border-[#d1d9e0]">
              <tr>
                <th className="px-3 py-2 text-[9px] font-bold text-[#5a6b7c] uppercase tracking-wider">Name</th>
                <th className="px-3 py-2 text-[9px] font-bold text-[#5a6b7c] uppercase tracking-wider">Position</th>
                <th className="px-3 py-2 text-[9px] font-bold text-[#5a6b7c] uppercase tracking-wider">Salary</th>
                <th className="px-3 py-2 text-[9px] font-bold text-[#5a6b7c] uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-[9px] font-bold text-[#5a6b7c] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {employees.map((emp: any) => (
                <tr key={emp.id} className="hover:bg-[#f8fafc] transition-colors group">
                  <td className="px-3 py-1.5">
                    <p className="text-[11px] font-bold text-[#1e3a5f]">{emp.name}</p>
                    <p className="text-[9px] font-mono text-[#90a4ae] tracking-tighter">{emp.id}</p>
                  </td>
                  <td className="px-3 py-1.5 text-[10px] text-[#5a6b7c]">{emp.position}</td>
                  <td className="px-3 py-1.5 text-[10px] font-mono text-[#1e3a5f] font-bold">MMK {emp.salary.toLocaleString()}</td>
                  <td className="px-3 py-1.5">
                    <span className={cn(
                      "status-badge-neutral !px-1.5 !py-0.5 !text-[8px]",
                      emp.isEwaEligible && "status-badge-success"
                    )}>
                      {emp.isEwaEligible ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    <button className="text-[#90a4ae] hover:text-[#0ea5e9] transition-colors"><ChevronRight size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        <div className="card-enterprise p-2">
          <p className="text-[8px] text-[#5a6b7c] uppercase tracking-widest font-bold">Employees</p>
          <p className="text-[13px] font-bold text-[#1e3a5f] mt-0.5">1,248</p>
        </div>
        <div className="card-enterprise p-2 border-t-2 border-t-[#2e7d32]">
          <p className="text-[8px] text-[#2e7d32] uppercase tracking-widest font-bold">Verified</p>
          <p className="text-[13px] font-bold text-[#2e7d32] mt-0.5">982</p>
        </div>
        <div className="card-enterprise p-2">
          <p className="text-[8px] text-[#5a6b7c] uppercase tracking-widest font-bold">Net Salary</p>
          <p className="text-[12px] font-bold text-[#1e3a5f] mt-0.5 font-mono">450.5M</p>
        </div>
        <div className="card-enterprise p-2 border-t-2 border-t-[#0ea5e9]">
          <p className="text-[8px] text-[#0ea5e9] uppercase tracking-widest font-bold">Budget Est.</p>
          <p className="text-[12px] font-bold text-[#0ea5e9] mt-0.5 font-mono">135.2M</p>
        </div>
      </div>
    </div>
  );
}

function BudgetCalculationStage() {
  return (
    <div className="space-y-4 flex flex-col items-center py-2">
      <div className="w-10 h-10 rounded-full bg-[#e3f2fd] flex items-center justify-center border border-[#bbdefb] mb-1">
        <Calculator size={18} className="text-[#1565c0]" />
      </div>
      <div className="text-center max-w-md">
        <h3 className="text-[12px] font-bold text-[#1e3a5f] tracking-tight uppercase">Budget Calculation</h3>
        <p className="text-[10px] text-[#5a6b7c] mt-0.5">Based on verified employees and standard EWA policy (30% cap).</p>
      </div>

      <div className="w-full max-w-sm card-enterprise overflow-hidden border-t-2 border-t-[#1e3a5f]">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2 text-[11px]">
            <span className="text-[#5a6b7c] font-medium">Verified Salary</span>
            <span className="font-mono text-[#1e3a5f] font-bold">MMK 450,500,000</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2 text-[11px]">
            <span className="text-[#5a6b7c] font-medium">EWA Advance Cap</span>
            <span className="font-mono text-[#0ea5e9] font-bold">30%</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-bold text-[#1e3a5f] uppercase tracking-wider">Total Budget</span>
            <span className="text-[15px] font-bold text-[#0ea5e9] font-mono tracking-tight">MMK 135,150,000</span>
          </div>
        </div>
        <div className="bg-[#f8fafc] px-3 py-2 border-t border-[#d1d9e0] flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-[#2e7d32]" />
          <p className="text-[9px] text-[#5a6b7c] italic font-medium uppercase tracking-tight">Verified by Risk Engine v2.0</p>
        </div>
      </div>
    </div>
  );
}

function RiskReviewStage() {
  const [selectedFee, setSelectedFee] = useState(MOCK_FEES[0]);

  return (
    <div className="space-y-4">
      <div className="message-strip-warning">
        <ShieldCheck size={14} className="shrink-0" />
        <div>
          <p className="font-bold uppercase tracking-wider text-[10px]">Risk Assessment Mode</p>
          <p className="mt-0.5 opacity-80">Assigned to: <span className="font-bold italic underline">Risk Reviewer (Level 2)</span></p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block">Select Fee Structure</label>
        <div className="grid grid-cols-3 gap-2.5">
          {MOCK_FEES.map(fee => (
            <button 
              key={fee.id}
              onClick={() => setSelectedFee(fee)}
              className={cn(
                "card-enterprise p-2.5 text-left transition-all relative",
                selectedFee.id === fee.id ? "border-[#0ea5e9] bg-[#f0f9ff] ring-1 ring-[#0ea5e9]/20" : "hover:bg-[#f8fafc]"
              )}
            >
              <p className="text-[8px] text-[#90a4ae] font-mono tracking-widest mb-0.5 uppercase font-bold">{fee.id}</p>
              <h5 className="text-[11px] font-bold text-[#1e3a5f] leading-tight truncate">{fee.name}</h5>
              <p className="text-[11px] text-[#0ea5e9] font-bold mt-1 font-mono">
                {fee.calculationType === 'fixed' ? `$${fee.value.toFixed(2)}` : `${fee.value}%`}
              </p>
              {selectedFee.id === fee.id && <div className="absolute top-2 right-2"><CheckCircle2 size={10} className="text-[#0ea5e9]" /></div>}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-[#d1d9e0]">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest">Operational Limits</label>
          <button className="flex items-center gap-1 text-[9px] font-bold text-[#0ea5e9] uppercase hover:underline">
            <PlayCircle size={11} />
            Simulation
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] text-[#90a4ae] uppercase font-bold">Min (MMK)</label>
            <input type="number" defaultValue={5000} className="input-enterprise font-mono !text-[#1e3a5f]" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-[#90a4ae] uppercase font-bold">Max (MMK)</label>
            <input type="number" defaultValue={500000} className="input-enterprise font-mono !text-[#1e3a5f]" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-[#90a4ae] uppercase font-bold">Count</label>
            <input type="number" defaultValue={4} className="input-enterprise font-mono !text-[#1e3a5f]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewStage({ role, final }: { role: string; final?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-[#d1d9e0] pb-3">
        <div className="w-8 h-8 rounded-full bg-[#f8fafc] border border-[#d1d9e0] flex items-center justify-center text-[#1e3a5f]">
          <User size={16} />
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide">{role} Approval</h3>
          <p className="text-[9px] text-[#5a6b7c] font-medium uppercase tracking-wider">Final validation of policies and risk factors.</p>
        </div>
      </div>

      <div className="grid gap-2">
        <div className="card-enterprise p-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#2e7d32]" />
            <span className="font-bold text-[#1e3a5f]">Compliance Documents Verified</span>
          </div>
          <button className="text-[10px] text-[#0ea5e9] font-bold uppercase tracking-wider hover:underline">View</button>
        </div>
        <div className="card-enterprise p-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#2e7d32]" />
            <span className="font-bold text-[#1e3a5f]">Payroll Policy Validated</span>
          </div>
          <button className="text-[10px] text-[#0ea5e9] font-bold uppercase tracking-wider hover:underline">View</button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest block flex items-center gap-2">
          <MessageSquare size={12} />
          Reviewer Comments
        </label>
        <textarea 
          placeholder="Add final remarks..."
          className="input-enterprise min-h-[80px] resize-none !p-2 text-[11px]"
        ></textarea>
      </div>

      {!final && (
        <div className="flex items-center gap-3 pt-1">
          <button className="btn-enterprise-danger flex-1 uppercase tracking-widest text-[10px] !py-1.5">
            Reject
          </button>
          <button className="btn-enterprise-secondary flex-1 uppercase tracking-widest text-[10px] !py-1.5">
            Return to HR
          </button>
        </div>
      )}
    </div>
  );
}


