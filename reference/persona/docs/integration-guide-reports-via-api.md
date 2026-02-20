# 

Integration Guide: Reports via API

## Solution overview

-   Silently orchestrates Persona’s Watchlist and Politically Exposed Persons reports on an individual

## Pre-integration

-   [ ]  Make sure your organization is set up with the requisite transaction and workflows
-   [ ]  Start familiarizing yourself with the configurations for each report

Reach out to your Persona team for assistance on any of these items!

## Integration Steps

### 1\. Create the Transaction

-   Please ensure you’re including the `reference_id` property under the `attributes` object: this will be the value you use to identify the user’s Persona account
-   Use your Production API key to create Production transactions, and your Sandbox API key to create Sandbox transactions

#### Transaction fields

Below we’ve outlined all of the fields that can be used as inputs to the reports. Your transaction may come with additional fields that you can use to pass through information to view in Persona.

While the only truly required field is either of the `name_` fields, we recommend passing in as much information as you have on the user, which will help cut down on false positives.

| Field | Type | Description |
| --- | --- | --- |
| name\_first | String | First Name |
| name\_last | String | Last name |
| name\_middle | String | Middle name |
| birthdate | Date | Birthdate, in the format of `YYYY-MM-DD` |
| address\_country\_code | String | 2-letter country code, using the ISO 3166 standard |

#### Sample cURL command

```json
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
        "name_last": "Test",
        "birthdate": "1990-01-01",
        "address_country_code": "US"
      }
    }
  }
}'
```

Visit [this Persona Help Center article](https://help.withpersona.com/articles/56sLAbSytkmI57zpbug3xc/) for sample terms that will trigger reports hits in Sandbox.

### 2\. Listen for the Transaction status

We recommend listening to the `transaction.status-updated` webhook ([docs](./webhooks.md)) to know when to proceed. You can alternatively make an API call to fetch the transaction ([docs](./api-reference/transactions/retrieve-a-transaction.md)).

#### Transaction statuses

To view and edit these statuses, click “… > Custom Statuses” on your transaction type’s page

| Status name | Description |
| --- | --- |
| `created` | Transaction has been created. |
| `approved` | Transaction has been approved: you can proceed with the user. |
| `declined` | Transaction has been declined: verification unsuccessful or user otherwise declined. |
| `needs_review` | Transaction is awaiting manual review (there was a report hit) |
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
