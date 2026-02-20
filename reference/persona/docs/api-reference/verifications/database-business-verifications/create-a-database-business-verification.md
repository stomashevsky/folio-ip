# Create a Database Business Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Database Business Verifications](./create-a-database-business-verification.md)

# Create a Database Business Verification

POST

https://api.withpersona.com/api/v1/verification/database-businesses

```
{
  "data": {
    "type": "verification/database-business",
    "id": "ver_ABC123",
    "attributes": {
      "address-city": "San Francisco",
      "address-country-code": "US",
      "address-postal-code": "94103",
      "address-street-1": "981 Mission St",
      "address-street-2": "# 95",
      "address-subdivision": "California",
      "business-name": "Acme Inc",
      "checks": [],
      "completed-at": null,
      "completed-at-ts": null,
      "country-code": "US",
      "created-at": "2023-11-03T17:37:06.000Z",
      "created-at-ts": 1699033026,
      "registration-number": null,
      "status": "initiated",
      "submitted-at": null,
      "submitted-at-ts": null
    },
    "relationships": {
      "inquiry": {
        "data": {
          "id": "inq_ABC123",
          "type": "inquiry"
        }
      },
      "template": {},
      "inquiry-template-version": {
        "data": {
          "type": "inquiry-template-version",
          "id": "itmplv_ABC123"
        }
      },
      "inquiry-template": {
        "data": {
          "type": "inquiry-template",
          "id": "itmpl_ABC123"
        }
      },
      "transaction": {},
      "verification-template": {
        "data": {
          "type": "verification-template/database-business",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/database-business",
          "id": "vtmplv_ABC123"
        }
      }
    }
  }
}
```
