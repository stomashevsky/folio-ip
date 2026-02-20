# Verification Checks

When individuals attempt to verify their identity, verification checks indicate something of note with the information that was submitted. They determine whether the verification attempt passes or fails and help you understand whether the submission is valid and meets your requirements, or if additional investigation is needed.

## Configure and consume checks

There are a set of default checks that are required for the submission to be passed, while others are ran and used for additional review but do not affect whether an attempt passes or fails. The defaults are determined based on the common needs across our customers, but we are happy to work with you to configure the defaults to meet your unique requirements. For more information about configuring requirements and the potential tradeoffs, please [contact us](https://app.withpersona.com/dashboard/contact-us).

Verification checks are returned in the [Retrieve a Verification](./api-reference/verifications/retrieve-a-verification.md) API response and are viewable in the Dashboard for each verification attempt.

Different checks are evaluated across different [Verification Types](./verification-types.md), which are specified at the beginning of the check slug.

## Check statuses

| Check Status | Description |
| --- | --- |
| Passed | The check passed for the verification attempt. |
| Failed | The check failed for the verification attempt. |
| Not Applicable | The check was not evaluated for the verification attempt (e.g. `id_barcode_detection` will not be evaluated if the back of the ID is not required to be submitted). |

## Check types

There are two check types:

1.  **User action required:** The individual did not submit the at-minimum high-quality and unobstructed images needed for verification. For instance, if an individual submits a blurry image. Persona exposes these checks back to the individual in the inquiry flow as hints to help individuals submit better images.
    
2.  **Fraud:** The individual may be trying to verify with false or altered information. For instance, if the face portrait from the ID doesn’t match the face from the selfie. There may be additional, noteworthy details about the submission that can be used to meet specific fraud requirements for different use cases. For instance, if the individual submitted an ID from a country that was not allowed on the VerificationTemplate.
    

## Checks for Verification types

Each Verification Type has a set of Verification checks designed for that type. See the full set of checks in the [Verification Checks table](https://app.withpersona.com/dashboard/resources/verification-checks/) in your Dashboard.

## Check Lifecycle

Most of our Verification checks are generally available, but we have two other launch stages to be aware of.

-   `beta`: These checks are available to the public, but may be constantly tuned by Persona with different thresholds. Their geographic coverage may also be limited and be expanded gradually.
-   `sunset`: These are checks that Persona has deprecated in favor of other checks.
