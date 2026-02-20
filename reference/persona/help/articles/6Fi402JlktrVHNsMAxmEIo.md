# Cases: Data Display prebuilt module

# What is the Case Data Display Module?[](#what-is-the-case-data-display-module)

The **Case Data Display module** is a prebuilt component that can be added to a Case Template. It displays string, number, or boolean case fields on a Case. You can customize when fields are displayed on the module and define logic that governs when it appears.

![datadisplay](../images/datadisplay_e46dbb48ad79.png)

# How do you add a Case Data Display module?[](#how-do-you-add-a-case-data-display-module)

1.  Navigate to the Dashboard, and click on **Cases** > **Templates**.
2.  Find and click on the Case template you want to edit, or **Create** a new template.
3.  Navigate to the **Tab** you want to add a Case component to. Click an empty space to view the Component Library.
4.  In the right toolbar, search for ‘**Data Display**.’
5.  Drag and drop the **Data Display module** into your Case UI and reposition it by dragging it around.

![datadisplaymodule](../images/datadisplaymodule_0a3cdf097694.png)

6.  Click on the **Data Display module** on the right toolbar you can customize the **Data Display module**.
    1.  Under **Headers**, you can customize the **Title** and add a **subtitle** to the module.
    2.  Under **Section Configuration,** you can add and remove **Sections** that will display on the **Data Display module.** Learn more about **Section Configuration** below.
    3.  Under **Module Layout**, you can change:
        1.  Dynamic height: Module will grow or shrink to fit its contents.
        2.  Visibility: Dynamically control whether the module is hidden. This is a toggle button that lets you set conditions for when the button should be displayed or hidden from view based on your case requirements. You can read more about **Visibility configuration** below.
    4.  Under **Advanced Options > Module Enablement**, you can define custom control conditions that determine when the **Data Display module** is enabled or disabled. Advanced options are typically configured for specific customers by a Persona team member.
7.  Click the **“Delete”** button if you want to remove the component from the Case UI.

## Section Configuration[](#section-configuration)

1.  To add a **Section**, click the “**Add section**” button.

![SectionConfig](../images/SectionConfig_3f229f90acdf.png)

1.  Click the **Pencil** button to edit the Section Title. You can also add and remove attributes in the edit screen. To mask sensitive data, check the “obscurable” box—this will replace all characters with “\*” on the Case UI.
2.  To remove a Section click the **Trash Can** button

![DataDisplayEdit](../images/DataDisplayEdit_0e9394dbf9fb.png)

## Visibility configuration[](#visibility-configuration)

If you toggle this on you will have two options to customize visibility.

![visibility](../images/visibility_38b9b2855a27.png)

1.  **Basic** visibility allows you to set rules on the **Data Display module** to determine when it will be visible. You can read more about **Visibility configuration** below.
2.  **Advanced** visibility allows you to set logic to control when the **Data Display module** is enabled or disabled based on custom conditions. Advanced options are typically configured for specific customers by a Persona team member.

## Basic visibility configuration[](#basic-visibility-configuration)

Visibility configuration consist of three main components:

1.  **Field**: The object that will have a condition linked to it.
2.  **Condition**: How the field is compared to the value (e.g., equals, does not equal).
3.  **Value**: The value to test against.

![visibilityconfig](../images/visibilityconfig_43cd5adc81f4.png)

### Creating visibility configuration[](#creating-visibility-configuration)

-   **AND Statements**: Combine multiple conditions that must all be true for the rule to pass. Add these using the **"Add"** button.
-   **OR Groups**: Combine conditions where only one needs to be true for the rule to pass. Create these by clicking **"Add OR Group"**.

## How to use visibility configuration[](#how-to-use-visibility-configuration)

1.  Click on the **Data Display module** component, and go to **Module Layout** and toggle the button next to **Visibility** in the right toolbar.
    1.  Click on “**Empty rule**” to see **Visibility configuration**.
    2.  Create a logical rule by filling in the three boxes following **Show if**, which correspond to an object, its condition, and its value being assessed, respectively. When that logical rule passes, the **Data Display module** is shown.
    3.  (Optional) Add additional logical rules by clicking either ”**Add”** (if you want to add 'AND' rules, where all must be passed to continue) or ”**Or group”** (if you can also nest a group of OR statements within an AND statement).

# Plans Explained[](#plans-explained)

## Case Data Display module component by plan[](#case-data-display-module-component-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Case Data Display module component | Limited | Limited | Available | Available |
| Advanced options - Module enablement | Limited | Limited | Limited | Available |
| Visibility - Advanced configurations | Limited | Limited | Limited | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md).
