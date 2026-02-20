# Update a Case

PATCH

https://api.withpersona.com/api/v1/cases/:case-id

```
{
  "data": {
    "id": "case_3maVhdLzdGftRZCvxfqazVL1",
    "attributes": {
      "status": "open",
      "name": "WATC-16",
      "created-at": "2021-06-30T20:37:18.678Z",
      "updated-at": "2021-08-26T18:24:19.695Z",
      "sla-expires-at": "2021-06-30T22:37:18.678Z",
      "creator-id": "wfl_yKynZZiuPz1R5qm9JFyBnnLB",
      "creator-type": "workflow-run",
      "assignee-id": "foo@bar.com",
      "assigner-id": "foo@bar.com",
      "assigner-type": "user",
      "tags": [],
      "fields": {},
      "attachments": []
    },
    "relationships": {
      "accounts": {
        "data": []
      },
      "case-comments": {
        "data": []
      },
      "case-template": {
        "data": {
          "id": "ctmpl_6HheND7s14a2o7fg33iHqhg7",
          "type": "case-template"
        }
      },
      "case-queue": {
        "data": {
          "id": "cqueue_7JRbkcdbx9fTossK98NJvRZcmk1",
          "type": "case-queue"
        }
      },
      "inquiries": {
        "data": [
          {
            "id": "inq_29Yd6kF6xWVFgemm5WTxhxvf",
            "type": "inquiry"
          }
        ]
      },
      "reports": {
        "data": [
          {
            "id": "rep_PN3xspEwWCWWRp1eGpedaSNj",
            "type": "report/watchlist"
          }
        ]
      },
      "verifications": {
        "data": []
      },
      "txns": {
        "data": []
      }
    },
    "type": "case"
  }
}
```
