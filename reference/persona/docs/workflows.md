# Overview

A powerful tool for administering your identity needs

Using a simple and intuitive editor, you can automate manual processes such as automatically tagging high-risk [Inquiries](./inquiries.md), running additional [Reports](./reports.md) when specific conditions get met, and ingesting non-Persona, 3rd party data. Workflows are highly configurable and scalable. They drastically simplify how you manage customer identity.

## Trigger a Workflow

All Workflows begin with a trigger, which initiates the Workflow. Three trigger types exist:

1.  **Event triggers:** Configure your Workflow to initiate when an event in Persona occurs. Find the list of possible events you can trigger a Workflow from on the [Events](./events.md) page.
    
2.  **API triggers:** Initiate a Workflow via an API request to Persona. Pass in any data in the body of the request which the Workflow can then access.
    
3.  **Scheduled triggers:** Run a workflow at a regular cadence.
    

## **Take action**

Workflows support a large library of actions that assist with your automation and orchestration needs.

-   `Add Item to List`: Populate Persona [Lists](./lists.md).
-   `Approve Inquiry`: [Approve](./model-lifecycle.md#inquiry-statuses) Persona [Inquiries](./inquiries.md).
-   `Create Case`: Create a Persona [Case](./cases.md) for manual review.
-   `Create Inquiry`: Create a Persona [Inquiry](./inquiries.md).
-   `Decline Inquiry`: [Decline](./models-lifecycle.md#inquiry-statuses) Persona [Inquiries](./inquiries.md).
-   `Evaluate Code`: Craft custom JS logic.
-   `Inquiry Link Email`: Send emails containing [Inquiry](./inquiries.md) links.
-   `Inquiry Link SMS`: Send SMS containing [Inquiry](./inquiries.md) links.
-   `Make HTTPS Request`: POST and GET to HTTPS endpoints. Configure template-level Webhooks as well.
-   `Mark Inquiry for Review`: Mark Persona [Inquiries](./inquiries.md) for [Review](./models-lifecycle.md#inquiry-statuses).
-   `Redact Object`: Redact [Inquiries](./inquiries.md) and [Accounts](./accounts.md) automatically. Field-level and conditional redaction possible when done via Workflows.
-   `Run Report`: Access and run the full library of [Reports](./reports.md). Examples include Person Watchlist and Adverse Media Report, among others.
-   `Run Workflow`: Initiate another Persona Workflows. Useful to chain together multiple Workflows.
-   `Send Email`: Fully customize email messages sent via Persona. Includes HTML styling, as well as advanced configuration options to specify the From email address, SMTP server address, SMTP server port, SMTP server TLS, SMTP server user, and SMTP server password.
-   `Send Slack Message`: Send Slack messages.
-   `Send SMS`: Fully customize SMS messages sent via Persona.
-   `Tag Object`: Tag Persona objects (e.g. [Inquiries](./inquiries.md), [Cases](./cases.md), [Reports](./reports.md), etc).
-   `Trust Device`: Mark devices as trusted.
-   `Update Hubspot`: Update Hubspot objects.
-   `Update Salesforce`: Update Salesforce objects.
-   `Update Zendesk`: Update Zendesk tickets.

## Asynchronous activity

Workflows support asynchronous activity by allowing users to use Wait steps. There are two types of Wait steps:

1.  **Wait on objects**
    
    -   Configure your Workflow to wait on one or many events. As an example, you can set up a Workflow to wait for an Inquiry to get approved, a Case to get created, etc.
    -   Specify a Default Resolution time, which is a timeout after which the Workflow will proceed if the event the Workflow listens for never occurs.
2.  **Wait for time**
    
    -   Configure your Workflow to Wait for a specified period of time to pass.

## Conditional and parallel logic

Workflows can condition off numerous criteria, including:

-   3rd party criteria (e.g. values returned by custom code functions, ingested via API triggers, etc)
-   Inquiry criteria (e.g. age, country, government ID number, selfie liveness score, etc)
-   Report criteria (e.g. watchlist match, adverse media match, results from synthetic fraud report runs, etc)
-   Case criteria (e.g. status of case resolutions, etc)
-   Account criteria (e.g. tags associated with count, etc)
-   Template criteria (e.g. certain inquiry templates, etc)
-   Database criteria (e.g. matches found against databases Persona supports, etc)

With API triggered Workflows, users can configure the input schema and the Workflow conditionals can then access those defined fields in subsequent steps.

Workflows also supports parallel logic. As an example, with a parallel step, you can run two Reports at the same time.
