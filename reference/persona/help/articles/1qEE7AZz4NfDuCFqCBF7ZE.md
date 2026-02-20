# Government ID Verification: Inquiry comparison check

## Overview[](#overview)

Persona offers many different Verification checks designed for Government ID Verification. You can see the full list in the [Verification checks](https://app.withpersona.com/dashboard/resources/verification-checks/) reference in the Dashboard.

This guide describes the Inquiry comparison check.

## Background[](#background)

You can configure an Inquiry Template to allow end users to make several attempts at submitting information. For Government ID Verification, it’s a good idea to allow several attempts, because it may take a user a few tries to submit a clear photo.

## What this check does[](#what-this-check-does)

The Inquiry comparison Verification check compares whether the details submitted by the end user in each attempt is consistent with details from other attempts they make within the same Inquiry. This check is a type of fraud-prevention check. It is intended to catch scenarios such as when the name or birthdate on the government ID that the user submits on a first attempt is different than the name or birthdate on the ID they submit in a second attempt.

## Tips[](#tips)

Here are tips on how to best use this Verification check:

-   Configure the fields you want to include in the comparison check. For example, you can choose to compare name, birthdate, or both. To configure your fields, reach out to your customer success manager or [contact the Persona support team](https://app.withpersona.com/dashboard/contact-us).
-   This check performs best when you prefill the Inquiry fields that you want to compare. If you do not prefill the fields, this check will use details extracted from the end user’s submission as the baseline for comparison. These details can be less reliable, especially if a user submits blurry or dark images.
    -   Resources:
        -   [Prefilling Fields](../../docs/docs/hosted-flow-fields.md) for Hosted Flow integrations
        -   [Prefilling Fields](../../docs/docs/embedded-flow-fields.md) for Embedded Flow integrations

## Learn more[](#learn-more)

This guide is part of a larger overview on configuring Government ID Verification. See: [Choose and configure Verification checks for Government ID Verification](./3WnqX7N26sshPLKPQbuW4O.md).

## Related articles

[Government ID Verification: Checks that compare Inquiry and Account data](./1rP2K32vfelQX6406OYi5j.md)

[Government ID Verification: Repeat check](./6pGzYouPWF1Z4SKzLWRMT5.md)

[Government ID Verification: Account comparison check](./h6kxly8QuyORcWYQFeaEw.md)

[Configuring Government ID Verification checks](./3WnqX7N26sshPLKPQbuW4O.md)

[Why should you use Accounts to store all of a single individual's PII and information?](./3O9c6KbB24OOxvVYMrTetP.md)

[How do I compare information and reverify individuals using Accounts?](./3Yo5qPfWb5mGm3FGh0bWKH.md)
