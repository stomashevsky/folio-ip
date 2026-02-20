# Redirecting After Inquiry

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Hosted Flow](./hosted-flow.md)

# Redirecting After Inquiry

Set the `redirect-uri` query parameter of the hosted flow link to your URL for processing responses from Persona. When the hosted flow completes, it will redirect to your URL with an `inquiry-id` query parameter. `redirect-uri` can also be set at the template level.

Your server should optionally expect a `reference-id` GET parameter if you provided one when starting the flow. For example, if your URL is `http://withpersona.com/fake-path` then you can expect the hosted flow to redirect to `http://withpersona.com/fake-path?inquiry-id=<your inquiry ID starting with inq_>&reference-id=12345`. For more detail on retrieving inquiries with the `inquiry-id`, see [/api/v1/inquiries/](./api-reference/inquiries/retrieve-an-inquiry.md).

`redirect-uri` supports custom schemes such as mobile intents.

If you have configured [Allowed Domains](./hosted-flow-security.md#allowed-domains), your `redirect-uri`’s domain must be a permitted domain.

## Query parameters

Specify the following parameters when creating the inquiry to redirect on completion.

| Parameter | Optional | Description |
| --- | --- | --- |
| `redirect-uri` |  | Once the inquiry enters either the `Completed` or `Failed` status, we redirect the user back to this URL. The callback should expect a GET parameter named `inquiry-id` that references the inquiry. |
| `reference-id` | Optional | You can generate and provide a unique id which we will associate with the inquiry. The identifier can be used to monitor user progress in newly created inquiries. |

## Redirect query parameters

When redirecting, Persona will specify the following query parameters.

| Parameter | Nullable |  |
| --- | --- | --- |
| `inquiry-id` |  | ID of the inquiry. |
| `reference-id` | Nullable | If you set a reference ID on the request, it will be on the response. |
| `status` |  | Status of the completed inquiry (e.g. `'completed'`, `'failed'`). |
| `fields` |  | A map of field types and values. See [Fields](./inquiry-fields.md) documentation. |
