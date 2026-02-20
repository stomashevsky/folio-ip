# List all User Audit Logs

[API Reference](../accounts/list-all-accounts.md)[User Audit Logs](./list-all-user-audit-logs.md)

# List all User Audit Logs

GET

https://api.withpersona.com/api/v1/user-audit-logs

```
{
  "data": [
    {
      "type": "user-audit-log",
      "id": "ual_ABC123ABC",
      "attributes": {
        "path": "/api/v1/inquiries",
        "method": "GET",
        "get-params": {},
        "post-params": {},
        "ip-address": "127.0.0.1",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "response-status": 200,
        "created-at": "2023-10-03T21:31:05.163Z"
      },
      "relationships": {
        "user": {
          "data": {
            "type": "user",
            "id": "user_ABC123"
          }
        },
        "user-session": {
          "data": {
            "type": "user-session",
            "id": "uses_ABC123"
          }
        }
      }
    },
    {
      "type": "user-audit-log",
      "id": "ual_ABC123XYZ",
      "attributes": {
        "path": "/api/internal/dashboard/v1/user-sessions/uses_ABC123/expire",
        "method": "GET",
        "get-params": {},
        "post-params": {
          "data": {
            "id": "uses_ABC123",
            "type": "user-session"
          }
        },
        "ip-address": "127.0.0.1",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "response-status": 200,
        "created-at": "2023-10-03T21:31:05.163Z"
      },
      "relationships": {
        "user": {
          "data": {
            "type": "user",
            "id": "user_ABC123"
          }
        },
        "user-session": {
          "data": {
            "type": "user-session",
            "id": "uses_ABC123"
          }
        }
      }
    }
  ],
  "links": {
    "prev": "/api/v1/user-audit-logs?page%5Bbefore%5D=ual_ABC123",
    "next": "/api/v1/user-audit-logs?page%5Bafter%5D=ual_ABC123"
  },
  "included": [
    {
      "id": "user_ABC123",
      "attributes": {
        "email-address": "jane@doe.com",
        "name-first": "Jane",
        "name-last": "Doe"
      },
      "type": "user"
    }
  ]
}
```
