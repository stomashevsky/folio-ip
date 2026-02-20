# Prefilling Fields

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)

# Prefilling Fields

Use the `fields` parameter to dynamically preset inquiry field values. In addition, `fields` will also prefill form values.

All attributes are optional. You only need to include keys for form fields you want prefilled. Individuals can still edit attributes after they’re prefilled.

You do not need to make passed values URL-safe. The Javascript SDK will automatically encode passed values.

See [Inquiry Fields](./inquiry-fields.md) for more information.

```javascript
const client = new Persona.Client({
  ...
  fields: {
    nameFirst: "Jane",
    nameLast: "Doe",
    birthdate: "2000-12-31",
    addressStreet1: "132 Second St.",
    addressCity: "San Francisco",
    addressSubdivision: "California",
    addressPostalCode: "93441",
    addressCountryCode: "US",
    phoneNumber: "+14154154154",
    emailAddress: "janedoe@persona.com",
    customAttribute: "hello",
  }
})
```

#### Field values and customers

Using the `fields` option is intended as a convenience for the end user in a manner similar to browser autofill. Because the client configuration is processed client-side, they can be freely modified by the end user.

If you must guarantee that field values are unmodified by the end user, you must use the external API to set the field values ahead of time.

#### Phone numbers

Please ensure that phone numbers are properly formatted based on the number’s country code. For example, US-based phone numbers should include the prefix `+1`.

For additional guidance on prefilling fields, see our [Help Center](https://help.withpersona.com/articles/79Y8gi2c0QnOzDax63LfDF/).
