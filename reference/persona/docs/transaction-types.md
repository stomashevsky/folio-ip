# Transaction Types

[Sending data to Persona](./choosing-an-integration-method.md)[Transactions (API-based integrations)](./transactions.md)[Model References](./transactions-model-lifecycle.md)

# Transaction Types

Transaction Types define the shape of the user interaction within Persona's ecosystem.

## Overview

For each type of transaction, we can define a schema of what information gets passed in during creation. Each transaction type has a transaction type ID. Transaction Types consist of custom field schemas and custom statuses.

Transactions have support for the following field types:

-   `Boolean`
-   `Date`
-   `Documents`
-   `File`
-   `Float`
-   `Hash`
-   `Integer`
-   `String`
-   `Multiple Choices`
-   `Array`

## Archiving

Customers can archive both Transaction fields and Types, which enables updates in the event a user saves the wrong field key, or a customer’s model changes over time. After a field is archived on a Transaction Type or a Transaction Type itself gets archived, all associated Workflows must get updated.
