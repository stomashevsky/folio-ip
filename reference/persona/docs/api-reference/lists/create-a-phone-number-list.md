# Create a Phone Number List

POST

https://api.withpersona.com/api/v1/list/phone-numbers

Example RequestCreated

POST

/api/v1/list/phone-numbers

Python

```
import requests

url = "https://api.withpersona.com/api/v1/list/phone-numbers"

payload = { "data": { "attributes": { "name": "My New List" } } }
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
    "id": "lst_kRcKDJ4c8wF2AmAghggtYxboX",
    "attributes": {
      "name": "My New List",
      "status": "active",
      "created-at": "2023-08-30T20:22:07.000Z",
      "updated-at": "2023-08-30T20:22:07.000Z"
    },
    "relationships": {
      "list-items": {
        "data": []
      }
    },
    "type": "list/phone-number"
  }
}
```

Create a new list for your organization.

### Authentication

AuthorizationBearer

Bearer authentication of the form `Bearer <token>`, where token is your auth token.

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

dataobjectOptional

### Response

This endpoint returns the created List object.

dataobject

A Phone Number List object

### Errors

400

Bad Request Error

401

Unauthorized Error

403

Forbidden Error

409

Conflict Error

422

Unprocessable Entity Error

429

Too Many Requests Error
