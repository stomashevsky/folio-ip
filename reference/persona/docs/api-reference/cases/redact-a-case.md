# Redact a Case

DELETE

https://api.withpersona.com/api/v1/cases/:case-id

```
{
  "data": {
    "id": "case_KsFU1Vxv9oK3ztnwQuD7MaJo",
    "attributes": {
      "status": "Approved",
      "name": "KCAS-1",
      "created-at": "2021-03-24T04:59:21.764Z",
      "updated-at": "2021-03-24T04:59:21.764Z",
      "resolved-at": "2021-03-25T04:59:21.764Z",
      "redacted-at": "2021-03-26T04:59:21.764Z",
      "sla-expires-at": "2021-03-26T06:59:21.764Z",
      "creator-id": "case_creator@withpersona.com",
      "creator-type": "user",
      "resolver-id": "case_resolver@withpersona.com",
      "resolver-type": "user",
      "updater-id": "case_updater@withpersona.com",
      "updater-type": "user",
      "tags": [],
      "fields": {},
      "attachments": []
    },
    "relationships": {
      "accounts": {
        "data": [
          {
            "id": "act_RNwaSKFUDTzxUakAEuE2xmhZ",
            "type": "account"
          }
        ]
      },
      "case-comments": {
        "data": [
          {
            "id": "cscm_yd2urRmjaCWcSSxqTSHvUcsn",
            "type": "case-comment"
          }
        ]
      },
      "case-template": {
        "data": {
          "id": "ctmpl_336jV1uVaaY84GAqvG91oiy9",
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
            "id": "inq_b6UPkf7mNC1qBtLXnfaWyUbY",
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
