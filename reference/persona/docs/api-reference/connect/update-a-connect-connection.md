# Update a Connect Connection

[API Reference](../accounts/list-all-accounts.md)[Connect](./list-all-connect-connections.md)

# Update a Connect Connection

PATCH

https://api.withpersona.com/api/v1/connect/connections/:connection-id

UpdateSuccess

PATCH

/api/v1/connect/connections/:connection-id

Python

```
import requests

url = "https://api.withpersona.com/api/v1/connect/connections/cxn_ABC123"

payload = { "data": { "attributes": { "scopes": ["account.read"] } } }
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.patch(url, json=payload, headers=headers)

print(response.json())
```

Try it

```
{
  "data": {
    "type": "connect/connection",
    "id": "cxn_ABC123",
    "attributes": {
      "token": "cxn_ABC123",
      "status": "active",
      "organization-id": "org_ABC123",
      "destination-organization-id": "org_DEF456",
      "scopes": [
        "inquiry.read",
        "account.read"
      ],
      "creator-id": "api_ABC123",
      "creator-type": "api-key",
      "created-at": "2018-06-01T00:00:00.000Z",
      "updated-at": "2018-06-01T00:00:00.000Z"
    }
  }
}
```

Updates an existing Connect Connection.

### Authentication

AuthorizationBearer

Bearer authentication of the form `Bearer <token>`, where token is your auth token.

### Path parameters

connection-idstringRequired

Token of the connect connection

### Headers

Key-InflectionenumOptional

Determines casing for the API response.

Allowed values:camelkebabsnake

Idempotency-KeystringOptional

Ensures the request is idempotent.

Persona-VersionenumOptional

Server API version. More info on versioning can be found [here](../../versioning.md).

### Query parameters

fieldsmap from strings to stringsOptional

Comma-separated list(s) of attributes to include in the response. This can be used to customize which attributes will be serialized in the response. See [Serialization](../../serialization.md#sparse-fieldsets) for more details.

### Request

This endpoint expects an object.

dataobjectOptional

### Response

This endpoint returns a Connect Connection.

dataobject

A Connect Connection object. This object represents a connection between organizations for sharing access to Persona objects.

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
