# Migration instructions

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)[JavaScript SDK Changelog](./embedded-flow-changelog.md)

# Migration instructions

## Migrating to `persona@5` from `persona@4`

### Inlined React

`persona@5` splits the [Inlined React](./inlined-flow.md) integration into a separate NPM package `persona-react`. This allows usage of `persona@5` without also installing React.

Only users of the Inlined React flow will need to modify their integration. To migrate, simply change your import:

```
-import { Inquiry } from "persona";
+import Inquiry from "persona-react";
```

If you previously included React in your application solely for the Persona Embedded flow, React can now be removed.

## Removal of deprecated parameters

The following [parameters](./embedded-flow-parameters.md) were deprecated in `persona@4`, and have been removed in `persona@5`:

-   `prefill`: `fields` should be used instead.
-   `themeId`: `themeId` was only a supported parameter for legacy Inquiries, and was always ignored for Dynamic Flow inquiries. Note that this is distinct from the `themeSetId` parameter, which is unaffected.

## Migrating to `persona@4` from `persona@3`

#### v3 is deprecated

As of **December 31, 2022**, `persona@3` and Legacy Templates are considered deprecated.

`persona@4` brings support for **Dynamic Flow Templates**, which represent the next generation of Persona’s inquiry flow. Dynamic Flow Templates allow for greater flexibility in data collection by allowing custom UIs and collection fields.

Dynamic Flow Templates support versioning and fully custom, component-based views. If you are an existing customer and are interested in using Dynamic Flow Templates, please [contact us](https://app.withpersona.com/dashboard/contact-us) or talk to your CSM.

## Am I using Dynamic Flow Templates?

If your template ID starts with `tmpl_`, then you are using a **Legacy Template**.

If your template ID starts with `itmpl_`, then you are using the new **Dynamic Flow Template** and must use `persona@4` or later.

### I am an existing customer using v3. Do I need to migrate?

You must use `persona@4` if you are using Dynamic Flow Templates. Inquiries created via Dynamic Flow Templates will not work with `persona@3`.

Existing customers who are not using Dynamic Flow Templates will not necessarily need to migrate to `persona@4`, and `persona@3` will continue working for the immediate future. However, **we will stop making updates to `persona@3` on December 31, 2022**. You will still be able to create inquiries, but no new features or fixes will be available. We recommend moving to `persona@4` for access to the latest product improvements - please see [migration to v4 section](./embedded-flow-migration-instructions.md) or [contact us](https://app.withpersona.com/dashboard/contact-us).

If you have a hard reliance on removed features, but want to use Dynamic Flow Templates, please [contact us](https://app.withpersona.com/dashboard/contact-us) or talk to your CSM for a migration path.

### What do I need to do to migrate to v4?

The following table lists breaking changes in `persona@4`.

| Change | Replacement |
| --- | --- |
| `react`, `react-dom`, and `styled-components` are now `peerDependencies` instead of `dependencies`, to avoid version conflicts in projects that already use these libraries | Install these packages in your project. |
| `onLoad` and `onReady` callbacks will no longer be passed error objects | Use the new callback `onError`. |
| `onStart` callback removed | Dynamic Flow Templates no longer track `Event.Start`. Templates can continue to listen for this event by watching for `Event.Start` in the `onEvent` callback; `inquiryId` will be a key on the second argument. |
| `onComplete` function signature changed to use keyword arguments | Change callback definitions to expect new arguments. |
| `onFail` callback removed | `onComplete` will be called for both passes and fails with a new `status` argument; check for failure with `status === 'failed'`. |
| `onExit` callback, `client.exit()` renamed to `onCancel`, `client.cancel()` (no behavior change) | `onCancel`, `client.cancel()` |
| `accessToken` renamed to `sessionToken` | `sessionToken` |
| `note` removed | Both Dynamic Flow Templates and Templates support custom fields. Contact us to configure custom fields as a replacement. |
| (Undocumented feature) `themeId` removed | Dynamic Flow Templates now control their appearance independently of a separate Theme object. Templates should specify a default theme in the [Templates](https://withpersona.com/dashboard/inquiry-templates) section of the Persona Dashboard. |
| (Deprecated) `prefill` | `prefill` is replaced by `fields` in Dynamic Flow templates. `prefill` is not supported at all in Dynamic Flow templates. `prefill` will continue to work in `persona@4` for non-Dynamic Flow templates, but will be removed in a future major version. |
| (Deprecated, undocumented feature) `lockedAttributes` | `lockedAttributes` was used in certain cases to conditionally disable form fields in Database Verifications. `lockedAttributes` are not supported at all in Dynamic flow. `lockedAttributes` will continue to work in `persona@4` for non-Dynamic Flow templates, but will be removed in a future major version. |
| `Event.CountrySelect`, `Event.VerificationChange` | These events will no longer be sent. |

### What’s new in v4?

| Change | Purpose |
| --- | --- |
| `fields` | `fields` is intended to replace `prefill`, which has been deprecated. It behaves identically to `prefill` for Dynamic Flow Templates and will prepopulate form flows in the UI. |
| `templateVersion` | Allows locking inquiry creation to a specific template version. Only Dynamic Flow Templates have versions. |
| `onError` | Allows consistent error handling. |
| `onCancel` is passed a `sessionToken` | This makes it easier to resume an existing inquiry without needing to request a session token from the external API. |
