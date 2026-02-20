# List all Devices

[API Reference](../accounts/list-all-accounts.md)[Devices](./list-all-devices.md)

# List all Devices

GET

https://api.withpersona.com/api/v1/devices

```
{
  "data": [
    {
      "id": "dev_ABC123",
      "attributes": {
        "device-vendor-id": "1a2b3c4d-5e6f-7g8h-9ijk-1A2B3C4D5E6F",
        "device-fingerprint": "1a2b3c4d5e6f7g8h9ijk",
        "browser-fingerprint": "1a2b3c4d5e6f7g8h9ijklmnopqrstuvw"
      },
      "type": "device"
    }
  ],
  "links": {
    "prev": "/api/v1/devices?page%5Bbefore%5D=dev_ABC123",
    "next": "/api/v1/devices?page%5Bafter%5D=dev_ABC123"
  }
}
```
