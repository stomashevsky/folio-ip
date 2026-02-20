# List all Events

[API Reference](../accounts/list-all-accounts.md)[Events](./list-all-events.md)

# List all Events

GET

https://api.withpersona.com/api/v1/events

```
{
  "data": [
    {
      "id": "evt_ABC123",
      "attributes": {
        "name": "inquiry.expired",
        "payload": {
          "data": {
            "type": "inquiry",
            "id": "inq_ABC123",
            "attributes": {}
          }
        },
        "created-at": "2023-09-23T17:14:01.918Z"
      },
      "type": "event"
    },
    {
      "id": "evt_ABC123",
      "attributes": {
        "name": "account.tag-added",
        "payload": {
          "data": {
            "type": "account",
            "id": "act_ABC123",
            "attributes": {}
          }
        },
        "created-at": "2023-09-23T00:46:41.877Z"
      },
      "type": "event"
    }
  ],
  "links": {
    "prev": "/api/v1/events?page%5Bbefore%5D=evt_ABC123",
    "next": "/api/v1/events?page%5Bafter%5D=evt_ABC123"
  }
}
```
