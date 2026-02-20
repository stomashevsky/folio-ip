# Government ID Verification: Repeat check

## Overview[](#overview)

Persona offers many different Verification checks designed for Government ID Verification. You can see the full list in the [Verification checks](https://app.withpersona.com/dashboard/resources/verification-checks/) reference in the Dashboard.

This guide describes the Repeat check, also known as Repeat detection.

## Background[](#background)

An [Account](./2gE7mjjLCIGJPnK6mTyjU9.md) lets you represent a single individual end user on Persona. For example, if you ask your end users to go through multiple Inquiries, an Account can consolidate all of those Inquiries in one place.

## What this check does[](#what-this-check-does)

The Repeat check compares whether the details and portrait from the end user's submission in a Government ID Verification attempt match that of a previously submitted ID on a different Account within your Organization.

Both details and portrait must match. If only details match, or only a portrait matches, this check will pass—that is, the ID will not be flagged.

## Tips[](#tips)

Here are tips on how to best use this Verification check:

-   Consider using this check only if you actively use Accounts.
-   Remember to prefill each Inquiry with an Account reference ID, if that end user has an associated Account. This prevents the known Account from being flagged by the Repeat check.
    -   Resources:
        -   [Prefilling Fields](../../docs/docs/hosted-flow-fields.md) for Hosted Flow integrations
        -   [Prefilling Fields](../../docs/docs/embedded-flow-fields.md) for Embedded Flow integrations

## Learn more[](#learn-more)

This guide is part of a larger overview on configuring Government ID Verification. See: [Choose and configure Verification checks for Government ID Verification](./3WnqX7N26sshPLKPQbuW4O.md).

## Related articles

[Government ID Verification: Account comparison check](./h6kxly8QuyORcWYQFeaEw.md)

[Configuring Government ID Verification checks](./3WnqX7N26sshPLKPQbuW4O.md)

[How do I compare information and reverify individuals using Accounts?](./3Yo5qPfWb5mGm3FGh0bWKH.md)

[Why should you use Accounts to store all of a single individual's PII and information?](./3O9c6KbB24OOxvVYMrTetP.md)
