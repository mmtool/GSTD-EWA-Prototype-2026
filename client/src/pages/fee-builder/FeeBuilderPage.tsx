/**
 * FeeBuilderPage — Fee Builder & Policy Configuration
 * Design: Neobrutalist Fintech — Configurable fee policies per company
 */
import {
  EnterpriseCard,
  EnterpriseBadge,
  EnterpriseButton,
  LedgerDivider,
  EnterpriseTable,
  ColumnDef
} from "@/components/EnterpriseComponents";
import { feePolicies, type FeePolicy } from "@/data/mockData";
import { Settings, Tag, Receipt, DollarSign, Plus } from "lucide-react";

export function FeeBuilderPage() {
  const getFeeColumns = (fp: FeePolicy): ColumnDef<any>[] => [
    {
      id: "type",
      header: "Fee Type",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {row.icon}
          <span className="text-[12px] font-bold text-[#1e3a5f]">{row.label}</span>
        </div>
      )
    },
    {
      id: "rate",
      header: "Rate / Value",
      accessor: (row) => <span className="text-[11px] font-mono font-bold text-[#5a6b7c]">{row.rate}</span>
    },
    {
      id: "minMax",
      header: "Min / Max / Detail",
      accessor: (row) => <span className="text-[11px] text-[#5a6b7c] font-medium">{row.detail}</span>
    },
    {
      id: "bearer",
      header: "Bearer",
      accessor: (row) => <EnterpriseBadge variant="neutral">{row.bearer}</EnterpriseBadge>
    },
    {
      id: "extra",
      header: "Cap / Extra",
      accessor: (row) => <span className="text-[11px] text-[#5a6b7c]">{row.extra}</span>
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#0ea5e9]" />
          <div>
            <h1 className="text-[15px] font-bold text-[#1e3a5f] uppercase tracking-wide">Fee Builder & Policy Configuration</h1>
            <p className="text-[10px] text-[#5a6b7c] uppercase tracking-wider mt-0.5">Policy management per corporate entity</p>
          </div>
        </div>
        <EnterpriseButton variant="primary" className="h-8 py-0 px-3 flex items-center gap-1 text-[10px]">
          <Plus className="w-3.5 h-3.5" /> New Policy
        </EnterpriseButton>
      </div>

      <LedgerDivider />

      {feePolicies.map(fp => {
        const feeRows = [
          { icon: <Tag className="w-3.5 h-3.5 text-[#0ea5e9]" />, label: "Service Fee", rate: `${fp.serviceFeeRate}%`, detail: `${fp.serviceFeeMin.toLocaleString()} - ${fp.serviceFeeMax.toLocaleString()}`, bearer: fp.feeBearer, extra: "—" },
          { icon: <Receipt className="w-3.5 h-3.5 text-amber-500" />, label: "Late Fee", rate: `${fp.lateFeeRate}%/day`, detail: `Grace: ${fp.lateFeeGraceDays} days`, bearer: "Employee", extra: `Cap: ${fp.lateFeeCap.toLocaleString()} MMK` },
          { icon: <DollarSign className="w-3.5 h-3.5 text-emerald-500" />, label: "WHT", rate: `${fp.whtRate}%`, detail: "Withholding Tax", bearer: "Employee", extra: "—" },
          { icon: <DollarSign className="w-3.5 h-3.5 text-emerald-500" />, label: "VAT", rate: `${fp.vatRate}%`, detail: "Value Added Tax", bearer: "Employee", extra: "—" },
          { icon: <DollarSign className="w-3.5 h-3.5 text-slate-400" />, label: "Bank Charge", rate: `${fp.bankCharge.toLocaleString()} MMK`, detail: "Transaction Fee", bearer: fp.bankChargeBearer, extra: "—" },
        ];

        return (
          <EnterpriseCard key={fp.companyId} className="border-[#d1d9e0] shadow-sm overflow-hidden">
            <div className="bg-[#f8fafc] border-b border-[#d1d9e0] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-[#5a6b7c]" />
                <h3 className="text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wide">{fp.companyName}</h3>
              </div>
              <EnterpriseBadge variant="info">BEARER: {fp.feeBearer.toUpperCase()}</EnterpriseBadge>
            </div>

            <EnterpriseTable
              data={feeRows}
              columns={getFeeColumns(fp)}
              rowKey={(row) => row.label}
              searchPlaceholder={`Filter ${fp.companyName} policies...`}
            />

            <div className="p-3 bg-[#f8fafc] border-t border-[#d1d9e0]">
              <p className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest mb-2">Late Fee Slab Structure</p>
              <div className="flex flex-wrap gap-2">
                {fp.lateFeeSlab.map((slab, i) => (
                  <div key={i} className="px-2 py-1 rounded-[2px] bg-[#fff8e1] border border-[#ffcc80] text-[10px] flex items-center gap-1.5">
                    <span className="text-[#5a6b7c] font-medium">Day {slab.from}-{slab.to === 999 ? "999+" : slab.to}:</span>
                    <span className="font-bold text-[#e65100]">{slab.rate}%/day</span>
                  </div>
                ))}
              </div>
            </div>
          </EnterpriseCard>
        );
      })}
    </div>
  );
}

