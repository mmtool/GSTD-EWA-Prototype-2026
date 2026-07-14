# Project Knowledge: GSTD-EWA-Prototype-2026

This document provides essential context and instructions for AI agents working on the **GSTD-EWA-Prototype-2026** project.

## 🏢 Project Overview
An Enterprise Fintech Platform (Earned Wage Access - EWA) prototype designed for modularity and role-based access.

## 🎨 Visual Identity & Design System
The platform adheres to a strict "Enterprise Precision" design language.
- **Primary Colors**: 
  - **Navy** (`#1e3a5f`): Main sidebar, headers, and primary container backgrounds.
  - **Teal** (`#0ea5e9`): Action buttons, highlights, progress indicators, and active states.
- **Aesthetic Principles**:
  - **Sharp Corners**: Use `rounded-[3px]` or `rounded-none`. Avoid large radii (`rounded-xl`).
  - **Structured Borders**: Subtle borders (`border-white/8` or `border-navy-light/20`) to separate modules.
  - **High Contrast**: White text on Navy backgrounds, Slate-400 for secondary information.
- **Typography**: 
  - **UI/Labels**: `Inter` (Sans-serif) for high readability.
  - **Data/Technical**: `JetBrains Mono` for amounts, transaction IDs, and timestamps.

## 🏗️ Architecture & Frameworks
- **Frontend**: React 18+ with Vite.
- **Routing**: `wouter` (Base path: `/GSTD-EWA-Prototype-2026/` in production).
- **Styling**: Tailwind CSS.
- **Icons**: `lucide-react`.
- **Animations**: `motion` (framer-motion).
- **State Management**: React Context (`ViewContext`) for role-based views.

## 🛡️ Role-Based Access Control (RBAC)
The application uses a `ViewContext` to switch between different organizational personas:
- **HR**: Employee lifecycle, onboarding, payroll.
- **Sales**: Business development tracking, repayment overview.
- **Operations**: Disbursement management, bank integrations, service catalogs.
- **Finance**: Circle Ledger (GL), fee hierarchies, settlements, write-offs.
- **Risk**: Limitation settings, backoffice monitoring, risk assessment.
- **Platform Admin**: Full configuration, form creators, error management.

## 🤖 Sub-Agent Routing & Specialization
For complex tasks, the main agent should "redirect" focus by consulting specialized skill files in the `/sub-agents/` directory:
- **Finance Tasks**: Read `/sub-agents/FINANCE_AGENT.md` for Ledger and Fee logic.
- **HR/Employee Tasks**: Read `/sub-agents/HR_AGENT.md` for onboarding and lifecycle workflows.
- **Risk/Compliance Tasks**: Read `/sub-agents/RISK_AGENT.md` for limits and workflow controls.

## 🧩 Core Modules & Data Lineage
Data in the platform is deeply interconnected. Agents must ensure that changes in one module reflect across the ecosystem:

### 1. Transaction Lifecycle & Finance
- **Transactions (TXN)** → **Circle Ledger (GL)**: Every TXN must trigger a corresponding **Journal Entry**.
- **Fee Hierarchy**: Fees are dynamically calculated based on **Fee Hierarchies** and applied to TXNs; they must reflect across the Ledger and Service Catalog.
- **Double-Entry Consistency**: Data must match across TXN, GL, and Journal modules at all times.

### 2. Operations & Control
- **Workflow**: All major actions (Disbursements, Onboarding, Settlements) must pass through a state-machine workflow. Data is "locked" or "pending" based on these states.
- **Budget & Limitations**: Risk assessments and Budget modules set "hard" and "soft" limits that prevent TXNs from being created if thresholds are exceeded.

### 3. Reporting & Visibility
- **Reports**: Aggregates data from TXN, GL, and Employee modules. Reports must always match the real-time state of the Ledger.
- **Dashboards**: Use `recharts` for visualization, maintaining the Navy/Teal palette for consistency.

### 4. Employee Management & Onboarding
- **Add Employee**: Simple modal/form for quick entry.
- **Bulk Import**: Multi-step wizard (`setImportWizardOpen`).
- **Permissions**: HR and Operations roles primarily manage these.

## 🚀 Deployment & Environment
- **GitHub Pages**: Deployed to `mmtool.github.io/GSTD-EWA-Prototype-2026/`.
- **Base URL**: Must use `import.meta.env.BASE_URL` for internal routing.
- **404 Handling**: A `404.html` is generated from `index.html` during build to support SPA routing on static hosting.

## 📝 Agent Guidelines
1. **Consistency**: Always match the established Navy/Teal color palette.
2. **Icons**: Use `Lucide` icons exclusively.
3. **Typography**: Inter (Sans) for UI, JetBrains Mono for data/technical values.
4. **Persistence**: The `rolePermissions` and user preferences are saved in `localStorage`.
5. **Context First**: Always check `ViewContext.tsx` when adding or modifying navigation modules.

---
*Created to ensure seamless collaboration and fast learning for all AI agents.*
