# Retrieve a Serpro Database Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Serpro Database Verifications](../serpro-database-verifications.md)

# Retrieve a Serpro Database Verification

GET

https://api.withpersona.com/api/v1/verification/database-serpros/:verification-id

```
{
  "data": {
    "id": "ver_ixBrVPK2jKwg4qGmbWZvwMmw",
    "attributes": {
      "birthdate": "1994-12-30",
      "checks": [],
      "completed-at": null,
      "completed-at-ts": null,
      "country-code": "BR",
      "cpf": "123456789",
      "created-at": "2022-08-03T03:42:20.000Z",
      "created-at-ts": 1659498140,
      "name-first": "Jane",
      "name-full": "Jane Doe",
      "name-last": "Doe",
      "status": "initiated",
      "submitted-at": null,
      "submitted-at-ts": null
    },
    "relationships": {
      "inquiry": {
        "data": null
      },
      "inquiry-template": {
        "data": null
      },
      "inquiry-template-version": {
        "data": null
      },
      "selfie": {
        "data": {
          "id": "self_ABC123",
          "type": "selfie/profile-and-center"
        }
      },
      "template": {
        "data": null
      },
      "transaction": {
        "data": null
      },
      "verification-template": {
        "data": {
          "type": "verification-template/database-serpro",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/database-serpro",
          "id": "vtmplv_ABC123"
        }
      }
    },
    "type": "verification/database-serpro"
  }
}
```
