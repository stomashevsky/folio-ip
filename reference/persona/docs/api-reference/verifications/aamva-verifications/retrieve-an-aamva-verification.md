# Retrieve an AAMVA Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[AAMVA Verifications](../aamva-verifications.md)

# Retrieve an AAMVA Verification

GET

https://api.withpersona.com/api/v1/verification/aamvas/:verification-id

```
{
  "data": {
    "id": "ver_ABC123",
    "attributes": {
      "address-postal-code": "94111",
      "birthdate": "1994-04-12",
      "checks": [],
      "completed-at": null,
      "completed-at-ts": null,
      "country-code": "US",
      "created-at": "2023-11-03T17:37:06.000Z",
      "created-at-ts": 1699033026,
      "expiration-date": "2029-05-08",
      "identification-number": "B12345678",
      "issue-date": "2021-05-27",
      "issuing-authority": "CA",
      "name-first": "Jane",
      "name-last": "Doe",
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
      "inquiry-template-version": {},
      "inquiry-template": {},
      "transaction": {},
      "verification-template": {
        "data": {
          "type": "verification-template/aamva",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/aamva",
          "id": "vtmplv_ABC123"
        }
      }
    },
    "type": "verification/aamva"
  }
}
```
