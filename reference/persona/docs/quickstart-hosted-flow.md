# Getting Started

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Hosted Flow](./hosted-flow.md)

# Getting Started

There are three ways to implement Hosted Flow:

1.  **Create a generic link** (No code)
    -   Construct one link that autogenerates a new inquiry each time it is loaded
    -   This link contains an _inquiry template ID_
    -   Best for: Sharing with small groups, simple use cases
    -   Warning: Users who load the link multiple times will create duplicate inquiries
2.  **Create unique links manually** (No code)
    -   Manually create a unique inquiry link for each user using the Persona dashboard
    -   These links each contain a unique _inquiry ID_
    -   Best for: Testing, very low volume (less than ~10 inquiries/month)
3.  **Create unique links via API** (Some code required)
    -   Programmatically create a unique inquiry link for each user
    -   These links each contain a unique _inquiry ID_
    -   Best for: High volume and/or personalized experiences
    -   **Recommended for production use**

Note that you can get started with a no-code approach, and migrate to the more scalable code-based approach later.

## Tutorials

Choose the guide that best fits your needs:

-   [No-code Hosted Flow](https://help.withpersona.com/articles/4pZBZYAFLkKMyXycGeAMV2/). See the following sections:
    -   “Generate unique Hosted Flow Inquiry links via the Dashboard” - how to create links manually
    -   “Copy the generic Hosted Flow Inquiry link from the Dashboard” - how to create a generic link
-   [Tutorial: Unique Hosted Flow links via API](./tutorial-hosted-flow-unique-api.md) - how to create unique links via API

## Quick reference

### Directing users to a flow

To start a hosted flow, link a user to `https://<your subdomain>.withpersona.com/verify` on Persona with the appropriate [query string parameters](./hosted-flow-parameters.md).

By default, your subdomain is `inquiry`, so your inquiry link domain is `inquiry.withpersona.com`. You can [customize your subdomain](./hosted-flow-subdomains.md).

### Parameters

To include [parameters](./hosted-flow-parameters.md) in your hosted flow link, add them to the end of the URL after a trailing `?`.

### Example links

#### ”Generic” link (using inquiry template ID)

`https://inquiry.withpersona.com/verify?inquiry-template-id=itmpl_XXXXXXXXXXXXX`.

-   Fill in your inquiry template ID. It should start with `itmpl_`.
-   Note that this approach uses [client-side inquiry creation](./creating-inquiries.md#creating-inquiries-client-side). Users who load the link multiple times will create duplicate inquiries.

#### Unique link (using inquiry ID)

`https://inquiry.withpersona.com/verify?inquiry-id=inq_XXXXXXXXXXXXX`

-   This is the link used for inquiries that you [pre-create via API](./creating-inquiries.md#creating-inquiries-via-api) or create manually.
-   Fill in a real inquiry ID. It should start with `inq_`.

#### Unique link that uses parameters

`https://inquiry.withpersona.com/verify?inquiry-id=itmpl_XXXXXXXXXXXXX&environment-id=env_XXXXXXXXXXXXX&reference-id=user_id1&language=ja&fields[name-first]=Jane`

-   `environment-id`: ID of a Persona environment. Should start with `env_`. Learn about [Sandbox and Production environments](./environments.md).
-   `reference-id`: A string that uniquely identifies the end user who is completing this inquiry. Learn about [reference IDs](./reference-ids.md).
-   `language`: The language the inquiry should use. Learn about [supported languages](./languages.md).
-   `fields[name-first]`: The first name of the end user who is completing this inquiry. Learn about [prefilling fields](./inquiry-fields.md#prefilling-inquiry-fields).

#### Link used to resume an existing inquiry

`https://inquiry.withpersona.com/verify?inquiry-id=inq_XXXXXXXXXXXXX&session-token=123456&redirect-uri=https://withpersona.com/done`

-   Learn about [resuming inquiries](./resuming-inquiries.md).

### Testing

To quickly test a hosted flow in Sandbox, create a “generic” hosted flow link, and pass the `environment-id` of your Sandbox environment as a parameter.

Learn about [Sandbox and Production environments](./environments.md).
