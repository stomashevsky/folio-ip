# List all Rate Limits

[API Reference](../accounts/list-all-accounts.md)[Rate Limits](./list-all-rate-limits.md)

# List all Rate Limits

GET

https://api.withpersona.com/api/v1/rate-limits

```
{
  "data": [
    {
      "type": "rate-limit/api",
      "attributes": {
        "limit": 3003,
        "remaining": 250,
        "seconds-to-reset": 60
      }
    }
  ]
}
```
