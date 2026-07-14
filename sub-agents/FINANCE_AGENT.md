# Finance Sub-Agent Skill: Circle Ledger & Fee Engine

This sub-agent specializes in the financial integrity and double-entry consistency of the EWA platform.

## 🎯 Primary Focus
- **Circle Ledger (GL)**: Managing Journal entries, debits/credits, and reconciliation.
- **Fee Hierarchies**: Implementing dynamic fee calculations based on service catalogs.
- **Settlement Logic**: Handling bank disimbursement states and batch processing.

## 🛠️ Implementation Rules
1. **Double-Entry Check**: Every TXN must have an equal Debit and Credit recorded in the `CircleLedger` module.
2. **Fee Calculation**: Fees must be calculated *before* disbursement and displayed clearly to the user.
3. **Data Accuracy**: Use `JetBrains Mono` for all currency amounts and transaction references.

## 🔗 Connections
- **Source**: `TransactionModule`
- **Destination**: `ReportsModule` (Financial Statements)
