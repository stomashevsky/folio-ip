# Report Templates Change Management[](#report-templates-change-management)

## Overview[](#overview)

Unlike other Persona objects, Report Templates do not support version management. Changes made to Report Types are immediately applied once saved.

| **Persona Object** | **Object ID syntax** |
| --- | --- |
| Report Template | Begins with `rptp_` |

## Change Behavior[](#change-behavior)

Changes to a Report Templates take effect immediately upon saving. There is no draft mode or publishing process available.

-   Changes are applied system-wide for any new Reports that reference the updated Report Template.
-   Any Reports that were previously generated will remain associated with the configuration that existed at the time they were created.
-   There is no version history or ability to revert changes.

For all Report Types, ability to configure or edit Report Templates are view-only in your Persona dashboard except for the Watchlist (person).

## No Version History[](#no-version-history)

Unlike versioned Persona objects, Report Types do not maintain a version history. Once changes are saved, previous configurations cannot be restored. We recommend reviewing changes carefully before saving to ensure accuracy.
