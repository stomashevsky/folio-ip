# Deterring SMS fraud

## Overview[](#overview)

If you use [Phone Number Verification](../../docs/reference/phone-number-verifications.md) or enable [device handoff](./1eWai1tzBuIZ8fA3QknyBd.md), fraudsters may try to use your Inquiry to commit fraud. We’ll cover a common type of fraud, and how you can take steps to discourage fraudsters and minimize the impact of a fraud attack.

## SMS traffic pumping fraud[](#sms-traffic-pumping-fraud)

One common type of fraud related to phone numbers is called SMS traffic pumping. In this scheme, bad actors use your Inquiry flow to generate SMS messages to many phone numbers (usually phone numbers in specific geographic regions), in order to make a profit.

This type of fraud can potentially cause the following issues for you:

-   You may see a large number of Inquiries from fraudsters, which creates noise in your data and work for your operations team.
-   You may be charged for a larger number of Inquiries on Persona than you want, due to the fact that fraudsters are motivated to go through your Inquiry flow.

## Deterring SMS fraud[](#deterring-sms-fraud)

Here are some approaches you can take to deter SMS fraud.

### Create Inquiries on behalf of each user[](#create-inquiries-on-behalf-of-each-user)

If you have integrated Persona via Hosted Flow, we recommend that you don’t share the Hosted Flow link directly with your users. The Hosted Flow link lets a user generate as many Inquiry links as they want to.

Instead, we recommend that you create Inquiries on behalf of each user. You can either manually create Inquiry links for each user, or create Inquiry links for each user via API. See the [Hosted Flow](./4pZBZYAFLkKMyXycGeAMV2.md) article to learn more.

### Phone Number Verification: Set a country code in the Inquiry UI[](#phone-number-verification-set-a-country-code-in-the-inquiry-ui)

Does your service serve a specific region (for example, the US and Canada)? If so, consider setting the country code in the Inquiry UI for Phone Number Verification so that end users cannot change it. This means fraudsters will not be able to input a phone number with a different country code. While this can’t block fraud that targets your country code, it can be an effective way to reduce it. The region of the phone number is a key factor in SMS traffic pumping.

Note: This is currently a setting we have to make on your behalf. Please [contact the Persona support team](https://app.withpersona.com/dashboard/contact-us) and we’ll help you out.

## Minimizing the impact of a fraud attack[](#minimizing-the-impact-of-a-fraud-attack)

In addition to the approaches above, here are additional ways to minimize the impact of a fraud attack.

### Automatically decline Inquiries using a Workflow[](#automatically-decline-inquiries-using-a-workflow)

You can set up a Workflow that automatically declines Inquiries if:

-   The phone number collected in a Phone Verification is outside of an expected geographic region, or within a region that you’ve identified as associated with fraud.
-   Other aspects of the Inquiry (e.g. the IP address, or region of the network used to complete the Inquiry) match characteristics of Inquiries you’ve identified as associated with fraud.

See [Creating Workflows](./20Zvcq50493eMUdt7aDhRY.md) to learn how to create a Workflow.

## Get support[](#get-support)

We’re happy to help you implement any of these approaches. Just reach out to your customer success manager or [contact our support team](https://app.withpersona.com/dashboard/contact-us).
