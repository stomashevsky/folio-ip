# Selfie Verification

## Overview[](#overview)

Selfie Verification protects against identity spoofing by automatically comparing a selfie to a Government ID Verification portrait with a three point composite and conducting biometric liveness checks. A Selfie Verification answers the question "Is the individual physically present during the attempt or transaction?"

## Verification Features[](#verification-features)

### Verification Inputs[](#verification-inputs)

-   Images of individual selfie poses looking center, left, and right (default configuration)

**Collection of inputs**

⚠️ We recommend using the Persona Inquiries product to configure and collect the necessary information to conduct Selfie Verifications, and to compound fraud prevention benefits across the two products.

-   Via Inquiries
    -   The Selfie Verification (and any associated screens) can be added to an existing Inquiry Template through a pre-built Module in the Flow Editor or as a new Inquiry Template via the Inquiry Template or Solution Library
-   Via API
    -   You can also run a Selfie Verification via a Transaction with an accompanying Workflow that contains the Run Selfie Verification action step
    -   Acceptable image types include `PDF`, `JPEG`, `JPG`, `PNG`, `HEIC`, `HEIF`
    -   File size must be between 10KB and 15MB
    -   Dimensions must be 200px min and 15000px max

### Verification Outputs[](#verification-outputs)

**Verification status**

The Verification status provides an overview of the verification’s outcome, with statuses marked as either `failed` or `passed`. This is an easy way to ascertain, at a high level, if the attempt to verify the identity met the requirements set forth in the configurations of the Verification Template.

**Selfie images**

The collected images are available in the Dashboard Verification results view to allow for easy comparison against the other outputs from the Verification.

**Verification Check statuses**

Each Selfie Verification check will be marked as `passed`, `failed`, or `not applicable`. This will give a more detailed look at which of the Verification Checks the attempt failed. In the Dashboard, the results view of the Verification also show which checks were required on the Verification Template when the Verification ran. Those that were required determine what checks are necessary to receive a `passed` at the Verification Status level.

**Verification Check details**

Given that the Verification checks can determine whether the attempt passes or fails the Verification, some Verification checks offer more detail about the failure reason and the specifics around why the attempt failed or passed that particular check. This allows a reviewer to understand more granularly what constitutes pass and fail, and gives insights into what Verification Template configurations may need to be optimized or adjusted.

Read more on [Selfie Verification Outputs here.](./4BTlLMW5TdKym0zoDzhVV9.md)

## Configuration options[](#configuration-options)

The Selfie Verification offers a variety of configurations such as required or un-required verification checks, verification check sub-configurations, and if used in conjunction with Inquiries, collection-specific configurations like device hand-off functionality and the option to configure center-only checks or the full three-point composite. See [Configuring Selfie Verification checks](./1dsXklKVFkvpSdX90CTtNo/%20%22Configuring%20Selfie%20Verification%20checks%22.md) to learn more.

## Selfie Verification access by plan[](#selfie-verification-access-by-plan)

|  | Startup Program | Essential Plan | Growth Plans | Enterprise Plans |
| --- | --- | --- | --- | --- |
| Selfie Verification | Available with limited configurations | Available | Available | Available |

[Learn about pricing and plans](../../landing/pricing.md)

## Related articles

[Understanding Selfie Verification results](./4BTlLMW5TdKym0zoDzhVV9.md)

[Configuring Selfie Verification checks](./1dsXklKVFkvpSdX90CTtNo.md)
