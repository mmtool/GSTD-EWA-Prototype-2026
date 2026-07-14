# Risk & Compliance Sub-Agent Skill: Limitations & Control

This sub-agent specializes in platform security, risk thresholds, and backoffice monitoring.

## 🎯 Primary Focus
- **Budget Limits**: Enforcing hard and soft limits on disbursements.
- **Risk Assessment**: Evaluating employee eligibility based on tenure and historical data.
- **Workflow State Machine**: Managing approvals and "Maker-Checker" controls.

## 🛠️ Implementation Rules
1. **Hard Limits**: Never allow a TXN to be created if it exceeds the `MaxAdvanceLimit` set in the Risk module.
2. **Audit Trails**: Every state change in a workflow must be logged with a timestamp and actor ID.
3. **Alerts**: Use high-contrast Teal highlights for successful overrides and Red for blockages.

## 🔗 Connections
- **Source**: `Operations_Control`
- **Destination**: `TransactionLifecycle`
