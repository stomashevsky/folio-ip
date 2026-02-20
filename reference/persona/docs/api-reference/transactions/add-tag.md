# Add tag to Transaction

[API Reference](../accounts/list-all-accounts.md)[Transactions](../transactions.md)

# Add tag to Transaction

POST

https://api.withpersona.com/api/v1/transactions/:transaction-id/add-tag

ExampleSuccess

POST

/api/v1/transactions/:transaction-id/add-tag

Python

```
import requests

url = "https://api.withpersona.com/api/v1/transactions/transaction-id/add-tag"

payload = { "meta": { "tag-name": "new tag" } }
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.json())
```

Try it

```
{
  "data": {
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
}
```

Adds a tag to a Transaction. Create a new tag if the tag does not already exist. No effect if the transaction already has the tag.

### Authentication

AuthorizationBearer

Bearer authentication of the form `Bearer <token>`, where token is your auth token.

### Path parameters

transaction-idstringRequired

ID of the transaction to add tag on.

### Headers

Key-InflectionenumOptional

Determines casing for the API response.

Allowed values:camelkebabsnake

Idempotency-KeystringOptional

Ensures the request is idempotent.

Persona-VersionenumOptional

Server API version. More info on versioning can be found [here](../../versioning.md).

### Query parameters

includestringOptional

A comma-separated list of relationship paths. This can be used to customize which related resources will be fully serialized in the `included` key in the response. See [Serialization](../../serialization.md#inclusion-of-related-resources) for more details.

fieldsmap from strings to stringsOptional

Comma-separated list(s) of attributes to include in the response. This can be used to customize which attributes will be serialized in the response. See [Serialization](../../serialization.md#sparse-fieldsets) for more details.

### Request

This endpoint expects an object.

metaobjectOptional

### Response

This endpoint returns a Transaction object and (optionally) its related objects in `included`.

dataobject

### Errors

400

Bad Request Error

401

Unauthorized Error

403

Forbidden Error

404

Not Found Error

409

Conflict Error

422

Unprocessable Entity Error

429

Too Many Requests Error
