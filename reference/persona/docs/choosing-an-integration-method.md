# Inquiry Fields

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Model References](./model-lifecycle.md)

# Inquiry Fields

Inquiries store values collected from the customer in fields, and inquiry template versions define the field schemas.

You can configure custom fields on your template field schema to support your use cases. Please contact support or your CSM to get started.

#### Field values and customers

Fields are expressly intended for storing customer-supplied information and are meant to be readable and writable by the end user. We do not recommend storing data that should not be exposed to end users in Inquiry Fields.

## Field types

| Name | Input Format | Notes |
| --- | --- | --- |
| `array` | `['a', 'b', 'c']`, `[1, 2, 3]` | Typed array |
| `boolean` | `true`, `false` |  |
| `choices` | `'enum_1'` |  |
| `date` | `'YYYY-MM-DD'` | ISO 8601 string |
| `datetime` | `'YYYY-MM-DDThh:mm:ss.000Z'` | ISO 8601 string |
| `file` | `{ filename: string; io: base64 data; }` | Serializes as:`{ filename: string; byte_size: integer; mime_type: string; url: string; }` |
| `hash` | Dependent on configuration | Dictionary with string keys and field values |
| `multi_choices` | `['enum_1', 'enum_2']` | Array of strings |
| `number` | `123`, `123.45` |  |
| `string` | `'hello world'` |  |

## Prefilling Inquiry fields

If you already have information you’ve collected on your user, you can pre-populate their inquiry with this information at creation time. This will:

-   Streamline the user experience. If the user has already given you this information, there’s no need to have them type it again into Persona. You can prefill the inquiry and just have the user confirm everything is correct.
-   Have an extra level of assurance that the user’s information is valid. For example, if you pass through a name and birthdate, you can configure your template to check that the information extracted from the user’s Government ID matches what was prefilled.

### How to do it

-   [**Server API:**](./api-reference/inquiries/create-an-inquiry.md) (recommended) Pass in the desired fields upon creation of the inquiry via API call. This is Persona’s recommended method.
-   [**SDK:**](./embedded-flow-fields.md) When implementing with one of Persona’s SDKs and creating the inquiry on-the-fly, you can send the fields over in the builder.
-   [**Hosted:**](./hosted-flow-fields.md) You can add fields to the URL when using a generic inquiry template link.

## Reading fields via API

An inquiry’s fields can be retrieved via the external API using a GET request. Fields are also passed back to the caller in inquiry flows on completion.

Fields are serialized as a nested map of field name to field type and field value. For example:

```json
{
  "name-first": {
    "type": "string",
    "value": "John",
  },
  "name-last": {
    "type": "string",
    "value": "Doe",
  },
  "birthdate": {
    "type": "date",
    "value": "1980-12-25",
  }
}
```

## Writing fields via API

When updating an inquiry via API, fields should be passed as a map of field name to field value. Field type does not need to be specified.

```json
{
  "name-first": "John",
  "name-last": "Doe",
  "birthdate": "1980-12-25"
}
```

## Field schema policies

#### Experimental

Field policies are currently in beta and are not generally available. If you think field policies fit your use case, please contact support or your CSM for more information.

Field behavior can be modified with field policies.

| Field write policies | Description |
| --- | --- |
| `none` | Default. No special behavior. |
| `write_once` | The field will become immutable after it has been set for the first time (via the end user, query string parameters, or external API). Setting a default value on the field schema will NOT cause the field to become immutable. Setting the field value to be `null` WILL cause the field to become immutable. |

| Field redaction policies | Description |
| --- | --- |
| `none` | Default. No special behavior. |
| `never` | This field will never be redacted. This is intended to be used for fields such as timestamps or tracking terms of service acceptance, and is NOT intended to be used for fields containing PII. |
