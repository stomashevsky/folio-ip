# Generate a one-time link for Inquiry Session

[API Reference](../accounts/list-all-accounts.md)[Inquiry Sessions](./list-all-inquiry-sessions.md)

# 

Generate a one-time link for Inquiry Session

POST

https://api.withpersona.com/api/v1/inquiry-sessions/:inquiry-session-id/generate-one-time-link

```
{
  "data": {
    "id": "iqse_ABC123",
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
      "browser-name": "Chrome",
      "browser-full-version": "115.0.0.0",
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
    "relationships": {
      "inquiry": {
        "data": {
          "type": "inquiry",
          "id": "inq_ABC123"
        }
      },
      "device": {
        "data": {
          "type": "device",
          "id": "dev_ABC123"
        }
      }
    },
    "type": "inquiry-session"
  },
  "meta": {
    "one-time-link": "https://withpersona.com/verify?code=CODE",
    "one-time-link-short": "https://perso.na/CODE"
  }
}
```
