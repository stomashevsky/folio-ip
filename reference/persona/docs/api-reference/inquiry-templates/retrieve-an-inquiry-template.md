# Retrieve an Inquiry Template

[API Reference](../accounts/list-all-accounts.md)[Inquiry Templates](./list-all-inquiry-templates.md)

# Retrieve an Inquiry Template

GET

https://api.withpersona.com/api/v1/inquiry-templates/:inquiry-template-id

```
{
  "data": {
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
}
```
