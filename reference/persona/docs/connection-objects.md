# Connection Objects

[Sending data to Persona](./choosing-an-integration-method.md)[Transactions (API-based integrations)](./transactions.md)[Model References](./transactions-model-lifecycle.md)

# Connection Objects

Transactions integrate different parts of Persona's ecosystem under one umbrella.

## Related Objects

Because Workflows combine logic across product lines, customers can rely on them to query across product lines as well. Any item contained on a Transaction-triggered Workflow Run is implicitly a related object to that Transaction and the Transaction dashboard view reflects this connection.

## Relations

Customers define and configure relations to reflect their worldview in Persona. Relations store known source-of-truth connections between systems of record.

Relations define formal connections between Transactions and Accounts. Customers establish this connection between Accounts and Transactions via relationship fields on the Account and Transaction. The field itself is indicated by a key and has its own, user specified field schema.
