# TIN Verification

## Overview[](#overview)

TIN verification is a type of verification check that confirms that the name and TIN (Taxpayer Identification Number) provided in an inquiry match records found within the Internal Revenue Service database.

This article explains:

-   Common use cases for TIN verification
-   The types of TINs supported in TIN verification
-   The possible values for the “status” of a TIN verification, and what they mean

## Common use cases for TIN verification[](#common-use-cases-for-tin-verification)

For KYC:

-   TIN verification can be used as a fallback to database verification to increase the likelihood of finding a matching record, because end users who do not have a social security number may have a TIN.

For KYB:

-   TIN verification is a standard part of KYB. During KYB onboarding, businesses can provide their EIN for verification against the IRS database.

## Best Practices[](#best-practices)

A recurring issue with TIN Verification is the fragile IRS system that handles the database request goes down from time to time. During this down time, TIN Verifications can't be completed and error out. If the TIN Verification is run as part of an Inquiry, the end users is then stuck waiting for the verification to resolve. This is why we're directing customers to instead place the TIN Verification in a Workflow that triggers after the Inquiry completes. Running within a workflow, the TIN Verification has the time it needs to complete, ideally with staggered retries spaced an hour apart, allowing the IRS system to recover and handle the TIN verification.

## Supported TIN types[](#supported-tin-types)

As background, a TIN—Taxpayer Identification Number—is an identification number used by the Internal Revenue Service (IRS) in the administration of tax laws. No two entities have the same TIN/legal name combination. All TIN types, except for Social Security Numbers (SSNs), are issued by the IRS. SSNs are issued by the Social Security Administration (SSA).

You can use the following types of TINs in a TIN verification:

-   **ITIN** - Individual Taxpayer Identification Number. This is a nine-digit number used to identify individuals for tax purposes. An ITIN is only assigned to individuals who are required to have taxpayer identification but are ineligible to get a Social Security Number (SSN).
-   **EIN** - Employer ID Number. An EIN is a type of TIN. It is used to identify employers for tax purposes.
-   **SSN** - Social Security Number. SSNs are issued by the SSA, as opposed to the IRS. They are used when paying taxes for and drawing benefits from Social Security.

## Possible "status" values of a TIN verification[](#possible-status-values-of-a-tin-verification)

Each TIN verification is labeled with a "status." The possible values are:

-   `submitted` - The obtained TIN and legal name are submitted for validation against the IRS database.
-   `passed` - The obtained TIN and legal name match the IRS records. This is also known as a TIN match.
-   `failed` - No business was found. The TIN and Name provided did not sufficiently match any source databases.

## Frequently asked questions[](#frequently-asked-questions)

#### **What happens when the IRS database is down?**[](#what-happens-when-the-irs-database-is-down)

Persona will continue to retry and run separate verification attempts when the IRS database is down. Persona’s KYB solution can be configured so that businesses continue through the overall flow to a certain extent, and then Persona will retry verification when the IRS is up.

#### **Can I verify an ATIN or PTIN?**[](#can-i-verify-an-atin-or-ptin)

These TIN numbers are not supported in TIN verification.

-   **ATIN** - Adoption Taxpayer Identification Number. This is a temporary nine-digit number issued by the IRS to individuals who are in the process of legally adopting a U.S. citizen or resident child but who cannot get an SSN for that child in time to file their tax return.
-   **PTIN** - Preparer Tax Identification Number. An ID used to identify a paid tax preparer. This is not applicable to most identity verification use cases and is more commonly used in credential validation.
