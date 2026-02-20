# Inquiry One-Time Links (OTL)

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Model References](./model-lifecycle.md)

# 

Inquiry One-Time Links (OTL)

If you want to let an end user continue an Inquiry that they have lost access to (e.g. because the Inquiry expired, or they lost the link), you can resume the Inquiry, then create and send them a one-time link (OTL). The one-time link takes the user back to where they left off in the Inquiry.

One-time links have the format `https://withpersona.com/verify?code=<one time link code>`.

## Creating one-time links via Dashboard

In the Dashboard, navigate to Inquiries > All Inquiries, and select the Inquiry. Click the ‘Resume’ button in the top right corner. You will be able to create a one-time link, and optionally choose to email it directly to the end user. By default, the one-time link expires in 24 hours. You can configure the expiration by setting the **From Inquiry resume** [expiration interval](./inquiry-expiration.md#configuring-expiration-intervals) under **Session Management** settings of the Inquiry Template.

## Creating one-time links via API

Use the [Generate a one-time link](./api-reference/inquiries/generate-a-one-time-link.md) API to create links to send to end users.

### Comparison to session token

It’s possible to create similar Inquiry links using session tokens from the Resume an Inquiry API. See [Resuming Inquiries](./resuming-inquiries.md) for details. However, we recommend against generating and sending links including the inquiry ID and a session token for security reasons. Links including a session token will not be one-time use, which increases the risk of leakage of sensitive information.

1.  SMS and Email are not secure transmission channels
2.  Persistent links grant access to PII present on Inquiry to anyone in possession of the link3. Non-OTLs expose unique identifier of inquiry when submitted over insecure transmission channels
