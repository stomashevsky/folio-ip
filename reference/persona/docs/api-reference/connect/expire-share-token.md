# Expire a Share Token

[API Reference](../accounts/list-all-accounts.md)[Connect](./list-all-connect-connections.md)

# Expire a Share Token

POST

https://api.withpersona.com/api/v1/connect/share-tokens/:share-token-id/expire

```
{
  "data": {
    "type": "connect/share-token",
    "id": "cnst_ABC123",
    "attributes": {
      "status": "created",
      "source-id": "act_DEF456",
      "created-at": "2023-08-17T23:18:13.000Z",
      "updated-at": "2023-08-17T23:18:13.000Z",
      "expires-at": "2023-08-18T23:18:13.000Z"
    }
  }
}
```
