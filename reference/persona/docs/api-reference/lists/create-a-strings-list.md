# Create a Strings List

POST

https://api.withpersona.com/api/v1/list/strings

Example RequestCreated

POST

/api/v1/list/strings

cURL

```
curl -X POST https://api.withpersona.com/api/v1/list/strings \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
  "data": {
    "attributes": {
      "name": "My New List"
    }
  }
}'
```

Try it

```
{
  "data": {
    "type": "list/string",
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
    }
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

A Strings List object

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
