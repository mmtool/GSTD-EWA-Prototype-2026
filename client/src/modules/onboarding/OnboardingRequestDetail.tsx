/**
 * Onboarding Request Detail View
 * Features: Stage-by-stage progress, current state details, and full audit trail timeline.
 */
import { motion } from "framer-motion";
import { 
  History, 
  User, 
  Clock, 
  MessageSquare, 
  FileText, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  ArrowLeft
} from "lucide-react";
import { OnboardingRequest, STAGE_NAMES } from "./types";
import { cn } from "@/lib/utils";

interface OnboardingRequestDetailProps {
  request: OnboardingRequest;
  onBack: () => void;
}

export default function OnboardingRequestDetail({ request, onBack }: OnboardingRequestDetailProps) {
  return (
    <div className="flex flex-col h-full bg-white text-[#1e3a5f] font-sans">
      {/* Header */}
      <div className="px-6 py-3 border-b border-[#d1d9e0] bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-1.5 hover:bg-[#f8fafc] rounded-[3px] text-[#5a6b7c] hover:text-[#1e3a5f] transition-all border border-transparent hover:border-[#d1d9e0]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-[#1e3a5f] tracking-tight uppercase">{request.companyName}</h2>
              <span className={cn(
                "status-badge-neutral uppercase tracking-widest !text-[9px] !px-2",
                request.status === 'approved' && "status-badge-success",
                request.status === 'pending_review' && "status-badge-warning"
              )}>
                {request.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-[10px] text-[#5a6b7c] uppercase tracking-widest font-bold mt-0.5">{request.id} • {request.type.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-enterprise-secondary !py-1.5 !px-4">
            Export Audit Log
          </button>
          <button className="btn-enterprise-primary !py-1.5 !px-4">
            Continue Workflow
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Content Area: Workflow Visualizer & Details */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
          {/* Stage Progress Visualizer */}
          <section className="card-enterprise p-4">
            <h3 className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
              <ShieldCheck size={14} className="text-[#0ea5e9]" />
              Workflow Progression
            </h3>
            <div className="relative flex justify-between items-start pt-2 px-3">
              {/* Connecting Line */}
              <div className="absolute top-[11px] left-[32px] right-[32px] h-[2px] bg-[#d1d9e0] z-0" />
              <div 
                className="absolute top-[11px] left-[32px] h-[2px] bg-[#0ea5e9] z-0 transition-all duration-1000" 
                style={{ width: `${Math.min((request.currentStage / (STAGE_NAMES.length - 1)) * 100, 100)}%` }}
              />
              
              {STAGE_NAMES.map((name, i) => {
                const isCompleted = i < request.currentStage;
                const isCurrent = i === request.currentStage;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 z-10 group relative">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-bold font-mono transition-all duration-300",
                      isCompleted 
                        ? "bg-[#2e7d32] border-[#2e7d32] text-white" 
                        : isCurrent 
                          ? "bg-[#0ea5e9] border-[#0ea5e9] text-white ring-2 ring-[#0ea5e9]/10" 
                          : "bg-white border-[#d1d9e0] text-[#90a4ae]"
                    )}>
                      {isCompleted ? <CheckCircle2 size={11} /> : <span>{i + 1}</span>}
                    </div>
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-tight w-14 text-center leading-tight transition-colors",
                      isCurrent ? "text-[#0ea5e9]" : isCompleted ? "text-[#2e7d32]" : "text-[#90a4ae]"
                    )}>
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Current Stage Details */}
          <section className="card-enterprise overflow-hidden">
            <div className="px-4 py-2 border-b border-[#d1d9e0] bg-[#f8fafc] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[#0ea5e9]" />
                <h4 className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-wider">Current Stage: {STAGE_NAMES[request.currentStage]}</h4>
              </div>
              <span className="text-[9px] text-[#5a6b7c] font-mono font-bold uppercase">Modified: {new Date(request.submissionDate).toLocaleDateString()}</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-4">
              <DetailBlock label="Assigned Role" value={request.currentStage >= 6 ? (request.currentStage === 6 ? "Operations" : request.currentStage === 7 ? "Risk" : "Finance") : "HR"} />
              <DetailBlock label="Budget Amount" value={`MMK ${request.budgetAmount.toLocaleString()}`} isMono />
              <DetailBlock label="Verification" value={request.employees.filter(e => e.verificationStatus === "verified").length + " / " + request.employees.length + " Staff"} />
              <DetailBlock label="Service Fee" value={request.selectedFees.length > 0 ? request.selectedFees[0].name : "Not Selected"} />
              <DetailBlock label="Repayment Fee" value={request.selectedFees.length > 1 ? request.selectedFees[1].name : "Not Selected"} />
              <DetailBlock label="Effective Date" value={request.payrollPolicy?.effectiveDate || "TBD"} />
            </div>
          </section>

          {/* Quick Info Sections */}
          <section className="grid grid-cols-2 gap-4">
            <div className="card-enterprise p-4 space-y-3">
              <h4 className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest flex items-center gap-2">
                <Building2 size={14} />
                Corporate Entity
              </h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between border-b border-dashed border-[#d1d9e0] pb-1">
                  <span className="text-[#90a4ae] font-bold uppercase tracking-tighter">Registration</span>
                  <span className="text-[#1e3a5f] font-mono font-bold">{request.corporateInfo?.registrationNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[#d1d9e0] pb-1">
                  <span className="text-[#90a4ae] font-bold uppercase tracking-tighter">Owner</span>
                  <span className="text-[#1e3a5f] font-bold">{request.corporateInfo?.ownerName || "N/A"}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#90a4ae] font-bold uppercase tracking-tighter">Phone</span>
                  <span className="text-[#1e3a5f] font-bold">{request.corporateInfo?.contactNumber || "N/A"}</span>
                </div>
              </div>
              <button className="w-full btn-enterprise-secondary !text-[9px] !py-1">
                View Full Profile
              </button>
            </div>

            <div className="card-enterprise p-4 space-y-3">
              <h4 className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} />
                Attachments ({request.documents.length})
              </h4>
              <div className="space-y-1.5">
                {request.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-1.5 hover:bg-[#f8fafc] rounded-[2px] border border-transparent hover:border-[#d1d9e0] transition-all group">
                    <div className="flex items-center gap-2">
                      <FileText size={12} className="text-[#90a4ae]" />
                      <span className="text-[11px] font-medium text-[#1e3a5f]">{doc.name}</span>
                    </div>
                    <button className="text-[9px] font-bold text-[#0ea5e9] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Audit Trail Timeline */}
        <div className="w-80 border-l border-[#d1d9e0] bg-white flex flex-col">
          <div className="p-5 border-b border-[#d1d9e0] bg-[#f8fafc]">
            <h3 className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-widest flex items-center gap-2">
              <History size={16} className="text-[#0ea5e9]" />
              Audit Log
            </h3>
            <p className="text-[9px] text-[#5a6b7c] mt-1 font-medium">Activity and workflow history.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5">
            <div className="relative space-y-6 before:absolute before:left-[13.5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#d1d9e0]">
              {request.auditTrail.map((entry, i) => (
                <div key={entry.id} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={cn(
                    "absolute left-0 w-7 h-7 rounded-full border flex items-center justify-center bg-white z-10 transition-all",
                    i === 0 ? "border-[#0ea5e9] text-[#0ea5e9] ring-2 ring-[#0ea5e9]/5" : "border-[#d1d9e0] text-[#90a4ae]"
                  )}>
                    {entry.stage >= 6 ? <ShieldCheck size={12} /> : <User size={12} />}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#1e3a5f] uppercase tracking-tight">{entry.action}</span>
                      <span className="text-[9px] text-[#90a4ae] font-mono">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#0ea5e9] font-bold uppercase">{entry.actorName}</span>
                      <span className="text-[9px] text-[#90a4ae] font-medium italic">({entry.actorRole})</span>
                    </div>
                    {entry.comment && (
                      <div className="mt-1.5 p-2 bg-[#f8fafc] border-l-2 border-[#0ea5e9] rounded-r-[2px] text-[10px] text-[#5a6b7c] leading-relaxed border border-[#d1d9e0] border-l-0">
                        "{entry.comment}"
                      </div>
                    )}
                    <p className="text-[8px] text-[#90a4ae] mt-1 font-bold uppercase tracking-widest">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-[#d1d9e0] bg-[#f8fafc]">
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-[#90a4ae]" size={12} />
              <textarea 
                placeholder="Audit comment..."
                className="input-enterprise min-h-[70px] !pl-8 !py-2 !text-[11px] resize-none"
              ></textarea>
            </div>
            <button className="btn-enterprise-primary w-full mt-2 !py-2 !text-[10px] uppercase tracking-[0.2em]">
              Submit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ label, value, isMono }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[8px] text-[#5a6b7c] uppercase font-bold tracking-wider">{label}</p>
      <p className={cn(
        "text-[11px] text-[#1e3a5f] font-bold",
        isMono && "font-mono tracking-tighter"
      )}>{value}</p>
    </div>
  );
}

