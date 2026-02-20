# Why does a Database Verification fail?

## Overview[](#overview)

A [Database Verification](./7dcdaIsMttmPUZ2ZelRbZD.md) can fail for several reasons. This guide covers common causes, and steps you can take to mitigate these causes.

## Common causes[](#common-causes)

Here are common reasons a Database Verification may fail:

-   **User's input differs from what's in a known database**: There are many legitimate reasons why what a user enters may not match what's in a known database. For example, they may make typos, or put in a nickname instead of their legal first name. Or, they might have several last names, and only enter part of it. Additionally the optional address autocomplete feature may provide partially incorrect, out of date, and/or omit address sub fields with the end user accepting the autocomplete as accurate without double checking.
-   **End users who are "thin-file"**: If your end user is "thin-file," they may not appear in a known database, and thus may fail a Database Verification. Thin-file means that the individual has a thin credit history or small to no financial footprint, and most Database Verifications run off of credit headers that are based on credit history. For a thin-file user, you're likely to see many "Missing" match results in their Database Verification. Learn more about how to understand match results [here](./7Lh9MkK1DUczNlAe4EB6oW.md).
-   **Identity database record is out of date**: The record in a known database may sometimes be out of date. For example, if an individual moves, there may be lag time between when they move and when their new address is picked up.

## Adjustments you can make[](#adjustments-you-can-make)

### Database Verification settings[](#database-verification-settings)

Persona lets you define how closely you want the user's information to match a record in a known database.

You can configure [settings](./6BFKQvaUZOtRSsXUJp2xu9.md) that include which fields (like first name, last name, birthdate, etc.) to require, and how exactly those fields must match a record in a known database, using a set of rules called [match requirements](./6BFKQvaUZOtRSsXUJp2xu9.md).

Persona offers strong defaults for each field, but these settings can be adjusted. In general, the more fields required, and the more exact the match requirements, the more likely you are to see Database Verification failures

To disable the Address Autocomplete option, go to the 'Database collect' screen. Select Edit, and select the Address component. In the properties to the right, set Autocomplete Method to "None".

### Using Reports[](#using-reports)

[Reports](./hI9YUPxjW7v46pFfyk6J1.md) give you additional information about your end users, and can help you better understand thin-file users.

A Database Verification returns what the user submits, and whether that information matches a known database. A Report gives you information in addition to what a user submits.

Reports can improve your understanding of thin-file users, because they pull from a wider range of data. Reports pull information from authoritative data sources that include credentials, attestations, records, logs, investigations, and analyses.
