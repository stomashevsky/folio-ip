# Search Cases

POST

https://api.withpersona.com/api/v1/cases/search

Simple queryComplex boolean queryEmpty query (all cases)Success

POST

/api/v1/cases/search

cURL

```
curl -X POST https://api.withpersona.com/api/v1/cases/search \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
  "query": {
    "not": {
      "attribute": "status",
      "operator": "eq",
      "value": "resolved"
    }
  },
  "sort": {
    "attribute": "created_at",
    "direction": "asc"
  },
  "page": {
    "size": 15
  }
}'
```

Try it

```
{
  "data": [
    {
      "id": "case_ABC123",
      "attributes": {
        "status": "open",
        "name": "KCAS-1",
        "created-at": "2025-01-15T10:30:00.000Z",
        "updated-at": "2025-01-15T14:22:00.000Z",
        "assigned-at": "2025-01-15T10:35:00.000Z",
        "sla-expires-at": "2025-01-20T10:30:00.000Z",
        "creator-id": "case_creator@withpersona.com",
        "creator-type": "user",
        "assignee-id": "case_assignee@withpersona.com",
        "assigner-id": "manager@withpersona.com",
        "assigner-type": "user",
        "updater-id": "case_updater@withpersona.com",
        "updater-type": "user",
        "tags": [
          "urgent",
          "review-needed"
        ],
        "fields": {
          "priority": {
            "type": "string",
            "value": "high"
          },
          "amount": {
            "type": "number",
            "value": 1000
          }
        },
        "attachments": []
      },
      "relationships": {
        "accounts": {
          "data": []
        },
        "case-comments": {
          "data": []
        },
        "case-template": {
          "data": {
            "id": "ctmpl_ABC123",
            "type": "case-template"
          }
        },
        "case-queue": {
          "data": {
            "id": "cqueue_XYZ789",
            "type": "case-queue"
          }
        },
        "inquiries": {
          "data": []
        },
        "reports": {
          "data": []
        },
        "verifications": {
          "data": []
        },
        "txns": {
          "data": []
        }
      },
      "type": "case"
    },
    {
      "id": "case_DEF456",
      "attributes": {
        "status": "pending",
        "name": "KCAS-2",
        "created-at": "2025-01-14T15:20:00.000Z",
        "updated-at": "2025-01-14T16:10:00.000Z",
        "creator-id": "api_key_123",
        "creator-type": "api-key",
        "updater-id": "api_key_123",
        "updater-type": "api-key",
        "tags": [],
        "fields": {
          "priority": {
            "type": "string",
            "value": "medium"
          }
        },
        "attachments": []
      },
      "relationships": {
        "accounts": {
          "data": []
        },
        "case-comments": {
          "data": []
        },
        "case-template": {
          "data": {
            "id": "ctmpl_ABC123",
            "type": "case-template"
          }
        },
        "case-queue": {},
        "inquiries": {
          "data": []
        },
        "reports": {
          "data": []
        },
        "verifications": {
          "data": []
        },
        "txns": {
          "data": []
        }
      },
      "type": "case"
    }
  ],
  "links": {
    "prev": "/api/v1/cases/search?page%5Bbefore%5D=case_ABC123&page%5Bsize%5D=10",
    "next": "/api/v1/cases/search?page%5Bafter%5D=case_DEF456&page%5Bsize%5D=10"
  }
}
```

Search for cases using a flexible query language.

## Search vs. List Endpoints

The Search and List endpoints serve different purposes and have distinct performance characteristics.

Use the **Search** endpoint (`POST /cases/search`) when you need to perform complex queries with boolean logic (AND/OR/NOT), filter by custom fields, assignee, case queue, or SLA expiration, or apply multiple conditions simultaneously. Search is optimized for flexible querying and is faster than paginating through all resources when looking for specific records.

Use the **List** endpoint (`GET /cases`) for simple listing with basic filters like status, case template, account, inquiry, or report.

## Data Freshness

Do not use search for read-after-write flows because the data will not be immediately available to search. Under normal operating conditions, data is searchable within approximately 1 minute of creation or modification. Propagation of new or updated data could be delayed during an outage. For workflows that require immediate data availability after creating or updating a case, use the List Cases endpoint instead.

### Searchable Attributes

The following attributes can be used in query predicates:

| Attribute | Description |
| --- | --- |
| `template` | Case template (e.g., `ctmpl_ABC123`) |
| `status` | Case status (e.g., `open`, `pending`, `resolved`) |
| `state` | Case state |
| `created_at` | Case creation timestamp |
| `updated_at` | Case last updated timestamp |
| `resolved_at` | Case resolution timestamp |
| `sla_expires_at` | SLA expiration timestamp |
| `assignee` | Assigned user (e.g., `user_ABC123`) |
| `case_queue` | Case queue (e.g., `cqueue_ABC123`) |
| `resolver` | Resolver user |
| `fields.*` | Custom case field (e.g., `fields.priority`) |

**Note:** Custom fields (`fields.*`) must be configured as searchable on the Case Template to be queryable.

### Authentication

AuthorizationBearer

Bearer authentication of the form `Bearer <token>`, where token is your auth token.

### Headers

Key-InflectionenumOptional

Determines casing for the API response.

Allowed values:camelkebabsnake

Idempotency-KeystringOptional

Ensures the request is idempotent.

Persona-VersionenumOptional

Server API version. More info on versioning can be found [here](../../versioning.md).

### Query parameters

fieldsmap from strings to stringsOptional

Comma-separated list(s) of attributes to include in the response. This can be used to customize which attributes will be serialized in the response. See [Serialization](../../serialization.md#sparse-fieldsets) for more details.

pageobjectOptional

### Request

This endpoint expects an object.

queryobjectOptional

Search query using boolean logic (AND/OR/NOT) and comparison operators. Supports predicates with operators: eq (equal), gt (greater than), gte (greater than or equal), lt (less than), lte (less than or equal).

sortobjectOptional

Sort configuration for results

pageobjectOptional

Pagination parameters

### Response

This endpoint returns a collection of Case objects matching the search criteria.

datalist of objects

An array of Cases matching the search criteria

linksobject

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
