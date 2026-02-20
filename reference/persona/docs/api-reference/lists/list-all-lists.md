# List all Lists

GET

https://api.withpersona.com/api/v1/lists

```
{
  "data": [
    {
      "type": "list/phone-number",
      "attributes": {
        "name": "My List",
        "status": "active",
        "created-at": "2023-08-30T21:31:06.000Z",
        "updated-at": "2023-08-30T21:31:06.000Z"
      },
      "id": "lst_kRcKDJ4c8wF2AmAghggtYxboX",
      "relationships": {
        "list-items": {
          "data": []
        }
      }
    }
  ],
  "links": {
    "prev": null,
    "next": "/api/v1/lists?page%5Bafter%5D=lst_3DS1z7bME8vWqqxmdCDqHwLm"
  }
}
```
