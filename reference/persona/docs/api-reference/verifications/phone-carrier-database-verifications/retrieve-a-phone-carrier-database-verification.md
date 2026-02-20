# Retrieve a Phone Carrier Database Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Phone Carrier Database Verifications](../phone-carrier-database-verifications.md)

# Retrieve a Phone Carrier Database Verification

GET

https://api.withpersona.com/api/v1/verification/database-phone-carriers/:verification-id

```
{
  "data": {
    "id": "ver_sg4L6Zax4TfXrVsGbVaBoSdr",
    "attributes": {
      "address-city": "San Francisco",
      "address-postal-code": "94111",
      "address-street-1": "123 Main St",
      "address-street-2": null,
      "address-subdivision": "California",
      "birthdate": "1994-12-30",
      "checks": [],
      "completed-at": null,
      "completed-at-ts": null,
      "country-code": "US",
      "created-at": "2022-08-03T03:15:56.000Z",
      "created-at-ts": 1659496556,
      "name-first": "Jane",
      "name-last": "Doe",
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
          "type": "verification-template/database-tin",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/database-tin",
          "id": "vtmplv_ABC123"
        }
      }
    },
    "type": "verification/database-phone-carrier"
  }
}
```
