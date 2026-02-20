# Inlined React Changelog

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)[Inlined React](./inlined-react-flow.md)

# Inlined React Changelog

The latest versions of the Inlined React SDK is:

[![Persona React SDK latest](./images/persona-react_f5d5de051b71.png)](https://www.npmjs.com/package/persona-react)

We are continually releasing fixes and updates which improve the end user experience. We recommend staying up-to-date with releases to make sure you are taking advantage of the latest functionality and improvements.

For changes to the core JavaScript SDK, see [JavaScript SDK Changelog](./embedded-flow-changelog.md).

## 6.5.0

### Features

-   Bump `persona` package version to `5.5.0`

## 6.4.0

### Features

-   Attempted to bump `persona` package version to `5.5.0`

## 6.3.2

### Features

-   Bump `react` package version to `19.0.1` to address CVE-2025-55182

## 6.3.1

### Features

-   Bump `react` package version for example to `19.0.1` to address CVE-2025-55182

## 6.3.0

### Features

-   Bump `persona` package version to `5.4.0`

## 6.2.0

### Features

-   Add persona-vue package with Vue 3 bindings
-   Add support for passing custom domains
-   Bump `persona` package version to `5.2.1`

### Bug Fixes

-   Update custom hosts take hosts and not URLs

## 6.1.0

### Features

-   Bump `persona` package version to `5.2.1`

## 6.0.1

### Fixes

-   Fix support for React 18. 6.0.0 incorrectly only supported React 19 and not React 18.

## 6.0.0

### ⚠ BREAKING CHANGES

-   Drops support for React versions lower than 18. React 18 is the minimum supported version. The previous minimum supported React version was React 16.
-   Adds support for React 19.
-   Bumps version of `persona` to `5.1.5`.

## 5.0.0

### ⚠ BREAKING CHANGES

-   the `Inquiry` export of this package (used for the Inline React integration) has been moved to a separate package `persona-react`, and has been removed from this package. To migrate, change `import { Inquiry } from 'persona'` to `import Inquiry from 'persona-react'`.
    
-   The following features marked as deprecated in `persona@4.0.0` (released 2021-08-03) have been removed.
    
    -   `prefill` (replaced by the `fields` parameter)
    -   `lockedAttributes` (replaced by the `fields` parameter + template-level configuration)
    -   `themeId` (only used by legacy inquiries)
    -   The `InquiryAttributes` type export (only used by legacy inquiries)
    -   The `InquiryErrorInvalidInquiryId` type (was never actually used)
