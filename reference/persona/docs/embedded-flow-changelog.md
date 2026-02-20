# JavaScript SDK Changelog

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)

# JavaScript SDK Changelog

The latest version of the SDK is: [![Persona SDK latest](./images/persona_023bab4a5303.png)](https://www.npmjs.com/package/persona)

We are continually releasing fixes and updates which improve the end user experience. We recommend staying up-to-date with releases to make sure you are taking advantage of the latest functionality and improvements.

## 5.5.0

### Features

-   Respond to border radius theme styles passed from inquiry for embedded flow types

## 5.4.0

### Fixes

-   Set `role=dialog` to iframe modal and address accessibility issue

### 5.3.1

### Bug Fixes

-   fix rendering of embedded iframe for safari and firefox

### 5.3.1-alpha.0

### Bug Fixes (experimental)

-   fix rendering of embedded iframe for safari and firefox

## 5.3.0

### Features

-   dynamically resize embedded iframe based on template preferred dimensions

## 5.2.1

### Fixes

-   Properly accept custom hostnames without protocols

## 5.2.0

### Features

-   Support passing custom hostnames via the `host` option. This option is not needed for most use cases.

## 5.1.1

### Fixes

-   Expose `InquiryError` as a named type export for TypeScript users
-   Expose `Inquiry` as a named export in `persona-react` for ESM users

## 5.1.0

### Features

-   adds `widgetPadding` as a param. This parameter allows controlling the widget paddings for the inline flow, to allow for more flexible layouts.

## 5.0.0

### Features

-   adds `Client.preload()`, which allows preloading static JavaScript assets ahead of time to speed up subsequent load times

### ⚠ BREAKING CHANGES

-   the `Inquiry` export of this package (used for the Inline React integration) has been moved to a separate package `persona-react`, and has been removed from this package. To migrate, change `import { Inquiry } from 'persona'` to `import Inquiry from 'persona-react'`.
    
-   The following features marked as deprecated in `persona@4.0.0` (released 2021-08-03) have been removed.
    
    -   `prefill` (replaced by the `fields` parameter)
    -   `lockedAttributes` (replaced by the `fields` parameter + template-level configuration)
    -   `themeId` (only used by legacy inquiries)
    -   The `InquiryAttributes` type export (only used by legacy inquiries)
    -   The `InquiryErrorInvalidInquiryId` type (was never actually used)

## 4.13.0 (2024-03-06)

### Features

-   remove dependencies on React, React DOM, and Styled Components, to reduce package size from 194kb to 50kb (74.23% reduction)

## 4.12.0 (2024-01-05)

### Features

-   support auto create account params

## 4.11.0 (2023-11-01)

### Features

-   **Client,InquiryInternal:** add canary as a host option

## 4.10.0 (2023-10-03)

### Features

-   add iframeTitle for a11y purposes

## 4.9.0 (2023-06-29)

### Features

-   add microphone permissions to iframe
-   support passing routingCountry to speed up initial request

## 4.8.0 (2023-05-19)

### Features

-   allow customizing iframe sandbox attributes
-   support style variant in embedded flow
-   support themeSetId

## 4.8.0-alpha (2023-02-09)

### Features (experimental)

-   🎸 client side collection events

### 4.7.1 (2022-11-11)

### Bug Fixes

-   fix TypeScript types for complete and fail callbacks

## 4.7.0 (2022-10-27)

### Features

-   add environmentId param to allow specifying any environment

## 4.6.0 (2022-04-26)

### Features

-   allow configuring widget frame height/width

## 4.5.0 (2022-03-23)

### Features

-   handle postMessage messages from subdomain.withpersona.com

## 4.4.0 (2022-02-15)

### Features

-   support multiple iframe origins

## 4.3.0 (2022-01-31)

### Features

-   add array field type

### 4.2.1 (2022-01-20)

### Bug Fixes

-   update error types to include error message

## 4.2.0 (2021-11-22)

### Features

-   add load camera failed event

## 4.1.0 (2021-10-13)

### Features

-   add Client.destroy()
-   Add option message-target-origin
-   add options.parent
-   sent notification on reopen

## 4.0.0 (2021-08-03)

### ⚠ BREAKING CHANGES

-   removes callback `onStart`. The `onEvent` callback can be used as a replacement by listening for `Event.Start`.
-   `onComplete` signature changed to use keyword arguments `inquiryId`, status`, and` field`.` status`should be inspected to determine if the inquiry passed or failed.`fields`is the same as the previous second argument.`onFail`callback removed;`onComplete\` will be called instead.
-   `onExit`, `client.exit()` renamed `onCancel`, `client.cancel()`. This is to make it more clear that `onExit` is not called when closing the flow after the flow has been completed.
-   Rather than potentially passing error objects as arguments to `onLoad` and `onReady` callbacks, passes them to the new `onError` instead.
-   `accessToken` renamed to `sessionToken`. templates.
-   `note` removed. Use custom fields instead.
-   Not strictly related to `persona-verify`, but inquiries created via Inquiry Templates will no longer send the following events: `'country-select'`, `'verification-change'`. There are no replacements.

### Features

-   support new Inquiry Templates

## 3.11.0 (2021-07-29)

### Features

-   add fields, templateVersionId as client options

### Bug Fixes

-   don’t stringify null props in query string
-   ignore mismatch in template IDs when empty

## 3.10.0 (2021-05-18)

### Features

-   add onReady callback

## 3.9.0 (2021-04-19)

### Features

-   add selfie start / capture events

### 3.8.1 (2021-04-09)

### Bug Fixes

-   Add Identification Number as an attribute to lockedAttributes

## 3.8.0 (2021-04-07)

### Features

-   add class names to widget overlay and iframe

### Bug Fixes

-   fix exit() event

### 3.7.3 (2021-02-12)

### Bug Fixes

-   undo ‘export type’ done in 3.7.2

### 3.7.2 (2021-02-10)

### Bug Fixes

-   Add back onExit to type definition

### 3.7.1 (2021-02-08)

### Bug Fixes

-   restore verify client events

## 3.7.0 (2021-02-04)

### Bug Fixes

-   repoint npm to src, move styled components to peer dep

## 3.6.0 (2021-01-29)

### Features

-   add inline Inquiry React component
-   bump version for 3.5.2 release
-   export as UMD module

## 3.5.1 (2020-11-17)

### Chores

-   Updated to Webpack 5
-   Updated to Styled Components 5
-   Allow CommonJS package (‘lib’) in addition to a Webpack built distribution (‘dist’), allowing NPM package installations to be reduced in size.
-   Cleaned up other dependencies

## 3.5.0 (2020-11-03)

### Features

-   Add containerId to client `message` listener

## 3.4.0 (2020-05-24)

### Features

-   add `allow-top-navigation-by-user-activation`
-   add locked attributes as a Client Option.
-   Add note to embedded flow

### Bug Fixes

-   **types:** make PrefillAttributes properties optional

## 3.3.0 (2020-03-10)

### Features

-   add locked attributes as a Client Option.

### Bug Fixes

-   **types:** make PrefillAttributes properties optional

## 3.2.0 (2020-02-25)

### Features

-   add `allow-top-navigation-by-user-activation`

## 3.1.1 (2020-02-11)

### Bug Fixes

-   unused onFailed callback should be named onFail

# 3.1.0 (2020-02-10)

### Features

-   add onFailed callback
