# Exporting data from the Dashboard

_This article describes how to export data from the Persona Dashboard. See the [developer docs](../../docs/docs.md) to learn how to export data via API._

## Overview[](#overview)

In the Persona Dashboard, you can export data from various views, including the [Accounts](./2gE7mjjLCIGJPnK6mTyjU9.md) view, the Inquiry view, and the [Cases](./1EJCOF8bL5KRx4pQESw7VB.md) view.

## Access control[](#access-control)

To export data from the Dashboard, you must have the associated permission for the type of data you want to export. Permissions include:

1.  **Export Accounts**: ability to export Accounts.
2.  **Export Cases**: ability to export Cases.
3.  **Export Inquiries**: ability to export Inquiries.
4.  **Export Reports**: ability to export Reports.

If you are an Admin, you can grant or remove these permissions from specific roles using [roles and permissions](./5isJzuUdTmFWiLehSDugUI.md).

## Important notes[](#important-notes)

### To avoid large downloads, filter your data first[](#to-avoid-large-downloads-filter-your-data-first)

By default, an export includes _all_ available data from all time (e.g. every Account, Inquiry, and/or Case). The data size can be very large.

To export only _some_ of the data, first filter your data using the controls at the top of the view, then export.

### Downloads contain PII[](#downloads-contain-pii)

Please note that all exports via the Persona Dashboard contain PII.

## Create an export[](#create-an-export)

To create an export, first navigate to the relevant page in the Persona Dashboard (for example, the Accounts view, the Inquiries view, or the Cases view). Filter the data to what you want, then click the **Export** button in the upper right hand corner.

## Data format[](#data-format)

### Overview[](#overview-1)

Some exports consist of a single `.csv` file, while others contain several `.csv` files. these files will be bundled together into a single `tar.gz` or `ZIP` file. Tip: If you are using the Windows operating system you may want to choose to export the files as a ZIP file since it is natively supported.

### Accounts[](#accounts)

When exporting from the Accounts page, you receive up to four files in `.csv` format: one file each for Accounts, Inquiries, Reports, and Documents.

Although these files are separate, they contain information associated with the same individual Account. All files include the associated Account ID, Inquiry ID, and relevant Report ID or Document ID.

### Inquiries[](#inquiries)

When exporting from the Inquiries page, you receive one Inquiry file, plus one file for each type of Verification that is part of your Inquiry. These files are in `.csv` format.

For example, if you run Government ID + Selfie verifications, you receive a total of three files: one Inquiry file, one Government ID file, and one Selfie file.

Each Verification file includes associated Verification checks and results, as well as all other fields that you see in the Dashboard.

### Cases[](#cases)

When exporting from the Cases page, you receive one Case file in `.csv` format. This file contains all associated Case objects (Account ID, Inquiry ID, Report ID, etc) and tags associated with the Cases.

### Reports[](#reports)

When exporting from the Reports page, you receive one summary Report file, plus one file for each type of Report that is included in the filter. These files are in `.csv` format.

Additional files will be exported for more detailed exports on Watchlist Hits and Adverse Media Hits, also in `.csv` format.

Every file will include a report ID, a link to the relevant data on dashboard, the report template, reference ID, status, tags, created at, last run at.

## View all exports[](#view-all-exports)

The Exports view displays the full history of exports, including who created the export, when it completed, and what type of export was made.

You can navigate to the Exports view in several ways: 

-   **From an email notification**: If you create an export, you will receive an email when it is ready to download. The email will link you to the Exports view.
-   **From the Dashboard Navbar**: Under the "Platform" header, click on **Exports**. 
    -   If you don't see this link, see the instructions for how to add it to your Navbar.

### Configure "Exports" in the Dashboard Navbar[](#configure-exports-in-the-dashboard-navbar)

If you are an Admin, you can add or remove the "Exports" link from the Navbar by editing a role's [Navbar configurations](./7jjWdyMQUMW1BAUUAlyaLT.md).

## Related articles

[Inquiry Overview Export](./3UMDh6jIJV8OaqMHKfFpZQ.md)

[Verification Volume Export](./7Mt5urHVKQbKirhyuzEexT.md)

[Verification Checks Match Comparison Results Export](./3VlGv1hT066blTn5vSI9wp.md)

[Verification Checks Export](./X6m9vL0l80BtWmb5pQRsM.md)
