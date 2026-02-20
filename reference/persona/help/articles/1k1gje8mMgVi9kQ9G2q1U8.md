# Transaction Types and Change Management[](#transaction-types-and-change-management)

## Overview[](#overview)

Unlike other Persona objects, Transaction Types do not support version management. Changes to Transaction Types are applied immediately once saved.

| Persona Object | Object ID syntax |
| --- | --- |
| Transaction Type | Begins with `txntp_` |

## Change Behavior[](#change-behavior)

When you modify a Transaction Type, updates are immediately effective after saving. There is no draft state or publishing process for these changes.

-   New Transactions created after changes will use the updated Transaction Type configuration.
-   Existing Transactions remain associated with the Transaction Type as it was configured at the time they were created.
-   There is no version tracking or rollback capability for Transaction Type changes.

## No Version History[](#no-version-history)

Transaction Types do not maintain a version history. All changes are permanent once saved. Carefully verify updates prior to saving to avoid unintended impacts.
