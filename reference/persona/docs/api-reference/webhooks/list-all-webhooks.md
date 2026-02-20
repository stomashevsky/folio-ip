# List all Webhooks

[API Reference](../accounts/list-all-accounts.md)[Webhooks](./list-all-webhooks.md)

# List all Webhooks

GET

https://api.withpersona.com/api/v1/webhooks

```
{
  "data": [
    {
      "type": "webhook",
      "id": "wbh_ABC123",
      "attributes": {
        "status": "disabled",
        "url": "https://withpersona.com",
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
    },
    {
      "type": "webhook",
      "id": "wbh_ABC123",
      "attributes": {
        "status": "disabled",
        "url": "https://withpersona.com",
        "api-version": "2023-01-05",
        "api-key-inflection": "camel",
        "api-attributes-blocklist": [
          "/data/attributes/fields/*-number"
        ],
        "file-access-token-expires-in": 600,
        "enabled-events": [
          "*"
        ],
        "payload-filter": {},
        "created-at": "2023-09-18T23:18:13.000Z"
      }
    }
  ],
  "links": {
    "next": "string",
    "prev": "string"
  }
}
```
