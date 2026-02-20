# Government ID + AAMVA Solution

## Overview[](#overview)

Persona’s Government ID + AAMVA solution enables organizations to get a step-up verification for Government ID by leveraging live DMV data. This solution helps you identify fraud effectively and mitigate limitations due to AAMVA coverage and service issues.

In this guide, learn:

-   What is included in the solution
-   How the components work together to optimize your verification process
-   How to set up and customize AAMVA verification for your specific needs

## What’s Included[](#whats-included)

Government ID + AAMVA solution includes the following:

**1 Inquiry Template**

-   **Government ID and Silent AAMVA**
    -   Automatically collects all ID types by default, including US driver’s licenses and state IDs. You can modify the accepted ID types by following [this guide](./3WnqX7N26sshPLKPQbuW4O.md#step-4-configure-enabled-countries-and-id-types).
    -   Requires a Barcode Check which means that both the front and back of ID are collected. While this required check introduces some friction to the user experience, it greatly improves extraction accuracy and overall user experience.

**2 Workflows**

-   **Run AAMVA Verification** triggered on inquiry completion
    -   It is best practice to run AAMVA verification via Workflows after an Inquiry is completed because it adds resilience to your solution.
    -   The Workflow ensures that the user experience remains unaffected if AAMVA services are unavailable due to outages or maintenance. It also handles downtime with retry logic, allowing up to 3 retries if the verification is canceled due to service issues.
    -   Case creation if all 3 retry attempts are canceled due to AAMVA service outages, or if the AAMVA verification is skipped because the submitted ID does not belong to an AAMVA- participating state, or if AAMVA verification fails.
-   **(GovID for AAMVA) Inquiry Failed: create cas**e triggered on inquiry failure
    -   Case creation if the Government ID verification fails

**1 Case Template**

-   **GovID + AAMVA Manual Review**
    -   A tag or comment is added to the Inquiry and Case to indicate why a Case was created.
    -   Includes a Case Action to run ad-hoc AAMVA verifications with a single click, providing additional assurance or re-trying AAMVA when the service is back online.

## Government ID + AAMVA Solution Process[](#government-id--aamva-solution-process)

Now that you know what’s included in Government ID + AAMVA solution, let’s explore how the various components work together:

1.  **Government ID and Silent AAMVA** Inquiry template captures essential user identity information and runs a Government ID verification.
2.  Upon successful completion of the Inquiry, the **Run AAMVA Verification Workflow** is triggered. This Workflow utilizes the collected data to perform AAMVA verification and handles any potential service issues through retry logic.
3.  In scenarios where verification fails or is incomplete or there is a service interruption, a **GovID + AAMVA Manual Review Case** is automatically created for manual review, from which you can decision on the individual.

If you’re interested in using Persona’s AAMVA solution, reach out to your customer success manager or [contact the Persona support team](https://app.withpersona.com/dashboard/contact-us).

## Other ways to set up AAMVA Verification[](#other-ways-to-set-up-aamva-verification)

### Inquiry with only AAMVA Verification[](#inquiry-with-only-aamva-verification)

AAMVA Verification is commonly used as a tool for manual review as a way to request more information about a submitted driver’s license when needed. You can set up an Inquiry Template that contains only AAMVA Verification. Your review team can then create one-off Inquiries using this template, either sending them directly to users or completing them based on previously submitted information (for example, an image of their license provided via a Government ID Verification).

If you’re interested in using AAMVA only Inquiry, reach out to your customer success manager or [contact the Persona support team](https://app.withpersona.com/dashboard/contact-us).

## Plans Explained[](#plans-explained)

|  | **Startup Program** | **Essential Plan** | **Growth Plan** | **Enterprise Plan** |
| --- | --- | --- | --- | --- |
| AAMVA | Not available | Government ID + AAMVA (this solution) Available as add-on | Available | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md)

## Related articles

[AAMVA Verification](./1wiQ7wAhmnKh6mesCGopKl.md)
