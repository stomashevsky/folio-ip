# Introduction

An introduction to Persona API

---

## What is the Persona API?

The Persona API is a powerful tool that enables you to integrate identity verification, risk assessment, and compliance solutions into your applications. Through our powerful endpoints, you can automate identity checks, manage verifications, and maintain regulatory compliance while providing a smooth user experience.

Get started with our [Quickstart Tutorial](./api-quickstart-tutorial.md) to learn about key concepts, authentication, and making your first API call.

## Key Features & Capabilities

1.  **Verification**: Perform identity verification using government-issued IDs, liveness checks, and database lookups.
2.  **Inquiries & reports**: Retrieve detailed verification reports and manage identity inquiries.
3.  **Workflows**: Automate business logic and process using Workflows to trigger actions based on verification results or other events.
4.  **API key management**: Securely authenticate and manage API access.
5.  **Webhooks & notifications**: Receive real-time updates on verification statuses and system events.
6.  **Rate limiting & idempotency**: Ensure stable API usage with structured rate limits and request deduplication.

## How you can use the Persona API

The Persona API provides flexible integration options, allowing you to choose the best method for your needs.

### Supplementing a core integration method

If you primarily use one of Persona’s [core integration methods](./inquiries.md) through the Inquiries product—such as hosted flow, embedded flow, or mobile SDKs (iOS & Android)—the API can enhance and extend your existing flow.

For example:

-   **Pre-creating Inquiries:** Use the API to pre-create inquiries before directing users through the inquiry flow for information collection and verification.
-   **Real-time updates:** Set up webhooks to receive real-time status updates when a user is approved, declined, or requires further review.
-   **Status monitoring & data retrieval:** Poll the API for the latest inquiry statuses or fetch specific verification details without disrupting your primary integration.

By leveraging the API alongside a core integration method, you can create a more dynamic and responsive identity verification system.

### Using the API as the only integration method

##### API-only integration methods are only applicable to Enterprise Plans

For some use cases, you may choose to integrate with Persona exclusively via the API, without using any of the standard inquiry-based or front-end experiences provided by Persona.

-   **Direct verification & reporting:** Instead of leveraging inquiries, you can directly create verifications, reports, or transactions via the API. It’s recommended to use Transactions to then trigger subsequent verifications and reports through Workflows—this provides the best experience and future flexibility.
-   **Retrieving results:** Use webhooks to receive real-time updates or poll the API for verification and report statuses.
-   **Backend-driven Workflows:** This approach is ideal for scenarios where you need full control over data processing, compliance checks, or fraud analysis without requiring user interaction through Persona’s hosted solutions.

By utilizing the API as the sole integration method, you can build a fully customized, automated identity verification system tailored to your specific operational needs.

## When to use the Persona API

Persona is designed to provide secure, flexible, and automated identity verification solutions. Whether you are looking to onboard customers, reduce fraud, or comply with KYC/AML regulations, Persona’s API enables you to:

-   Verify identities in real-time using government-issued IDs, liveness data, and database lookups.
-   Customize verification flows to match your business needs.
-   Integrate seamlessly with your existing applications using RESTful API calls.
-   Automate compliance and fraud prevention through robust risk assessment tools.
-   Leverage real-time monitoring and insights for improved decision-making.

## Questions?

We’re always happy to help with code or other questions you might have!

-   Search our [documentation](./index.md)
-   Get support in our [Help Center](https://help.withpersona.com/)
-   Contact our [sales team](https://withpersona.com/contact)
-   Join the [Persona community](https://help.withpersona.com/community/) of experts and peers
