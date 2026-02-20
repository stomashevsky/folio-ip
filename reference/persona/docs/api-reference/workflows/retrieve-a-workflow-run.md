# Retrieve a Workflow Run

GET

https://api.withpersona.com/api/v1/workflow-runs/:workflow-run-id

```
{
  "data": {
    "id": "wfr_3JqAR9ddLRVZLK5z4yD8oeHB",
    "attributes": {
      "created-at": "2022-08-08T18:55:44.910Z",
      "status": "in_progress"
    },
    "relationships": {
      "creator": {},
      "workflow": {
        "data": {
          "type": "workflow",
          "id": "wfl_3VghhbvDc7UuUNT8uZrqZjsk"
        }
      },
      "workflow-version": {
        "data": {
          "type": "workflow-version",
          "id": "wfv_DkWeGvK9wojQnubF8ABHzJRQ"
        }
      }
    },
    "type": "workflow-run"
  }
}
```
