# Retrieve an Event

[API Reference](../accounts/list-all-accounts.md)[Events](./list-all-events.md)

# Retrieve an Event

GET

https://api.withpersona.com/api/v1/events/:event-id

```
{
  "data": {
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
  }
}
```
