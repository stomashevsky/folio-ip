# List all Inquiry Sessions

[API Reference](../accounts/list-all-accounts.md)[Inquiry Sessions](./list-all-inquiry-sessions.md)

# List all Inquiry Sessions

GET

https://api.withpersona.com/api/v1/inquiry-sessions

GET

/api/v1/inquiry-sessions

cURL

```
curl https://api.withpersona.com/api/v1/inquiry-sessions \
     -H "Authorization: Bearer <token>"
```

Try it

200Success

```
{
  "data": [
    {
      "id": "iqse_ABC123",
      "attributes": {
        "status": "expired",
        "created-at": "2023-07-25T04:15:20.000Z",
        "started-at": "2023-07-25T05:14:50.000Z",
        "expired-at": "2023-07-26T05:14:50.000Z",
        "ip-address": "127.0.0.1",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "os-name": "Mac",
        "os-full-version": "10.15.7",
        "device-type": "desktop",
        "browser-name": "Chrome",
        "browser-full-version": "115.0.0.0",
        "is-proxy": false,
        "is-tor": false,
        "is-datacenter": false,
        "is-vpn": false,
        "threat-level": "low",
        "country-code": "US",
        "country-name": "United States",
        "region-code": "CA",
        "region-name": "California",
        "latitude": 37.7688,
        "longitude": -122.262
      },
      "relationships": {
        "inquiry": {
          "data": {
            "type": "inquiry",
            "id": "inq_ABC123"
          }
        },
        "device": {
          "data": {
            "type": "device",
            "id": "dev_ABC123"
          }
        }
      },
      "type": "inquiry-session"
    }
  ],
  "links": {
    "prev": "/api/v1/inquiry-sessions?page%5Bbefore%5D=iqse_ABC123",
    "next": "/api/v1/inquiry-sessions?page%5Bafter%5D=iqse_ABC123"
  }
}
```

Retrieves a list of Inquiry Sessions. Results are returned in reverse chronological order, with the most recently created objects first.

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

filterobjectOptional

### Response

This endpoint returns a collection of Inquiry Session objects.

datalist of objects

linksobject

includedlist of objects or null

Objects that _may_ be returned if specified via the `include` query parameter in the request.

### Errors

400

Bad Request Error

401

Unauthorized Error

403

Forbidden Error

429

Too Many Requests Error
