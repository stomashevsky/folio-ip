# Run an account action

[API Reference](./list-all-accounts.md)[Accounts](./list-all-accounts.md)

# Run an account action

POST

https://api.withpersona.com/api/v1/accounts/:account-id/run-action

Basic account action triggerSuccess

POST

/api/v1/accounts/:account-id/run-action

cURL

```
curl -X POST https://api.withpersona.com/api/v1/accounts/account-id/run-action \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
  "data": {
    "account-action-id": "accac_h4Ln3agRBwdpZD55Lef8fDwjuvjG",
    "parameters": {
      "status": "activated"
    }
  }
}'
```

Try it

```
{
  "data": {
    "id": "act_hpNqyAbEG4HeVjZoBRNCMKkA",
    "attributes": {
      "reference-id": "abc-123",
      "account-type-name": "User",
      "created-at": "2023-09-22T17:13:49.000Z",
      "updated-at": "2023-09-23T00:22:19.000Z",
      "fields": {
        "name": {
          "type": "hash",
          "value": {
            "first": {
              "type": "string",
              "value": "Jane"
            },
            "middle": {
              "type": "string",
              "value": "Marie"
            },
            "last": {
              "type": "string",
              "value": "Doe"
            }
          }
        },
        "address": {
          "type": "hash",
          "value": {
            "street_1": {
              "type": "string",
              "value": "123 Main St"
            },
            "street_2": {
              "type": "string"
            },
            "subdivision": {
              "type": "string",
              "value": "California"
            },
            "city": {
              "type": "string",
              "value": "San Francisco"
            },
            "postal_code": {
              "type": "string",
              "value": "94111"
            },
            "country_code": {
              "type": "string",
              "value": "US"
            }
          }
        },
        "identification_numbers": {
          "type": "array",
          "value": [
            {
              "type": "hash",
              "value": {
                "identification_class": {
                  "type": "string",
                  "value": "visa"
                },
                "identification_number": {
                  "type": "string",
                  "value": "12345678"
                },
                "issuing_country": {
                  "type": "string",
                  "value": "US"
                }
              }
            },
            {
              "type": "hash",
              "value": {
                "identification_class": {
                  "type": "string",
                  "value": "visa"
                },
                "identification_number": {
                  "type": "string",
                  "value": "87654321"
                },
                "issuing_country": {
                  "type": "string",
                  "value": "UK"
                }
              }
            },
            {
              "type": "hash",
              "value": {
                "identification_class": {
                  "type": "string",
                  "value": "cct"
                },
                "identification_number": {
                  "type": "string",
                  "value": "A12345678"
                },
                "issuing_country": {
                  "type": "string",
                  "value": "AF"
                }
              }
            }
          ]
        },
        "birthdate": {
          "type": "date",
          "value": "1994-12-30"
        },
        "phone_number": {
          "type": "string",
          "value": "111-222-3333"
        },
        "email_address": {
          "type": "string",
          "value": "jane@doe.com"
        },
        "selfie_photo": {
          "type": "file"
        }
      },
      "tags": [
        "tag1",
        "tag2"
      ]
    },
    "relationships": {
      "account-type": {
        "data": {
          "id": "acttp_7X5W5w9GMtQntE6oPtKnj44c",
          "type": "account-type"
        }
      }
    },
    "type": "account"
  },
  "meta": {
    "workflow-run-id": "wfr_abc123def456ghi789"
  }
}
```

Triggers an account action for the specified account

### Authentication

AuthorizationBearer

Bearer authentication of the form `Bearer <token>`, where token is your auth token.

### Path parameters

account-idstringRequired`format: "^act_[a-zA-Z0-9]{24,28}$"`

The ID of the account to run the action on

### Request

This endpoint expects an object.

dataobjectRequired

### Response

Account action executed successfully

dataobject

An Account object.

Note that `fields` is **not** key inflected.

metaobject

### Errors

400

Bad Request Error

401

Unauthorized Error

403

Forbidden Error

404

Not Found Error

409

Conflict Error

422

Unprocessable Entity Error

429

Too Many Requests Error
