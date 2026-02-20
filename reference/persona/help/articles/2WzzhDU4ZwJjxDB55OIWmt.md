# Cases: Related Cases prebuilt module

# What is the Case Related Cases module?[](#what-is-the-case-related-cases-module)

The **Case Related Cases module** is a prebuilt component that can be added to a Case Template. It displays all related cases associated with Accounts that are attached to the Case. You can attach an Account by using the [Attach Object to Case](./68OO1Ovqk7xRcYUDVMbWYa.md) step in a Workflow. You can define logic that governs when it appears.

![relatedcase](../images/relatedcase_6216cb8514cf.png)

If the Case is associated with multiple Accounts (e.g. when used for KYB), this module displays a separate list of related Cases per Account.

# How do you add a Case Related Cases module?[](#how-do-you-add-a-case-related-cases-module)

1.  Navigate to the Dashboard, and click on **Cases** > **Templates**.
2.  Find and click on the Case template you want to edit, or **Create** a new template.
3.  Navigate to the **Tab** you want to add a Case component to. Click an empty space to view the Component Library.
4.  In the right toolbar, search for ‘**Related Cases**.’
5.  Drag and drop the **Related Cases module** into your Case UI and reposition it by dragging it around.

![relatedcasemodule](../images/relatedcasemodule_17fb0c637842.png)

6.  Click on the **Related Cases module** on the right toolbar you can customize the module.
    1.  Under **Module Layout**, you can change:
        1.  Dynamic height: Module will grow or shrink to fit its contents.
        2.  Visibility: Dynamically control whether the module is hidden. This is a toggle button that lets you set conditions for when the button should be displayed or hidden from view based on your case requirements. You can read more about **Visibility configuration** below.
    2.  Under **Advanced Options > Module Enablement**, you can define custom control conditions that determine when the **Related Cases module** is enabled or disabled. Advanced options are typically configured for specific customers by a Persona team member.
7.  Click the **“Delete”** button if you want to remove the component from the Case UI.

## Visibility configuration[](#visibility-configuration)

If you toggle this on you will have two options to customize visibility.

![visibility](../images/visibility_38b9b2855a27.png)

1.  **Basic** visibility allows you to set rules on the **Related Cases module** to determine when it will be visible. You can read more about **Basic visibility configuration** below.
2.  **Advanced** visibility allows you to set logic to control when the **Related Cases module** is enabled or disabled based on custom conditions. Advanced visibility configurations are typically configured for specific customers by a Persona team member.

## Basic visibility configuration[](#basic-visibility-configuration)

Visibility configuration consist of three main components:

1.  **Field**: The object that will have a condition linked to it.
2.  **Condition**: How the field is compared to the value (e.g., equals, does not equal).
3.  **Value**: The value to test against.

![visibilityconfig](../images/visibilityconfig_43cd5adc81f4.png)

### Creating Visibility Configuration[](#creating-visibility-configuration)

-   **AND Statements**: Combine multiple conditions that must all be true for the rule to pass. Add these using the **"Add"** button.
-   **OR Groups**: Combine conditions where only one needs to be true for the rule to pass. Create these by clicking **"Add OR Group"**.

## How to Use Visibility Configuration[](#how-to-use-visibility-configuration)

1.  Click on the **Related Cases module**, and go to **Module Layout** and toggle the button next to **Visibility** in the right toolbar.
    1.  Click on “**Empty rule**” to see **Visibility configuration**.
    2.  Create a logical rule by filling in the three boxes following **Show if**, which correspond to an object, its condition, and its value being assessed, respectively. When that logical rule passes, the **Checklist module** is shown.
    3.  (Optional) Add additional logical rules by clicking either ”**Add”** (if you want to add 'AND' rules, where all must be passed to continue) or ”**Or group”** (if you can also nest a group of OR statements within an AND statement).

# Plans Explained[](#plans-explained)

## Case Related Cases module component by plan[](#case-related-cases-module-component-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Case Related Cases module component | Available | Available | Available | Available |
| Advanced options - Module enablement | Not Available | Not Available | Limited | Available |
| Visibility - Advanced configurations | Limited | Limited | Limited | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md).
