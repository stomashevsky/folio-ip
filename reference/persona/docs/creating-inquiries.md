# Creating Inquiries

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Inquiry Tutorials](./inquiries-best-practices.md)

# Creating Inquiries

Persona supports both API-based inquiry creation, as well as client-side, end-user driven inquiry creation.

## Creating inquiries via API

1.  Call [api/v1/inquiries](./api-reference/inquiries/create-an-inquiry.md) to create a new inquiry.
2.  Pass the inquiry ID starting with `inq_` to your integration. See the documentation for your integration type for more information.
3.  When the end user accesses the Persona flow, the linked Inquiry will be loaded. Note that if the Inquiry has already been accessed, the user will need to be authenticated via a session token. See [Resuming Inquiries](./resuming-inquiries.md) for more information.

## Creating inquiries client-side

1.  Pass the template ID starting with `itmpl_` to your integration. See the documentation for your integration type for more information.
2.  When the end user accesses the Persona flow, a new Inquiry will automatically be created using the provided template. Note that if the user closes or restarts the flow, an entirely new Inquiry will be created, and all progress will be lost.

Client-side inquiry creation can be disabled on a per-template basis.

## Disabling client-side inquiry creation

Client-side inquiry creation can be disabled on a per-template basis in the Dashboard by navigating to a Template > Configure > Security > Block client-side Inquiry creation.

## Should I use API or client-side inquiry creation?

We recommend API-based inquiry creation whenever possible. API-based inquiry creation has many benefits:

1.  It is easier to ensure that unique users only go through the flow a single time. See [Prevent users from creating multiple Inquiries](./prevent-users-from-creating-multiple-inquiries.md) for more information.
2.  Avoid bad actors creating a large number of Inquiries by controlling exactly when Inquiries are created and accessed.
3.  API-based creation allows you to [prefill fields](./hosted-flow-fields.md) in a way that cannot be modified by the end user. Client-side prefill works via query string params, which are visible to end users.

However, there are situations where client-side inquiry creation may be preferred.

1.  Client-side inquiry creation does not require you to have a backend capable of interacting with Persona’s API.
2.  Client-side inquiry creation is easier to integrate and can be helpful for evaluations and proofs of concept.
3.  Inquiries expire after 24 hours by default, so any Inquiry created by API will be inaccessible after then. This can be worked around by only creating the inquiry when the user needs to go through the flow, setting a longer expiration interval, or [resuming the inquiry](./resuming-inquiries.md). However, these can be difficult in certain use cases, like when Inquiry links are emailed to end users. In cases like this, client-side creation can be lower friction to implement.

## Other notes

### Conversion metrics

The way Inquiries are created can cause conversion metrics and dropoff analysis to be misleading.

If using the API, creating Inquiries too far ahead of when users will go through the flow can lead to a large amount of Inquiries that are never accessed, causing dropoff to appear higher than it actually is.

If using client-side creation, users can create as many Inquiries as they want, which can lead to a large amount of Inquiries that are never completed, similarly inflating dropoff.

For the most accurate metrics, we recommend creating Inquiries via API, and creating Inquiries as close as possible to the point where users need to go through the flow.
