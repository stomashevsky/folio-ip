# Inquiry Templates

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Model References](./model-lifecycle.md)

# Inquiry Templates

## Configuration

Inquiry templates house the configuration for a single use case by defining the screens, verifications, decisioning, and theming.

You’ll create inquiries from inquiry templates, and these inquiries will be locked to the current active inquiry template version.

Configure inquiry templates in [Dashboard > Inquiries > Templates](https://app.withpersona.com/dashboard/inquiry-templates), and learn more about configuring templates in our [Help Center](https://help.withpersona.com/articles/ETA0GIS8K60DSoiFRpA9z/).

## Versioning

Whenever a change is made to an inquiry template, a new inquiry template version will be created. This version is a snapshot of the current configuration.

To guarantee that you are accessing the latest published version of an inquiry template, use the Inquiry Template ID, which starts with `itmpl_`, in your integration.

To pin your integration to a specific version snapshot, use the Inquiry Template Version ID, which starts with `itmplv_`.

## Platform interoperability

These objects can be created and used within Dynamic Flow inquiry templates:

-   [Accounts](./accounts.md) congregate data across your entire relationship with a customer.
-   [Cases](./cases.md) allow your team members to decision across a use case.
-   [Reports](./reports.md) provide supplemental data on a customer.
-   [Verifications](./verifications.md) determine if collected data is verified.

## Dynamic flow vs. legacy Templates

#### Legacy Template deprecation

As of **December 31, 2022**, Legacy Templates are considered deprecated.

If your template ID starts with `itmpl_`, then you are using a Dynamic Flow Template. Dynamic Flow Templates allow for greater flexibility in data collection by allowing custom UIs and collection fields along with dynamic friction.

If your template ID starts with `tmpl_`, then you are using a Legacy Template. Legacy Templates do not support dynamic logic and are limited to being linear flows.

### Migrating to Dynamic Flow

-   If you are using our SDKs, you must migrate to `v4` for the JavaScript SDK, or `v2` for the iOS and Android SDKs.
-   If you are using webhooks or the API and are trying to access the template from a serialized Inquiry response based on the `type` field, you will need to look for the type `inquiry-template` instead of `template`.
