# Create a Case

POST

https://api.withpersona.com/api/v1/cases

```
{
  "data": {
    "id": "case_gqe7rH38FvxtzhGBQmDBsjkB",
    "attributes": {
      "status": "open",
      "name": "MRR-3",
      "created-at": "2021-09-28T05:18:36.200Z",
      "updated-at": "2021-09-28T05:18:36.200Z",
      "sla-expires-at": "2021-09-28T07:18:36.200Z",
      "creator-id": "case_creator@withpersona.com",
      "creator-type": "user",
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
          "id": "ctmpl_Jumm3K4zHwaLBBdyLUCnHbBC",
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
            "id": "inq_KHK4MJCE4QvfocWB2intQ3YE",
            "type": "inquiry"
          }
        ]
      },
      "reports": {
        "data": []
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
