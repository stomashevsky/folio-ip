# Parameters

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Hosted Flow](./hosted-flow.md)

# Parameters

Query string parameters can be passed to customize the behavior of the hosted flow.

There are two main ways to use the hosted flow: creating new inquiries, and resuming existing inquiries. If you have an `inquiry-id` available (e.g. from [creating an inquiry via API](./api-reference/inquiries/create-an-inquiry.md)), please see [Resuming existing inquiries](./resuming-inquiries.md).

#### Special characters in URL parameters

Be sure to escape your values if you are passing non-alphanumeric characters in your parameters. For example, values including whitespace or symbols like `+` and `&` need to be escaped. In JavaScript, this can be done with [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).

For example, if your `redirect-uri` itself contains a query string, `&` should be replaced with `%26`.

## Creating new inquiries

The most common way to set up the hosted flow is to specify an inquiry template ID (`inquiry-template-id`). This will create a new inquiry every time the link is accessed.

Persona recommends connecting new inquiries to an account. To connect the inquiry to an account, specify either `referenceId` or `accountId`. You cannot specify both.

| Parameter | Requirement | Description |
| --- | --- | --- |
| `inquiry-template-id` `inquiry-template-version-id` `template-id` | Required | This template ID corresponds to a pre-set configuration and determines how the flow is customized. See [Inquiry Templates](./inquiry-templates.md). |
| `environment-id` |  | The Persona API environment on which to create inquiries. See [Environments](./environments.md). |
| `reference-id` |  | You can generate and provide a unique ID which we will associate with the inquiry. Oftentimes this will be the unique user identifier from your system. A new account will be created if no account with the given reference ID exists. Inquiries with the same reference ID will be associated with the same account. See [Reference IDs](./reference-ids.md). |
| `account-id` |  | ID of an existing account to associate newly created inquiries with. If `account-id` is passed, passing either `reference-id` or `account-type-id` will result in an error. See [Accounts](./accounts.md). |
| `account-type-id` |  | ID of the account type to use if creating a new account for the inquiry. If omitted, the default account type associated with the current environment will be used. `account-type-id` will be ignored if a new account is not created (for example, if passed with a `reference-id` that does not correspond with an existing account). |
| `fields` |  | Provide an object to set inquiry field values. Each attribute in the object is optional. This will also prefill form inputs corresponding to the field in the flow. See [Fields](./embedded-flow-fields.md). |

## Access inquiry created via API or resuming existing inquiries

If you have pre-created an inquiry via API or you are looking to resume an existing inquiry instead of creating a new one, use the `inquiryId` parameter. Do not pass a `templateId` or `templateVersionId` when resuming the inquiry.

If the inquiry already has submitted verifications, you need to specify a `session-token` as well. You can generate a session token with the [/api/v1/inquiries/\[inquiry-id\]/resume](/api-reference/inquiries/resume-an-inquiry) endpoint.

| Parameter | Required | Description |
| --- | --- | --- |
| `inquiry-id` | Required | Specify an inquiry ID to resume an existing inquiry. If the inquiry has a `pending` status, then a sessionToken from the server-side API is required. |
| `session-token` |  | When resuming an inquiry with a `pending` status, you must also generate a session token from the server-side API. See [Inquiry Sessions](./inquiry-sessions.md). |

## Other parameters

These parameters are not related to creating or resuming inquiries, and can always be specified.

| Parameter | Required | Description |
| --- | --- | --- |
| `language` |  | Specify a supported language to localize the flow. Language will be inferred from browser settings by default. See [Languages](./languages.md). |
| `redirect-uri` |  | When the user successfully verifies their identity, we redirect back to this URI. The callback should expect a `GET` parameter named `inquiry-id` that references the completed inquiry. If no `redirect-uri` is specified, then the success page shown to users will not have a continue button. See [Security](./hosted-flow-security.md#allowed-redirect-uris) for instructions on configuring a redirect URI allowlist. See [Redirecting On Complete](./hosted-flow-redirecting-on-complete.md). |
| `theme-set-id` |  | **Beta feature.** Pass a specific theme set to be used. |
| `style-variant` |  | Pass `dark` to force dark mode or `light` to force light mode. This setting can be changed at any time. |

## Deprecated parameters

#### Deprecated attributes

Deprecated attributes are planned to be removed or replaced in the future. They will continue to work in the immediate future.

| Parameter | Description |
| --- | --- |
| `environment` | **Deprecated. Use `environment-id` instead.** The Persona API environment on which to create inquiries. For sandbox and production, use `sandbox` and `production` respectively. |
| `prefill` | **Deprecated. Use `fields` instead.** Provide an object to prefill form inputs in the flow. Each attribute in the object is optional. See [Prefill](./hosted-flow-fields.md) documentation. |
| `routing-country` | **Deprecated. No longer necessary.** Pass a specific country to route requests to. Persona now automatically routes requests to the best location, so this parameter is no longer needed. |
| `theme-id` | **Deprecated. Legacy templates only. Not available for Dynamic Flow.** Pass a specific theme to be used. |
