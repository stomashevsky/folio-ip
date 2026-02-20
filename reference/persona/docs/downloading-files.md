# Downloading Files

Files belonging to your organization can be downloaded from [files.withpersona.com](https://files.withpersona.com/).

These files can include photos associated with a verification, such as driver license or passport photos, or key photos extracted from the selfie video.

Files connected to a resource will be available to download via their respective “retrieve” endpoint. For example, files associated with an Inquiry will be returned by the [Retrieve an Inquiry](./api-reference/inquiries/retrieve-an-inquiry.md) API endpoint. File URLs will be available within the `included` `document` or `selfie` objects within the Inquiry API response.

In API responses, file URLs appear in the form `https://files.withpersona.com/[filename].[extension]?access_token=[token]`. Each file URL contains a signed access token, and thus can load the file without an additional Persona API key in the request header.

By default, each URL remains valid for 6 hours after the API request was made. Afterwards, the access token expires, and a new API request must be made to obtain new file URLs. The expiration timeout is configurable per API key or Webhook, up to 3 days.

## New behavior in `v2023-01-05`

The way file URLs are serialized in all API responses has changed as of API version `v2023-01-05`. This change affects how you use file URLs returned from an API response to download files, and alters the level of access control embedded in the file URLs.

### Old behavior

File URLs were of the form `https://withpersona.com/api/v1/files/[token]/[filename].[extension]`, and required a Persona API key in the request header to access them.

### New behavior

File URLs are of the form `https://files.withpersona.com/[filename].[extension]?access_token=[token]`. A Persona API key is not needed.

### What remains the same

The Download a File API remains unchanged for previous API versions.

### Usage patterns to migrate

If you save URLs returned from API responses for use beyond 6 hours into the future, going forward, you will need to account for URLs expiring after 6 hours.
