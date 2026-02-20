# Case Templates and Change Management[](#case-templates-and-change-management)

## Overview[](#overview)

Unlike other Persona objects, Case Templates do not support version management. Any changes made to Case Templates are immediately effective once saved.

| **Persona Object** | **Object ID syntax** |
| --- | --- |
| Case Template | Begins with `ctmpl_` |

## Change Behavior[](#change-behavior)

When you edit a Case Template, updates are immediately applied across all areas where that template is used. There is no draft process or staged publishing.

-   Updates take effect system-wide for any new Cases created using the modified Case Template.
-   Existing Cases already created from earlier versions of the template remain as they were at the time of creation.
-   There is no ability to track previous versions or undo changes after they are saved.

## No Version History[](#no-version-history)

Case Templates do not maintain a version history. Changes are permanent once saved. Carefully review and validate updates prior to applying changes.
