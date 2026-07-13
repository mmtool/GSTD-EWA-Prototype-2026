/**
 * FeeHierarchyPage — Fee Hierarchy Engine
 * Each tier: 2 types (percent / flat), attribute rules, logical conditions
 * Attributes: Late Day, Employee Tenure, Count per Circle, Day, Amount
 * Priority-based condition rule matching
 * Design: Enterprise Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 */
import { useState } from "react";
import {
  EnterpriseCard,
  EnterpriseBadge,
  EnterpriseButton,
  LedgerDivider,
  EnterpriseTable,
  EnterpriseKpiCard,
  ColumnDef,
  TableAction
} from "@/components/EnterpriseComponents";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pyramid, Plus, Eye, Settings, Clock, Calendar, Users, TrendingUp, Filter, Calculator, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "MMK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

type FeeType = "PERCENT" | "FLAT";
type LogicalOp = "AND" | "OR" | "NOT";
type ConditionAttribute = "LATE_DAY" | "EMPLOYEE_TENURE" | "COUNT_PER_CIRCLE" | "DAY" | "AMOUNT" | "TENURE_MONTHS";
type ConditionOperator = "GT" | "GTE" | "LT" | "LTE" | "EQ" | "BETWEEN";

interface FeeCondition {
  id: string;
  attribute: ConditionAttribute;
  operator: ConditionOperator;
  value: string;
  logicalOp: LogicalOp;
}

interface FeeTier {
  id: string;
  name: string;
  tierLevel: number;
  feeType: FeeType;
  value: number;
  priority: number;
  conditions: FeeCondition[];
  applicableTo: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
}

const feeTiers: FeeTier[] = [
  { id: "FT-001", name: "Standard Disbursement Fee", tierLevel: 1, feeType: "PERCENT", value: 1.5, priority: 1, conditions: [
    { id: "FC-001", attribute: "AMOUNT", operator: "GTE", value: "0", logicalOp: "AND" },
    { id: "FC-002", attribute: "AMOUNT", operator: "LT", value: "50000", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-002", name: "Mid-Tier Disbursement Fee", tierLevel: 2, feeType: "PERCENT", value: 1.0, priority: 2, conditions: [
    { id: "FC-003", attribute: "AMOUNT", operator: "GTE", value: "50000", logicalOp: "AND" },
    { id: "FC-004", attribute: "AMOUNT", operator: "LT", value: "100000", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-003", name: "High-Tier Disbursement Fee", tierLevel: 3, feeType: "PERCENT", value: 0.75, priority: 3, conditions: [
    { id: "FC-005", attribute: "AMOUNT", operator: "GTE", value: "100000", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-004", name: "Late Repayment Penalty", tierLevel: 1, feeType: "PERCENT", value: 5.0, priority: 10, conditions: [
    { id: "FC-006", attribute: "LATE_DAY", operator: "GT", value: "0", logicalOp: "AND" },
    { id: "FC-007", attribute: "LATE_DAY", operator: "LT", value: "7", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-005", name: "Extended Late Penalty", tierLevel: 2, feeType: "PERCENT", value: 10.0, priority: 20, conditions: [
    { id: "FC-008", attribute: "LATE_DAY", operator: "GTE", value: "7", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-006", name: "Flat Service Fee — All Tiers", tierLevel: 0, feeType: "FLAT", value: 1500, priority: 0, conditions: [
    { id: "FC-009", attribute: "DAY", operator: "BETWEEN", value: "1,7", logicalOp: "AND" },
  ], applicableTo: "All", status: "ACTIVE" },
  { id: "FT-007", name: "New Employee Discount", tierLevel: 0, feeType: "PERCENT", value: -50, priority: 50, conditions: [
    { id: "FC-010", attribute: "EMPLOYEE_TENURE", operator: "LT", value: "3", logicalOp: "AND" },
    { id: "FC-011", attribute: "TENURE_MONTHS", operator: "LT", value: "6", logicalOp: "AND" },
  ], applicableTo: "New Employee (< 6 months)", status: "ACTIVE" },
  { id: "FT-008", name: "Loyal Employee Reduction", tierLevel: 0, feeType: "PERCENT", value: -25, priority: 40, conditions: [
    { id: "FC-012", attribute: "COUNT_PER_CIRCLE", operator: "GTE", value: "10", logicalOp: "AND" },
    { id: "FC-013", attribute: "TENURE_MONTHS", operator: "GTE", value: "12", logicalOp: "AND" },
  ], applicableTo: "Loyal Employee (12+ months, 10+ txns)", status: "ACTIVE" },
];

export function FeeHierarchyPage() {
  const [selectedTier, setSelectedTier] = useState<FeeTier | null>(null);

  const tierColumns: ColumnDef<FeeTier>[] = [
    {
      id: "id",
      header: "Tier ID",
      accessor: (ft) => <span className="font-mono font-bold text-[#1e3a5f]">{ft.id}</span>,
      searchString: (ft) => ft.id
    },
    {
      id: "name",
      header: "Rule Name / Definition",
      accessor: (ft) => (
        <div>
          <p className="text-[12px] font-bold text-[#1e3a5f]">{ft.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] text-[#5a6b7c] uppercase tracking-wider bg-[#f0f4f7] px-1 rounded-[1px]">Level {ft.tierLevel}</span>
            <span className="text-[9px] text-[#5a6b7c] uppercase tracking-wider bg-[#f0f4f7] px-1 rounded-[1px]">Priority {ft.priority}</span>
          </div>
        </div>
      ),
      searchString: (ft) => ft.name
    },
    {
      id: "type",
      header: "Fee Type",
      accessor: (ft) => <EnterpriseBadge variant={ft.feeType === "PERCENT" ? "info" : "success"}>{ft.feeType}</EnterpriseBadge>
    },
    {
      id: "value",
      header: "Value Adjustment",
      isNumeric: true,
      align: "right",
      accessor: (ft) => (
        <span className={cn("font-mono font-bold text-[12px]", ft.value < 0 ? "text-[#2e7d32]" : "text-[#e65100]")}>
          {ft.feeType === "PERCENT" ? (ft.value > 0 ? "+" : "") + ft.value + "%" : formatMMK(ft.value)}
        </span>
      )
    },
    {
      id: "conditions",
      header: "Logic Depth",
      accessor: (ft) => <span className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest">{ft.conditions.length} Conditions</span>
    },
    {
      id: "status",
      header: "State",
      accessor: (ft) => <EnterpriseBadge variant={ft.status === "ACTIVE" ? "success" : "neutral"}>{ft.status}</EnterpriseBadge>
    }
  ];

  const tierActions: TableAction<FeeTier>[] = [
    {
      label: "View Logic Flow",
      icon: <Eye className="w-3.5 h-3.5" />,
      onClick: (ft) => setSelectedTier(ft)
    },
    {
      label: "Modify Tier",
      icon: <Settings className="w-3.5 h-3.5" />,
      onClick: (ft) => console.log("Edit", ft.id)
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pyramid className="w-5 h-5 text-[#0ea5e9]" />
          <div>
            <h1 className="text-[15px] font-bold text-[#1e3a5f] uppercase tracking-wide">Fee Hierarchy & Rule Engine</h1>
            <p className="text-[10px] text-[#5a6b7c] uppercase tracking-wider mt-0.5">Attribute-based priority matching for dynamic fee calculation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EnterpriseButton variant="primary" className="h-8 py-0 px-3 flex items-center gap-1 text-[10px] bg-[#1e3a5f]">
            <Plus className="w-3.5 h-3.5" /> Define Logic Tier
          </EnterpriseButton>
        </div>
      </div>

      <LedgerDivider />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <EnterpriseKpiCard
          label="Active Fee Tiers"
          value={feeTiers.filter(t => t.status === "ACTIVE").length}
          accentColor="info"
          icon={<Pyramid className="w-3.5 h-3.5 text-[#0d47a1]" />}
        />
        <EnterpriseKpiCard
          label="Logic Conditions"
          value={feeTiers.reduce((sum, t) => sum + t.conditions.length, 0)}
          accentColor="neutral"
          icon={<Settings className="w-3.5 h-3.5 text-[#5a6b7c]" />}
        />
        <EnterpriseKpiCard
          label="Average Fee (Net)"
          value="1.24%"
          accentColor="success"
          icon={<TrendingUp className="w-3.5 h-3.5 text-[#2e7d32]" />}
        />
        <EnterpriseKpiCard
          label="Rule Precision"
          value="99.9%"
          accentColor="success"
          icon={<ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />}
        />
      </div>

      <Tabs defaultValue="tiers" className="w-full">
        <TabsList>
          <TabsTrigger value="tiers">Tier Registry</TabsTrigger>
          <TabsTrigger value="conditions">Universal Rules</TabsTrigger>
          <TabsTrigger value="simulator">Fee Simulator</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="mt-4 outline-none">
          <EnterpriseTable
            data={feeTiers}
            columns={tierColumns}
            rowKey={(ft) => ft.id}
            actions={tierActions}
            searchPlaceholder="Search tiers or definitions..."
          />
          
          {selectedTier && (
            <EnterpriseCard className="mt-6 p-6 border-[#d1d9e0] bg-[#f8fafc]">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                   <Pyramid className="w-4 h-4 text-[#1e3a5f]" />
                   <h3 className="text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wider">{selectedTier.name} — Logical Breakdown</h3>
                 </div>
                 <EnterpriseButton variant="secondary" className="h-7 text-[10px]" onClick={() => setSelectedTier(null)}>Close Analysis</EnterpriseButton>
               </div>
               
               <div className="grid grid-cols-4 gap-6 mb-8">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest">Hierarchy Depth</p>
                    <p className="text-[14px] font-bold text-[#1e3a5f]">Level {selectedTier.tierLevel}</p>
                    <p className="text-[10px] text-[#5a6b7c]">Priority Ranking: {selectedTier.priority}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest">Calculated Value</p>
                    <p className={cn("text-[14px] font-mono font-bold", selectedTier.value < 0 ? "text-[#2e7d32]" : "text-[#e65100]")}>
                      {selectedTier.feeType === "PERCENT" ? (selectedTier.value > 0 ? "+" : "") + selectedTier.value + "%" : formatMMK(selectedTier.value)}
                    </p>
                    <p className="text-[10px] text-[#5a6b7c] uppercase">Mode: {selectedTier.feeType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest">Application Scope</p>
                    <p className="text-[12px] font-bold text-[#1e3a5f] uppercase">{selectedTier.applicableTo}</p>
                    <p className="text-[10px] text-[#5a6b7c]">Target Entity</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest">Registry Status</p>
                    <EnterpriseBadge variant={selectedTier.status === "ACTIVE" ? "success" : "neutral"}>{selectedTier.status}</EnterpriseBadge>
                    <p className="text-[10px] text-[#5a6b7c] uppercase mt-1">Live Environment</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#1e3a5f]" />
                    <p className="text-[10px] font-bold text-[#1e3a5f] uppercase tracking-widest">Rule Conditional Logic (Sequential Chain)</p>
                  </div>
                  
                  <div className="border border-[#d1d9e0] rounded-[2px] overflow-hidden">
                    <EnterpriseTable
                      data={selectedTier.conditions}
                      columns={[
                        { id: "id", header: "ID", accessor: (c) => <span className="text-[10px] font-mono text-[#5a6b7c]">{c.id}</span> },
                        { id: "attr", header: "Attribute", accessor: (c) => {
                          const icons: Record<string, any> = { LATE_DAY: Clock, EMPLOYEE_TENURE: Calendar, AMOUNT: TrendingUp, COUNT_PER_CIRCLE: Users };
                          const Icon = icons[c.attribute] || Settings;
                          return (
                            <div className="flex items-center gap-1.5">
                              <Icon className="w-3 h-3 text-[#5a6b7c]" />
                              <span className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-tight">{c.attribute.replace("_", " ")}</span>
                            </div>
                          );
                        }},
                        { id: "op", header: "Operator", accessor: (c) => <span className="text-[10px] font-bold text-[#1e3a5f] bg-[#f0f4f7] px-1.5 py-0.5 rounded-[2px]">{c.operator}</span> },
                        { id: "val", header: "Value", accessor: (c) => <span className="text-[11px] font-mono font-bold text-[#1e3a5f]">{c.value}</span> },
                        { id: "link", header: "Linkage", accessor: (c) => <EnterpriseBadge variant={c.logicalOp === "AND" ? "info" : "warning"}>{c.logicalOp}</EnterpriseBadge> }
                      ]}
                      rowKey={(c) => c.id}
                    />
                  </div>

                  <div className="p-4 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-[2px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-3.5 h-3.5 text-[#1e3a5f]" />
                      <p className="text-[9px] font-bold text-[#1e3a5f] uppercase tracking-widest">Evaluation Pseudocode</p>
                    </div>
                    <p className="text-[11px] font-mono text-[#5a6b7c] leading-relaxed">
                      IF {selectedTier.conditions.map((c, i) => (
                        <span key={c.id}>
                          {i > 0 && <span className="text-[#0ea5e9] font-bold"> {c.logicalOp} </span>}
                          ({c.attribute} {c.operator} {c.value})
                        </span>
                      ))} THEN APPLY <span className="text-[#e65100] font-bold">{selectedTier.value}{selectedTier.feeType === "PERCENT" ? "%" : " MMK"}</span>
                    </p>
                  </div>
               </div>
            </EnterpriseCard>
          )}
        </TabsContent>

        <TabsContent value="conditions" className="mt-4 outline-none">
           <EnterpriseTable
              data={feeTiers.flatMap(ft => ft.conditions.map(c => ({ ...c, tierName: ft.name })))}
              columns={[
                { id: "id", header: "Rule ID", accessor: (c) => <span className="text-[10px] font-mono text-[#5a6b7c]">{c.id}</span> },
                { id: "tier", header: "Associated Tier", accessor: (c) => <span className="text-[11px] font-bold text-[#1e3a5f]">{c.tierName}</span> },
                { id: "attr", header: "Attribute", accessor: (c) => <span className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-tight">{c.attribute.replace("_", " ")}</span> },
                { id: "logic", header: "Logic Statement", accessor: (c) => (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#5a6b7c] uppercase font-bold">{c.operator}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className="text-[11px] font-mono font-bold text-[#1e3a5f]">{c.value}</span>
                  </div>
                )},
                { id: "op", header: "Chain Op", accessor: (c) => <EnterpriseBadge variant="neutral">{c.logicalOp}</EnterpriseBadge> }
              ]}
              rowKey={(c) => c.id}
              searchPlaceholder="Search rule logic or tier names..."
           />
        </TabsContent>

        <TabsContent value="simulator" className="mt-4 outline-none">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EnterpriseCard className="p-6 border-[#d1d9e0]">
                <div className="flex items-center gap-2 mb-6">
                  <Calculator className="w-4 h-4 text-[#1e3a5f]" />
                  <h3 className="text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wider">Fee Calculation Simulator</h3>
                </div>
                
                <div className="space-y-6">
                   <div className="p-4 bg-[#f8fafc] border border-[#d1d9e0] rounded-[2px] space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest">Transaction Amount (MMK)</label>
                        <input type="text" defaultValue="75,000" className="w-full bg-white border border-[#d1d9e0] rounded-[2px] px-3 py-2 text-[13px] font-mono font-bold text-[#1e3a5f] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest">Late Period (Days)</label>
                        <input type="text" defaultValue="0" className="w-full bg-white border border-[#d1d9e0] rounded-[2px] px-3 py-2 text-[13px] font-mono font-bold text-[#1e3a5f] outline-none" />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#5a6b7c]">Primary Tier Match:</span>
                        <span className="font-bold text-[#1e3a5f] uppercase tracking-tight">FT-002 (Mid-Tier)</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#5a6b7c]">Calculated Tier Fee (1.0%):</span>
                        <span className="font-mono font-bold text-[#1e3a5f]">750 MMK</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#5a6b7c]">Flat Service Fee:</span>
                        <span className="font-mono font-bold text-[#1e3a5f]">1,500 MMK</span>
                      </div>
                      <LedgerDivider />
                      <div className="flex justify-between items-center text-[13px] font-bold">
                        <span className="text-[#1e3a5f] uppercase tracking-widest">Total Estimated Fee:</span>
                        <span className="font-mono text-[#e65100]">2,250 MMK</span>
                      </div>
                   </div>

                   <EnterpriseButton variant="primary" className="w-full bg-[#1e3a5f] uppercase tracking-widest text-[10px] font-bold h-10">
                     Recalculate Estimate
                   </EnterpriseButton>
                </div>
              </EnterpriseCard>

              <EnterpriseCard className="p-6 border-[#d1d9e0] bg-[#f8fafc]">
                 <div className="flex items-center gap-2 mb-6">
                  <Pyramid className="w-4 h-4 text-[#1e3a5f]" />
                  <h3 className="text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wider">Evaluation Priority Map</h3>
                </div>
                
                <div className="space-y-3">
                   {feeTiers.sort((a, b) => a.priority - b.priority).map((ft, i) => (
                     <div key={ft.id} className="flex items-center gap-3 p-3 bg-white border border-[#d1d9e0] rounded-[2px] shadow-sm">
                        <span className="text-[10px] font-mono font-bold text-[#5a6b7c] w-6">#{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-[#1e3a5f]">{ft.name}</p>
                          <p className="text-[8px] text-[#5a6b7c] uppercase font-bold tracking-tighter">P:{ft.priority} | L:{ft.tierLevel}</p>
                        </div>
                        <span className={cn("text-[11px] font-mono font-bold", ft.value < 0 ? "text-[#2e7d32]" : "text-[#e65100]")}>
                          {ft.feeType === "PERCENT" ? (ft.value > 0 ? "+" : "") + ft.value + "%" : formatMMK(ft.value)}
                        </span>
                     </div>
                   ))}
                </div>
              </EnterpriseCard>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
