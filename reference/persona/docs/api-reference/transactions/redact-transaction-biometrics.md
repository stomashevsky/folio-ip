# Redact Transaction biometrics

[API Reference](../accounts/list-all-accounts.md)[Transactions](../transactions.md)

# Redact Transaction biometrics

POST

https://api.withpersona.com/api/v1/transactions/:transaction-id/redact-biometrics

```
{
  "data": {
    "id": "txn_26wUfNNK6Ze7qkwyK6kuj7RkZgdP",
    "attributes": {
      "status": "created",
      "fields": {
        "front-photo": {
          "type": "file",
          "value": null
        },
        "back-photo": {
          "type": "file",
          "value": null
        },
        "country-code": {
          "type": "string",
          "value": null
        },
        "selected-id-class": {
          "type": "string",
          "value": null
        },
        "center-photo": {
          "type": "file",
          "value": null
        },
        "selfie-compare-photo": {
          "type": "file",
          "value": null
        }
      },
      "tags": [],
      "created-at": "2021-09-29T18:00:00Z",
      "updated-at": "2021-09-29T18:00:00Z"
    },
    "relationships": {
      "transaction-type": {
        "data": {
          "type": "transaction-type",
          "id": "txntp_N1687FCwgERcW3M88M5U4mAt"
        }
      },
      "related-objects": {
        "data": []
      }
    },
    "type": "transaction"
  }
}
```
