# Expire an API key

[API Reference](../accounts/list-all-accounts.md)[API Keys](./list-all-api-keys.md)

# Expire an API key

POST

https://api.withpersona.com/api/v1/api-keys/:api-key-id/expire

```
{
  "data": {
    "type": "api-key",
    "id": "api_ABC123",
    "attributes": {
      "name": "Default API Key",
      "api-version": "2023-01-05",
      "api-key-inflection": "kebab",
      "api-attributes-blocklist": [
        "address-*",
        "name-last",
        "/data/attributes/fields/*-number"
      ],
      "permissions": [
        "account.read",
        "account.write",
        "api_log.read"
      ],
      "ip-address-allowlist": [
        "*"
      ],
      "file-access-token-expires-in": 21600,
      "last-used-at": "2023-08-17T23:24:00.000Z",
      "created-at": "2023-08-17T23:18:13.000Z"
    }
  }
}
```
