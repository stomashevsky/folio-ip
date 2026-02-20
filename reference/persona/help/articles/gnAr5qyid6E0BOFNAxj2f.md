# Workflows: Add Item To Face List Step

# What is the Add Item To Face List step?[](#what-is-the-add-item-to-face-list-step)

**Add Item To Face List** is a Workflow Action step that adds an item to a Persona face list.

![Add Item To Face List Step](../images/Add_Item_To_Face_List_Step_4cc3582252d6.png)

Lists in general are particularly useful for enhancing security, compliance, and operational efficiency. Some examples of this include:

-   **Fraud Prevention**: Maintain a list of known fraudulent email addresses, IP addresses, or identities to automatically flag or block suspicious activities.
-   **Compliance Checks**: Create lists of sanctioned individuals or entities to ensure compliance with legal and regulatory requirements by checking against these lists during verification processes.
-   **VIP Customer Management**: Manage a list of VIP customers to provide them with prioritized service or special handling during interactions.
-   **Access Control**: Use lists to manage access to certain features or services by maintaining a whitelist or blacklist of users or entities.

Face Lists are a specific kind of Persona List that stores images. It can be used to compare and match facial data from new inquiries against stored data to identify individuals or detect known fraudsters.

The Add Item To Face List step allows you to automatically add a new image to a Face List, keeping it relevant and useful.

# How do you add an Add Item To Face List step?[](#how-do-you-add-an-add-item-to-face-list-step)

⚠️ The Add Item to Face List step in Workflows is only available following an Inquiry-based step.

For example, steps like Fetch Object step (where the object is an Inquiry), Create Inquiry step, or the trigger for the workflow like Inquiry Completed must precede the Add to Face List step for it to be used.

1.  Navigate to the Dashboard, and click on **Workflows** > **All Workflows**.
2.  Find and click on the workflow you want to edit, or **Create** a new workflow.
3.  Click on **+** when hovering over a circle to add an **Action**.

![tagOnInqiry](../images/tagoninquiry_4336399141d5.png)

4.  Use the **Find Action** select box to click on **List** > **Add Item To Face List**.
5.  Choose the **Inquiry-based Step** to select the image from.
6.  Choose the **List** you want to add facial data to.
7.  (Optional) In ‘Advanced Configuration’, click the **Continue on error** box if you want the workflow to continue running even if this step raises an error.
8.  **Close** the step. You’ll have to **Save** and **Publish** the workflow to begin using it.

# Plans Explained[](#plans-explained)

## Add Item To Face List step by plan[](#add-item-to-face-list-step-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Add Item To Face List step | Not Available | Available | Available as part of Enhanced Image Registries | Available as part of Enhanced Image Registries |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md).

# Learn more[](#learn-more)

[Learn more about Lists.](../../docs/v2022-09-01/docs/lists.md)
