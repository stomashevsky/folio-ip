# Parameters

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)

# Parameters

Parameters can be passed to the client instance to customize the behavior of the embedded flow.

There are two main ways to use the embedded flow: creating new inquiries, and resuming existing inquiries. If you have an `inquiry-id` available (e.g. from [creating an inquiry via API](./api-reference/inquiries/create-an-inquiry.md)), please see [Resuming existing inquiries](./resuming-inquiries.md).

## Creating new inquiries

The most common way to set up the hosted flow is to specify an inquiry template ID (`inquiry-template-id`). This will create a new inquiry on every visit.

Optionally, you can connect new inquiries to an account. To connect the inquiry to an account, specify either `referenceId` or `accountId`. You cannot specify both.

For more details on the callback parameters, see [Client Callbacks](./embedded-flow-client-callbacks.md).

| Parameters | Required | Description | Availability |
| --- | --- | --- | --- |
| `templateId` `templateVersionId` | Required | This template ID corresponds to a pre-set configuration and determines how the flow is customized. See [Inquiry Templates](./inquiry-templates.md). |  |
| `environmentId` |  | The Persona API environment on which to create inquiries. See [Environments](./environments.md). | `4.7.0` |
| `referenceId` |  | You can generate and provide a unique ID which we will associate with the inquiry. Oftentimes this will be the unique user identifier from your system. A new account will be created if no account with the given reference ID exists. Inquiries with the same reference ID will be associated with the same account. See [Reference IDs](./reference-ids.md). |  |
| `accountId` |  | ID of an existing account to associate newly created inquiries with. If `accountId` is passed, passing either `referenceId` or `accountTypeId` will result in an error. See [Accounts](./accounts.md). |  |
| `accountTypeId` |  | ID of the account type to use if creating a new account for the inquiry. If omitted, the default account type associated with the current environment will be used. `accountTypeId` will be ignored if a new account is not created (for example, if passed with a `referenceId` that does not correspond with an existing account). | `4.12.0` |
| `fields` |  | Provide an object to set inquiry field values. Each attribute in the object is optional. This will also prefill form inputs corresponding to the field in the flow. See [Fields](./embedded-flow-fields.md). |  |

## Access inquiry created via API or resuming existing inquiries

If you have pre-created an inquiry via API or you are looking to resume an existing inquiry instead of creating a new one, use the `inquiryId` parameter. Do not pass a `templateId` or `templateVersionId` when resuming the inquiry.

The other attributes and callbacks specified above can still be used.

If the inquiry already has submitted verifications, you need to specify a `sessionToken` as well. You can generate a token with the [/api/v1/inquiries/resume](./api-reference/inquiries/resume-an-inquiry.md) endpoint. The token will be accessible as `meta['session-token']`.

| Parameter | Required | Description | Availability |
| --- | --- | --- | --- |
| `inquiryId` | Required | Specify an inquiry ID to resume an existing inquiry. The `sessionToken` parameter is required if the inquiry’s status is pending. |  |
| `sessionToken` |  | When resuming an inquiry with a `pending` status, you must also generate a session token from the server-side API. See [Inquiry Sessions](./inquiry-sessions.md). | `4.0.0` |

## Other parameters

These parameters are not related to creating or resuming inquiries, and can always be specified.

| Parameters | Required | Description | Availability |
| --- | --- | --- | --- |
| `onLoad` |  | A function that is called when the Persona module has finished loading, but before the inquiry flow UI is ready for user interaction. Calls to `open()` prior to the `onLoad` callback will still open the flow, and a loading spinner will be shown. |  |
| `onReady` |  | A function that is called when the inquiry has finished loading and is ready for user interaction. Will always be called after `onLoad`. |  |
| `onCancel` |  | A function that is called when an individual has specifically exited the flow without completing. The function should expect two arguments, the inquiry ID and a `sessionToken` for resuming. |  |
| `onComplete` |  | A function that is called when an individual completes the inquiry flow (passed or failed). It is passed the inquiry ID, status, and fields. |  |
| `onError` |  | A function that is called when an error occurs in the flow. |  |
| `onEvent` |  | A function that is called when an individual reaches certain points in the inquiry flow. The function should expect two arguments, an `eventName` string and a `metadata` object which contains event-specific values. |  |
| `frameAncestors` |  | **Should only be used if your page integrating Persona’s `iframe` is itself embedded into another page as an `iframe`.** If this matches your use case, you _must_ pass an array of origins for ALL frames that are ancestors of the Persona `iframe`. Allows specifying additional origins for CSP purposes. Values should include both protocol and host (e.g. [https://withpersona.com](https://withpersona.com/)). Defaults to `['window.location.origin']`. | `4.4.0` |
| `frameHeight` |  | Control the height of the Persona widget iframe. Values must be valid CSS size strings. | `4.6.0` |
| `frameWidth` |  | Control the height of the Persona widget iframe. Values must be valid CSS size strings. Size cannot exceed `768px`. | `4.6.0` |
| `iframeTitle` |  | Sets a title for the Persona `iframe` for accessibility purposes. Defaults to `"Verify your identity"`. | `4.10.0` |
| `language` |  | Specify a supported language to localize the flow. Language will be inferred from browser settings by default. See [Languages](./languages.md). |  |
| `messageTargetOrigin` |  | **Should only be used if your page integrating Persona’s `iframe` is itself embedded into another page as an `iframe`.** If this matches your use case, you _must_ pass your page’s domain here. Allows specifying a custom target for `window.postMessage`, to allow the Persona web application to communicate with the Persona `iframe`. Defaults to `'window.location.origin'`. | `4.1.0` |
| `parent` |  | Allows specifying a custom mount point for the Persona `iframe`. Defaults to `document.body`. If `document.body` does not exist, the first child of `document` is used. | `4.1.0` |
| `sandboxAttributes` |  | Allows customization of the attributes passed to the `sandbox` attribute of the `iframe` embedding the Persona flow. Not all attributes can be removed, and removing attributes may affect the functionality of the Inquiry Flow. See [iframe sandbox attributes](./embedded-flow-security.md#iframe-sandbox-attributes). | `4.8.0` |
| `themeSetId` |  | **Beta feature.** Pass a specific theme set to be used. | `4.8.0` |
| `styleVariant` |  | Pass `dark` to force dark mode or `light` to force light mode. This setting can be changed at any time. | `4.8.0` |
| `widgetPadding` |  | Allows customizing the internal padding inside the Persona `iframe` for the [Inlined React](./inlined-flow.md) flow. Is ignored outside of the Inlined React flow. Value should be an object with shape `{ top?: number; bottom?: number; left?: number; right?: number; }` | `5.1.0` |

## Deprecated parameters

| Parameter | Description |
| --- | --- |
| `environment` | **Deprecated. Use `environment-id` instead.** The Persona API environment on which to create inquiries. For sandbox and production, use `sandbox` and `production` respectively. |
| `prefill` | **Deprecated. Use `fields` instead.** Provide an object to prefill form inputs in the flow. Each attribute in the object is optional. See [Prefill](./hosted-flow-fields.md) documentation. |
| `routing-country` | **Deprecated. No longer necessary.** Pass a specific country to route requests to. Persona now automatically routes requests to the best location, so this parameter is no longer needed. |
| `theme-id` | **Deprecated. Legacy templates only. Not available for Dynamic Flow.** Pass a specific theme to be used. |
