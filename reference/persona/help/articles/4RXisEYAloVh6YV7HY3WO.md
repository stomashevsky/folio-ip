# Understanding Phone Carrier Verification results[](#understanding-phone-carrier-verification-results)

## Overview[](#overview)

The Phone Carrier Verification verifies the authenticity of inputted phone numbers by checking the legal name and phone number against global telecommunications carrier databases. It adds an additional layer of data to ensure not only that the physical phone is with the individual, but that it’s actually associated with that individual’s name. For more details, see the [Phone Carrier Verification overview](./7nbNgynP75u1YE4pLcV75L.md).

This page examines an example of a Phone Carrier Verification and guides you through the results. You'll learn how to interpret Verification checks and understand why they **passed** or **failed**.

ℹ️ Note: A Verification run represents a single attempt to verify specific information. Within an Inquiry, users may get multiple Verification results due to user error, network issues, or other configureable factors in Persona. For this reason, we recommend reviewing, listening, or retrieving the status of the parent Inquiry or Transaction rather than individual Verifications. This approach allows you to use Inquiry Templates or Workflows to better evaluate approval conditions, declines, and cases needing additional review.

## Example Phone Carrier Verification result[](#example-phone-carrier-verification-result)

As an example, we'll look at a Phone Carrier Verification that checks whether the phone number submitted is valid by matching it to Phone Carrier database information. We'll walk through the example Verification below, section by section.

![phonecarrier](../images/phonecarrier_6f3d79ca74d6.png)

Note: Input fields and Carrier Match Results in these screenshots are intentionally blurred for privacy, but represent the actual data submitted during verification.

## Overall Verification run result[](#overall-verification-run-result)

When viewing a Phone Carrier Verification run, you’ll first see the overall Verification result. In this example, the Phone Carrier Verification **failed**.

This top-level status is commonly in a “**passed**” or “**failed**” state. The information below explains why it “**failed**” and shows the Verification Template configurations that led to that “**failed**” status.

Here’s how to understand Verification results and their status:

### A note on Inquiry status vs. Verification status[](#a-note-on-inquiry-status-vs-verification-status)

A common best practice for solutions within Persona is to rely on statuses. For example, when integrating via Inquiries (Hosted, Embedded, or Mobile SDK), businesses typically listen for the status of an Inquiry to decide whether a user should proceed within a user experience or not—if **passed**, otherwise it may require additional review. That additional review allows you to automatically or manually review the different verification attempts by conditioning on or reviewing the statuses of those verifications. You can also go one level deeper and review the statuses of the verification checks within a Verification to further understand the exact reasons for Verification failures.

These different statuses, let you quickly determine if an identity meets your Verification threshold and which ones don't. It gives you the ability to automate the attempts you feel most confident about, while leaving a pathway open for the longer tail, more complicated situations. For those complicated situations that need review—such as higher-risk, failed, or declined identities—you can drill down into specific details based on what you need to investigate further.

![phonecarrier](../images/phonecarrier_6f3d79ca74d6.png)

### Phone Number[](#phone-number)

“Phone Number” refers to the Phone number submitted and “Country” indicates the Country associated with the submitted phone number.

# Verification checks[](#verification-checks)

## What are Verification checks?[](#what-are-verification-checks)

Verification checks evaluate specific aspects of the submitted information. Each Verification type has its own set of Verification checks that run instantly during the Verification run. A check can result in one of three statuses: "**passed**,” "**failed,**" or "**not applicable (N/A).”** The following section explains these statuses in detail.

In this example, a Birthdate comparison check would be "**N/A”** because a Phone Carrier Verification is unavailable for the country associated with the Phone Number.

![PhoneCarriervercheck](../images/PhoneCarriervercheck_7e9fe6b76bfe.png)

## What does each Verification Check mean?[](#what-does-each-verification-check-mean)

Every Verification Type has it's own Verification Checks, as each type verifies different pieces of information. For a complete look at the definition of Verification Checks per Verification Type, active customers can view a complete list of Verification Checks and associated failure reasons by going to **Documentation > [Verification Checks](https://app.withpersona.com/dashboard/resources/verification-checks)** in your Persona Dashboard.

## What do Verification check results look like?[](#what-do-verification-check-results-look-like)

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
-   **Required**: The Verification checks required to pass in order for the Phone Carrier Verification to successfully complete.

![phonecarrierverfchecks](../images/phonecarrierverfchecks_fb408ff75083.png)

### How do I know if a Verification check is required?[](#how-do-i-know-if-a-verification-check-is-required)

In this example, we see that one Verification check was [required](./7IAy61dAMRDQ1Q77ugwpcA.md) (indicated by the blue checkmark in the Required column). The check **failed**. While reviewing non-required Verification checks is common practice, consider updating your Verification Template to require any check whose failure would be unacceptable. This ensures future Verification runs will properly evaluate these critical checks.

## Verification check details[](#verification-check-details)

Some Verification checks offer deeper verifications features, such as Carrier Match Results, which are included in Phone Carrier Verification.

### Carrier Match Results[](#carrier-match-results)

![phonecarriermatch](../images/phonecarriermatch_2e12e62e82a1.png)

The Carrier Match Results provides a detailed view of if the submitted information matches the Phone Carrier Database.

-   **Property:** The type of information about the user—also known as the field.
-   **Input:** The information the end user input.
-   **Match Result:** How closely the submitted information matched a known database record. The options are: `Full`, `Partial`, `None`, or `Missing`. Below, we'll explain what each option means.
-   **Status:** This is a high-level result of the check. Possible values are:
    -   `Multiple checks`: Multiple checks are required for this check to pass.
    -   `Passed`: The check passed in the verification attempt.
    -   `Failed`: The check failed in the verification attempt.
    -   `N/A`: Not applicable. The check was not evaluated in the verification attempt. (This may happen because this check depends on a piece of information that was not collected as part of the Inquiry.)
-   **Score**: A phone number’s risk score is a measure of the risk associated with the phone number. The risk score ranges from 0 to 100. The higher the risk score, the higher the risk level. You can read more about the [Phone Risk Report here](./6MsSJ5GQjHhtIN0xxLLeby.md).

### Fields that matched[](#fields-that-matched)

In the **Status** column, fields that matched will have **passed**. This means they **passed**—i.e. the value the user submitted sufficiently matched what was in a known database.

![phonecarriermatch](../images/phonecarriermatch_2e12e62e82a1.png)

In the Match Result column, we see these fields varied in how closely they matched a known database record.

-   **Match result = `Partial`**: First name and Address were both a `Partial` match. This means the value the user submitted partially matched what was in a known database.

A match could also result in a `Full` match. This means the submitted value matched exactly with what is in the known database.

### Fields that did not match[](#fields-that-did-not-match)

Fields that fail will have `Failed`. This means they did not match—i.e. the value the user submitted did NOT sufficiently match what was in a known database.

![phonecarriermatch](../images/phonecarriermatch_2e12e62e82a1.png)

-   **Match result = `None`**: Last name. This means the value the user submitted didn’t match exactly what was in a known database.

A match result that did not pass could return `None` or `Missing`. This means the information the user submitted did not sufficiently match what is in a known database or Persona was unable to find information about this field from a known database.

## Related articles

[Phone Carrier Verification](./7nbNgynP75u1YE4pLcV75L.md)
