# Government ID Verification: Account comparison check

## Overview[](#overview)

Persona offers many different Verification checks designed for Government ID Verification. You can see the full list in the [Verification checks](https://app.withpersona.com/dashboard/resources/verification-checks/) reference in the Dashboard.

This guide describes the Account comparison check.

## Background[](#background)

An [Account](./2gE7mjjLCIGJPnK6mTyjU9.md) lets you represent a single individual end user on Persona. For example, if you ask your end users to go through multiple Inquiries, an Account can consolidate all of those Inquiries in one place.

## What this check does[](#what-this-check-does)

The Account comparison Verification check compares whether the details extracted from the end user’s submission in a Government ID Verification attempt is consistent with the most recent values on an Account for that user. This check is a type of fraud-prevention check. It is intended to catch scenarios such as when a different name or birthdate is present on the government ID that the user submits than is on the Account.

## Tips[](#tips)

Here are tips on how to best use this Verification check:

-   Consider using this check if you actively use Accounts, and you want to verify your users multiple times. For example, you might reverify users on a cadence, or before you allow them to take a riskier action in your product.
-   Remember to prefill each Inquiry with an Account reference ID, if that end user has an associated Account.
    -   Resources:
        -   [Prefilling Fields](../../docs/docs/hosted-flow-fields.md) for Hosted Flow integrations
        -   [Prefilling Fields](../../docs/docs/embedded-flow-fields.md) for Embedded Flow integrations
-   Configure the fields you want to include in the comparison check. For example, you can choose to compare name, birthdate, or both. To configure your fields, reach out to your customer success manager or [contact the Persona support team](https://app.withpersona.com/dashboard/contact-us).

## Learn more[](#learn-more)

This guide is part of a larger overview on configuring Government ID Verification. See: [Choose and configure Verification checks for Government ID Verification](./3WnqX7N26sshPLKPQbuW4O.md).

## Related articles

[Why should you use Accounts to store all of a single individual's PII and information?](./3O9c6KbB24OOxvVYMrTetP.md)

[Configuring Government ID Verification checks](./3WnqX7N26sshPLKPQbuW4O.md)

[Government ID Verification: Repeat check](./6pGzYouPWF1Z4SKzLWRMT5.md)
