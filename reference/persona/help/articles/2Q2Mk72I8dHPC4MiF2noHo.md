# Verification check attributes

## Overview[](#overview)

This guide covers the attributes of a Verification check that has been run on an Inquiry. The information in this guide will help you interpret the results of an Inquiry.

### Prerequisites[](#prerequisites)

This guide will be most helpful if you first review [Key concepts: Inquiry, Verification, and other terms](./14hgKH7lZo9b6ja7tRJobW.md).

## Attributes of a Verification check[](#attributes-of-a-verification-check)

While completing an Inquiry, an end user can make one or more attempts at submitting information. The result of each Verification attempt includes the result of each Verification check that was run.

Each Verification check that was run has the following attributes:

-   **Name**: the name of the Verification check.
-   **Status**: the high-level result of the check. Possible values are:
    -   `Passed`: The check passed in the verification attempt.
    -   `Failed`: The check failed in the verification attempt.
    -   `Not applicable`: The check was not evaluated in the verification attempt. (This may happen because this check depends on a piece of information that was not collected as part of the Inquiry.)
-   **Type**: whether the Verification check falls into the `Fraud` or `User action required` category.
    -   `Fraud`: Checks in this category are designed to help catch fraudulent submissions. If a check in this category fails,  there may be a higher chance the submission is fraudulent.
    -   `User action required`: Checks in this category are designed to flag instances when a user submits information that does not meet the quality bar Persona requires. If a check in this category fails, it does not necessarily indicate a higher chance that the submission is fraudulent.
    -   _Note:_ You may also see the phrase "Verification type" used to refer to the difference between functional categories of Verifications, such as Government ID, Selfie, and Document.
-   **Required**: whether the Verification check was required to pass in order for the Inquiry to successfully complete.

## Learn more[](#learn-more)

To learn how to interpret Verification check results in the Dashboard, see: [Tutorial: Understand Verification results for an Inquiry](./xrnJpm5Q18CSN63SQFdsi.md)
