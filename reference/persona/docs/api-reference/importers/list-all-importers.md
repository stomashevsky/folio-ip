# List all Importers

[API Reference](../accounts/list-all-accounts.md)[Importers](./list-all-importers.md)

# List all Importers

GET

https://api.withpersona.com/api/v1/importers

```
{
  "data": [
    {
      "type": "importer/account",
      "attributes": {
        "created-at": "2020-07-12T17:16:54.656Z",
        "duplicate-count": 0,
        "error-count": 0,
        "status": "pending",
        "successful-count": 0
      },
      "id": "mprt_TKqquVbHaSVYqgWhxNjuYDjQ"
    },
    {
      "type": "importer/list-item/name",
      "attributes": {
        "completed-at": "2020-07-14T17:17:23.032Z",
        "created-at": "2020-07-12T17:16:54.656Z",
        "duplicate-count": 3,
        "error-count": 0,
        "status": "ready",
        "successful-count": 104
      },
      "id": "mprt_N6PqYkfSqeqiQYWoeHA3GGDo"
    }
  ],
  "links": {
    "prev": "/api/v1/events?page%5Bbefore%5D=mprt_ABC123",
    "next": "/api/v1/events?page%5Bafter%5D=mprt_ABC123"
  }
}
```
