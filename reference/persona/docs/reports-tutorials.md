# Reports Tutorials

Learn more in the [Reports API documentation](./api-reference/reports.md)

## Running your first report

Create your first report by creating a POST request to the reports resource.

```curl
API_KEY=YOUR_API_KEY_HERE
curl -X POST -H 'Content-Type: application/json' \
	-H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "attributes": {
      "report-template-id": YOUR_TEMPLATE_ID,
    }
  }
}' https://withpersona.com/api/v1/reports
```

After you submit this request to create the report, we’ll process it as soon as possible. This usually happens within a second.

The response of this request will include a report ID which you can use to poll for your report.

```json
{
  "data": {
    "type: "report/watchlist",
    "id": "rep_yourfirstreportid",
    "attributes": {
       "status": "pending",
       "..." : "..."
    }
  }
}
```

## Getting the results of your report

Fetch your report using the report ID from the reports resource.

```curl
API_KEY=YOUR_API_KEY_HERE
curl -X GET -H 'Content-Type: application/json' \
	-H "Authorization: Bearer $API_KEY" \
  https://withpersona.com/api/v1/reports/REPORT_ID
```

Once the `status` is `ready`, the results should be available in the response.

```json
{
  "data": {
    "type: "report/watchlist",
    "id": "rep_yourfirstreportid",
    "attributes": {
       "status": "ready",
      ...
    }
  }
}
```
