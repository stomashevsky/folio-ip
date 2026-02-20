# Retrieve a User Audit Log

[API Reference](../accounts/list-all-accounts.md)[User Audit Logs](./list-all-user-audit-logs.md)

# Retrieve a User Audit Log

GET

https://api.withpersona.com/api/v1/user-audit-logs/:user-audit-log-id

```
{
  "data": {
    "type": "user-audit-log",
    "id": "ual_ABC123",
    "attributes": {
      "path": "/api/v1/inquiries",
      "method": "GET",
      "get-params": {},
      "post-params": {},
      "ip-address": "127.0.0.1",
      "created-at": "2023-10-03T21:31:05.163Z"
    },
    "relationships": {
      "user": {
        "data": {
          "type": "user",
          "id": "user_ABC123"
        }
      }
    }
  }
}
```
