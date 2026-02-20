# Transaction API-first lifecycle

[Sending data to Persona](./choosing-an-integration-method.md)[Transactions (API-based integrations)](./transactions.md)[Overview](./transactions.md)

# 

Transaction API-first lifecycle

Transaction statuses can be updated at various points in the Transactions lifecycle to track user progression through API-first flow.

To start we suggest the following statuses but as we build out the integration we can add/remove them as necessary. These can be used for tracking/reporting:

| Status | Event Name | Description | Metrics |
| --- | --- | --- | --- |
| `created` | `created-at` | Initial status. Transaction has been created with information collected and passed to Persona. The `created-at` attribute on the Transactions notes when this happens. |  |
| `completed` | `transaction.status-updated` with status `completed` | The verifications have been run and the outcome is `passed`. | Completed Rate = Completed / Created |
| `approved` | `transaction.status-updated` with status `approved` | The Transaction has been approved. Will be using `transaction.status-updated` with status `approved`. | Approved Rate = Approved / Created |
| `declined` | `transaction.status-updated` with status `declined` | The Transaction has been declined. Will be using `transaction.status-updated` with status `declined` | Decline Rate = Declined / Created |
