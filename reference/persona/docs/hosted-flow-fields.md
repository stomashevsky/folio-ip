# Prefilling Fields

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Hosted Flow](./hosted-flow.md)

# Prefilling Fields

Use the `fields` parameter to dynamically preset inquiry field values. In addition, `fields` will also prefill form values.

All attributes are optional. You only need to include keys for form fields you want prefilled. Individuals can still edit attributes after they’re prefilled.

See [Inquiry Fields](./inquiry-fields.md) for more information.

```curl
https://api.withpersona.com/verify?template-id=tmpl_JAZjHuAT738Q63BdgCuEJQre&fields[name-first]=Jane&fields[name-last]=Doe&fields[birthdate]=1957-05-29&fields[address-street-1]=132%20Second%20St.&fields[address-city]=San%20Francisco&fields[address-subdivision]=California&fields[address-postal-code]=93441&fields[address-country-code]=US&fields[phone-number]=+14151231234&fields[email-address]=janedoe%40gmail.com
```

#### Field values and customers

Using the `fields` query string parameter is intended as a convenience for the end user in a manner similar to browser autofill. Because the query string values are handled client-side, they can be freely modified by the end user.

If you must guarantee that field values are unmodified by the end user, you must use the external API to set the field values ahead of time.

#### Encoding passed values

The `fields` value should be an object encoded as a string using a library like [qs](https://github.com/ljharb/qs#parsing-objects).

If manually passing values, please be sure to make values URL-safe, e.g. with `encodeURIComponent` in JavaScript. For example, if passing a phone number with an area code, `'%2B1...'` should be passed instead of `'+1...'`.

#### Phone numbers

Please ensure that phone numbers are properly formatted based on the number’s country code. For example, US-based phone numbers should include the prefix `+1`.

For additional guidance on prefilling fields, see our [Help Center](https://help.withpersona.com/articles/79Y8gi2c0QnOzDax63LfDF/).
