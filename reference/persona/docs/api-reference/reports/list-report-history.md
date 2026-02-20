# List Report history

GET

https://api.withpersona.com/api/v1/reports/:report-id/history

```
{
  "data": [
    {
      "type": "run",
      "run-type": "scheduled",
      "completed-at": "2025-10-22T05:07:10.000+00:00",
      "id": "rpr_5HCmTnQMtLgRyarbyFDFNy8k",
      "matches": 30,
      "scheduled-date": "2025-10-22"
    },
    {
      "type": "dismiss",
      "created-at": "2025-10-22T05:09:22.065+00:00",
      "creator-name": "John Doe",
      "id": "ract_nXmT51zEhQnwRYPCJmQ73Rq5"
    },
    {
      "type": "review",
      "created-at": "2025-10-22T04:30:03.000+00:00",
      "creator-name": "John Doe",
      "id": "ract_zbzaG66ZnxeRxnSrumQGU8kF"
    },
    {
      "type": "pause",
      "created-at": "2025-10-22T04:30:03.000+00:00",
      "creator-name": "John Doe",
      "id": "ract_xxSK46C5xQ8pCqcg3wKUyX5F"
    },
    {
      "type": "resume",
      "created-at": "2025-10-22T04:30:03.000+00:00",
      "creator-name": "John Doe",
      "id": "ract_L6JdsScaRjdzfKhESXRELyMg"
    }
  ],
  "links": {
    "prev": "string",
    "next": "/api/v1/reports/report-id/history?page%5Bafter%5D=rpr_VydFpmA58EyEYnWLprvtMNau"
  }
}
```
