# AAMVA Verification

## Overview[](#overview)

An AAMVA Verification answers the question "Does the US state identification card or driver’s license match what is currently in the DMV database?"

The AAMVA Verification takes in collected values (from a US driver’s license or state identification card) and runs the inputs through information in an official Department of Motor Vehicles (DMV) database to verify the identity. The American Association of Motor Vehicle Administrators (AAMVA) is the underlying service that powers AAMVA Verification and interfaces with DMV data. The AAMVA Verification offers a step-up verification and greater assurance against fraud when paired with the Government ID Verification.

### When should I use AAMVA verification?[](#when-should-i-use-aamva-verification)

AAMVA Verification is commonly used as:

-   **An added validation on Inquiries you deem higher-risk**: You can configure AAMVA Verification to run automatically when an Inquiry shows signs of being high-risk. In Persona, you can define custom conditional logic to express what it means to be high-risk (e.g. if a user fails a specific Verification check earlier in the Inquiry).
-   **An additional input requested by human reviewers**: AAMVA Verifications can be a tool for human reviewers who want more information to decide whether a submitted ID is valid. A reviewer can send the end user a link to a new Inquiry that takes them through an AAMVA Verification.

### U.S. States covered by AAMVA[](#us-states-covered-by-aamva)

AAMVA Verification covers most, but not all US states. Some states do not participate in the AAMVA system, and some states only allow access to government organizations.

As of February 2025, the following jurisdictions are _not_ covered by AAMVA Verification:

-   Alaska
-   California
-   Louisiana
-   Minnesota
-   New York
-   Pennsylvania
-   Utah

### Types of fraud AAMVA Verification can’t catch[](#types-of-fraud-aamva-verification-cant-catch)

While AAMVA Verification is a convenient way to catch certain kinds of fraud, there are some things it can’t do. For example, it cannot detect:

-   A fake driver’s license displaying valid personal details on the front side that match a valid barcode on the back side
-   Validity of photo ID or signature
-   Whether a real driver’s license is being used by someone who does not own it

You can offset many of the limitations of AAMVA Verification by combining it with other Persona products. For example, you can catch when a driver’s license is used by someone who doesn’t own it by leveraging Persona’s Government ID and Selfie Verifications.

### Understanding data sources[](#understanding-data-sources)

AAMVA Verification is an [issuing data source](../../landing/blog/what-are-issuing-database-verifications.md). Issuing data sources (i.e. Department of Motor Vehicles (DMV)), Social Security Administration (SSA)) offer step-up verification and higher levels of assurance against fraud. Within Persona, issuing data sources are represented as Verification Types in the form of products like AAMVA Verification or eCVSV Verification.

## Using AAMVA Verification[](#using-aamva-verification)

AAMVA Verification is typically used in combination with Government ID and Selfie Verifications.

-   Government ID and Selfie Verifications check that the user is in possession of a driver's license that matches their face.
-   AAMVA Verification checks that the user's driver’s license is legitimate.

There are three common ways to set up AAMVA Verification, either in combination with Government ID and Selfie Verifications or as a follow-up step for manual review.

### After Government ID Verification via Workflow (recommended)[](#after-government-id-verification-via-workflow-recommended)

For most use cases, the smoothest setup is to run AAMVA Verification via a Workflow after a user completes an Inquiry. The Inquiry can be configured to collect driver's license information via Government ID Verification, and that information can then be passed into AAMVA Verification.

There are several benefits to this setup:

-   **User experience**: It does not require your users to go through a separate Verification.
-   **Resilience**: It builds resilience into your AAMVA Verification. The underlying AAMVA service that provides access to the DMV database sometimes becomes unavailable. By running AAMVA Verification in a Workflow, the downtime does not impact the user experience in your Inquiry, and you can handle the downtime by implementing retry logic in the Workflow.

Here are some best practices for implementing this setup:

-   **Require barcode**: This setup tends to produce good results only if you ask users to upload the barcode of the driver’s license in the Government ID Verification.
-   **Require mobile device**: We recommend that you require users to use a mobile device to scan the barcode. This helps users take the clearest photo of the barcode. Mobile devices typically have higher-quality cameras, and can be more easily moved to an area with good lighting.

Note that some users have difficulty capturing barcodes, so requiring barcodes may lead some users to drop off from your Inquiry. You may want to monitor your Inquiry completion rates via [Inquiry Analytics](./6wdZdwn9m4T8eY7EfqWRmB.md).

### After Government ID Verification in an Inquiry[](#after-government-id-verification-in-an-inquiry)

Another common way to set up AAMVA Verification is to ask users to complete it as an additional Inquiry step only if they fail certain Verification checks in a Government ID Verification. You can use a branching step in Persona's [Dynamic Flow Editor](./3oD3G7MYVMVOvWZWXRvXtR.md) to route certain users through AAMVA Verification within the same Inquiry.

If you choose this setup, you may be able to reduce user friction by prefilling the form that users must fill in for AAMVA Verification, using details collected about their driver’s license in the Government ID Verification. Users can double check and further edit the details before they submit. See the [Inquiry Prefill article](./79Y8gi2c0QnOzDax63LfDF.md) for more information.

### Inquiry with only AAMVA Verification[](#inquiry-with-only-aamva-verification)

AAMVA Verification can also be used to support manual review of driver's licenses submitted through Government ID Verification. In this setup, the manual review team can create a one-off Inquiry to request more information about a submitted driver’s license.

To implement this setup, create an Inquiry Template that contains only AAMVA Verification. A member of your review team can then [create an Inquiry in the Persona dashboard](./5BXtEAVKgWEUucY9uH7Uvj.md#3-within-the-persona-dashboard) using this template. They can either send the Inquiry to a user, or fill the Inquiry out themselves on behalf of the user, using information the user previously submitted (for example, driver's license details provided via a Government ID Verification).

## Verification features[](#verification-features)

### Verification inputs[](#verification-inputs)

Required inputs from a US state ID or driver’s license:

-   Name
-   Date of Birth
-   ID Number
-   Expiration Date
-   Issuing Date
-   State of Issuance

### Verification outputs[](#verification-outputs)

**`Verification status`**

The verification status indicates where the Verification is in its process, with results displayed as ‘failed’ or ‘passed.’ This is an easy way to ascertain, at a high level, if the attempt to verify the identity met the requirements set forth in the configurations of the Verification Template.

**`Verification Check statuses`**

Each AAMVA Verification Check is marked as `passed`, `failed`, or `not applicable`. This will give a more detailed look at which of the Verification Checks the attempt failed. In the Dashboard, the results view of the Verification also shows which checks were required on the Verification Template when the Verification ran. Those that were required determine what checks are necessary to receive a `passed` at the Verification Status level.

For AAMVA Verification, we recommend requiring Verification checks that ensure that the name, birthdate, and ID number on the user's driver's license match the information in the AAMVA database. Other checks can be required or non-required depending on your organization's needs.

**`Verification Check details`**

Some Verification Checks offer more detail about why the attempt failed or passed that particular check. This allows a reviewer to better understand how the Verification status was determined, and gives insight into how the Verification Template configurations may need to be optimized or adjusted.

**`Identity Comparison Check details`**

In the Dashboard view of an AAMVA Verification run, the Identity Comparison Check detail is expanded by default. The Identity Comparison Check provides a detailed view of attribute match quality and the associated risk level.

## Configuration options[](#configuration-options)

The AAMVA Verification offers the ability to configure which inputted attributes are required to consider a verification run `passed`. See [Configuring AAMVA Verification checks](./70vgYw92xPjkiRr3vYfity/%20%22Configuring%20AAMVA%20Verification%20checks%22.md) for more information.

## AAMVA Verification access by plan[](#aamva-verification-access-by-plan)

|  | Startup Program | Essential Plan | Growth and Enterprise Plans |
| --- | --- | --- | --- |
| AAMVA Verification | Not Available | Available (including Government ID + AAMVA solution) as add-on | Available |

[Learn about pricing and plans](../../landing/pricing.md)

## Disclaimer[](#disclaimer)

_Persona is not a consumer reporting agency and the services (and the data provided as part of its services) do not constitute a ‘consumer report’ for the purposes of the Federal Fair Credit Reporting Act (FCRA). The data and reports we provide to you may not be used, in whole or in part, to: make any consumer debt collection decision, establish a consumer’s eligibility for credit, insurance, employment, government benefits, or housing, or for any other purpose authorized under the FCRA. If you use any of any of our services, you agree not to use them, or the data, for any purpose authorized under the FCRA or in relation to taking an adverse action relating to a consumer application._

## Related articles

[Government ID + AAMVA Solution](./76IuZmA7MC9tdemWcSb49M.md)

[Configuring AAMVA Verification checks](./70vgYw92xPjkiRr3vYfity.md)
