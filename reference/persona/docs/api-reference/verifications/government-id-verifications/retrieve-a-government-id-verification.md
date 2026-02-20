# Retrieve a Government ID Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Government ID Verifications](../government-id-verifications.md)

# Retrieve a Government ID Verification

GET

https://api.withpersona.com/api/v1/verification/government-ids/:verification-id

```
{
  "data": {
    "id": "ver_ABC123",
    "attributes": {
      "address-city": "SAN FRANCISCO",
      "address-postal-code": "94111",
      "address-street-1": "123 MAIN ST",
      "address-street-2": null,
      "address-subdivision": "CA",
      "back-photo-url": null,
      "birthdate": "1990-01-01",
      "birthplace": null,
      "capture-method": "upload",
      "checks": [],
      "completed-at": "2024-03-20T21:22:31.000Z",
      "completed-at-ts": 1710969751,
      "country-code": "US",
      "created-at": "2024-03-20T21:22:25.000Z",
      "created-at-ts": 1710969745,
      "designations": [],
      "document-number": null,
      "endorsements": null,
      "entity-confidence-reasons": [
        "generic"
      ],
      "entity-confidence-score": 96.1831512451172,
      "expiration-date": "2025-01-01",
      "from-reusable-persona": false,
      "front-photo-url": "https://files.withpersona.com/id-front.jpg?access_token=ACCESS_TOKEN",
      "height": null,
      "id-class": "dl",
      "identification-number": "Y123ABC",
      "issue-date": "2020-07-28",
      "issuing-authority": null,
      "issuing-subdivision": "CA",
      "name-first": "JANE",
      "name-last": "DOE",
      "name-middle": null,
      "name-suffix": null,
      "nationality": null,
      "native-name-first": "三",
      "native-name-last": "张",
      "native-name-middle": null,
      "native-name-title": null,
      "photo-urls": [
        {
          "byte-size": 2849115,
          "normalized-url": "https://files.withpersona.com/id-front.jpg?access_token=ACCESS_TOKEN",
          "original-urls": [
            "https://files.withpersona.com/id-front.jpg?access_token=ACCESS_TOKEN"
          ],
          "page": "front",
          "url": "https://files.withpersona.com/id-front.jpg?access_token=ACCESS_TOKEN"
        }
      ],
      "restrictions": null,
      "selfie-photo": {
        "byte-size": 201105,
        "url": "https://files.withpersona.com/selfie-photo.jpg?access_token=ACCESS_TOKEN"
      },
      "selfie-photo-url": "https://files.withpersona.com/selfie-photo.jpg?access_token=ACCESS_TOKEN",
      "sex": null,
      "status": "passed",
      "submitted-at": "2024-03-20T21:22:25.000Z",
      "submitted-at-ts": 1710969745,
      "vehicle-class": null,
      "video-url": null,
      "visa-status": null
    },
    "relationships": {
      "document": {
        "data": {
          "id": "doc_ABC123",
          "type": "document/government-id"
        }
      },
      "inquiry": {
        "data": {
          "id": "inq_ABC123",
          "type": "inquiry"
        }
      },
      "inquiry-template": {
        "data": {
          "type": "inquiry-template",
          "id": "itmpl_ABC123"
        }
      },
      "inquiry-template-version": {
        "data": {
          "type": "inquiry-template-version",
          "id": "itmplv_ABC123"
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
          "type": "verification-template/government-id",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/government-id",
          "id": "vtmplv_ABC123"
        }
      }
    },
    "type": "verification/government-id"
  }
}
```
