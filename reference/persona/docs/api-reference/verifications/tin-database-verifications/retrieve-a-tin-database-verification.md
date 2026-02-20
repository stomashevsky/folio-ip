# Retrieve a TIN Database Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Tin Database Verifications](../tin-database-verifications.md)

# Retrieve a TIN Database Verification

GET

https://api.withpersona.com/api/v1/verification/database-tins/:verification-id

```
{
  "data": {
    "id": "ver_2wpqiEtejRcTA1hMJEXmbrJ6",
    "attributes": {
      "checks": [],
      "completed-at": "2022-08-03T04:13:06.000Z",
      "completed-at-ts": 1659499986,
      "country-code": "US",
      "created-at": "2022-08-03T04:11:32.000Z",
      "created-at-ts": 1659499892,
      "name-business": null,
      "name-first": "JANE",
      "name-last": "DOE",
      "status": "passed",
      "submitted-at": "2022-08-03T04:13:00.000Z",
      "submitted-at-ts": 1659499980,
      "tin": "123456789",
      "tin-type": "itin"
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
    "type": "verification/database-tin"
  }
}
```
