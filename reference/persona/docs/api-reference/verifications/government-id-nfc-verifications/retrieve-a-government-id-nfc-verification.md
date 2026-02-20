# Retrieve a Government ID NFC Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Government ID NFC Verifications](../government-id-nfc-verifications.md)

# Retrieve a Government ID NFC Verification

GET

https://api.withpersona.com/api/v1/verification/government-id-nfcs/:verification-id

```
{
  "data": {
    "id": "ver_Ra6LFdoQmPFJH27gonC3cChh",
    "attributes": {
      "birthdate": "1994-12-30",
      "checks": [
        {
          "metadata": {},
          "name": "id_nfc_expired_detection",
          "reasons": [
            "expired"
          ],
          "status": "failed"
        }
      ],
      "completed-at": "2022-07-28T20:47:12.000Z",
      "completed-at-ts": 1659041232,
      "country-code": "UT",
      "created-at": "2022-07-28T16:55:44.000Z",
      "created-at-ts": 1659027344,
      "expiration-date": "2022-12-30",
      "id-class": "pp",
      "identification-number": "L898902C3",
      "name-first": "ANNA MARIA",
      "name-last": "SAMPLE",
      "selfie-photo": {
        "byte-size": 1000,
        "url": "https://files.withpersona.com/..."
      },
      "sex": "F",
      "status": "passed",
      "submitted-at": "2022-07-28T20:47:06.000Z",
      "submitted-at-ts": 1659041226
    },
    "relationships": {
      "document": {
        "data": {
          "id": "doc_QZ8M2J1fH2o76Rq57vuVWMsE",
          "type": "document/government-id-nfc"
        }
      },
      "inquiry": {
        "data": null
      }
    },
    "type": "verification/government-id-nfc"
  }
}
```
