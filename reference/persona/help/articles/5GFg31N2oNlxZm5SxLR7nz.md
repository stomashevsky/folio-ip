# Configure a Politically Exposed Person (PEP) Report

Configuration is only available for Watchlist and Politically Exposed Person (PEP) Reports. For changes to other report types, please contact the Persona support team.

## Overview[](#overview)

Configuring the [Politically Exposed Person Report](./UQGaDEhkQ7TLAMJsjuXiX.md) to meet your business needs can be complex. This guide is designed to empower you to make informed decisions about the configurations that best fit your business needs. Persona offers customization options to give you control over the data you receive, match requirements, and screening frequency.

## Configuration Options[](#configuration-options)

To configure your PEP Report, navigate to **Reports** > **Templates** in your dashboard and select a PEP template.

![Screenshot 2026-01-07 at 4.19.08 PM.png](attachment:d42356a5-ce1c-4923-a8c0-e5189fa2d149:Screenshot_2026-01-07_at_4.19.08_PM.png)

You can edit the following settings in the Reports Template Editor.

### Template name[](#template-name)

This is the name of the template. You can keep the default name, or update it to a name that makes sense for your use case and organization. To update the template name, type your preferred name into the text box and select “Save Report Template” in the upper right hand corner.

### PEP classes[](#pep-classes)

This setting determines the level of political exposure risk that the report will screen for. Political exposure risk is classified into four categories:

-   Class 1 (high risk) includes:
    -   Heads of state and government
    -   Members of government (national and regional)
    -   Members of parliament (national and regional)
    -   Heads of military, judiciary, and law enforcement
    -   Board members of central banks
    -   Top-ranking officials of political parties
-   Class 2 (medium-high risk) includes:
    -   Senior officials of the military, judiciary, and law enforcement agencies
    -   Senior officials of other state agencies and bodies and high-ranking civil servants
    -   Senior members of religious groups
    -   Ambassadors, consuls, and high commissioners
-   Class 3 (medium-low risk) includes:
    -   Senior management and board of directors of state-owned businesses and organizations
-   Class 4 (low risk) includes:
    -   Mayors and members of local, country, city, and district assemblies
    -   Senior officials and functionaries of international or supranational organizations

Select all of the risk classes that you would like to include in your report.

### Match filters[](#match-filters)

Match filters further refine the criteria used to screen for political exposure. Turn the following filters on or off according to your organization’s needs and risk tolerance:

-   Allow relatives & close associates: determines whether the report surfaces matches for persons who are related or closely associated to PEPs
-   Allow candidates: determines whether the report surfaces matches for political candidates (in addition to political leaders currently in office)
-   Allow unknown classes: determines whether the report surfaces matches for which a PEP risk class is not available
-   Portrait comparison enabled: determines whether the screening compares of provided selfies against publicly available portraits of politically exposed persons
-   Default country: determines the country to reference when screening for government officials, if no country is provided in the user input (if the default country is disabled and the user input does not include a country code, all matches will be surfaced regardless of country)

### Name matching[](#name-matching)

Name matching settings let you decide how closely the name of your end user must match an entity in a source list.

Name matching has four options. In all cases, user input is normalized to account for extra punctuation or spaces, titles and honorifics, and differences in capitalization.

1.  **Exact:** A match is recorded if the name provided by the end user is an exact match for a politically exposed person’s name, or for a common public alias for a politically exposed person.
2.  **Strict:** A match is recorded if the name provided by the end user is a match for a politically exposed person’s name or alias, allowing for addition or substitution of subset names (e.g., inclusion or exclusion of a middle name) and initials.
3.  **Tolerant:** A match is recorded if the name provided by the end user is a match for a politically exposed person’s name or alias, allowing for use of nicknames, abbreviations, and common typos.
4.  **Custom:** This option allows you to set custom match requirements—including whether to allow aliases, partial names, and nicknames—and to set a custom tolerance level for typos.

For a deep dive into what these options mean, please see our [Name Match Requirements](./1FOJzuI3uMFmcDuR5zkged.md) article.

### Birthdate matching[](#birthdate-matching)

Birthdate matching settings let you decide how closely the birthdate of your end user must match the birthday of a politically exposed person.

Birthdate matching has three options:

-   **Exact date:** matches on the exact date that is input into the report
    -   Example: if an end user inputs 12-25-2000, only 12-25-2000 will match
-   **Exact year:** matches on the year that is put into the report
    -   For example, if an end user inputs 12-25-2000, then 01-01-2000 and 12-30-2000 would both match, along with any other date within the year 2000
-   **Within +/- 1 year from birth year (default setting):** matches on the year +/- 1 year to allow for additional catches
    -   Example: if an end user inputs 12-25-2000, then 01-01-1999 and 12-30-2001 will both match, along with any other date in 1999, 2000, or 2001

## Continuous Monitoring[](#continuous-monitoring)

The PEP Report can be set to recur at a regular cadence that meets your compliance requirements. [Continuous monitoring](./7LRMBbxLshF7sCcLhfhwF4.md) allows you to stay alert in the event that an individual’s level of political exposure increases.

Continuous monitoring settings are currently view-only. If you’d like to adjust these settings, please [contact the Persona support team](https://app.withpersona.com/dashboard/contact-us).

## Related articles

[Politically Exposed Person Report](./116MoqsoZ0B5FYkdR8Hufp.md)

[Name Match Requirements for Reports](./1FOJzuI3uMFmcDuR5zkged.md)

[Continuous monitoring for Reports](./7LRMBbxLshF7sCcLhfhwF4.md)
