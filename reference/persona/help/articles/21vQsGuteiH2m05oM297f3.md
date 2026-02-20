# Government ID Verification: Setting allowed ID types

# Overview[](#overview)

For a Government ID Verification, you can [set the accepted ID types](./21vQsGuteiH2m05oM297f3.md). For each accepted ID type, you can configure one or more alternatives to serve as fallback options.

Accepted alternatives are useful when end users confuse one ID type for another. For example, users might select Driver's License but inadvertently submit Passports, causing verification attempts to fail. This is an advanced configuration that should only be used in specific scenarios where you understand your users' behavior patterns.

To configure accepted alternatives:

## Step 1: Navigate to the Government ID Verification Template configurations[](#step-1-navigate-to-the-government-id-verification-template-configurations)

### For Government ID Verification Templates within an Inquiry Template[](#for-government-id-verification-templates-within-an-inquiry-template)

1.  In the Persona Dashboard, navigate to Inquiries > Templates. Select a template that uses Government ID Verification.
2.  Once you are in the Flow Editor, use the Left Panel to head to Verifications.
3.  Select the Government ID Verification template.
4.  Navigate to Countries and ID types.

![SettingAllowedIDtypes001](../images/SettingAllowedIDtypes001_c34ebee1f8c2.png)

### For Government ID Verification Templates used alongside a Transaction, Workflow, or via API[](#for-government-id-verification-templates-used-alongside-a-transaction-workflow-or-via-api)

1.  In the Persona Dashboard, navigate to Verifications > Templates.
2.  Select the desired Government ID Verification Template that you'd like to change.

## Step 2: Configure Accepted Alternatives[](#step-2-configure-accepted-alternatives)

You can configure accepted alternatives using three different methods depending on your needs:

### Method 1: Configure for an individual country[](#method-1-configure-for-an-individual-country)

1.  Locate the country you want to configure in the Countries and ID types table.
2.  Click the chevron next to the country's name to view its accepted ID types.
3.  Select the ID type you want to configure alternatives for.
4.  In the ID configuration pane that appears:
    -   To add an alternative: Click the **+** button above the list of accepted alternatives and select an ID type from the dropdown.

![SettingAllowedIDtypes002](../images/SettingAllowedIDtypes002_d71a3ea19898.png)

-   To remove an alternative: Click the X next to the alternative ID type's name.

### Method 2: Bulk configure for multiple countries/ID types[](#method-2-bulk-configure-for-multiple-countriesid-types)

1.  Select multiple countries using the checkboxes to the left of the table.
2.  From the floating action bar that appears, select the ID configuration icon.
3.  From the dropdown, select **Accepted alternatives**.

![SettingAllowedIDtypes003](../images/SettingAllowedIDtypes003_ff9a54ff4a8d.png)

4.  In the Accepted Alternatives Overrides modal:
    -   Select the ID types you want to set alternatives for.
    -   Use the checkboxes to select the accepted alternatives from the available ID types.
    -   Note that any alternatives not selected will be removed from the selected ID types, as changes in this modal are applied as an override.

![SettingAllowedIDtypes004](../images/SettingAllowedIDtypes004_a3cef9899495.png)

5.  Click **Confirm** to apply your changes.

### Method 3: View and edit alternatives across countries[](#method-3-view-and-edit-alternatives-across-countries)

1.  Click the **ID** button in the table actions to open the Bulk ID Configuration Panel.
2.  Navigate to the **Accepted alternatives** tab.
3.  This tab displays all accepted alternatives for each ID type across all countries, organized by ID type.
4.  Use the checkboxes to make your changes as needed.
5.  Click **Confirm** to save your configurations.

![SettingAllowedIDtypes005](../images/SettingAllowedIDtypes005_28f8d4668d08.png)

## Step 3: Save your changes[](#step-3-save-your-changes)

In the upper corner of the Flow Editor, click **Save**.

### Method 1: Configure IDs for an individual country[](#method-1-configure-ids-for-an-individual-country)

1.  Locate the country you want to configure in the Countries and ID types tab.
2.  Click the chevron next to the country's name to view its accepted ID types.
3.  To add an ID, click the + button above the list of accepted ID types. Select an ID type from the dropdown. The dropdown will show all available ID types for the selected country that haven't yet been added to your accepted list.

![SettingAllowedGovID003](../images/SettingAllowedGovID003_1b97c3725149.png)

4.  To remove an ID, hover on an accepted ID type and click the X button.

![SettingAllowedGovID004](../images/SettingAllowedGovID004_e0a4eee783f1.png)

### Method 2: Bulk Configure IDs for Multiple Countries/ID Types[](#method-2-bulk-configure-ids-for-multiple-countriesid-types)

1.  Select multiple countries using the checkboxes to the left of the table.
2.  From the floating action bar that appears, select the **Remove ID** button.

![SettingAllowedGovID005](../images/SettingAllowedGovID005_7b6c8dc79d89.png)

3.  In the Remove IDs modal:
    -   Select the ID types you want to remove using the checkboxes.
    -   The modal shows all ID types available in at least one of your selected countries. (Note that availability varies by country.)
    -   When you click **Confirm**, the selected ID types will only be removed from the countries where they're supported.
4.  Click **Confirm** to apply your changes.

![SettingAllowedGovID006](../images/SettingAllowedGovID006_0e04a53c4cb7.png)

5.  To add IDs, follow the same process but select the **Add ID** button instead.

### Method 3: View and Configure IDs Across Countries[](#method-3-view-and-configure-ids-across-countries)

1.  Click the **ID** button in the table actions to open the Bulk ID Configuration Panel.
2.  View the complete list of ID types from any tab. Click an ID type to see which countries offer it and whether it's currently accepted in your Verification.
3.  To add or remove an ID from a country in this view, select the country using the checkbox to its left. In the floating action bar that appears, click either Add ID or Remove ID.

![SettingAllowedGovID007](../images/SettingAllowedGovID007_659392139f3e.png)

4.  Click **Confirm** to apply your changes.

## Step 4: Save your changes[](#step-4-save-your-changes)

In the upper corner of the Flow Editor, click **Save**.

Important Note: When configuring accepted alternatives, the main ID type must always be included in the list of accepted ID types. If you remove the main ID type, the ID type check will fail even when the end user submits the correct ID type.

As usual, you will need to publish your changes for them to go live.

## Allowed ID types by Plan[](#allowed-id-types-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Government ID Verification allowed ID type/class configurations | Available | Available | Available | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md)

## Learn more[](#learn-more)

-   You can also [set accepted fallback ID types for Government ID Verification](./PF0H0WuZaInkYNun8GTMg.md).

## Related articles

[Understanding Government ID Verification](./425G1MJXb8d9w6hTr7Huwg.md)

[Government ID Verification: Setting accepted fallback ID types](./PF0H0WuZaInkYNun8GTMg.md)

[Government ID Verification](./5vXD7S7pQCq8Q9Z4RztxLw.md)

[Configuring Government ID Verification checks](./3WnqX7N26sshPLKPQbuW4O.md)
