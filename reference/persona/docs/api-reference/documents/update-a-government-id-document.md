# Update a Government ID Document

PATCH

https://api.withpersona.com/api/v1/document/government-ids/:document-id

```
{
  "data": {
    "id": "doc_vXwNeVfVCcgedQ2Sg4R5F9VD",
    "attributes": {
      "address-city": "San Francisco",
      "address-postal-code": "94111",
      "address-street-1": "123 Main St",
      "address-street-2": null,
      "address-subdivision": "CA",
      "back-photo": null,
      "birthdate": "1994-12-30",
      "birthplace": null,
      "created-at": "2024-01-23T20:54:08.000Z",
      "designations": [],
      "document-number": null,
      "endorsements": null,
      "expiration-date": "2029-05-11",
      "front-photo": {
        "filename": "persona_camera_1706043245796.jpg",
        "url": "https://files.withpersona.com/persona_camera_1706043245796.jpg?access_token=ACCESS_TOKEN",
        "byte-size": 298279
      },
      "height": null,
      "id-class": "dl",
      "identification-number": "25995844",
      "issue-date": "2021-04-29",
      "issuing-authority": null,
      "issuing-subdivision": "CA",
      "name-first": "Jane",
      "name-last": "Doe",
      "name-middle": "Marie",
      "name-suffix": null,
      "nationality": null,
      "processed-at": "2024-01-23T20:54:14.000Z",
      "processed-at-ts": 1706043254,
      "restrictions": null,
      "selfie-photo": {
        "filename": "selfie_photo.jpg",
        "url": "https://files.withpersona.com/selfie_photo.jpg?access_token=ACCESS_TOKEN",
        "byte-size": 11686
      },
      "sex": null,
      "status": "processed",
      "vehicle-class": null,
      "visa-status": null
    },
    "relationships": {
      "inquiry": {
        "data": {
          "id": "inq_VbHWkX4hjmZryYCTGtVWHFRy",
          "type": "inquiry"
        }
      },
      "template": {},
      "inquiry-template-version": {
        "data": {
          "id": "itmplv_HAVumeSgCxWxhVb8tTRjaiUB",
          "type": "inquiry-template-version"
        }
      },
      "inquiry-template": {
        "data": {
          "id": "itmpl_srQQ2Ui2gvNY353u65vD61gr",
          "type": "inquiry-template"
        }
      },
      "document-files": {
        "data": []
      }
    },
    "type": "document/government-id"
  }
}
```
