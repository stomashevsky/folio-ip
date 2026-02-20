# Retrieve a Webhook

[API Reference](../accounts/list-all-accounts.md)[Webhooks](./list-all-webhooks.md)

# Retrieve a Webhook

GET

https://api.withpersona.com/api/v1/webhooks/:webhook-id

```
{
  "data": {
    "type": "webhook",
    "id": "wbh_ABC123",
    "attributes": {
      "status": "disabled",
      "url": "https://withpersona.com",
      "secret": "wbhsec_abcdefgh-1234-5678-9ijk-lmnopqrstuvw",
      "secrets": [
        {
          "value": "wbhsec_abcdefgh-1234-5678-9ijk-lmnopqrstuvw"
        }
      ],
      "api-version": "2023-01-05",
      "api-key-inflection": "kebab",
      "api-attributes-blocklist": [
        "address-*",
        "name-last",
        "/data/attributes/fields/*-number"
      ],
      "file-access-token-expires-in": 21600,
      "enabled-events": [
        "account.created",
        "verification.created"
      ],
      "payload-filter": {
        "data": {
          "relationships": {
            "inquiry-template": {
              "data": {
                "id": "itmpl_abc123def456"
              }
            }
          }
        }
      },
      "created-at": "2023-08-17T23:18:13.000Z"
    }
  }
}
```
