# Retrieve a Phone Number Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Phone Number Verifications](../phone-number-verifications.md)

# Retrieve a Phone Number Verification

GET

https://api.withpersona.com/api/v1/verification/phone-numbers/:verification-id

```
{
  "data": {
    "id": "ver_ABC123",
    "attributes": {
      "checks": [],
      "completed-at": null,
      "completed-at-ts": null,
      "confirmation-code": "12345",
      "country-code": "US",
      "created-at": "2023-11-03T17:37:06.000Z",
      "created-at-ts": 1699033026,
      "metadata": {},
      "phone-number": "+14169671111",
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
          "type": "verification-template/email-address",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/email-address",
          "id": "vtmplv_ABC123"
        }
      }
    },
    "type": "verification/phone-number"
  }
}
```
