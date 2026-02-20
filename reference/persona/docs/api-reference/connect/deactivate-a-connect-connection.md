# Deactivate a Connect Connection

[API Reference](../accounts/list-all-accounts.md)[Connect](./list-all-connect-connections.md)

# Deactivate a Connect Connection

POST

https://api.withpersona.com/api/v1/connect/connections/:connection-id/deactivate

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
