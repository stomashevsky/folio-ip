# List all Reports

GET

https://api.withpersona.com/api/v1/reports

```
{
  "data": [
    {
      "type": "report/address-lookup",
      "attributes": {
        "completed-at": "2019-12-19T21:42:49.000Z",
        "created-at": "2019-12-19T21:42:49.000Z",
        "status": "ready"
      },
      "id": "rep_YcNZJLxuwEuV8jUPbykYQyXG"
    },
    {
      "type": "report/adverse-media",
      "attributes": {
        "completed-at": "2019-12-18T22:43:03.000Z",
        "created-at": "2019-12-18T22:43:03.000Z"
      },
      "id": "rep_2wM8yufwLrbMV6kUtGPBxeGS"
    },
    {
      "type": "report/email-address",
      "attributes": {
        "completed-at": "2019-12-13T08:34:10.000Z",
        "created-at": "2019-12-13T08:34:10.000Z"
      },
      "id": "rep_LatvE1PdVhfiwcJWVLj4Z25j"
    },
    {
      "type": "report/phone-number",
      "attributes": {
        "completed-at": "2019-12-13T08:33:29.000Z",
        "created-at": "2019-12-13T08:32:49.000Z"
      },
      "id": "rep_RU3JgzXaAzVV2g2NYLd7ub12"
    },
    {
      "type": "report/watchlist",
      "attributes": {
        "completed-at": "2019-11-19T00:10:27.000Z",
        "created-at": "2019-11-19T00:10:27.000Z"
      },
      "id": "rep_6LRELcKmPcx9MxYGk6mdCPJo"
    }
  ],
  "links": {
    "prev": "string",
    "next": "/api/v1/reports?page%5Bafter%5D=rep_u2Dgz8U3CmxTVgqEH9qzezHi"
  }
}
```
