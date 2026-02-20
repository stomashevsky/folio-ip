# Pagination

Pagination is implemented with a cursor to ensure that consecutive requests of pages are not affected by newly created objects. When listing a resource, the response will contain a list of objects up to the specified page size. The most recently created object will appear first. All pagination fields are optional and should be passed in as URL parameters.

| Parameter | Description |
| --- | --- |
| page\[after\] | A cursor for use in pagination. `page[after]` is the object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with `inq_bar`, your subsequent call can include `page[after]=inq_bar` in order to fetch the next page of the list. |
| page\[before\] | A cursor for use in pagination. `page[before]` is the object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with `inq_bar`, your subsequent call can include `page[before]=inq_bar` in order to fetch the previous page of the list. |
| page\[size\] | A limit on the number of objects returned. Limit can range between 1 and 100 (default is 10). |

```
require 'http'
response = HTTP.
  headers('Authorization': "Bearer #{api_key}").
  get('https://api.withpersona.com/api/v1/inquiries?page[after]=inq_4eC39HqLyjWDarjtT1zdp7dc&page[size]=100')
inquiry = JSON.parse(response.body)
```
