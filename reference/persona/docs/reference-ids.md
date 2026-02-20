# Reference IDs

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Model References](./model-lifecycle.md)

# Reference IDs

A reference ID is a string that you assign to identify a unique end user in Persona.

A reference ID lets you link multiple Persona inquiries to a single Persona [account](./accounts.md). Inquiries created with the same reference ID are automatically associated with the same account.

#### Best practice

Persona recommends you provide a reference ID for an inquiry whenever possible.

### Using reference IDs

You should assign the same reference ID to every inquiry you create for a single end user. This helps you:

-   Easily look up the status of all interactions between this user and Persona
-   More easily re-verify the user
-   Guard against a user [creating multiple inquiries](./prevent-users-from-creating-multiple-inquiries.md)

### Choosing a reference ID

The value you choose as the reference ID can help you tie a Persona account back to your business.

Persona recommends you use the “user ID” of a user within your internal systems as the corresponding reference ID for their Persona inquiries. This provides a clear way to tie each Persona account back to your systems.

#### Reference IDs and PII

Prefer using UIDs instead of sensitive information such as email addresses. Persona does not treat reference IDs as PII.

### Setting a reference ID

Your Persona integration method determines how you set a reference ID:

-   [**Server API**](./api-reference/inquiries/create-an-inquiry.md) (recommended): Pass the reference ID in the `auto-create-account-reference-id` field in the `meta` object in your request payload
-   [**Embedded**](./embedded-flow-parameters.md): Pass the field to the `referenceId` parameter in the embed code
-   [**Hosted**](./hosted-flow-parameters.md): Include the reference ID as a query string parameter (`&reference-id=abc`)

You can also set a reference ID on an existing Persona account [through the API](./api-reference/accounts/update-an-account.md).
