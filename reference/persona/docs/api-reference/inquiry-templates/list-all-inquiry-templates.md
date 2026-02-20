# List all Inquiry Templates

[API Reference](../accounts/list-all-accounts.md)[Inquiry Templates](./list-all-inquiry-templates.md)

# List all Inquiry Templates

GET

https://api.withpersona.com/api/v1/inquiry-templates

```
{
  "data": [
    {
      "id": "itmpl_ABC123",
      "attributes": {
        "name": "Basic KYC verification flow",
        "status": "active",
        "embedded-flow-domain-allowlist": [
          "example.com",
          "app.example.com"
        ],
        "hosted-flow-subdomains": [
          "mycompanyname"
        ],
        "hosted-flow-redirect-uri-schemes": [
          "https",
          "http"
        ]
      },
      "relationships": {
        "latest-published-version": {
          "data": {
            "type": "inquiry-template-version",
            "id": "itmplv_XYZ789"
          }
        }
      },
      "type": "inquiry-template"
    }
  ],
  "links": {
    "prev": "/api/v1/inquiry-templates?page%5Bafter%5D=itmpl_ABC123",
    "next": "/api/v1/inquiry-templates?page%5Bafter%5D=itmpl_ABC123"
  }
}
```
