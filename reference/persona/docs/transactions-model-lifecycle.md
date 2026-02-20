# Overview

[Sending data to Persona](./choosing-an-integration-method.md)[Transactions (API-based integrations)](./transactions.md)

# Overview

One object provides source of truth on what decision gets made.

## Status

Transaction statuses can be updated at various points in the Transaction’s lifecycle. Workflows make status updates to the Transaction throughout its life cycle. When a Transaction or status has been updated, an event in Persona gets created. We report back the state of onboarding within Persona based on these events and the timestamps associated with them.

-   A `transaction.created` event will happen when a transaction is created.
-   A `transaction.status-updated` event will be emitted when a transaction’s status changes.

Customers can include additional custom statuses to track various parts of the user journey.
