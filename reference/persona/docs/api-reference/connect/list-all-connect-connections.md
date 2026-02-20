# List all Connections

[API Reference](../accounts/list-all-accounts.md)[Connect](./list-all-connect-connections.md)

# List all Connections

GET

https://api.withpersona.com/api/v1/connect/connections

```
{
  "data": [
    {
      "type": "connect/connection",
      "id": "cxn_ABC123",
      "attributes": {
        "token": "cxn_ABC123",
        "status": "active",
        "organization-id": "org_ABC123",
        "destination-organization-id": "org_XYZ789",
        "scopes": [
          "inquiry.read",
          "account.read"
        ],
        "creator-id": "api_ABC123",
        "creator-type": "api-key",
        "created-at": "2018-06-01T00:00:00.000Z",
        "updated-at": "2018-06-01T00:00:00.000Z"
      }
    },
    {
      "type": "connect/connection",
      "id": "cxn_DEF456",
      "attributes": {
        "token": "cxn_DEF456",
        "status": "inactive",
        "organization-id": "org_ABC123",
        "destination-organization-id": "org_ZYX987",
        "scopes": [
          "inquiry.read"
        ],
        "creator-id": "usr_DEF456",
        "creator-type": "user",
        "created-at": "2018-05-15T00:00:00.000Z",
        "updated-at": "2018-05-20T00:00:00.000Z"
      }
    }
  ],
  "links": {
    "prev": "/api/v1/connect/connections?page%5Bafter%5D=cxn_ABC123",
    "next": "/api/v1/connect/connections?page%5Bafter%5D=cxn_DEF456"
  }
}
```
