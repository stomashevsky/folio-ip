# 

Integration Guide: Understanding a Persona API payload

Persona’s API responses are designed to be comprehensive and consistent. They are inspired by the JSON:API specification, following a normalized structure that separates primary data from related objects.

This guide walks you through the anatomy of a typical Persona API payload. The exact payload schema for any object can be found in its API reference.

## Top-Level Structure

Every Persona API payload has the same outermost shape:

```json
{
  "data": { ... },
  "included": [ ... ]
}
```

-   `data`: Contains the **primary resource** requested (e.g., an Inquiry, Case, Transaction, etc.)
-   `included`: Contains a list of fully-expanded **related resources** (e.g an Inquiry’s related Verifications, Account, and/or Case)

---

## Data

The `data` object is the focal point of the payload. It represents the main resource returned by the API call and follows the following schema:

```json
{
  "type": "inquiry | case | transaction | account | verification/{verification-type} | report/{report-type}",
  "id": "inq_aaa | case_bbb | txn_ccc | acct_ddd | ver_eee | rep_fff ",
  "attributes": { ... },
  "relationships": { ... }
}
```

**`type`:** A string defining the type of resource. Verification and Report types also specify the sub-type: for example: `verification/government-id` and `report/watchlist`

**`id`:** Persona’s globally unique identifier for the resource.

### Attributes

All resource-specific information lives in the `attributes` object. This section contains the primary data that describes the object—things like timestamps, status, names, and other core metadata that are **not** relationships or system-generated identifiers.

While the exact set of attributes varies by resource type (e.g., `inquiry` vs. `transaction`), many resources share a **common base set** of properties for consistency.

#### Shared attributes, common among most resources

-   `created-at`: ISO 8601 timestamp when the resource was created.
-   `updated-at`, `completed-at`, or `submitted-at`: Depending on the object type, these indicate state transitions.
-   `tags`: An array of custom string labels applied to the object.
-   `reference-id`: A custom identifier provided by your system to map the resource to your internal records (supported on `inquiries`, `transactions`, and `accounts`).

#### Examples of resource-specific attributes

-   `status` indicates state specific to that resource (e.g., `"approved"`, `"ready"`, `"needs-review"`). Each resource uses its own set of statuses.
-   `files` and `photo-urls` arrays will contain download links to the files processed for `verifications` or `documents` resources
-   `checks` on verifications will detail exactly why the verification passed or failed
-   `result` and `run-history` are attributes specific to a report run on an individual or business
-   `behaviors` contain analytics about how the user interacted with the inquiry flow

### Fields

Inquiries, Transactions, Cases, and Accounts all allow for a custom field schema to be configured on each object. Fields are strongly typed and the exact schema will vary depending on the implementation.

```json
"attributes": {
  "status": "approved",
  "created-at": "2025-05-09T16:51:28.000Z",
  "fields": {
    "name-first": {
      "type": "string",
      "value": "Alexander"
    },
    "name-last": {
      "type": "string",
      "value": "Sample"
    },
    "is-primary-account-holder": {
      "type": "boolean",
      "value": true
    },
    "birthdate": {
      "type": "date",
      "value": "1990-01-01"
    },
    "jurisdiction": {
      "type": "choices",
      "value": "EU"
    },
    "preferred-methods-of-contact": {
      "type": "multi_choices",
      "value": [
        "text",
        "email"
      ]
    }
  }
}
```

---

### Relationships

The `relationships` object defines foreign-key-style links to other Persona resources. Each object includes the object type as well as its ID. The `data` object within each relationship will be an array if there’s a 1:N association between the primary resource and the relation (e.g an inquiry can have multiple verifications). It will be a single object if there’s a 1:1 mapping (e.g an inquiry can only be associated with one account)

```json
"relationships": {
  "account": {
    "data": {
      "type": "account", "id": "act_123"
    }
  },
  "verifications": {
    "data": [
      { "type": "verification/selfie", "id": "ver_abc"},
      {"type": "verification/government-id", "id": "ver_def"}
    ]
  },
  "inquiry-template": {
    "data": {
      "type": "inquiry-template", "id": "itmpl_NZXSmP3CCkSX7EK9ub9d6hoXMQ1H"
    }
  }
}
```

These references are expanded in the `included` array, allowing you to hydrate the full resource tree without additional requests.

---

## Included

The `included` array contains full resource objects that correspond to the references in `relationships`. Each entry mirrors the structure of `data`.

By default, starting from API version 2025-10-27, the `included` array will be empty unless you explicitly request related resources using the `include` query parameter (e.g., `?include=account,verifications`). For older API versions, some related resources may be included by default. See [Response Body](./response-body.md#specify-related-resources) for more details.

```json
{
  "type": "account",
  "id": "act_123",
  "attributes": {
    "account-status": "Onboarded",
    "fields": {
	     "email-address": {
	        "type": "string",
	        "value": "[email protected]"
	     }
	     ...
    }
  },
  "relationships": {
    "account-type": {
      "data": { "type": "account-type", "id": "acttp_456" }
    }
  }
}
```

---

### Verifications

#### Attributes

Verification attributes contain all of the information that was extracted and processed within the verification, along with a `status` attribute of `passed`, `failed`, or `canceled`. Most implementations involving an inquiry template will copy the fields from the last passing verification object to its inquiry fields for ease of access.

#### Files

The files submitted will be contained in the `photo-urls` array of each verification. You can download the file by making a GET request to the URL provided. For payloads containing multiple verification attempts, make sure you’re fetching the files from a verification with a `passed` status.

```json
{
  "data": {...},
  "included": [
    {
      "type": "verification/government-id",
      "attributes": {
        "status": "passed",
        "id-class": "pp",
        "name-first": "Alexander",
        "name-last": "Sample",
        "expiration-date": "2031-01-01",
        "identification-number": "12345",
        "checks": [...], 
        "photo-urls": [
          {
            "page": "front",  // front of ID
            "url": "https://files.withpersona.com/dl-front.jpg?access-token=abc",
            "normalized-url": "https://files.withpersona.com/dl-front.jpg?access-token=def",
            "original-urls": [
              "https://files.withpersona.com/dl-front.heic?access-token=..."
            ],
            "byte-size": 196256
          },
          {
            "page": "back",  // back of ID, if collected
            ...
          }
        ],
        "selfie-photo": { // The portrait on the ID
          "url": "https://files.withpersona.com/selfie_photo.jpg?access-token=fhi",
          ...
        }
      }
    }
  ]
}
```

#### Checks

All verification resources will have a `checks` array, detailing the results of each individual verification check.

```json
"checks": [
  {
    "name": "document_expired_detection",
    "status": "passed | failed | not_applicable",
    "requirement": "required | not_required",
    "reasons": [],
    "metadata": {}
  }
]
```

### Reports

Look at the top level `has-match` attribute to get the current match status of the report. For reports with continuous monitoring enabled, timestamps for all previous runs, as well as the next scheduled run, will be included in the report’s `run-history`. Any current matched results will show up in the `results` array.

```json
  "attributes": {
    "status": "ready",
    "created-at": "2025-06-10T03:30:13.000Z",
    "completed-at": "2025-06-10T03:30:13.000Z",
    "redacted-at": null,
    "report-template-version-name": "v3",
    "has-match": true,
    "is-continuous": false,
    "is-recurring": false,
    "tags": [],
    "query": {
      "name-first": "Alexander",
      "name-middle": null,
      "name-last": "Sample",
      "term": "Alexander Sample",
      "birthdate": null,
      "country-code": null
    },
    "result": [
      // All matching results for the search term
    ],
    "run-history": [
      {
        "scheduled-at": "2025-01-05T07:58:10.000Z",
        "completed-at": "2025-01-05T07:58:10.000Z",
        "report-template-version-id": 14930,
        "type": "scheduled"
      }, ...
    ],
    "ignore-list": []
  }
```

## Webhook event payloads

A webhook payload will contain the Persona resource with the same schema as defined above within its `payload` object.

```json
{
  "data": {
    "type": "event",
    "id": "evt_PrXRyZ6sgM8nmhXiYgxRwAzRQh7n",
    "attributes": {
      "name": "inquiry.approved",
      "payload": { // The inquiry response is contained within this attribute
        "data": {
          "type": "inquiry",
          "id": "inq_xRC9NTj4FkVxgKDmHATNqxGAYXwH",
          "attributes": {...}
        },
        "included": [
          ...
        ]
      }
    }
  }
}
```

## KYC vs KYB: What top-level resource should I ingest?

For KYC, you’ll likely only need to ingest **Inquiry** or **Transaction** payloads and events. All related information like verifications and reports will be contained in the response.

For KYB, if you are using multiple inquiry templates (e.g: asking each UBO to verify themselves), you will want to ingest the **Case** payload, which will contain all account, inquiry, report, and verification information from the business _and_ the UBOs.

## Appendix

### Statuses for each resource

| Object | Possible status values |
| --- | --- |
| Inquiry | created | started | pending | completed | failed | approved | declined | expired |
| Verification | passed | failed | canceled |
| Verification check | passed | failed | not\_applicable |
| Report | pending | ready | errored |
| Case | Case statuses are customizable and will vary depending on the use case |
| Transaction | Transaction statuses are customizable and will vary depending on the use case |
| Account | Account statuses are stored in the `account-status` attribute, and will vary depending on the implementation |
