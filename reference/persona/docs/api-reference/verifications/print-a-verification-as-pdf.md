# Print Verification PDF

[API Reference](../accounts/list-all-accounts.md)[Verifications](../verifications.md)

# Print Verification PDF

GET

https://api.withpersona.com/api/v1/verifications/:verification-id/print

GET

/api/v1/verifications/:verification-id/print

cURL

```
curl https://api.withpersona.com/api/v1/verifications/verification-id/print \
     -H "Authorization: Bearer <token>"
```

Try it

Prints a verification in PDF format.

### Authentication

AuthorizationBearer

Bearer authentication of the form `Bearer <token>`, where token is your auth token.

### Path parameters

verification-idstringRequired

### Headers

Key-InflectionenumOptional

Determines casing for the API response.

Allowed values:camelkebabsnake

Idempotency-KeystringOptional

Ensures the request is idempotent.

Persona-VersionenumOptional

Server API version. More info on versioning can be found [here](../../versioning.md).

### Response

This endpoint returns a PDF of a Verification object.

### Errors

400

Bad Request Error

401

Unauthorized Error

403

Forbidden Error

404

Not Found Error

429

Too Many Requests Error
