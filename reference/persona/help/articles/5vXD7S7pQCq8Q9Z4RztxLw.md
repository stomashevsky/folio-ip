# Government ID Verification

## Overview[](#overview)

The Government ID Verification extracts, analyzes, and verifies government ID, such as passports and driver’s licenses, with configurable and automated heuristic checks across 200+ countries and territories. A Government ID Verification answers the question "Does the individual possess a genuine government-issued ID that supports their claim to a physical identity?"

## Verification Features[](#verification-features)

### Verification Inputs[](#verification-inputs)

-   Image of Government ID

**Collection of inputs**

⚠️ We recommend using the Persona Inquiries product to configure and collect the necessary information to conduct Government ID Verifications, and to compound fraud prevention benefits across the two products.

-   Via Inquiries
    -   The Government ID Verification (and any associated screens) can be added to an existing Inquiry Template through a pre-built Module in the Flow Editor or as a new Inquiry Template via the Inquiry Template or Solution Library
-   Via API
    -   You can also run a Government ID Verification via a Transaction with an accompanying Workflow that contains the Run Government ID Verification action step
    -   Acceptable image types include `PDF`, `JPEG`, `JPG`, `PNG`, `HEIC`, `HEIF`
    -   File size must be between 10KB and 15MB
    -   Dimensions must be 200px min and 15000px max

### Verification Outputs[](#verification-outputs)

**Verification status** A Verification’s status is an indicator of where the Verification is in its lifecycle. After a Verification has run the simplest output and indicator is the status as `failed` or `passed`. This is an easy way to ascertain, at a high level, if the attempt to verify the identity met the requirements set forth in the configurations of the Verification Template.

**Card or document image(s)** The collected images are available in the Dashboard Verification results view to allow for easy comparison against the other outputs from the Verification.

**Extractions** As part of the Verification run, the Verification attempts to extract values and attributes from the collected images and these are displayed as part of the results.

⚠️ It is best practice to write these values to the associated Inquiry to have an additional way to review results (if the Government ID image collection occurs via Inquiry) and to write these values to the associated Account when a Verification passes to lay a foundation for re-verification user experiences and processes.

**Verification Check statuses** Each Government ID Verification check will be shown as `passed`, `failed`, or `not applicable`. This will give a more detailed look at which of the Verification Checks the attempt failed. In the Dashboard, the results view of the Verification also show which checks were required on the Verification Template when the Verification ran. Those that were required determine what checks are necessary to receive a `passed` at the Verification Status level.

**Verification Check details** Given that the Verification checks can determine whether the attempt passes or fails the Verification, some Verification checks offer more detail about the failure reason and the specifics around why the attempt failed or passed that particular check. This allows a reviewer to understand more granularly what constitutes pass and fail, and gives insights into what Verification Template configurations may need to be optimized or adjusted.

Read more on [Government ID Verification Outputs here.](./425G1MJXb8d9w6hTr7Huwg.md)

## Configuration options[](#configuration-options)

The Government ID Verification offers a variety of configurations such as required or un-required verification checks, acceptable countries, acceptable ID types, verification check sub-configurations, and if used in conjunction with Inquiries, collection-specific configurations like device hand-off functionality and the option to capture both the front and back of the ID.

Given that Verification configurations are nuanced, explore detailed explanations around these configurations in the Help Center [**Articles > Verifications > Features > Configurations**](../verifications/features/configurations.md).

## Government ID Verification access by plan[](#government-id-verification-access-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Government ID Verification | Available with limited configurations | Available | Available | Available (including NFC-enabled forms of identification) |

[Learn about pricing and plans](../../landing/pricing.md)

## Related articles

[Understanding Government ID Verification](./425G1MJXb8d9w6hTr7Huwg.md)

[Configuring Government ID Verification checks](./3WnqX7N26sshPLKPQbuW4O.md)
