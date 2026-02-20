# 

Integration Guide: Database Verification via API

## Solution overview

-   Silently orchestrates a [database verification](https://withpersona.com/product/verifications/authoritative-databases-issuing-sources) on an individual
-   Can be configured to support a variety of countries

## Pre-integration

-   [ ]  Make sure your organization is set up with the requisite transaction and workflows! Reach out to your Persona team for support with this.
-   [ ]  For each country you want to support, review the match requirements with your Persona team
-   [ ]  Think about any additional post-verification business logic you want to apply to your users in the Persona Workflow (report runs, age checks, etc)
-   [ ]  Think about if there are any situations that would warrant a manual review of the user, using [Persona Cases](https://withpersona.com/product/cases).

## Integration Steps

### 1\. Create the Transaction

-   Please ensure you’re including the `reference_id` property under the `attributes` object: this will be the value you use to identify the user’s Persona account
-   Use your Production API key to create Production transactions, and your Sandbox API key to create Sandbox transactions

#### Transaction fields

Whether or not these fields are required will depend on your configuration of required and non-required inputs for each country.

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| name\_first | String | true | First Name |
| name\_last | String | true | Last name |
| name\_middle | String | false | Middle name. May be used in reports, but not the database verification itself. |
| birthdate | Date | true | Birthdate, in the format of `YYYY-MM-DD` |
| address\_street\_1 | String | true | Address street 1 |
| address\_street\_2 | String | false | Address street 2 |
| address\_city | String | true | Address city |
| address\_postal\_code | String | true | Address postal code |
| address\_subdivision | String | true | Address subdivision (state). Abides by [ISO 3166-2 standards](https://en.wikipedia.org/wiki/ISO_3166-2). |
| address\_country\_code | String | true | 2-letter country code. See Persona’s list of supported countries [in your dashboard](https://app.withpersona.com/dashboard/resources/coverage-map/database). |
| tax\_identification\_number | String | true | Tax Identification Number (e.g SSN) |
| document\_number | String | false | Additional document number used for certain countries’ data sources (e.g AU) |
| email\_address | String | false | Email address |
| phone\_number | String | false | Phone number |
| debug | String | false | For Sandbox verifications only: set as `passed` to pass the verification or `failed` to force-fail the verification. By default, the verification will pass. |

#### Sample cURL command

```curl
curl -X POST https://api.withpersona.com/api/v1/transactions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <API KEY>" \
-d '{
  "data": {
    "attributes": {
      "transaction_type_id": "<your transaction ID>",
      "reference_id": "<your internal identifier for the user>",
      "fields": {
        "name_first": "Persona",
        "name_middle": "",
        "name_last": "Test",
        "birthdate": "2000-01-01",
        "address_street_1": "201 Post St",
        "address_street_2": "",
        "address_city": "San+Francisco",
        "address_subdivision": "CA",
        "address_postal_code": "94108",
        "address_country_code": "US",
        "email_address": "personatest@withpersona.com",
        "phone_number": "4058675309",
        "document_number": "",
        "debug": "passed",
        "tax_identification_number":"123"
      }
    }
  }
}'
```

### 2\. Listen for the Transaction status

Listen to the `transaction.status-updated` webhook ([docs](./webhooks.md)) to fetch the information verified and to know how to proceed with the user.

#### Transaction statuses

To view and edit these statuses, click “… > Custom Statuses” on your transaction type’s page

| Status name | Description |
| --- | --- |
| `created` | Transaction has been created. |
| `approved` | Transaction has been approved: you can proceed with the user. |
| `declined` | Transaction has been declined: verification unsuccessful or user otherwise declined. |
| `needs_review` | Transaction is awaiting manual review. |
| `errored` | Transaction has errored. |

---

## Fallback inquiry orchestration

If your transaction flow includes a fallback to a Persona UI inquiry (most commonly Government ID and Selfie), you’ll have the following additional fields and statuses.

### Additional fields

| Field | Type | Description |
| --- | --- | --- |
| `fallback_inquiry_id` | String | Persona will create and populate this field with the inquiry ID for you to surface to your user. |

### Additional statuses

| Status name | Description |
| --- | --- |
| `pending_fallback_inquiry` | The transaction will reach this status if a fallback inquiry has been created. On receipt of this status update, you will know that `fallback_inquiry_id` has been populated and your next action will be to surface that inquiry. |
