# Inquiry Signals

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Model References](./model-lifecycle.md)

# Inquiry Signals

Platform signals computed for an inquiry (such as fraud scores and behavioral indicators) can be exposed on the external Inquiry API and webhooks. This allows you to consume risk and trust signals directly from inquiry responses without needing to make separate API calls.

#### Requires enablement

Signals on the Inquiry API are gated behind a feature flag at the organization level. Contact your CSM or [Persona support](https://app.withpersona.com/dashboard/contact-us) to enable this feature for your organization.

## How it works

The `GET /api/v1/inquiries/:id` response includes a `signals` array in `data.attributes`. When the feature is enabled and signals are available, the array is populated:

```json
{
  "data": {
    "id": "inq_abc123",
    "type": "inquiry",
    "attributes": {
      "status": "approved",
      "signals": [
        {
          "name": "inquiry/bot_score",
          "value": 42
        },
        {
          "name": "inquiry/behavior_threat_level",
          "value": "low"
        }
      ]
    }
  }
}
```

When the feature is not enabled, `signals` will be an empty array:

```json
{
  "data": {
    "id": "inq_abc123",
    "type": "inquiry",
    "attributes": {
      "status": "approved",
      "signals": []
    }
  }
}
```

## Signal object fields

Each signal in the array contains the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | The identifier for the signal (e.g. `inquiry/bot_score`, `inquiry/behavior_threat_level`). |
| `value` | string or number | The computed value of the signal. The type depends on the specific signal. |

## Which signals appear

Only signals that pass visibility checks for your organization are included in the response. Specifically:

-   The signal must be assigned to the inquiry’s template version.
-   The signal’s visibility rules must be satisfied (based on product features and environment restrictions).

The set of visible signals may vary across inquiry templates and template versions. If no signals are visible for a given inquiry, the `signals` array will be empty.

## Webhook exposure

Since `signals` is an inline attribute on the inquiry object, it automatically appears in all inquiry webhook event payloads (e.g. `inquiry.completed`, `inquiry.approved`, `inquiry.declined`). No additional webhook configuration is required. When the feature is not enabled, `signals` will be an empty array in the webhook payload.

For example, an `inquiry.approved` webhook event payload will include signals in the inquiry attributes:

```json
{
  "data": {
    "type": "event",
    "id": "evt_XGuYWp7WuDzNxie5z16s7sGJ",
    "attributes": {
      "name": "inquiry.approved",
      "payload": {
        "data": {
          "type": "inquiry",
          "id": "inq_abc123",
          "attributes": {
            "status": "approved",
            "signals": [
              {
                "name": "inquiry/bot_score",
                "value": 42
              },
              {
                "name": "inquiry/behavior_threat_level",
                "value": "low"
              }
            ]
          },
          "relationships": {
            "template": {
              "data": {
                "id": "tmpl_XYZ789",
                "type": "template"
              }
            }
          }
        }
      },
      "created-at": "2026-02-16T19:01:00.000Z"
    }
  }
}
```

See the [Webhooks Overview](./webhooks.md) for more information on configuring and consuming webhooks.
