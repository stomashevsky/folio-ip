# List all Transactions

[API Reference](../accounts/list-all-accounts.md)[Transactions](../transactions.md)

# List all Transactions

GET

https://api.withpersona.com/api/v1/transactions

```
{
  "data": [
    {
      "id": "txn_ABC123",
      "attributes": {
        "status": "declined",
        "fields": {
          "country": {
            "type": "string",
            "value": "US"
          },
          "name-first": {
            "type": "string",
            "value": "LeBron"
          },
          "name-last": {
            "type": "string",
            "value": "James"
          },
          "selected-id-class": {
            "type": "string",
            "value": "dl"
          },
          "front-photo": {
            "type": "file",
            "value": {
              "filename": "image.png",
              "byte-size": 237011,
              "mime-type": "image/png",
              "url": "https://files.withpersona.com/image.png?access_token=ACCESS_ABC123"
            }
          },
          "back-photo": {
            "type": "file",
            "value": {
              "filename": "image.png",
              "byte-size": 237011,
              "mime-type": "image/png",
              "url": "https://files.withpersona.com/image.png?access_token=ACCESS_ABC123"
            }
          }
        },
        "tags": [],
        "created-at": "2023-05-26T16:49:33.860Z",
        "updated-at": "2023-05-26T16:49:43.965Z"
      },
      "relationships": {
        "reviewer": {
          "data": {
            "type": "workflow-run",
            "id": "wfr_ABC123"
          }
        },
        "transaction-label": {},
        "transaction-type": {
          "data": {
            "type": "transaction-type",
            "id": "txntp_ABC123"
          }
        },
        "related-objects": {
          "data": [
            {
              "type": "account",
              "id": "act_ABC123"
            },
            {
              "type": "verification/government-id",
              "id": "ver_ABC123"
            }
          ]
        }
      },
      "type": "transaction"
    }
  ],
  "links": {
    "prev": "/api/v1/transactions?page%before%5D=txn_ABC123",
    "next": "/api/v1/transactions?page%5Bafter%5D=txn_ABC123"
  }
}
```
