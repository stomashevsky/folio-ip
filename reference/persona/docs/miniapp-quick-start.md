# Getting Started

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[MiniApp Integration](./miniapp-integration.md)

# Getting Started

Verifying users via MiniApp is as simple as giving them your hosted flow link and using `miniapp` as the subdomain.

When users visit the URL on their iOS device, they will be prompted to use our MiniApp. If users decline to install the MiniApp they can continue in the browser. For high risk use cases, Persona can disable the web environment and instruct the user to install the MiniApp in order to continue.

### Directing users to the flow

To start the MiniApp flow, link a user to `https://miniapp.withpersona.com/inquiry` or `https://miniapp.withpersona.com/verify` with the appropriate query string parameters. To test the MiniApp in your sandbox, pass the `environment-id` of your Sandbox environment as a query string parameter.

An example link is `https://miniapp.withpersona.com/inquiry?inquiry-template-id=itmpl_y3B7qEELMkQ8XogGev77QsZn`

Swap the inquiry template ID with yours to create your MiniApp flow link.

### Parameters

To include parameters in your MiniApp link, add them to the end of the URL after a trailing `?`.

Refer to hosted flow documentation for full list of [parameters](./quickstart-hosted-flow.md#parameters).

Example URL for Template with optional fields:

`https://miniapp.withpersona.com/inquiry?inquiry-template-id=<your template ID starting with itmpl_>&environment-id=<your environment ID starting with env_>&reference-id=user_id1&fields[name-first]=Jane`

Example URL for resuming an existing inquiry:

`https://miniapp.withpersona.com/inquiry?code=abc123`

#### Resuming Inquiries with MiniApp

We recommend resuming inquiries via [Inquiry One-Time Links (OTL)](./inquiry-one-time-links.md) instead of passing a URL with the session token parameter.

iOS will truncate the session token in the link that the user sees in some contexts. This will prevent users from being able to access these inquiries. Additionally, links including a session token will not be one-time use and will permanently grant access to the Inquiry, which increases the risk of leakage of sensitive information.

See [Resuming Inquiries](./resuming-inquiries.md) and [Ensuring user access to inquiries](./ensuring-user-access-to-inquiries.md) for more information and recommendations for specific scenarios around resuming Inquiries.
