# 

Generate a one-time link for an Inquiry

POST

https://api.withpersona.com/api/v1/inquiries/:inquiry-id/generate-one-time-link

```
{
  "data": {
    "id": "inq_zEx4jL84ShbUyuwX6AzPSqt6",
    "attributes": {
      "status": "pending",
      "reference-id": "abc-123",
      "note": "A helpful note",
      "behaviors": {
        "api-version-less-than-minimum-count": 0,
        "autofill-cancels": 0,
        "autofill-starts": 0,
        "behavior-threat-level": "low",
        "bot-score": 70,
        "completion-time": 40.172463903,
        "devtools-open": false,
        "debugger-attached": false,
        "distraction-events": 0,
        "hesitation-baseline": 29677,
        "hesitation-count": 3,
        "hesitation-percentage": 96.88310813087575,
        "hesitation-time": 28752,
        "mobile-sdk-version-less-than-minimum-count": 0,
        "request-spoof-attempts": 0,
        "shortcut-copies": 0,
        "shortcut-pastes": 0,
        "user-agent-spoof-attempts": 0
      },
      "tags": [],
      "creator": "creator@withpersona.com",
      "reviewer-comment": "This is a comment for this inquiry!",
      "created-at": "2023-03-29T19:06:45.000Z",
      "updated-at": "2023-03-30T19:07:01.000Z",
      "started-at": "2023-03-30T19:07:01.000Z",
      "expires-at": "2023-03-31T19:07:01.000Z",
      "completed-at": "2023-03-28T18:35:10.000Z",
      "failed-at": "2023-03-28T18:35:10.000Z",
      "marked-for-review-at": "2023-03-28T18:35:10.000Z",
      "decisioned-at": "2023-03-28T18:35:10.000Z",
      "expired-at": "2023-03-28T18:35:10.000Z",
      "redacted-at": "2023-03-28T18:35:10.000Z",
      "previous-step-name": "start",
      "next-step-name": "verification_document",
      "fields": {
        "name-first": {
          "type": "string",
          "value": "Jane"
        },
        "name-middle": {
          "type": "string",
          "value": "Marie"
        },
        "name-last": {
          "type": "string",
          "value": "Doe"
        },
        "address-street-1": {
          "type": "string",
          "value": "123 Main St"
        },
        "address-street-2": {
          "type": "string"
        },
        "address-city": {
          "type": "string",
          "value": "San Francisco"
        },
        "address-subdivision": {
          "type": "string",
          "value": "California"
        },
        "address-postal-code": {
          "type": "string",
          "value": "94111"
        },
        "address-country-code": {
          "type": "string",
          "value": "US"
        },
        "birthdate": {
          "type": "date",
          "value": "1995-09-08"
        },
        "email-address": {
          "type": "string",
          "value": "jane@doe.com"
        },
        "phone-number": {
          "type": "string"
        },
        "identification-number": {
          "type": "string"
        }
      }
    },
    "relationships": {
      "account": {
        "data": {
          "id": "act_n2uq9eKMboaCQzu9ALWYcVdN",
          "type": "account"
        }
      },
      "documents": {
        "data": []
      },
      "template": {
        "data": {}
      },
      "inquiry-template": {
        "data": {
          "id": "itmpl_p8ANAJy9iqadm2buF2xcVgqH",
          "type": "inquiry-template"
        }
      },
      "inquiry-template-version": {
        "data": {
          "id": "itmplv_iXhqfNWqwYLAWs9G8Fm8hPfo",
          "type": "inquiry-template-version"
        }
      },
      "reports": {
        "data": []
      },
      "reviewer": {
        "data": {}
      },
      "selfies": {
        "data": []
      },
      "sessions": {
        "data": []
      },
      "verifications": {
        "data": [
          {
            "id": "ver_uHDiwtcx3htjajvEaeMjPQcE",
            "type": "verification/database"
          }
        ]
      }
    },
    "type": "inquiry"
  },
  "meta": {
    "one-time-link": "https://withpersona.com/verify?code=us1-asdf",
    "one-time-link-short": "https://perso.na/verify?code=ABC123"
  }
}
```
