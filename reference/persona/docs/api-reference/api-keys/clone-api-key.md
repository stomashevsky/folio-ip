# Clone an API key

[API Reference](../accounts/list-all-accounts.md)[API Keys](./list-all-api-keys.md)

# Clone an API key

POST

https://api.withpersona.com/api/v1/api-keys/:api-key-id/clone

```
{
  "data": {
    "type": "api-key",
    "id": "api_ABC123",
    "attributes": {
      "api-attributes-blocklist": [
        "address-*",
        "name-last",
        "/data/attributes/fields/*-number"
      ],
      "api-key-inflection": "kebab",
      "api-version": "2023-01-05",
      "created-at": "2023-08-17T23:18:13.000Z",
      "expires-at": null,
      "file-access-token-expires-in": 21600,
      "ip-address-allowlist": [
        "*"
      ],
      "last-used-at": "2023-08-17T23:24:00.000Z",
      "name": "Default API Key",
      "note": null,
      "permissions": [
        "account.read",
        "account.write",
        "api_log.read"
      ],
      "value": "persona_production_abcdefg"
    }
  }
}
```
