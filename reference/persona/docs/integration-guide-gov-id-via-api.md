# 

Integration Guide: Government ID Verification via API

#### Enterprise support

This feature is restricted to customers on the Enterprise plan. Please reach out to your Account Team or [contact us](https://app.withpersona.com/dashboard/contact-us) if you are interested in enabling and setting up this feature.

## Solution overview

-   Silently orchestrates a [Government ID verification](https://withpersona.com/blog/what-is-government-id-verification) on an individual

## Pre-integration

-   [ ]  Ensure you have the proper consent language in place to be able to support Government ID via API verification
-   [ ]  Make sure your organization is set up with the requisite transaction and workflows!
-   [ ]  Review the verification requirements
-   [ ]  Think about any additional post-verification business logic you want to apply to your users in the Persona Workflow (report runs, age checks, etc)
-   [ ]  Think about if there are any situations that would warrant a manual review of the user, using [Persona Cases](https://withpersona.com/product/cases).

Reach out to your Persona team if you have questions related to any of these items!

## Integration Steps

### 1\. Create the Transaction

-   Please ensure you’re including the `reference_id` property under the `attributes` object: this will be the value you use to identify the user’s Persona account
-   Use your Production API key to create Production transactions, and your Sandbox API key to create Sandbox transactions

#### Transaction fields

The minimum set of fields required for the verification is: `id_front_photo`, `id_class`, `address_country_code`, and `transaction_type`.

Whether or not additional fields are required will depend on your checks configuration. For example, if you’re requiring the **Inquiry Comparison** check, you will want to prefill the inquiry with the user’s information, so Persona can verify that it matches what’s on the ID.

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| name\_first | String | false | First Name |
| name\_last | String | false | Last name |
| name\_middle | String | false | Middle name |
| birthdate | Date | false | Birthdate, in the format of `YYYY-MM-DD` |
| address\_street\_1 | String | false | Address street 1 |
| address\_street\_2 | String | false | Address street 2 |
| address\_city | String | false | Address city |
| address\_postal\_code | String | false | Address postal code |
| address\_subdivision | String | false | Address subdivision (state). Abides by [ISO 3166-2 standards](https://en.wikipedia.org/wiki/ISO_3166-2). |
| address\_country\_code | String | **true** | 2-letter country code. See Persona’s list of supported countries [in your dashboard](https://app.withpersona.com/dashboard/resources/coverage-map/database). |
| id\_class | String | **true** | Map the ID type to the Persona Identifier ([docs](./api-reference/verifications/government-id-verifications.md)) |
| id\_front\_photo | File | **true** | The front photo of the ID |
| id\_back\_photo | File | false | The back photo of the ID— only required if your verification configuration requires it |
| phone\_number | String | false | Phone number |
| email\_address | String | false | Email address |
| transaction\_type | String | **true** | ID referencing a [Transaction type](./transaction-types.md). |
| debug | String | false | For Sandbox verifications only: set as `passed` to pass the verification or `failed` to force-fail the verification. By default, the verification will pass. |

#### Sample cURL commands

Because your request will contain files we recommend using a `multipart/form-data` style of request over `application/json`, though we have provided both as examples.

We’ve omitted some of the optional fields here for simplicity.

```
curl -X POST https://api.withpersona.com/api/v1/transactions \
-H 'Authorization: Bearer <api_token>' \
--form 'data[attributes][transaction_type_id]=<your transaction id>' \
--form 'data[attributes][reference_id]=<your internal identifier for the user>' \
--form 'data[attributes][fields][name_first]=Persona' \
--form 'data[attributes][fields][name_last]=Test' \
--form 'data[attributes][fields][birthdate]=1990-01-01' \
--form 'data[attributes][fields][id_class]=dl' \
--form 'data[attributes][fields][address_country_code]=US' \
--form 'data[attributes][fields][id_front_photo]=@path-to-front-file.png' \
--form 'data[attributes][fields][id_back_photo]=@path-to-back-file.png' \
--form 'data[attributes][fields][debug]=passed'
```

### 2\. Listen for the Transaction status

We recommend listening to the `transaction.status-updated` webhook ([docs](./webhooks.md)) to know when to proceed. You can alternatively make an API call to fetch the transaction ([docs](./api-reference/transactions/retrieve-a-transaction.md)).

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

If your transaction flow includes a fallback to a Persona UI inquiry, you’ll utilize the following additional fields and statuses.

### Additional fields

| Field | Type | Description |
| --- | --- | --- |
| `fallback_inquiry_id` | String | Persona will create and populate this field with the inquiry ID for you to surface to your user. |

### Additional statuses

| Status name | Description |
| --- | --- |
| `pending_fallback_inquiry` | The transaction will reach this status if a fallback inquiry has been created. On receipt of this status update, you will know that `fallback_inquiry_id` has been populated and your next action will be to surface that inquiry. |
