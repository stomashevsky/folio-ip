# List all Cases

GET

https://api.withpersona.com/api/v1/cases

```
{
  "data": [
    {
      "id": "case_KsFU1Vxv9oK3ztnwQuD7MaJo",
      "attributes": {
        "status": "open",
        "name": "KCAS-1",
        "created-at": "2021-03-24T04:59:21.764Z",
        "updated-at": "2021-03-24T04:59:21.764Z",
        "creator-id": "case_creator@withpersona.com",
        "creator-type": "user",
        "assignee-id": "case_assignee@withpersona.com",
        "assigner-id": "case_assigner@withpersona.com",
        "assigner-type": "user",
        "updater-id": "case_updater@withpersona.com",
        "updater-type": "user",
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
              "id": "inq_eGK41TM6GjcZgdcoox7x8Hh0",
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
  ],
  "links": {
    "next": "/api/v1/cases?page%5Bafter%5D=case_19pQg1NHfYeUdpIvYZ54xmDz",
    "prev": "/api/v1/cases?page%5Bbefore%5D=case_1ePP8j3pyznPCEuw4TCjWWD0"
  }
}
```
