# Protocol

The Persona API uses `GET`, `POST`, `PATCH`, and `DELETE` requests to communicate and HTTP response codes to indicate status and errors. All responses come in standard JSON. The Persona API is served over HTTPS TLS v1.2+ to ensure data privacy; HTTP and HTTPS with TLS versions below 1.1 are not supported. Requests should typically include a `Content-Type` of `application/json` and the body must be valid JSON. Exceptions are for uploading files for some APIs, where you can use a `Content-Type` of `multipart/form-data`.

#### Encoding query string values

When passing query string arguments, please be sure to make values URL-safe, e.g. with `encodeURIComponent` in JavaScript. For example, if passing a phone number with an area code, `'%2B1...'` should be passed instead of `'+1...'`.
