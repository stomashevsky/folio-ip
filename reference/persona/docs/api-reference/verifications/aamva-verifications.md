# AAMVA Verifications

[API Reference](../accounts/list-all-accounts.md)[Verifications](../verifications.md)

# AAMVA Verifications

An AAMVA Verification queries the Driver’s License Data Verification (DLDV) Service maintained by the American Association of Motor Vehicle Administrators. This verification answers the question “Does the ID data corroborate against live US DMV records?”. This is especially useful when combined with a [Government ID Verification](./government-id-verifications.md) to determine whether ID contents exist and whether they have been tampered with.

## Product Versions

| Component | Version | Notes |
| --- | --- | --- |
| AAMVA | 2.1.2 | 1\. refactor: add default fields for aamva and international DB to Gov ID Module and all builders using module |
| AAMVA | 2.1.1 | 1\. Add South Carolina as a data source |
| AAMVA | 2.1.0 | 1\. Refactor external service error check 2. |
| AAMVA | 2.0.0 | 1\. Launch Identity Comparison Check |
