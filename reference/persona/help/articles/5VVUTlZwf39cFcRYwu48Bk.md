# Cases: Checklist prebuilt module

# What is the Case Checklist module?[](#what-is-the-case-checklist-module)

The **Case Checklist module** is a prebuilt component that can be added to a Case Template. It lets you create a custom checklist for agents to follow and complete as they review each Case. You can define logic that governs when it appears.

![checklist](../images/checklist_5120d1860b2a.png)

# How do you add a Case Checklist Module?[](#how-do-you-add-a-case-checklist-module)

1.  Navigate to the Dashboard, and click on **Cases** > **Templates**.
2.  Find and click on the Case template you want to edit, or **Create** a new template.
3.  Navigate to the **Tab** you want to add a Case component to. Click an empty space to view the Component Library.
4.  In the right toolbar, search for ‘**Checklist**.’
5.  Drag and drop the **Checklist module** into your Case UI and reposition it by dragging it around.

![checklistmodule](../images/checklistmodule_c199f9afc649.png)

6.  Click on the **Checklist module** on the right toolbar you can customize the module.
    1.  Under **Settings**, you can edit the **Title** text to change the text displayed on the top of the module.
    2.  Under **Settings**, add items to the Checklist by clicking the "**Add item**" button. Learn more about **Add item** below.
    3.  Under **Module Layout**, you can change:
        1.  Dynamic height: Module will grow or shrink to fit its contents.
        2.  Visibility: Dynamically control whether the module is hidden. This is a toggle button that lets you set conditions for when the button should be displayed or hidden from view based on your case requirements. You can read more about **Visibility configuration** below.
    4.  Under **Advanced Options > Module Enablement**, you can define custom control conditions that determine when the **Checklist module** is enabled or disabled. Advanced options are typically configured for specific customers by a Persona team member.
7.  Click the **“Delete”** button if you want to remove the component from the Case UI.

## Add item[](#add-item)

When the pop-up appears, provide the following information:

1.  Item description: A description of what needs to be checked
2.  Item key: A unique identifier used for updating checklist items through Persona's API
3.  Required for statuses: Define which case statuses require this item to be checked before proceeding. Cases can only transition to these statuses once this checklist item is marked complete.

![checklistitem](../images/checklistitem_c0d16d737b3e.png)

4.  To move an items, click and drag the items to the desired position.
5.  To add an items, type the name of the desired field into the search bar and select the one you want to add.
6.  To remove a Field click the toggle button on the right.

## Visibility configuration[](#visibility-configuration)

If you toggle this on you will have two options to customize visibility.

![visibility](../images/visibility_38b9b2855a27.png)

1.  **Basic** visibility allows you to set rules on the **Checklist module** to determine when it will be visible. You can read more about **Basic visibility configuration** below.
2.  **Advanced** visibility allows you to set logic to control when the **Checklist module** is enabled or disabled based on custom conditions. Advanced options are typically configured for specific customers by a Persona team member.

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

1.  Click on the **Checklist module**, and go to **Module Layout** and toggle the button next to **Visibility** in the right toolbar.
    1.  Click on “**Empty rule**” to see **Visibility configuration**.
    2.  Create a logical rule by filling in the three boxes following **Show if**, which correspond to an object, its condition, and its value being assessed, respectively. When that logical rule passes, the **Checklist module** is shown.
    3.  (Optional) Add additional logical rules by clicking either ”**Add”** (if you want to add 'AND' rules, where all must be passed to continue) or ”**Or group”** (if you can also nest a group of OR statements within an AND statement).

# Plans Explained[](#plans-explained)

## Case Checklist module component by plan[](#case-checklist-module-component-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Case Checklist module component | Available | Available | Available | Available |
| Advanced options - Module enablement | Not Available | Not Available | Limited | Available |
| Visibility - Advanced configurations | Limited | Limited | Limited | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md).
