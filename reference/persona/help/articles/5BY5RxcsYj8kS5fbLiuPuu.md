# Account Types Change Management[](#account-types-change-management)

## Overview[](#overview)

Unlike other Persona objects, Account Types do not support version management. Changes made to Account Types are immediately applied once saved.

| **Persona Object** | **Object ID syntax** |
| --- | --- |
| Account Type | Begins with `acttp_` |

## Change Behavior[](#change-behavior)

When you make changes to an Account Type, those changes become effective immediately after you save them. There is no draft mode or publishing process.

-   Changes apply to any new or updated Accounts that reference the updated Account Type.
-   Existing Accounts remain associated with the Account Type, but any changes to configuration or schema are reflected for all Accounts referencing that type.
-   There is no version history or rollback capability once changes are saved.

## No Version History[](#no-version-history)

Account Types do not maintain a version history. Any changes you make will permanently overwrite the previous configuration. Review changes carefully before saving to avoid unintended updates.
