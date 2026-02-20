# Verifications

Verifications provide **granular** and **modular** building blocks that enable Organizations to answer “Is this person who they claim to be?” with a focus on verifying digital transactions.

The collective process of mixing and matching verifications to achieve sufficient assurance that an individual is indeed who they claim to be is often called [identity proofing](https://csrc.nist.gov/glossary/term/identity_proofing). The goal of identity proofing is often tying digital identities to physical identities.

Persona focuses on granular and modular verifications because we need to adapt to any and all identity verification use case that can be influenced by industry regulations, fraud rate, customer demographics, and use case.

## How are Verifications _granular_?

Verification are broken up into [Verification Types](./verification-types.md) that focus on answering different identity claims made by the user.

**[Government ID](./api-reference/verifications/government-id-verifications.md)** - Does the individual possess a genuine Government Issued Identity that supports their claim to a physical identity?

**[Document](./api-reference/verifications/document-verifications.md)** - Does the individual have corroborating Documents (SSN, Bank Statements, Utility Bills, Student ID cards) that support their claims?

**[Selfie](./api-reference/verifications/selfie-verifications.md)** - Is the individual present during the transaction and can we bind the face to a government issued ID?

**[Database](./api-reference/verifications/database-verifications.md)** - Given user provided data, can we match and find one or more records of a physical identity? Do authoritative or issuing databases corroborate provided data?

-   **AAMVA** - Do US DMV databases corroborate user provided data?
-   **eCBSV** - Do US SSA databases corroborate user provided SSN?
-   **[Phone Carrier](./api-reference/verifications/phone-carrier-database-verifications.md)** - Do Phone Carrier (ATT, T-Mobile, Verizon) databases corroborate user provided phones?
-   **[Serpro](./api-reference/verifications/serpro-database-verifications.md)** - Do BR [Serpro](https://www.serpro.gov.br/en/about-serpro) databases corroborate user provided data?
-   **[TIN](./api-reference/verifications/tin-database-verifications.md)** - Do US IRS databases corroborate user provided data?

**[Phone](./api-reference/verifications/phone-number-verifications.md)** - Does the user possess their claimed phone number?

## How are Verifications _modular_?

Each Verification has a set of configurations both at the Verification and Verification Check level that allow organizations to adjust thresholds and tailor verifications for their demographics and use case
