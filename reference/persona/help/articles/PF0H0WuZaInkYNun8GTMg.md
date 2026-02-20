# Government ID Verification: Setting accepted fallback ID types

# Overview[](#overview)

For a Government ID Verification, you can [set the allowed ID types](./21vQsGuteiH2m05oM297f3.md). For each allowed ID type, you can set one or more accepted _fallback_ ID types.

Setting fallback ID types can be useful if you notice your end users are confusing one ID type for another. For example, you may find that users select Driver's License but are inadvertently submitting Passports causing their verification attempts to fail. In this way, this is an advanced configuration that should only be used in specific scenarios where you are confident in the behavior of your users.

Fallback ID types are also set in the same Allowed ID Types configuration for a Government ID Verification template and enable the ability to accept additional ID types in the event that the end user submits a different ID type than what they selected.

# Configuring fallback ID types for a Government ID Verification Template[](#configuring-fallback-id-types-for-a-government-id-verification-template)

To set accepted fallback ID types:

## Step 1: Navigate to the Government ID Verification Template configurations[](#step-1-navigate-to-the-government-id-verification-template-configurations)

### For Government ID Verification Templates within an Inquiry Template[](#for-government-id-verification-templates-within-an-inquiry-template)

1.  In the Persona Dashboard, navigate to **Inquiries** > **Template**. Select a template that uses Government ID Verification.
2.  In the upper corner of the Flow Editor, click **Configure**.
3.  Select **Verifications** > **Government ID** in the sidebar.

### For Government ID Verification Templates used alongside a Transaction, Workflow, or via API[](#for-government-id-verification-templates-used-alongside-a-transaction-workflow-or-via-api)

1.  In the Persona Dashboard, navigate to **Verifications** > **Template**.
2.  Select the desired Government ID Verification Template that you'd like to change.

## Step 2: Update the Government ID Verification Template configurations[](#step-2-update-the-government-id-verification-template-configurations)

1.  Scroll to **Enabled countries and ID types**.
2.  Locate the country for which you would like to set accepted fallback ID types. Expand the row.
3.  Add the desired fallback ID types to the **Allowed ID Classes** configuration
    -   Note: You will see the main ID type listed as an option in Allowed ID Classes. Do not remove it. If you remove it, the Allowed ID type check will fail if the end user submits the correct ID type.

As usual, you will need to publish your changes for them to go live.

## Accepted Fallback ID types by Plan[](#accepted-fallback-id-types-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Government ID Verification accepted fallback ID type/class configurations | Available | Available | Available | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md)

## Related articles

[Government ID Verification: Setting allowed ID types](./21vQsGuteiH2m05oM297f3.md)

[Configuring Government ID Verification checks](./3WnqX7N26sshPLKPQbuW4O.md)
