# Key Inflection

The Persona API accepts requests with attribute keys using camelCase, kebab-case, and snake\_case.

All responses use kebab-case for attribute keys by default. However, you can override how attribute keys are formatted by providing an additional `Key-Inflection: <inflection>` header to the request. The Persona API currently accepts `kebab`, `camel`, and `snake` for inflecting keys. You can also set the default key inflection on the API key itself via the [Persona dashboard](https://app.withpersona.com/dashboard/api-keys).

Incoming requests from webhooks are also key inflected according to the default key inflection setting on the Webhook.
