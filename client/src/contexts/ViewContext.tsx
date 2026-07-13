/**
 * ViewContext — Role-Based View Account Type Switching
 * Allows instant switching between 7 view types (HR, Sales, Operations, Back Office, Finance, Risk, Platform Admin)
 * Each view type controls which modules, actions, and data are visible
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ViewType = "HR" | "Sales" | "Operations" | "Back Office" | "Finance" | "Risk" | "Platform Admin";

export type ModuleId =
  | "dashboard"
  | "employees"
  | "onboarding"
  | "repayment"
  | "circle-ledger"
  | "fee-builder"
  | "budget"
  | "risk"
  | "transactions"
  | "reports"
  | "settlement"
  | "payroll"
  | "notifications"
  | "admin"
  | "workflow"
  | "writeoff"
  | "form-creator"
  | "errors"
  | "disbursement"
  | "bank-integration"
  | "service-catalog"
  | "fee-hierarchy"
  | "employee-groups"
  | "limitations"
  | "documentation";

interface ModuleConfig {
  id: ModuleId;
  label: string;
  icon: string;
  views: ViewType[];
}

export const MODULE_REGISTRY: ModuleConfig[] = [
  { id: "dashboard", label: "Dashboard", icon: "grid-3x3", views: ["HR", "Sales", "Operations", "Back Office", "Finance", "Risk", "Platform Admin"] },
  { id: "onboarding", label: "Employee Onboarding", icon: "user-check", views: ["HR", "Operations", "Platform Admin"] },
  { id: "employees", label: "Employee Management", icon: "users", views: ["HR", "Operations", "Back Office", "Finance", "Risk", "Platform Admin"] },
  { id: "transactions", label: "Transaction Monitor", icon: "arrow-right-left", views: ["HR", "Operations", "Back Office", "Finance", "Risk", "Platform Admin"] },
  { id: "repayment", label: "Repayment & Settlement", icon: "repeat", views: ["HR", "Sales", "Operations", "Back Office", "Finance"] },
  { id: "settlement", label: "Settlement Verification", icon: "shield-check", views: ["Operations", "Finance"] },
  { id: "circle-ledger", label: "Circle Ledger (GL)", icon: "book-open", views: ["Finance", "Platform Admin"] },
  { id: "fee-builder", label: "Fee Builder & Policy", icon: "settings", views: ["Platform Admin"] },
  { id: "budget", label: "Budget Management", icon: "wallet", views: ["HR", "Finance", "Risk"] },
  { id: "risk", label: "Risk & Backoffice", icon: "shield-alert", views: ["Risk", "Operations"] },
  { id: "reports", label: "Reports Center", icon: "bar-chart-3", views: ["HR", "Sales", "Operations", "Back Office", "Finance", "Risk", "Platform Admin"] },
  { id: "payroll", label: "Payroll & Deduction", icon: "file-spreadsheet", views: ["HR", "Back Office", "Finance"] },
  { id: "notifications", label: "Notification Center", icon: "bell", views: ["HR", "Operations", "Back Office", "Finance", "Platform Admin"] },
  { id: "admin", label: "Admin & Configuration", icon: "sliders-horizontal", views: ["Platform Admin"] },
  { id: "workflow", label: "Workflow & Case Mgmt", icon: "workflow", views: ["HR", "Finance", "Operations", "Risk", "Platform Admin"] },
  { id: "writeoff", label: "Write-Off Management", icon: "trash-2", views: ["Finance", "Risk"] },
  { id: "form-creator", label: "Form Creator", icon: "layout-template", views: ["Platform Admin"] },
  { id: "errors", label: "Error Messages", icon: "alert-circle", views: ["Platform Admin"] },
  { id: "disbursement", label: "Disbursement Engine", icon: "zap", views: ["Operations", "Finance", "Platform Admin"] },
  { id: "bank-integration", label: "Bank Integration", icon: "landmark", views: ["Finance", "Operations", "Platform Admin"] },
  { id: "service-catalog", label: "Service Catalog", icon: "layers", views: ["Platform Admin", "Operations"] },
  { id: "fee-hierarchy", label: "Fee Hierarchy Engine", icon: "pyramid", views: ["Platform Admin", "Finance"] },
  { id: "employee-groups", label: "Employee Groups", icon: "users", views: ["HR", "Operations", "Platform Admin"] },
  { id: "limitations", label: "Transaction Limits", icon: "gauge", views: ["Platform Admin", "Risk", "Operations"] },
  { id: "documentation", label: "Documentation", icon: "book-open", views: ["HR", "Sales", "Operations", "Back Office", "Finance", "Risk", "Platform Admin"] },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<ViewType, ModuleId[]> = {
  "HR": ["dashboard", "onboarding", "employees", "transactions", "repayment", "budget", "reports", "payroll", "notifications", "workflow", "employee-groups", "documentation"],
  "Sales": ["dashboard", "repayment", "reports", "documentation"],
  "Operations": ["dashboard", "onboarding", "employees", "transactions", "repayment", "settlement", "risk", "reports", "notifications", "workflow", "disbursement", "bank-integration", "service-catalog", "employee-groups", "limitations", "documentation"],
  "Back Office": ["dashboard", "employees", "transactions", "repayment", "reports", "payroll", "notifications", "documentation"],
  "Finance": ["dashboard", "employees", "transactions", "repayment", "settlement", "circle-ledger", "budget", "reports", "payroll", "notifications", "workflow", "writeoff", "disbursement", "bank-integration", "fee-hierarchy", "documentation"],
  "Risk": ["dashboard", "employees", "transactions", "budget", "risk", "reports", "workflow", "writeoff", "limitations", "documentation"],
  "Platform Admin": [
    "dashboard", "onboarding", "employees", "transactions", "circle-ledger", "fee-builder", 
    "reports", "notifications", "admin", "workflow", "form-creator", "errors", 
    "disbursement", "bank-integration", "service-catalog", "fee-hierarchy", "employee-groups", "limitations", "documentation"
  ],
};

interface ViewContextType {
  view: ViewType;
  setView: (v: ViewType) => void;
  modules: ModuleConfig[];
  allModuleConfigs: ModuleConfig[];
  rolePermissions: Record<ViewType, ModuleId[]>;
  updateRolePermissions: (view: ViewType, moduleIds: ModuleId[]) => void;
  hasPermission: (moduleId: ModuleId) => boolean;
  lang: "en" | "my";
  setLang: (l: "en" | "my") => void;
}

const ViewContext = createContext<ViewContextType | null>(null);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewType>("HR");
  const [lang, setLang] = useState<"en" | "my">("en");
  const [rolePermissions, setRolePermissions] = useState<Record<ViewType, ModuleId[]>>(DEFAULT_ROLE_PERMISSIONS);

  const updateRolePermissions = useCallback((v: ViewType, ids: ModuleId[]) => {
    setRolePermissions(prev => ({ ...prev, [v]: ids }));
  }, []);

  const activeModuleIds = rolePermissions[view];
  const modules = MODULE_REGISTRY.filter(m => activeModuleIds.includes(m.id));
  
  const hasPermission = useCallback((moduleId: ModuleId) => {
    return rolePermissions[view].includes(moduleId);
  }, [view, rolePermissions]);

  return (
    <ViewContext.Provider value={{ 
      view, 
      setView, 
      modules, 
      allModuleConfigs: MODULE_REGISTRY,
      rolePermissions, 
      updateRolePermissions,
      hasPermission, 
      lang, 
      setLang 
    }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used within ViewProvider");
  return ctx;
}
