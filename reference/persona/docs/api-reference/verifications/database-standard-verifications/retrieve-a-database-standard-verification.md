# Retrieve a Database Standard Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Database Standard Verifications](../database-standard-verifications.md)

# Retrieve a Database Standard Verification

GET

https://api.withpersona.com/api/v1/verification/database-standards/:verification-id

```
{
  "data": {
    "id": "ver_6hhbmCZyhrhTjqHVwwP66QGe",
    "attributes": {
      "address-city": "Los Angeles",
      "address-postal-code": "55555",
      "address-street-1": "555 Beverly Hills",
      "address-street-2": "Apartment 123",
      "address-subdivision": "CA",
      "checks": [],
      "completed-at": null,
      "completed-at-ts": null,
      "country-code": "US",
      "created-at": "2022-08-02T04:53:19.000Z",
      "created-at-ts": 1659415999,
      "name-first": "ALEXANDER",
      "name-last": "HAMILTON",
      "name-middle": "JAMES",
      "normalized-address-city": "Los Angeles",
      "normalized-address-postal-code": "55555",
      "normalized-address-street-1": "555 Beverly Hills",
      "normalized-address-street-2": "Apt 123",
      "normalized-address-subdivision": "CA",
      "status": "initiated",
      "submitted-at": null,
      "submitted-at-ts": null
    },
    "relationships": {
      "inquiry": {},
      "template": {},
      "inquiry-template-version": {},
      "inquiry-template": {},
      "transaction": {},
      "verification-template": {
        "data": {
          "type": "verification-template/database-standard",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/database-standard",
          "id": "vtmplv_ABC123"
        }
      }
    },
    "type": "verification/database-standard"
  }
}
```
