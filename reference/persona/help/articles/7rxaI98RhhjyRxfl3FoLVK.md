# Cases: Verification prebuilt module

# What is the Verification module?[](#what-is-the-verification-module)

The **Case Verification module** is a prebuilt component that can be added to a Case Template. It displays all Verification attempts related to the Case. You can attach a Verification by using the [Attach Objects to Case step](./68OO1Ovqk7xRcYUDVMbWYa.md) in a Workflow. You can define logic that governs when it appears.

![verificationmodule](../images/verificationmodule_06825ba527e5.png)

# How do you add a Verification module?[](#how-do-you-add-a-verification-module)

1.  Navigate to the Dashboard, and click on **Cases** > **Templates**.
2.  Find and click on the Case template you want to edit, or **Create** a new template.
3.  Navigate to the **Tab** you want to add a Case component to. Click an empty space to view the Component Library.
4.  In the right toolbar, search for ‘**Verification**.’
5.  Drag and drop the **Verification module** into your Case UI and reposition it by dragging it around.

![caseverification](../images/caseverification_dcc8ad350081.png)

6.  Click on the **Verification module** on the right toolbar you can customize how information is displayed on the module.
    1.  Under **Settings**, you can select which verification template to display from the dropdown menu. Choose "All Verification Templates" if you don't have a specific preference, or select a particular template.
    2.  Under **Settings**, you can select the type of verification. It is defaulted to “Government ID” but you have the option to change it to verification for the case.
    3.  Under **Fields**, you can add, remove and rearrange the fields that will display on the Verification module. This section will only show up for “Government ID” or “Selfie” types. Learn more about **Verification Fields** below.
    4.  Under **Module Layout**, you can change:
        1.  Dynamic height: Module will grow or shrink to fit its contents.
        2.  Visibility: Dynamically control whether the module is hidden. This is a toggle button that lets you set conditions for when the button should be displayed or hidden from view based on your case requirements. You can read more about **Visibility configuration** below.
    5.  Under **Advanced Options > Module Enablement**, you can define custom control conditions that determine when the **Verification module** is enabled or disabled. Advanced options are typically configured for specific customers by a Persona team member.
7.  Click the **“Delete”** button if you want to remove the component from the Case UI.

## Verification Fields[](#verification-fields)

![verificationfields](../images/verificationfields_55e8b65441f5.png)

1.  To move a **Field**, click and drag the Field to the desired position.
2.  To add a **Field**, type the name of the desired field into the search bar and select the one you want to add.
3.  To remove a **Field** click the toggle button on the right.

## Visibility configuration[](#visibility-configuration)

If you toggle this on you will have two options to customize visibility.

![visibility](../images/visibility_38b9b2855a27.png)

1.  **Basic** visibility allows you to set rules on the **Verification module** to determine when it will be visible. You can read more about **Basic visibility configuration** below.
2.  **Advanced** visibility allows you to set logic to control when the **Verification module** is enabled or disabled based on custom conditions. Advanced options are typically configured for specific customers by a Persona team member.

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

1.  Click on the **Verification module**, and go to **Module Layout** and toggle the button next to **Visibility** in the right toolbar.
    1.  Click on “**Empty rule**” to see **Visibility configuration**.
    2.  Create a logical rule by filling in the three boxes following **Show if**, which correspond to an object, its condition, and its value being assessed, respectively. When that logical rule passes, the **Verification module** is shown.
    3.  (Optional) Add additional logical rules by clicking either ”**Add”** (if you want to add 'AND' rules, where all must be passed to continue) or ”**Or group”** (if you can also nest a group of OR statements within an AND statement).

# Plans Explained[](#plans-explained)

## Case Verification module component by plan[](#case-verification-module-component-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Case Verification module component | Limited | Limited | Available | Available |
| Advanced options - Module enablement | Limited | Limited | Limited | Available |
| Visibility - Advanced configurations | Limited | Limited | Limited | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md).
