# Creating a Transaction[](#creating-a-transaction)

## Overview[](#overview)

A [Transaction](./5mzXj1PHBXtX5UlYbfZyvx.md) is a flexible object in that represents a user interaction or event that you define. This can be onboarding, a loan application, a submitted form, a withdrawal, or any other meaningful interaction within your system. Transactions help you coordinate identity-related actions across multiple Persona products and your own infrastructure and are a key component for any API-first integration method. This article outlines the primary methods for creating a Transaction and highlights how to integrate Transaction creation into your existing workflows and automation processes.

## Methods for creating a Transaction[](#methods-for-creating-a-transaction)

### 1\. Within a Workflow (Recommended)[](#1-within-a-workflow-recommended)

You can create a Transactions within a Persona Workflow, either as a trigger or as a step in a larger identity orchestration flow.

### Relevant Workflow Steps[](#relevant-workflow-steps)

-   [Workflows: Create Transaction Step](./6yTKeRbCEdxNfYBucXqBZU.md): Allows you to generate a Transaction from within a Workflow.

### Specifying Transaction attributes in the Workflow Step[](#specifying-transaction-attributes-in-the-workflow-step)

You will need to specify the Transaction Type for a newly created Transaction and you can additionally define Transaction fields or other attributes. See the article on [Workflows: Create Transaction Step](./6yTKeRbCEdxNfYBucXqBZU.md) for step-specific configurations.

### 2\. Directly creating a Transaction via API (Recommended)[](#2-directly-creating-a-transaction-via-api-recommended)

You can create a Transaction directly via the API.

### Relevant API endpoint[](#relevant-api-endpoint)

The relevant API endpoint to execute this request is:

-   [Create a Transaction](../../docs/reference/create-a-transaction.md)

### Specifying Transaction attributes in the API request[](#specifying-transaction-attributes-in-the-api-request)

The Create a Transaction endpoint allows you to define various attributes when programmatically creating a Transaction.

-   `transaction-type-id`: Defines the Transaction Type.
-   `fields`: (Optional) Custom field data to describe or contextualize the Transaction (e.g., transaction amount, location, or reason). You can [define schema is on the Transaction Type](./46CAEFF2OIg2G826BAlfkG.md).
-   `reference-id`: Unique identifier for the Transaction

To learn more about integration via Transactions, [review methods](../../docs/docs/transactions.md).

## Related articles

[Transactions overview](./5mzXj1PHBXtX5UlYbfZyvx.md)

[Workflows: Create Transaction step](./6yTKeRbCEdxNfYBucXqBZU.md)

[Transaction types and fields](./2QtlaeVrfaokLJnLZ8cRNL.md)
