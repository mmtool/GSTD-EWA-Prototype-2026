/**
 * AdminPage — Platform Admin Configuration
 * Design: Neobrutalist Fintech — System configuration, role management, policies, and audit log
 */
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMMK } from "@/data/mockData";
import { Settings, Users, Lock, FileText, ShieldCheck, Key, Globe, Eye } from "lucide-react";
import { useState } from "react";
import {
  EnterpriseCard,
  EnterpriseBadge,
  EnterpriseButton,
  LedgerDivider,
  EnterpriseTable,
  ColumnDef,
  TableAction
} from "@/components/EnterpriseComponents";

interface ViewType {
  id: string;
  label: string;
  description: string;
  modules: string[];
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  module: string;
  timestamp: string;
  details: string;
}

const viewTypes: ViewType[] = [
  { id: "HR", label: "HR", description: "Employee lifecycle, onboarding, payroll oversight", modules: ["Dashboard", "Employees", "Onboarding", "Payroll", "Reports"] },
  { id: "Sales", label: "Sales", description: "Corporate portfolio, revenue, client health", modules: ["Dashboard", "Onboarding", "Companies", "Budget", "Reports"] },
  { id: "Operations", label: "Operations", description: "Daily operations, disbursements, settlements", modules: ["Dashboard", "Employees", "Transactions", "Repayment", "Settlement", "Reports"] },
  { id: "Back Office", label: "Back Office", description: "Transaction processing, verification, reconciliation", modules: ["Dashboard", "Transactions", "Repayment", "Settlement", "Errors", "Workflow"] },
  { id: "Finance", label: "Finance", description: "GL ledger, accounting entries, financial health", modules: ["Dashboard", "Circle Ledger", "Fee Builder", "Reports", "Repayment"] },
  { id: "Risk", label: "Risk", description: "Credit risk, compliance, fraud detection", modules: ["Dashboard", "Risk", "Write-Off", "Reports"] },
  { id: "Platform Admin", label: "Platform Admin", description: "System configuration, policies, platform health", modules: ["All Modules"] },
];

const auditLog: AuditLog[] = [
  { id: "AUD-001", action: "Policy Updated", user: "Finance Manager", module: "Fee Builder", timestamp: "2026-07-12 10:30", details: "Late fee rate changed from 0.1% to 0.15% for Skyline Trading" },
  { id: "AUD-002", action: "Employee Verified", user: "Operations Lead", module: "Employees", timestamp: "2026-07-12 09:45", details: "Htet Oo Kyaw — Employment verified and EWA auto-approved" },
  { id: "AUD-003", action: "Budget Allocated", user: "Sales Manager", module: "Budget", timestamp: "2026-07-12 08:00", details: "Golden Harvest Foods budget increased to 15,000,000 MMK" },
  { id: "AUD-004", action: "Company Onboarded", user: "Back Office", module: "Onboarding", timestamp: "2026-07-11 16:00", details: "Golden Harvest Foods moved to ACTIVE status" },
  { id: "AUD-005", action: "Risk Assessment", user: "Risk Analyst", module: "Risk", timestamp: "2026-07-11 14:00", details: "Skyline Trading credit score recalculated to 78" },
];

export function AdminPage() {
  const [enabledModules, setEnabledModules] = useState<string[]>([
    "dashboard", "employees", "onboarding", "transactions", "repayment",
    "circle-ledger", "fee-builder", "budget", "risk", "reports",
    "settlement", "payroll", "workflow", "writeoff", "form-creator", "notifications",
  ]);

  const viewTypeColumns: ColumnDef<ViewType>[] = [
    {
      id: "label",
      header: "View Type",
      accessor: (vt) => <EnterpriseBadge variant="info" className="bg-[#1e3a5f] text-white border-[#1e3a5f] font-bold">{vt.label}</EnterpriseBadge>,
      searchString: (vt) => vt.label
    },
    {
      id: "description",
      header: "Description",
      accessor: (vt) => <span className="text-[12px] text-[#5a6b7c]">{vt.description}</span>,
      searchString: (vt) => vt.description
    },
    {
      id: "modules",
      header: "Accessible Modules",
      accessor: (vt) => (
        <div className="flex flex-wrap gap-1">
          {vt.modules.map(m => (
            <span key={m} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-[#5a6b7c] font-bold uppercase tracking-wider">{m}</span>
          ))}
        </div>
      )
    }
  ];

  const auditColumns: ColumnDef<AuditLog>[] = [
    {
      id: "id",
      header: "Log ID",
      accessor: (a) => <span className="text-[11px] font-mono text-[#5a6b7c] font-bold">{a.id}</span>,
      searchString: (a) => a.id
    },
    {
      id: "action",
      header: "Action",
      accessor: (a) => <EnterpriseBadge variant="info">{a.action}</EnterpriseBadge>,
      searchString: (a) => a.action
    },
    {
      id: "user",
      header: "User",
      accessor: (a) => <span className="text-[12px] font-bold text-[#1e3a5f]">{a.user}</span>,
      searchString: (a) => a.user
    },
    {
      id: "module",
      header: "Module",
      accessor: (a) => <span className="text-[11px] font-bold text-[#5a6b7c] uppercase tracking-wider">{a.module}</span>
    },
    {
      id: "details",
      header: "Details",
      accessor: (a) => <span className="text-[11px] text-[#5a6b7c] max-w-[300px] truncate block">{a.details}</span>,
      searchString: (a) => a.details
    },
    {
      id: "timestamp",
      header: "Timestamp",
      accessor: (a) => <span className="text-[10px] font-mono text-[#90a4ae]">{a.timestamp}</span>
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-bold text-[#1e3a5f] uppercase tracking-wide">Platform Admin Configuration</h1>
          <p className="text-[10px] text-[#5a6b7c] uppercase tracking-wider mt-0.5">System configuration, role management, and audit log</p>
        </div>
      </div>

      <LedgerDivider />

      <Tabs defaultValue="modules" className="w-full">
        <TabsList>
          <TabsTrigger value="modules"><Settings className="w-3.5 h-3.5" /> Modules</TabsTrigger>
          <TabsTrigger value="roles"><Users className="w-3.5 h-3.5" /> View Types</TabsTrigger>
          <TabsTrigger value="audit"><FileText className="w-3.5 h-3.5" /> Audit Log</TabsTrigger>
          <TabsTrigger value="system"><Globe className="w-3.5 h-3.5" /> System</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="outline-none space-y-4">
          <EnterpriseCard className="p-4 border-[#d1d9e0] shadow-sm">
            <h3 className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-widest mb-4">Module Toggle</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: "dashboard", label: "Dashboard", desc: "KPI hub with role-adaptive metrics" },
                { key: "employees", label: "Employee Management", desc: "Employee lifecycle and verification" },
                { key: "onboarding", label: "Company Onboarding", desc: "Pipeline from submitted to active" },
                { key: "transactions", label: "Transaction Monitor", desc: "Full transaction lifecycle" },
                { key: "repayment", label: "Repayment & Settlement", desc: "Workflow and maker-checker" },
                { key: "circle-ledger", label: "Circle Ledger (GL)", desc: "Double-entry accounting" },
                { key: "fee-builder", label: "Fee Builder", desc: "Policy configuration per company" },
                { key: "budget", label: "Budget Management", desc: "Allocation and utilization" },
                { key: "risk", label: "Risk & Backoffice", desc: "Credit scoring and fraud detection" },
                { key: "reports", label: "Reports Center", desc: "Financial statements and audit trail" },
                { key: "settlement", label: "Settlement Verification", desc: "Maker-checker protocol" },
                { key: "payroll", label: "Payroll & Deduction", desc: "Deduction tracking and reconciliation" },
                { key: "workflow", label: "Workflow Engine", desc: "Case management and SLA" },
                { key: "writeoff", label: "Write-Off", desc: "Loss provision management" },
                { key: "form-creator", label: "Form Builder", desc: "EWA request form templates" },
                { key: "notifications", label: "Notifications", desc: "Multi-channel notifications" },
              ].map(mod => (
                <div key={mod.key} className="flex items-start gap-3 p-3 rounded-[3px] bg-[#f8fafc] border border-[#d1d9e0] transition-colors hover:bg-white">
                  <Switch checked={enabledModules.includes(mod.key)} onCheckedChange={(checked) => {
                    if (checked) setEnabledModules([...enabledModules, mod.key]);
                    else setEnabledModules(enabledModules.filter(k => k !== mod.key));
                  }} className="mt-1" />
                  <div>
                    <p className="text-[12px] font-bold text-[#1e3a5f]">{mod.label}</p>
                    <p className="text-[10px] text-[#5a6b7c] mt-0.5 leading-tight">{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </EnterpriseCard>
        </TabsContent>

        <TabsContent value="roles" className="outline-none">
          <EnterpriseTable
            data={viewTypes}
            columns={viewTypeColumns}
            rowKey={(vt) => vt.id}
            searchPlaceholder="Search view types..."
          />
        </TabsContent>

        <TabsContent value="audit" className="outline-none">
          <EnterpriseTable
            data={auditLog}
            columns={auditColumns}
            rowKey={(a) => a.id}
            searchPlaceholder="Search audit log..."
          />
        </TabsContent>

        <TabsContent value="system" className="outline-none">
          <EnterpriseCard className="p-4 border-[#d1d9e0] shadow-sm space-y-3">
            <h3 className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-widest mb-2">System Configuration</h3>
            <div className="flex items-center justify-between p-3 rounded-[3px] bg-[#f8fafc] border border-[#d1d9e0]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e3f2fd] flex items-center justify-center">
                  <Lock className="w-4 h-4 text-[#0ea5e9]" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#1e3a5f]">Maker-Checker Enforcement</p>
                  <p className="text-[10px] text-[#5a6b7c]">Require two-person approval for settlements and write-offs</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-[3px] bg-[#f8fafc] border border-[#d1d9e0]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#1e3a5f]">Auto Approval for Trusted Employees</p>
                  <p className="text-[10px] text-[#5a6b7c]">Skip manual review for employees with both verifications passed</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-[3px] bg-[#f8fafc] border border-[#d1d9e0]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#fff8e1] flex items-center justify-center">
                  <Key className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#1e3a5f]">Late Fee Auto-Calculation</p>
                  <p className="text-[10px] text-[#5a6b7c]">Automatically calculate late fees based on configured slab rates</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-[3px] bg-[#f8fafc] border border-[#d1d9e0]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e8eaf6] flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#1e3a5f]">Currency: MMK (Myanmar Kyat)</p>
                  <p className="text-[10px] text-[#5a6b7c]">Platform default currency for all transactions</p>
                </div>
              </div>
              <EnterpriseBadge variant="neutral" className="text-[9px] font-bold">LOCKED</EnterpriseBadge>
            </div>
          </EnterpriseCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

