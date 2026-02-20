# Which API endpoints can I use to download user information from an Inquiry?

Our API has several endpoints that let you fetch Inquiries, as well as Verifications. Here are a few pointers to help you get started.

## Inquiries API[](#inquiries-api)

For Inquiries, you can [list all Inquiries](../../docs/reference/list-all-inquiries.md), then fetch information about [a specific Inquiry](../../docs/reference/apiv1inquiriesinquiry-id.md).

## Verifications API[](#verifications-api)

For Verifications, you’ll first want to know the type of Verification you’re fetching. There are separate endpoints for each type of Verification. For example, for details about a Government ID Verification, you would use [this endpoint](../../docs/reference/retrieve-a-government-id-verification.md). See our docs for other similar endpoints.

## Attribute blocklist[](#attribute-blocklist)

If you want, you can limit which fields of an Inquiry or Verification (or any other object) come back in an API response. You might want to do this to prevent sensitive PII fields from hitting your server.

To limit which fields are returned, configure your API key’s attribute blocklist. Learn more [here](../../docs/docs/api-keywebhook-attribute-blocklist.md).
