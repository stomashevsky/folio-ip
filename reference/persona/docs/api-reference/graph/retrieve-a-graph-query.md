# Retrieve a Graph Query

[API Reference](../accounts/list-all-accounts.md)[Graph](./create-a-graph-query.md)

# Retrieve a Graph Query

GET

https://api.withpersona.com/api/v1/graph-queries/:graph-query-id

```
{
  "data": {
    "type": "graph-query",
    "id": "grphq_prM3gdSL6ciwGjSjj4aXgKJT",
    "attributes": {
      "status": "completed",
      "params": {
        "<query-key>": "<query params>"
      },
      "created-at": "2023-09-1T06:30:44.000Z",
      "updated-at": "2023-09-2T07:31:47.000Z",
      "completed-at": "2023-09-4T09:33:03.000Z",
      "stats": {},
      "explorer-url": "https://withpersona.com/dashboard/explorer?queryId=grphq_prM3gdSL6ciwGjSjj4aXgKJT",
      "node-limit-reached": false,
      "nodes": []
    }
  }
}
```
