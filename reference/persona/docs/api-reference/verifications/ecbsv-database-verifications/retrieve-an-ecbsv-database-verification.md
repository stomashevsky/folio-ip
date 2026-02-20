# Retrieve an eCBSV Database Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[eCBSV Database Verifications](../ecbsv-database-verifications.md)

# Retrieve an eCBSV Database Verification

GET

https://api.withpersona.com/api/v1/verification/database-ecbsvs/:verification-id

```
{
  "data": {
    "id": "ver_2wpqiEtejRcTA1hMJEXmbrJ6",
    "attributes": {
      "birthdate": "1994-04-12",
      "checks": [],
      "completed-at": null,
      "completed-at-ts": null,
      "country-code": "US",
      "created-at": "2022-08-03T04:11:32.000Z",
      "created-at-ts": 1659499892,
      "email-address": "jane@doe.com",
      "identification-number": "B12345678",
      "name-first": "Jane",
      "name-last": "Doe",
      "signature-ip": "127.0.0.1",
      "signature-timestamp": "2022-09-03T04:13:06.000Z",
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
          "type": "verification-template/database-ecbsv",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/database-ecbsv",
          "id": "vtmplv_ABC123"
        }
      }
    },
    "type": "verification/database-ecbsv"
  }
}
```
