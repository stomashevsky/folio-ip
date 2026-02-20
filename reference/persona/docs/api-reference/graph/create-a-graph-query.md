# Create a Graph Query

[API Reference](../accounts/list-all-accounts.md)[Graph](./create-a-graph-query.md)

# Create a Graph Query

POST

https://api.withpersona.com/api/v1/graph-queries

```
{
  "data": {
    "type": "graph-query",
    "id": "grphq_prM3gdSL6ciwGjSjj4aXgKJT",
    "attributes": {
      "status": "submitted",
      "params": {
        "<query-key>": "<query params>"
      },
      "created-at": "2023-09-1T06:30:44.000Z",
      "stats": {},
      "explorer-url": "https://withpersona.com/dashboard/explorer?queryId=grphq_prM3gdSL6ciwGjSjj4aXgKJT",
      "node-limit-reached": false,
      "nodes": []
    }
  }
}
```
