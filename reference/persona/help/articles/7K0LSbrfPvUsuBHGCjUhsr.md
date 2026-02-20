# Adverse Media Report

## Overview[](#overview)

The Adverse Media Report screens an individual across a **global** database of 300+ million news articles to identify any negative or unfavorable information associated with that individual. The database includes a wide variety of news sources — both "traditional" news outlets and unstructured sources. The risks associated with conducting business with persons with an adverse media profile vary.

## Use Case[](#use-case)

Adverse Media screening is critical for the KYC/AML process. It helps to know when the clients have been involved with unethical or criminal activities like money laundering, financial fraud, organized crime, etc. Especially if the firms operate within a regulated sector.

Often there's a significant delay between when someone has been involved in doing something nefarious vs. when they show up on a Sanctions/Warnings list. The media is much faster at reporting on such activities, so organizations often pair the adverse media report with the [Watchlist Report](./UQGaDEhkQ7TLAMJsjuXiX.md).

## Report Features[](#report-features)

![adversemediareport.png](../images/Adverse_Media_55b7569b8914.gif)

### Search Inputs[](#search-inputs)

-   First and Last name of individual (required)
-   Birthdate (optional)
-   Country of individual (optional)

The inputs are typically collected during a KYC Inquiry. The individual’s first and last names, are set as the main search terms, while birthdate and country inputs can be derived from a government ID verification or Inquiry form input.

### Report Outputs[](#report-outputs)

If a match is found, you can access and review the surfaced articles by clicking on each matched item. Each item includes attributes that help to determine the validity of the report output.

It’s easy to run into cases where you have many false positives with Adverse Media Report. This is because when you search for a name and get a hit online in an article, you don't know if this article refers to the person you are searching for or _another_ person with the same name. As such, we do our best to do entity resolution and group together articles that have a high degree of confidence that they are referring to the same person. In the report, we return all the possible matches sorted in order of relevance.

**`Birthdates`**

The possible birthdates associated with an individual. If an individual has an undetermined birthday or they have used multiple birthdays, we will surface all possible birthdates.

**`Age`**

The possible ages associated with an individual. If an individual has an undetermined age or they have used multiple ages, we will surface all possible ages.

**`Relevance`**

Explains the relevance of the match. The results in the report are sorted based on relevance. The possible reasons for relevance are:

-   Matched the name exactly
-   Matched the name with a synonym
-   Matched an AKA name with a synonym
-   Matched birth year filter
-   Matched against an AKA name exactly
-   Matched for a complex reason, such as acronym
-   Matched closely to the name
-   Matched the name phonetically
-   Approximately matched search birth year
-   Personal suffixes removed from search input
-   Clerical marks removed from search input

**`Aliases`**

Alternate names that the individual can also be known as. Our vendor collects this information from various sources they have regarding this individual. There tend to be slight variations in spellings and also the name in different languages based on how the news articles reference this person.

**`Categories`**

We categorize the types of unfavorable media associated with an individual with the below types. Based on the types of unfavorable media associated with an individual, we will surface the corresponding types.

-   Financial AML/CFT
-   Fraud-linked
-   General AML/CFT
-   Narcotics AML/CFT
-   Property Crime
-   Terrorism
-   Violence AML/CFT
-   Cybercrime
-   Financial Difficulty
-   Other Financial
-   Other Minor
-   Other Serious
-   Regulatory
-   Violence NON-AML/CFT

**`Countries`**

List of all countries where the adverse media is observed in.

### Notifications[](#notifications)

The best way to be notified immediately of a match on the Adverse Media Report is to set up a webhook listening for the event types: `report/adverse-media.matched` fires whenever a match is found; `report/adverse-media.ready` fires whenever the report runs, regardless of match status.

## Configuration Options[](#configuration-options)

Configuration options for Adverse Media Report are view-only. By default, all category types are enabled along with recommended match settings. Please [contact the Persona support team](https://app.withpersona.com/dashboard/contact-us) to make changes to your report configurations.

-   Categories: Type of adverse media to search against (e.g. violent crime, terrorism, narcotics).
-   Article-level filtering: Customization on article details
-   Name matching: How closely the name of your end user must match an entity in a source list. To learn more, refer to [this guide](./1FOJzuI3uMFmcDuR5zkged.md)
-   Birthdate matching: How closely the birthdate of your end user must match an entity in a source list. To learn more, refer to [this guide](./3gcpePErNfB1lPrMAcLjeI.md#birthdate-matching)

## Continuous Monitoring[](#continuous-monitoring)

Just because a person is not a "bad actor" today does not mean that they cannot be a "bad actor" 2 months down the line. Therefore, it's critical for organizations to monitor individuals continuously and to make sure there is no negative news or unfavorable information on a given person. To learn more, refer to [this guide](./7LRMBbxLshF7sCcLhfhwF4.md).

## Plans Explained[](#plans-explained)

|  | Startup Program | Essential Plan | Growth and Enterprise Plans |
| --- | --- | --- | --- |
| Adverse Media Report | Not Available | Available | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md)

## FAQs[](#faqs)

### How often are databases updated?[](#how-often-are-databases-updated)

The adverse media database is updated within 48 hours of the information being published on the referred website

## _Disclaimer_[](#disclaimer)

_Persona is not a consumer reporting agency and the services (and the data provided as part of its services) do not constitute a ‘consumer report’ for the purposes of the Federal Fair Credit Reporting Act (FCRA). The data and reports we provide to you may not be used, in whole or in part, to: make any consumer debt collection decision, establish a consumer’s eligibility for credit, insurance, employment, government benefits, or housing, or for any other purpose authorized under the FCRA. If you use any of any of our services, you agree not to use them, or the data, for any purpose authorized under the FCRA or in relation to taking an adverse action relating to a consumer application._
