# Cases: Device prebuilt modules

# What is the Case Device module?[](#what-is-the-case-device-module)

The **Case Device module** is a prebuilt component that can be added to a Case Template. It displays device information from Inquiries that are attached to the Case. This information includes IP address, threat rating, and network country. You can also customize when fields are displayed on the module and define logic that governs when it appears.

![devicemodule](../images/devicemodule_0ff4b11deb35.png)

# How do you add a Case Device module?[](#how-do-you-add-a-case-device-module)

1.  Navigate to the Dashboard, and click on **Cases** > **Templates**.
2.  Find and click on the Case template you want to edit, or **Create** a new template.
3.  Navigate to the **Tab** you want to add a Case component to. Click an empty space to view the Component Library.
4.  In the right toolbar, search for ‘**Device**.’
5.  Drag and drop the **Device module** into your Case UI and reposition it by dragging it around.

![devicemodulecomponent](../images/devicemodulecomponent_8f2acfba3dac.png)

6.  Click on the **Field update module** on the right toolbar you can customize how information is displayed on the module.
    1.  Under **Fields,** you can add, remove and rearrange the fields that will display on the **Device module.** Learn more about **Device Fields** below.
    2.  Under **Module Layout**, you can change:
        1.  Dynamic height: Module will grow or shrink to fit its contents.
        2.  Visibility: Dynamically control whether the module is hidden. This is a toggle button that lets you set conditions for when the button should be displayed or hidden from view based on your case requirements. You can read more about **Visibility Configuration** below.
    3.  Under **Advanced Options > Module Enablement**, you can define custom control conditions that determine when the **Device module** is enabled or disabled. Advanced options are typically configured for specific customers by a Persona team member.
7.  Click the **“Delete”** button if you want to remove the component from the Case UI.

## Device Fields[](#device-fields)

1.  To move a **Field**, click and drag the Field to the desired position.
2.  To add a **Field**, type the name of the desired field into the search bar and select the one you want to add.
3.  To remove a **Field** click the toggle button on the right.

![devicefields](../images/devicefields_5a67fa56f17b.png)

## Visibility Configuration[](#visibility-configuration)

If you toggle this on you will have two options to customize visibility.

![visibility](../images/visibility_38b9b2855a27.png)

1.  **Basic** visibility allows you to set rules on the **Device module** to determine when it will be visible. You can read more about **Basic Visibility Configuration** below.
2.  **Advanced** visibility allows you to set logic to control when the **Device module** is enabled or disabled based on custom conditions. Advanced options are typically configured for specific customers by a Persona team member.

## Basic Visibility Configuration[](#basic-visibility-configuration)

Visibility configuration consist of three main components:

1.  **Field**: The object that will have a condition linked to it.
2.  **Condition**: How the field is compared to the value (e.g., equals, does not equal).
3.  **Value**: The value to test against.

![visibilityconfig](../images/visibilityconfig_43cd5adc81f4.png)

### Creating Visibility Configuration[](#creating-visibility-configuration)

-   **AND Statements**: Combine multiple conditions that must all be true for the rule to pass. Add these using the **"Add"** button.
-   **OR Groups**: Combine conditions where only one needs to be true for the rule to pass. Create these by clicking **"Add OR Group"**.

## How to Use Visibility Configuration[](#how-to-use-visibility-configuration)

1.  Click on the **Device module**, and go to **Module Layout** and toggle the button next to **Visibility** in the right toolbar.
    1.  Click on “**Empty rule**” to see **Visibility Configuration**.
    2.  Create a logical rule by filling in the three boxes following **Show if**, which correspond to an object, its condition, and its value being assessed, respectively. When that logical rule passes, the **Device module** is shown.
    3.  (Optional) Add additional logical rules by clicking either ”**Add”** (if you want to add 'AND' rules, where all must be passed to continue) or ”**Or group”** (if you can also nest a group of OR statements within an AND statement).

# Plans Explained[](#plans-explained)

## Case Device module component by plan[](#case-device-module-component-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Case Device module component | Limited | Limited | Available | Available |
| Advanced options - Module enablement | Limited | Limited | Limited | Available |
| Visibility - Advanced configurations | Limited | Limited | Limited | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md).
