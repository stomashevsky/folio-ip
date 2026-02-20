# Running Graph Queries

## Running your first graph query

Create your first graph query by creating a POST request to the graph queries resource. You will need to specify the graph query template you want to use, along with the parameters it needs. Please refer to the [Graph Query Templates Documentation](./graph-query-templates.md) to see what you need for your specific query.

```curl
API_KEY=YOUR_API_KEY_HERE
curl -X POST -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "attributes": {
      "graph-query-template-id": YOUR_TEMPLATE_ID,
      "parameter-map": {
        "example-key": "example-value",
        "...": "...
      }
    }
  }
}' https://api.withpersona.com/api/v1/graph-queries
```

`parameter-map` should be all the parameter names defined in your graph query template and the value you want to pass in. For example, if you have a parameter `account-id` in your graph query template, it would look like:

```
{
  "account-id": "act_UqdkF248jR4yH8xxixsMhKnt"
}
```

After you submit this request to create the graph query, we’ll process it as soon as possible. The response of this request will include a graph query ID which you can use to poll for your query result.

The newly created graph query’s status starts as `submitted` initially as it is being processed.

```json
{
  "data": {
    "type: "graph-query",
    "id": "grphq_yourfirstqueryid",
    "attributes": {
       "params": {
         <Your query params>
       },
       "created-at": DATE_TIME_STRING,
       "completed-at": null,
       "status": "submitted",
	   ...
    }
  }
}
```

## Getting the results of your query

Fetch the results of your graph query using the graph query ID from the graph queries resource.

```curl
API_KEY=YOUR_API_KEY_HERE
curl -X GET -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $API_KEY" \
  https://api.withpersona.com/api/v1/graph-queries/GRAPH_QUERY_ID
```

Once the `status` is `completed`, the results are available in the response.

## Query response format

```json
{
  "data": {
    "type: "graph-query",
    "id": "grphq_yourfirstqueryid",
    "attributes": {
       "status": "completed",
       "params": {
         <Your query params>
       },
       "created-at": DATE_TIME_STRING,
       "updated-at": DATE_TIME_STRING,
       "errored-at": DATE_TIME_STRING,
       "completed-at": DATE_TIME_STRING,
       "stats": {
         num-accounts: 5,
         num-device-fingerprints: 2,
         ...
       },
       "explorer-url": LINK_TO_VISUALIZE_QUERY_IN_PERSONA_DASHBOARD,
       "node-limit-reached": false,
  		 "nodes": [
         {
           "type": "account",
           "value": "act_123example"
         },
         {
           "type": "device_fingerprint",
           "value": "123example"
         },
         ...
       ]
    }
  }
}
```

| Item in Response | Description |
| --- | --- |
| `status` | The status of the graph query. It is initially `submitted` and becomes `completed` once Persona is done processing the data. |
| `params` | The same parameters you passed in when the graph query was created. |
| `created-at` | The timestamp of when the graph query was first created. |
| `updated-at` | The timestamp of when the graph query was last updated. |
| `errored-at` | The timestamp of when the graph query resulted in an error, if any. |
| `completed-at` | The timestamp of when the graph query result was done being computed (if it is completed) |
| `stats` | an `object` detailing the counts of each node type in the query response. |
| `explorer-url` | For any more advanced investigation, it is easiest to use our powerful suite of tools and visualization in Graph Explorer. This link opens your query result there so you can continue your analysis without having to rerun the query. |
| `nodes` | An array of node objects comprised of attributes defined below: |
| `value` | The value of the node that Graph uses to determine matches |
| `type` | The type of node |

If your team is interested in learning more about getting additional data in the API response, please let your Persona Account Team contact know.

#### A note on node limits

Every graph query requires processing huge amounts of data and analyzing all of their relationships. To ensure performant queries, the computation will not continue traversing more nodes once it hits the node limit. It will return the accumulated results it has traversed so far. If `node-limit-reached` is `true`, the results will only reflect the portion of the graph it has traversed so far. Please reach out to your Persona Graph contact to inquire about pagination.

## Best practices

For optimal query performance, try to keep the range of nodes being queried over small. For example:

-   In general, a query over a smaller `created-at` time range would be faster.
-   In general, a query on a more unique node type, such as government ID number, would compute faster than a query on a node type with lots of matches, such as name.
