# Request IDs

```
require 'http'
response = HTTP.
  headers('Authorization': "Bearer #{api_key}").
  get('https://api.withpersona.com/api/v1/inquiries?page[after]=inq_4eC39HqLyjWDarjtT1zdp7dc&page[size]=100')
request_id = response.headers['Request-Id']
```
