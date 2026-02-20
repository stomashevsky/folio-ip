# Cases: Comments prebuilt modules

# What is the Case Comments module?[](#what-is-the-case-comments-module)

The **Case Comments module** is a prebuilt component that can be added to a Case Template. It can be used to view and add comments to a case. You can customize when fields are displayed on the module and define logic that governs when it appears.

![casecommentsmodule](../images/casecommentsmodule_c2ee9d7dc6bc.png)

The **Case Comments module** provides a collaborative space where you and your team can view and add comments on a case. You can use preset comments when updating case status or adding new comments.

# How do you add a Case Comments module?[](#how-do-you-add-a-case-comments-module)

1.  Navigate to the Dashboard, and click on **Cases** > **Templates**.
2.  Find and click on the Case template you want to edit, or **Create** a new template.
3.  Navigate to the **Tab** you want to add a Case component to. Click an empty space to view the Component Library.
4.  In the right toolbar, search for ‘**Comments**.’
5.  Drag and drop the **Comments module** into your Case UI and reposition it by dragging it around.

![commentmodule](../images/commentmodule_8bbe3dee4560.png)

6.  Click on the **Comments module.** On the right toolbar you can customize how comments are displayed on the module.
    1.  Under **Preset comments,** you can add, remove and rearrange the comments that will display on the **Comments module.** You can read more about **Preset comments** below.
    2.  Under **Module Layout**, you can change:
        1.  Dynamic height: Module will grow or shrink to fit its contents.
        2.  Visibility: Dynamically control whether the module is hidden. This is a toggle button that lets you set conditions for when the button should be displayed or hidden from view based on your case requirements. You can read more about **Visibility configuration** below.
    3.  Under **Advanced Options > Module Enablement**, you can define custom control conditions that determine when the **Comments module** is enabled or disabled. Advanced options are typically configured for specific customers by a Persona team member.
7.  Click the **“Delete”** button if you want to remove the component from the Case UI.

## Preset Comments[](#preset-comments)

![presetcomments](../images/presetcomments_1f838eddc743.png)

1.  Click “**\+ Add**” to add a new comment. If you add more than one comment you can rearrange them by clicking and dragging them to the desired position.

![addcomment](../images/addcomment_57a19401d910.png)

2.  Click on the three dots to edit the comment. You can change the “Template name” here.

![newcomment](../images/newcomment_4af969976868.png)

## Visibility configuration[](#visibility-configuration)

If you toggle this on you will have two options to customize visibility.

![visibility](../images/visibility_38b9b2855a27.png)

1.  **Basic** visibility allows you to set rules on the **Comments module** to determine when it will be visible. You can read more about **Basic visibility configuration** below.
2.  **Advanced** visibility allows you to set logic to control when the **Comments module** is enabled or disabled based on custom conditions. Advanced options are typically configured for specific customers by a Persona team member.

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

1.  Click on the **Comments module**, and go to **Module Layout** and toggle the button next to **Visibility** in the right toolbar.
    1.  Click on “**Empty rule**” to see **Visibility configuration**.
    2.  Create a logical rule by filling in the three boxes following **Show if**, which correspond to an object, its condition, and its value being assessed, respectively. When that logical rule passes, the **Comments module** is shown.
    3.  (Optional) Add additional logical rules by clicking either ”**Add”** (if you want to add 'AND' rules, where all must be passed to continue) or ”**Or group”** (if you can also nest a group of OR statements within an AND statement).

# Plans Explained[](#plans-explained)

## Case Comments module component by plan[](#case-comments-module-component-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Case Comments module component | Limited | Limited | Available | Available |
| Advanced options - Module enablement | Limited | Limited | Limited | Available |
| Visibility - Advanced configurations | Limited | Limited | Limited | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md).
