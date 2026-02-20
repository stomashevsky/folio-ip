# Inquiry created

[Webhooks](./webhook-account-created.md)[Webhooks Inquiry Events](../webhooks-inquiry-events/webhook-inquiry-created.md)

# Inquiry created

```
{
  "data": {
    "attributes": {
      "created-at": "2024-02-15T23:48:17.732Z",
      "name": "inquiry.created",
      "payload": {
        "data": {
          "id": "inq_zEx4jL84ShbUyuwX6AzPSqt6",
          "attributes": {
            "status": "created",
            "reference-id": "abc-123",
            "note": null,
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
            "reviewer-comment": null,
            "created-at": "2023-03-29T19:06:45.000Z",
            "updated-at": "2023-03-30T19:07:01.000Z",
            "started-at": "2023-03-30T19:07:01.000Z",
            "expires-at": "2023-03-31T19:07:01.000Z",
            "completed-at": null,
            "failed-at": null,
            "marked-for-review-at": null,
            "decisioned-at": null,
            "expired-at": null,
            "redacted-at": null,
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
                "type": "string",
                "value": null
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
                "type": "string",
                "value": null
              },
              "identification-number": {
                "type": "string",
                "value": null
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
        "included": [
          {
            "type": "inquiry-session",
            "attributes": {
              "status": "expired",
              "created-at": "2023-07-25T04:15:20.000Z",
              "started-at": "2023-07-25T05:14:50.000Z",
              "expired-at": "2023-07-26T05:14:50.000Z",
              "ip-address": "127.0.0.1",
              "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
              "os-name": "Mac",
              "os-full-version": "10.15.7",
              "device-type": "desktop",
              "device-name": null,
              "browser-name": "Chrome",
              "browser-full-version": "115.0.0.0",
              "mobile-sdk-name": null,
              "mobile-sdk-full-version": null,
              "device-handoff-method": null,
              "is-proxy": false,
              "is-tor": false,
              "is-datacenter": false,
              "is-vpn": false,
              "threat-level": "low",
              "country-code": "US",
              "country-name": "United States",
              "region-code": "CA",
              "region-name": "California",
              "latitude": 37.7688,
              "longitude": -122.262
            },
            "id": "iqse_ABC123",
            "relationships": {
              "inquiry": {
                "data": {
                  "type": "inquiry",
                  "id": "inq_ABC123"
                }
              }
            }
          },
          {
            "type": "inquiry-template",
            "attributes": {
              "name": "Twilio Desktop",
              "status": "active"
            },
            "id": "itmpl_ABC123",
            "relationships": {
              "latest-published-version": {
                "data": {
                  "type": "inquiry-template-version",
                  "id": "itmplv_ABC123"
                }
              }
            }
          }
        ]
      }
    },
    "id": "evt_o9byQRbjygu76Jbtea9wuJ1boP7a",
    "type": "event"
  }
}
```
