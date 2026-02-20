# List all Share Tokens

[API Reference](../accounts/list-all-accounts.md)[Connect](./list-all-connect-connections.md)

# List all Share Tokens

GET

https://api.withpersona.com/api/v1/connect/share-tokens

```
{
  "data": [
    {
      "type": "connect/share-token",
      "id": "cnst_ABC123",
      "attributes": {
        "status": "created",
        "source-id": "act_DEF456",
        "created-at": "2023-08-17T23:18:13.000Z",
        "updated-at": "2023-08-17T23:18:13.000Z",
        "expires-at": "2023-08-18T23:18:13.000Z"
      }
    },
    {
      "type": "connect/share-token",
      "id": "cnst_GHI789",
      "attributes": {
        "status": "redeemed",
        "source-id": "inq_GHI789",
        "created-at": "2023-08-17T22:15:00.000Z",
        "updated-at": "2023-08-17T22:20:30.000Z",
        "pending-at": "2023-08-17T22:16:0.000Z",
        "redeemed-at": "2023-08-17T22:20:30.000Z"
      }
    }
  ],
  "links": {
    "next": "/api/v1/connect/share-tokens?page%5Bafter%5D=cnst_GHI789",
    "prev": "string"
  }
}
```
