# Print Report PDF

GET

https://api.withpersona.com/api/v1/reports/:report-id/print

GET

/api/v1/reports/:report-id/print

Python

```
import requests

url = "https://api.withpersona.com/api/v1/reports/report-id/print"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.json())
```

Try it

Prints a report in PDF format.

### Authentication

AuthorizationBearer

Bearer authentication of the form `Bearer <token>`, where token is your auth token.

### Path parameters

report-idstringRequired

### Headers

Key-InflectionenumOptional

Determines casing for the API response.

Allowed values:camelkebabsnake

Idempotency-KeystringOptional

Ensures the request is idempotent.

Persona-VersionenumOptional

Server API version. More info on versioning can be found [here](../../versioning.md).

### Response

This endpoint returns a PDF of a Report object.

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

429

Too Many Requests Error
