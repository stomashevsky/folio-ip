# Database Verifications

[API Reference](../accounts/list-all-accounts.md)[Verifications](../verifications.md)

# Database Verifications

A Database Verification answers the question “Do authoritative or issuing databases corroborate provided user data?”. Learn more about Database Verifications [here](https://help.withpersona.com/articles/7dcdaIsMttmPUZ2ZelRbZD).

For a list of supported information fields and what countries and coverage we have, visit our database [coverage map](https://app.withpersona.com/dashboard/resources/coverage-map/database).

You can see the full set of supported Verification checks in the [Verification Checks table](https://app.withpersona.com/dashboard/resources/verification-checks/) in your Dashboard.

## Identity Comparison Check

Persona provides strong defaults that strike a balance between false positive and false negative matches. By default, Persona allows near matches, which avoids unnecessary failures if a user inputs a typo or a nickname as their first name (e.g. “Mike” instead of “Mikey”). A birthdate of 12/15/1990 can be reported as a partial match against a birthdate of 12/14/1990. These defaults can be configured. For more information about these settings, see [Match requirements for Database Verification](https://support.withpersona.com/hc/en-us/articles/15869802383763-Match-requirements-for-Database-Verification).

International Database Verifications, which cover regions outside the United States, have some differences in how you configure match requirements. For details, see [Match Requirements for international Database Verification](https://support.withpersona.com/hc/en-us/articles/15938547576083), and feel free to [contact us](https://app.withpersona.com/dashboard/contact-us) with any questions.

| Verification Check Slug | Check Name | Check Type | Description |
| --- | --- | --- | --- |
| `database_identity_comparison` | Identity | Fraud | Detect if the identity matches a record in the authoritative or issuing databases |

## Database Verification Checks

These checks are processed regardless of the region for the authoritative database

| Verification Check Slug | Check Name | Check Type | Description |
| --- | --- | --- | --- |
| `database_address_deliverable_detection` | Deliverable address | User action required | Detect if the address is deliverable. |
| `database_address_residential_detection` | Residential address | User action required | Detect if the address is residential. |
| `database_inquiry_comparison` | Inquiry comparison | Fraud | Compare if previously claimed attributes like name or birthdate are inconsistent with what was submitted to the authoritative database |
| `database_po_box_detection` | PO box | User action required | Detect if the address is a PO box. |
