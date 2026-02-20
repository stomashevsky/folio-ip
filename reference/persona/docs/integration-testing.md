# Integration Testing

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)

# Integration Testing

Testing integrations using Sandbox Inquiries

It may be valuable to programmatically test your various API integrations with the Persona platform. For example, throughout the [Inquiry Model Lifecycle](./model-lifecycle.md), the Inquiry may change status and fire associated [Events](./events.md#types-of-events) as your customer progresses through the Inquiry. Similarly, within the Inquiry lifecycle, Verifications may be created and processed through the [Verification Lifecycle](./verification-lifecycle.md), also changing status and firing associated events.

You can setup [webhooks](./webhooks.md) to notify your service about these events. You may also choose to directly [fetch an Inquiry](./api-reference/inquiries/retrieve-an-inquiry.md) or [fetch a Verification](./api-reference/verifications/retrieve-a-verification.md) at anytime during their respective lifecycles. Your application may be set up to take certain actions based on these Events or on the data contained within the Inquiry or Verification.

After creating a [Sandbox](./environments.md#sandbox) Inquiry, the following Simulate Actions can be specified to evoke Inquiry and Verification lifecycle behavior, thereby replicating the necessary conditions required for programmatically testing the behavior of your application.

**The relevant endpoint is the [Inquiries Perform Simulate Actions](./api-reference/inquiries/perform-simulate-actions.md) endpoint.**

## Simulate Actions

### Inquiry Status

The following actions evoke behavior around the Inquiry lifecycle:

| Simulate Action | Effects |
| --- | --- |
| `start_inquiry` | 
-   Set Inquiry status to `pending`
-   Fire `inquiry.started` event

 |
| `complete_inquiry` | 

-   Set Inquiry status to `completed`
-   Fire `inquiry.completed` event

 |
| `fail_inquiry` | 

-   Set Inquiry status to `failed`
-   Fire `inquiry.failed` event

 |
| `expire_inquiry` | 

-   Set Inquiry status to `expired`
-   Fire `inquiry.expired` event

 |
| `mark_for_review_inquiry` | 

-   Set Inquiry status to `needs_review`
-   Fire `inquiry.marked-for-review` event

 |
| `approve_inquiry` | 

-   Set Inquiry status to `approved`
-   Fire `inquiry.approved` event

 |
| `decline_inquiry` | 

-   Set Inquiry status to `declined`
-   Fire `inquiry.declined` event

 |

### Creating Verification with Status

The following actions evoke behavior around creating and processing a verification:

| Simulate Action | Effects |
| --- | --- |
| `create_passed_verification` | 
-   Create a Verification with status `passed`
-   Fire the following events in order:
-   Events specific to the [Verification type](./verification-types.md)
-   `verification.created`
-   `verification.submitted`
-   `verification.passed`

 |
| `create_failed_verification` | 

-   Create a Verification with status `failed`
-   Fire the following events in order:
-   Events specific to the [Verification type](./verification-types.md)
-   `verification.created`
-   `verification.submitted`
-   `verification.failed`

 |

#### Supported Verification types

The following are the Verification types currently supported, and their associated type-specific events:

| Verification Type | Type-specific Events |
| --- | --- |
| Government ID | `document.created` `document.submitted` `document.processed` |
| Document | `document.created` `document.submitted` `document.processed` |
| Database | None |
| Selfie | `selfie.created` `selfie.submitted` `selfie.processed` |
