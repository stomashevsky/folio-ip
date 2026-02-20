# Retrieve a Verification

[API Reference](../accounts/list-all-accounts.md)[Verifications](../verifications.md)

# Retrieve a Verification

GET

https://api.withpersona.com/api/v1/verifications/:verification-id

```
{
  "data": {
    "type": "verification/database",
    "attributes": {
      "address-city": "Los Angeles",
      "address-postal-code": "55555",
      "address-street-1": "555 Beverly Hills",
      "address-street-2": "Apartment 123",
      "address-subdivision": "California",
      "birthdate": "1999-01-01",
      "checks": [],
      "completed-at": null,
      "completed-at-ts": null,
      "country-code": "US",
      "created-at": "2023-11-03T17:37:06.000Z",
      "created-at-ts": 1699033026,
      "document-number": null,
      "email-address": "jane@doe.com",
      "identification-number": null,
      "name-first": "Jane",
      "name-last": "Doe",
      "name-middle": null,
      "normalized-address-city": "Los Angeles",
      "normalized-address-postal-code": "55555",
      "normalized-address-street-1": "555 Beverly Hills",
      "normalized-address-street-2": "Apt 123",
      "normalized-address-subdivision": "CA",
      "phone-number": null,
      "status": "initiated",
      "submitted-at": null,
      "submitted-at-ts": null
    },
    "id": "ver_ABC123",
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
          "type": "verification-template/database",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/database",
          "id": "vtmplv_ABC123"
        }
      }
    }
  }
}
```
