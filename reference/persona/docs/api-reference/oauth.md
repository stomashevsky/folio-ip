# OAuth

Share access to a Persona resource with another Organization

#### Make sure you have consents and protections in place

Please ensure that you have obtained all necessary consents and put protections in place with the third party to whom you are granting access to PII (Personally Identifiable Information). Persona disclaims any liability and responsibility for the data once it has been transferred to the third party.

#### Restricted API

This API is restricted to certain customers. If you would like to enable this API for your organization, please reach out to your Account Team or [contact us](https://app.withpersona.com/dashboard/contact-us).

Allow another Organization to have temporary (exactly 1 hour) access to specific Inquiry, Verification, or any other retrieval endpoints. Here’s how it works:

1.  Authorize an Organization to access specific objects.
2.  Send the Organization the Authorization Code you created.
3.  The designated Organization uses the Authorization Code to create an Access Token which acts like a scoped-down API Key.
4.  The Access Token can be used to read/write to objects that are specified.

The API request nomenclature follows the [OAuth 2.0 standard](https://datatracker.ietf.org/doc/html/rfc6749).
