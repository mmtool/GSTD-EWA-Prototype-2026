# HR Sub-Agent Skill: Employee Lifecycle & Onboarding

This sub-agent specializes in workforce management and the employee experience.

## 🎯 Primary Focus
- **Employee Onboarding**: Managing individual and bulk import workflows.
- **Lifecycle Management**: Handling status changes (Active, Terminated, On Leave).
- **Payroll Integration**: Synchronizing employee earnings data with the EWA limits.

## 🛠️ Implementation Rules
1. **Privacy First**: Ensure sensitive employee data (salaries, IDs) is handled with appropriate RBAC checks.
2. **Bulk Processing**: Use the `ImportWizard` state machine for all bulk data entries.
3. **Typography**: Use `Inter` for all names and labels for maximum legibility.

## 🔗 Connections
- **Source**: `HR_Dashboard`
- **Destination**: `RiskAssessment` (for limit calculations)
