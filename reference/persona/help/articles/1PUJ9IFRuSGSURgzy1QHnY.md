# Creating a Case

# Creating Cases[](#creating-cases)

## Overview[](#overview)

A [Case](./1EJCOF8bL5KRx4pQESw7VB.md) is an identity investigation center that enables your team to triage, review, and resolve identity inquiries efficiently. Cases are highly customizable and can aggregate data from multiple Persona products, including Inquiries, Verifications, Reports, and Graph. This article outlines the primary methods for creating a Case and highlights how to integrate Case creation into your existing workflows and automation processes.

## Methods for creating a Case[](#methods-for-creating-a-case)

### 1\. Within a Workflow (Recommended)[](#1-within-a-workflow-recommended)

You can create a Case within a Workflow. This is especially useful for automating operational review processes when certain thresholds or conditions are met. This method is recommended and allows you to use a Workflow to subsequently update Case fields, decision a Case status, attach other objects to the Case for review, and many other commonly used actions in decisioning or business logic-related processes.

#### Relevant Workflow Steps[](#relevant-workflow-steps)

-   [**Create Case Step**](./3ly3uUwIUTVih1pkT5dfcE.md): Allows you to generate a Case from within a Workflow.

#### Specifying Case attributes in the Workflow Step[](#specifying-case-attributes-in-the-workflow-step)

You will also need to specify the Case Template for a newly created Case and you can additionally define Case fields or other attributes. See the article on [Workflows: Create Case step](./3ly3uUwIUTVih1pkT5dfcE.md) for step-specific configurations.

### 2\. Directly creating a Case via API[](#2-directly-creating-a-case-via-api)

You can create a Case directly via the API.

#### Relevant API endpoint[](#relevant-api-endpoint)

The relevant API endpoint to execute this request is:

-   [Create a Case](../../docs/reference/create-a-case.md)

#### Specifying Case attributes in the API request[](#specifying-case-attributes-in-the-api-request)

The Create a Case endpoint allows you to define various attributes when programmatically creating a Case. While `case-template-id` is the only `required` parameter needed, you can also create a Case with some other important attributes.

-   `case-template-id`: The Case Template ID defines the structure of the Case, including layout, field requirements, and review steps. You can find Template IDs in your Persona dashboard under **Cases > Templates**.
-   `creator-email-address`: (Optional) Email of the user creating this Case in the organization. Useful for audit trails and ownership attribution.
-   `case-queue-id`: (Optional) Assign the Case to a specific queue to help with triage and load balancing.
-   `object-ids`: (Optional) Attach existing Persona resources (such as Inquiries, Reports, or Transactions) to the Case at creation. This ensures that your investigation context is immediately available and centralized.
-   `sla-expires-in-seconds`: (Optional) Set an SLA deadline to ensure timely review.

Refer to the [API reference documentation](../../docs/reference/create-a-case.md) for request examples and to test out API calls in the sandbox environment.

## Related articles

[Cases Overview](./1EJCOF8bL5KRx4pQESw7VB.md)

[Cases Template](./5WFMyVPjzgXQNljqg2xf4h.md)

[Workflows: Create Case step](./3ly3uUwIUTVih1pkT5dfcE.md)
