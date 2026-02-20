# Understanding eCBSV Verification results[](#understanding-ecbsv-verification-results)

## Overview[](#overview)

eCBSV (electronic Consent Based Social Security Number Verification) is a service offered by the United States government and is supported by Persona.

This page examines an example of a eCBSV Verification and guides you through the results. You'll learn how to interpret Verification checks and understand why they **passed** or **failed**.

ℹ️ Note: A Verification run represents a single attempt to verify specific information. Within an Inquiry, users may get multiple Verification results due to user error, network issues, or other configureable factors in Persona. For this reason, we recommend reviewing, listening, or retrieving the status of the parent Inquiry or Transaction rather than individual Verifications. This approach allows you to use Inquiry Templates or Workflows to better evaluate approval conditions, declines, and cases needing additional review.

## Example eCBSV Verification result[](#example-ecbsv-verification-result)

As an example, we'll look at a eCBSV Verification. We'll walk through the example Verification below, section by section.

![ECBSV Revamp](../images/ECBSV_Revamp_cc39e54ff864.png)

Note: Input fields in these screenshots are intentionally blurred for privacy, but represent the actual data submitted during verification.

## Overall Verification run result[](#overall-verification-run-result)

When viewing a eCBSV Verification run, you’ll first see the overall Verification result. In this example, the eCBSV Verification **failed**. The reason is that the **Record Matched** and **Death record Checks** were required, and the submitted information did not pass the check requirements. This check passes only if each "required" field collected in the eCBSV matches the settings for eCBSV Verification.

This top-level status is commonly in a “**passed**” or “**failed**” state. The information below the overall result offers further explanation or reasons as to why it “**failed**” and shows the Verification Template configurations that led to that “**failed**” status.

Here’s how to understand Verification results and their status:

### A note on Inquiry status vs. Verification status[](#a-note-on-inquiry-status-vs-verification-status)

A common best practice for solutions within Persona is to rely on statuses. For example, when integrating via Inquiries (Hosted, Embedded, or Mobile SDK), businesses typically listen for the status of an Inquiry to decide whether a user should proceed within a user experience or not—if **passed**, otherwise it may require additional review. That additional review allows you to automatically or manually review the different verification attempts by conditioning on or reviewing the statuses of those verifications. You can also go one level deeper and review the statuses of the verification checks within a Verification to further understand the exact reasons for Verification failures.

These different statuses, let you quickly determine if an identity meets your Verification threshold and which ones don't. It gives you the ability to automate the attempts you feel most confident about, while leaving a pathway open for the longer tail, more complicated situations. For those complicated situations that need review—such as higher-risk, failed, or declined identities—you can drill down into specific details based on what you need to investigate further.

### Collected Fields[](#collected-fields)

The Collected Fields are the inputted information from the end user.

**Checks**: We see that two Verification checks are [required](./7IAy61dAMRDQ1Q77ugwpcA.md) (Blue check mark in the Required column). Both failed.

# Verification Checks[](#verification-checks)

## What are Verification Checks?[](#what-are-verification-checks)

Verification checks evaluate specific aspects of the submitted information and images. Each Verification type has its own set of Verification checks that run instantly during the Verification run. A check can result in one of three statuses: "**passed**,” "**failed,**" or "**not applicable (N/A).”** The following section explains these statuses in detail.

## What does each Verification Check mean?[](#what-does-each-verification-check-mean)

Every Verification Type has it's own Verification Checks, as each type verifies different pieces of information. For a complete look at the definition of Verification Checks per Verification Type, active customers can view a complete list of Verification Checks and associated failure reasons by going to **Documentation > [Verification Checks](https://app.withpersona.com/dashboard/resources/verification-checks)** in your Persona Dashboard.

## What do Verification Check results look like?[](#what-do-verification-check-results-look-like)

Let's zoom in on all the checks.

Here's what each column means at a high level:

-   **Status**: This is a high-level result of the check. Possible values are:
    -   `Passed`: The check passed in the Verification attempt and meets the check’s configuration.
    -   `Failed`: The check failed in the Verification attempt and does not meet the check’s configuration.
    -   `N/A`: Not applicable. The check was not evaluated in the Verification attempt. This may happen because this check’s configuration depends on a piece of information that was not collected as part of the Inquiry and the check can not be performed.
-   **Check Name**: The name of the Verification check.
-   **Type**: If a Verification check falls into the `Fraud` or `User behavior` category.
    -   `Fraud`: Checks in this category are designed to help catch fraudulent submissions. If a check in this category fails, there may be a higher chance the submission is fraudulent.
    -   `User behavior`: Checks in this category are designed to flag instances when a user submits information that does not meet the quality bar Persona requires. If a check in this category fails, it does not necessarily indicate a higher chance that the submission is fraudulent. Note: You may see this as `user action required` in the API response.
-   **Required**: The Verification checks required to pass in order for the Government ID Verification to successfully complete.

Note: if you find that a required check isn’t something you want to require, then you should update the configurations on the Verification Template. You can read more about that [here](../verifications/features/government-id-verification-configurations.md).

![eCBSVchecks](../images/eCBSVchecks_f21f4e3bd077.png)

## How do I know if a Verification check is required?[](#how-do-i-know-if-a-verification-check-is-required)

In this example, we see two [required](./7IAy61dAMRDQ1Q77ugwpcA.md) Verification checks (indicated by blue checkmarks in the Required column). Of these, both **failed**. While reviewing non-required Verification checks is common practice, consider updating your Verification Template to require any check whose failure would be unacceptable. This ensures future Verification runs will properly evaluate these critical checks.
