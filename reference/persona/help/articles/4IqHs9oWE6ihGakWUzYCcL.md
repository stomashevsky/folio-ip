# Email Risk Report

## Overview[](#overview)

The Email Risk Report assesses the fraud risk of an email address and confirms its authenticity, and identifies fake and suspicious users. It leverages multiple first-party and third-party data sources to predict the risk of an email address. We often recommend coupling the Email Risk Report with other report types, like [Phone Risk Report](./6MsSJ5GQjHhtIN0xxLLeby.md) to help show a fuller picture of the individual.

## Reports Features[](#reports-features)

![emailriskreport.png](../images/emailriskreport_151d2e94eb42.png)

### Search Inputs[](#search-inputs)

-   Email address (required)

### Report Outputs[](#report-outputs)

**`Disposable`**

The email is from an temporary/disposable service

**`Spam Trap`**

Email that is a spam trap. Spam traps are "low quality" emails that should be avoided when sending emails; doing so could increase your (the sender) email's "spamminess" score from various email providers.

**`Deliverable`**

Returns True if the email is likely to be delivered to the user and land in their mailbox. Deliverability can vary depending on user's email settings, spam filters, and many other factors.

**`Valid-MX`**

Whether or not the email server has a valid MX record. MX records tell the internet where your mail servers exist to receive mail and also serve as an indicator of where you're sending mail from.

**`Domain-age-days`**

Days since the domain was created

**`Domain-exists`**

If valid domain exists

**`Domain`**

The domain name of the email

**`Credentials-leaked`**

Credentials were leaked at some point in time (e.g. a data breach, pastebin, dark web, etc.)

**`Estimated-age-days`**

The estimated age of the email in days according to the first time it’s been seen within the network

**`Suspicious`**

Whether the email is suspicious or risky

### Notifications[](#notifications)

The best way to be notified immediately of a match on the Email Risk Report is to set up a webhook listening for the event type: `report/email-address.ready`.

## Configuration Options[](#configuration-options)

There is no configuration option available for this report type.

## Static Blocklist[](#static-blocklist)

The Email Risk Report service maintains a static domain blocklist to ensure results are focused on domains where meaningful risk insights can be derived. Some domains are automatically excluded because they are known to produce non-actionable or non-risk-relevant signals — for example, domains associated with privacy relay or masking services.

These domains are not necessarily fraudulent or suspicious; many exist to protect user privacy or support legitimate product features. However, because such addresses do not carry reputation or behavioral signals, they are excluded from processing.

When an input email address belongs to one of these domains:

-   The corresponding report run will be skipped, and
-   The result will show a match status of no match to indicate that no risk analysis was performed.

This filtering helps maintain data quality and ensures reports focus on signals that can provide actionable insight — not on emails that inherently reveal no risk-relevant information.

## Plans Explained[](#plans-explained)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Email Risk Report | Not Available | Available | Available | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md)

## _Disclaimer_[](#disclaimer)

_Persona is not a consumer reporting agency and the services (and the data provided as part of its services) do not constitute a ‘consumer report’ for the purposes of the Federal Fair Credit Reporting Act (FCRA). The data and reports we provide to you may not be used, in whole or in part, to: make any consumer debt collection decision, establish a consumer’s eligibility for credit, insurance, employment, government benefits, or housing, or for any other purpose authorized under the FCRA. If you use any of any of our services, you agree not to use them, or the data, for any purpose authorized under the FCRA or in relation to taking an adverse action relating to a consumer application._
