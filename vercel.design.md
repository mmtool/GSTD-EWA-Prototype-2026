# EWA 3.0 Enterprise Design System Reference (vercel.design.md)

This reference defines the visual language, design tokens, typography, and reusable UI components of the EWA (Earned Wage Access) 3.0 Enterprise Platform. It serves as the **single source of truth** for all visual styles, UI components, and design decisions across the portal.

---

## 1. Visual Identity & Mood

The visual identity of EWA 3.0 is **SAP Fiori-Inspired Enterprise Fintech**. It is structured, authoritative, and clean, conveying confidence and data density for corporate HR admins, risk managers, and financial controllers.

### Key Mood Principles
- **No Rounded Corners (Sharp Cards):** Every panel, card, button, and input has a clean, sharp look (`rounded-[3px]` or `rounded-none`) to represent structural solidity.
- **Monospace Financial Rhythm:** All quantitative values, status tickers, and currency values are displayed using `font-mono` and `tabular-nums` to ensure exact column alignment and clean comparisons.
- **Signature "Ledger-Flow" Divider:** Sections are partitioned by a distinct, micro-designed ledger line with an accent mark to convey the motion of financial ledgers.
- **Micro-Badges (Dot + Text):** Status and priority badges are compact to maximize density while retaining instant semantic comprehension.

---

## 2. Color System & Tokens

Our color space uses modern Oklch colors configured in Tailwind CSS. 

### Core Theme Tokens
| CSS Custom Property | Tailwind Class Reference | OKLCH Value | Semantic Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `bg-background` | `oklch(0.965 0.005 250)` | Canvas background (soft off-white/gray) |
| `--foreground` | `text-foreground` | `oklch(0.15 0.02 250)` | Primary text, deep charcoal |
| `--border` | `border-border` | `oklch(0.87 0.008 250)` | Structural borders and grid lines |
| `--card` | `bg-card` | `oklch(0.995 0 0)` | Clean white panel backgrounds |
| `--primary` | `bg-primary` | `oklch(0.2 0.05 250)` | **EWA Deep Navy** (#1e3a5f) — main brand color |
| `--ring` | `ring-ring` | `oklch(0.55 0.12 210)` | **EWA Teal** (#0ea5e9) — primary accent color |

### Brand-Specific Semantic Swatches
- **EWA Navy:** `bg-[#1e3a5f]` — Solid corporate, headers, sidebar, key metrics.
- **EWA Teal:** `bg-[#0ea5e9]` — Active states, primary selections, key highlights.
- **EWA Emerald:** `bg-[#2e7d32]` — Positive values, success, completed transactions.
- **EWA Amber:** `bg-[#e65100]` — Pending approvals, moderate risk, warning.
- **EWA Red:** `bg-[#c62828]` — Overdue settlements, failed disbursements, errors.

---

## 3. Typography Pairings

We structure typography to establish high hierarchy contrast and absolute numeric alignment:

```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```

- **Section Titles & Module Names:** Bold `font-sans`, dark primary colors, tracking tight.
  - *Example:* `<h1 className="text-lg font-bold text-[#1e3a5f] uppercase tracking-wide">`
- **Quantitative / Monospace Data:** Clear `font-mono` with `tabular-nums` and a medium or bold weight.
  - *Example:* `<span className="font-mono font-bold text-slate-700 tabular-nums">`
- **Sub-titles & Explanatory Metadata:** Small `font-sans` with lighter text color (`text-slate-400` or `text-[#5a6b7c]`).

---

## 4. Reusable Enterprise UI Components

All components are declared centrally in `@/components/EnterpriseComponents` as a single source of truth.

### A. Enterprise Card
A sharp-cornered container with standard padding, a subtle border, and a neat header layout.

```tsx
import { cn } from "@/lib/utils";

export function EnterpriseCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-enterprise", className)} {...props}>
      {children}
    </div>
  );
}
```

### B. Enterprise KPI Card
A highly scannable dashboard summary widget featuring a solid Navy accent top strip, large bold quantitative values, and small uppercase labels.

```tsx
interface KpiCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  accentColor?: "navy" | "teal" | "emerald" | "amber" | "red";
  className?: string;
}

export function EnterpriseKpiCard({ label, value, subValue, accentColor = "navy", className }: KpiCardProps) {
  const accentClasses = {
    navy: "border-t-[#1e3a5f]",
    teal: "border-t-[#0ea5e9]",
    emerald: "border-t-[#2e7d32]",
    amber: "border-t-[#e65100]",
    red: "border-t-[#c62828]"
  };

  return (
    <div className={cn("kpi-card border-t-3", accentClasses[accentColor], className)}>
      <p className="text-lg font-bold text-[#1e3a5f] font-mono tracking-tight leading-none mb-1">{value}</p>
      <p className="text-[8px] text-[#5a6b7c] uppercase tracking-widest font-semibold">{label}</p>
      {subValue && <p className="text-[9px] text-[#2e7d32] font-semibold mt-1">{subValue}</p>}
    </div>
  );
}
```

### C. Enterprise Status Badge
Compact semantic badges styled after the official SAP Fiori standard.

```tsx
export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function EnterpriseBadge({ variant, children, className }: BadgeProps) {
  const classes = {
    success: "status-badge-success",
    warning: "status-badge-warning",
    error: "status-badge-error",
    info: "status-badge-info",
    neutral: "status-badge-neutral",
  };
  return (
    <span className={cn(classes[variant], className)}>
      <span className="w-1 h-1 rounded-full bg-current mr-1 shrink-0" />
      {children}
    </span>
  );
}
```

### D. Enterprise Button
Clean button components utilizing the design system classes.

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  icon?: React.ReactNode;
}

export function EnterpriseButton({ variant = "primary", icon, children, className, ...props }: ButtonProps) {
  const classes = {
    primary: "btn-enterprise-primary",
    secondary: "btn-enterprise-secondary",
    danger: "btn-enterprise-danger",
  };
  return (
    <button className={cn(classes[variant], className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
```

### E. Enterprise Message Strip
Compact banners used for alert delivery and feedback.

```tsx
interface MessageStripProps {
  variant: "info" | "warning" | "error" | "success";
  message: string;
  className?: string;
}

export function EnterpriseMessageStrip({ variant, message, className }: MessageStripProps) {
  const classes = {
    info: "message-strip-info",
    warning: "message-strip-warning",
    error: "message-strip-error",
    success: "message-strip-success",
  };
  return (
    <div className={cn(classes[variant], className)}>
      {message}
    </div>
  );
}
```

### F. Enterprise Form Controls
Standard inputs and selects optimized for rapid typing and legible values.

```tsx
export function EnterpriseInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("input-enterprise", className)} {...props} />;
}

export function EnterpriseSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("select-enterprise", className)} {...props}>
      {children}
    </select>
  );
}
```

### G. Ledger Divider (Signature Motif)
A subtle horizontal line that ends with an elegant visual weight.

```tsx
export function LedgerDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-px bg-[#d1d9e0] my-4 flex items-center justify-end", className)}>
      <span className="absolute right-0 w-2.5 h-1 bg-[#0ea5e9]" />
    </div>
  );
}
```

---

## 5. Layout and Spacing Grid

- **Page Wrapping:** All modules live inside a padded `div` wrapper with standard density:
  - Default: `space-y-4 p-5`
- **Dashboard Bento Rows:** Group summary cards in standard 5-column grids:
  - CSS: `grid grid-cols-5 gap-2`
- **Side Panel Alignment:** Two-column split screens use clean 3:1 grids:
  - CSS: `grid grid-cols-4 gap-4` where the main content occupies `col-span-3` and the side panel is `col-span-1`.

---

## 6. Implementation Checklist
When updating a module, ensure it satisfies this checklist:
- [ ] Uses `<EnterpriseCard>` instead of raw `<Card>`/`<CardContent>`.
- [ ] Employs `<EnterpriseKpiCard>` for all KPI items.
- [ ] Formats status columns with `<EnterpriseBadge>`.
- [ ] Replaces general buttons with `<EnterpriseButton>`.
- [ ] Swaps out custom page headers or custom lines with `<LedgerDivider>`.
- [ ] Displays currency/numbers with `font-mono tracking-tight font-bold`.
- [ ] Keeps corners strictly sharp (`rounded-[3px]` or flat).
