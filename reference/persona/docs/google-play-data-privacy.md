# Google Play Privacy

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[Android](./android-sdk-v2-integration-guide.md)

# Google Play Privacy

Detailed information on completing the Google Play Store questions when submitting your app for release or update.

## Overview

As part of the Google Play Store Developer submission process, developers are required to fill out Google’s updated Data Safety section in the Google Play Console. When completing the Safety Section portion of your developer application, you are required to provide information about your app’s data collection and privacy practices, including the practices of third-party partners like Persona whose SDK code you integrate into your app.

After February 2022, “No information available” will be shown by Google in the Data Safety section for apps that have not submitted information in the Google Play Console for review and for apps that have submitted information but the submission was rejected. Without an approval in the Data Safety section, your new app submission or app update may be rejected.

## Answering the Google Play Store Safety Section Questions

You must select answers from the options presented in Google Play Store. Please keep in mind:

-   Persona’s SDKs are fully configurable by you, both in the data we collect on your behalf and how you use that data. Accordingly, you should identify all possible data collections and uses, even if not outlined here or even if certain data will be collected and used only in limited situations.
-   Your answers should follow the Google Play Store Safety Section Review Guidelines and any applicable laws.
-   We encourage you to consult with your legal counsel if you have questions about compliance with applicable laws or how your use of Persona implicates applicable laws.
-   You are solely responsible for keeping your responses accurate and up to date. If your practices change, update your responses in Google Play Store.

## What You Need To Disclose

-   Any of the required user data types that are collected and/or shared
-   Any user data sent off the user’s device by libraries or SDKs used in your app, regardless of whether this information is transmitted to you (the developer) or a third party
-   Any user data transferred from your server to a third party or transferred to another third-party app on the same device
-   Any user data collected or transferred through a webview which can be opened from your app, unless users are navigating the open web \*Note: you can learn more about each of these types of data use during the application submission process. General Answers for Google’s Data Safety Section for Persona’s SDKs

## Data Collection and Security

Below are a series of answers about our data collection and security measures.

| Question | Answer |
| --- | --- |
| Does your app collect any user data that is sent off the user’s device? | YES (as part of your use of the Persona Services, the Persona SDK will pass the data listed below, as further disclosed in the [Persona Privacy Policy](https://withpersona.com/legal/privacy-policy)) |
| Is this data encrypted in transit? | YES |
| Can users request to delete this data? | YES |

## Data Types Collected by Persona’s SDKs

## Prominent Disclosure and Consent

In addition to reviewing the information below, you are also responsible for ensuring your continued compliance with Google’s Prominent Disclosure and Consent Requirements. You’ll need to confirm the types of data that you and/or your third-party partners including Persona collect from your app before answering the questions in Google Play Store.

Persona has provided a list of data types below that our services collect as further disclosed in our [Privacy Policy](https://withpersona.com/legal/privacy-policy). However, you will need to compare them to your custom configuration of the Persona SDKs and the data collection practices in your app to confirm whether your answers are accurate.

| Data Type | Collected? |
| --- | --- |
| Location | Approximate Location: NO Precise Location: NO |
| Personal Information | Name: YES Email Address: NO Personal Identifiers: YES Address: YES Phone Number: NO Race and Ethnicity: NO Political or Religious Beliefs: NO Sexual Orientation: NO Other Personal Information: NO |
| Financial Information | Credit/Debit Card/Bank Number: NO Purchase History: NO Credit Information: NO Other Financial Information: NO |
| Health and Fitness | Health Information: NO Fitness Information: NO |
| Messages | Emails: NO SMS or MMS: NO Other in-app messages: NO Photos or Videos: YES |
| Audio Files | Voice or Sound Recordings: NO Music Files: NO Other Audio Files: NO |
| Files and Docs | NO |
| Calendar | NO |
| Contacts | NO |
| App Activity | Page Views and Taps in App: NO In-App Search History: NO Installed Apps: NO Other User-Generated Content: NO Other Actions: NO |
| Web Browsing History | NO |
| App Info and Performance | Crash Logs: NO Diagnostics: NO Other App Performance Data: NO |
| Device or Other Identifiers | YES |

## Data Usage and Handling by Persona’s SDKs

You will need to have a clear understanding of how each data type is used by you and your third-party partners including Persona. Persona provides deep linking and attribution analytics services. Depending on the type of data being collected, you may be prompted to provide more information about Persona SDKs will use and handle your data:

| Question | Answer |
| --- | --- |
| Is data Collected and/or Shared | YES to both |
| Is data “processed ephemerally”? | NO (see Play Store Safety Section for definition) |
| Is the collection of data necessary to the use of the app or can users choose whether data is collected? | YES |
| Why is the user data collected? | App Functionality: YES Analytics: YES Developer Communications: NO Fraud Prevention, Security, or Compliance: YES Advertising or Marketing: NO (Product) Personalization: NO Account Management: NO |

## Privacy Links

You will have the ability to add links on your product page to your app’s privacy policy and your privacy choices documentation. To learn more about Persona’s privacy practices and end user options, please see Persona’s [Privacy Policy](https://withpersona.com/legal/privacy-policy).
