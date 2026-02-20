# 

Report Action: Pause Continuous Monitoring

POST

https://api.withpersona.com/api/v1/reports/:report-id/pause

```
{
  "data": {
    "type": "report/watchlist",
    "attributes": {
      "completed-at": "2022-01-14T23:42:01.000Z",
      "created-at": "2022-01-14T23:42:01.000Z",
      "matched-lists": [],
      "redacted-at": null,
      "report-template-version-name": "v1",
      "status": "ready",
      "term": "Alexander Sample"
    },
    "id": "rep_EPehAHkBaZKUxxxLEDL1gv4h",
    "relationships": {
      "inquiry": {},
      "account": {},
      "report-template": {
        "data": {
          "id": "rptp_jfp2TAY28vijxxxCcn4WVqdX",
          "type": "report-template/watchlist"
        }
      }
    }
  }
}
```
