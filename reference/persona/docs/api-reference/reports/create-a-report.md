# Create a Report

POST

https://api.withpersona.com/api/v1/reports

```
{
  "data": {
    "type": "report/watchlist",
    "attributes": {
      "birthdate": null,
      "completed-at": "2023-06-07T14:12:16.000Z",
      "country-code": null,
      "created-at": "2023-06-07T14:12:16.000Z",
      "has-match": false,
      "ignore-list": [],
      "is-continuous": false,
      "matched-lists": [],
      "name-first": "Jane",
      "name-last": "Doe",
      "name-middle": null,
      "redacted-at": null,
      "report-template-version-name": "v1",
      "status": "ready",
      "tags": [],
      "term": "Jane Doe"
    },
    "id": "rep_ARR4XUoYJRgQd7VMVaGEY2Gc",
    "relationships": {
      "inquiry": {},
      "account": {
        "data": {
          "id": "act_rD4wFHtwhkgbpy2pc3o2G94a",
          "type": "account"
        }
      },
      "transaction": {},
      "report-template": {
        "data": {
          "id": "rptp_2t2xwqxPDE1gw8DtYVFB9Vua",
          "type": "report-template/watchlist"
        }
      }
    }
  }
}
```
