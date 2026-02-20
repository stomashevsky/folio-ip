# Overview

Our API responses use standard HTTP status codes: `2xx` status codes indicate success, `4xx` status codes indicate invalid input or invalid action on current state, and `5xx` status codes indicate a rare error on Persona’s servers.

## Error handling

Errors that you will receive from Persona fall into three major categories:

-   [Client errors](./errors.md#client-errors): Invalid content in the API request.
-   [Network errors](./errors.md#network-errors): Intermittent communication problems between client and server.
-   [Server errors](./errors.md#server-errors): A problem on Persona’s servers.

[A list of all error codes](./errors.md#error-codes) is provided at the end of this page.

### Client errors

Client errors result from invalid content of an API request. They return an HTTP response with a `4xx` error code. For example, the server may return a `401` if you provide an invalid API key, or a `422` if invalid parameters were provided. **For client errors, we generally recommend correcting the original request and trying again.**

#### Error-specific best practices

##### `4xx` and Idempotency

-   For a `POST` operation using an [idempotency key](./idempotence.md), Persona will cache the results of requests as long as the API call was acknowledged. This means that a request that returns a `400` sends back the same `400` if followed by a new request with the same parameters and idempotency key. **We recommend generating a fresh idempotency key when modifying the original request to get a successful result.**
-   There are caveats to the above. For example, if you receive a `429` error due to your request being rate limited, subsequent requests with the same idempotency key will still run because rate limiters are executed before the API’s idempotency layer. The same goes for a `401` due to an invalid API key. Even so, the safest strategy to address most `4xx` errors is to generate a new idempotency key, correct the request, and try again.

##### `409` Conflict

-   This type of error can occur when attempting to create a duplicate resource or attempting to update the same resource while it is actively being modified. **To prevent `409` errors, we recommend checking for the existence or current state of the resource before making the API request.** This practice can help prevent conflicts by ensuring that your request is compatible with the current resource state.
    
-   Examples of actions that can cause 409 errors include:
    
    -   **Attempting to create a duplicate resource** - An example is attempting to create an `Account` with `reference id` that is already in use. This is considered a duplicate resource as `reference id` is a unique identifier for that resource and therefore cannot be used to create another `Account`.
    -   **Attempting to modify a resource that is actively being modified** - An example is attempting to update both the field values and the `status` of a `Transaction` in two different requests simultaneously, which can lead to conflicts. Instead, first, update the desired fields, then retrieve the `Transaction` to confirm the updates, and finally, update the `status`.
    -   **Attempting to modify a resource in an unacceptable way** - An example is attempting to [Resume an Inquiry](./api-reference/inquiries/resume-an-inquiry.md) when that specific Inquiry is in an incompatible state (i.e. not `pending`, not `expired`).

##### `429` Too Many Requests

-   **Structured Retry Logic** - To react to a `429`, we recommend implementing an exponential backoff strategy. This approach helps manage rate limits effectively, ensuring your requests are processed as soon as capacity becomes available. A sample backoff interval could start with delays of 5 seconds, then progressively increase to 10, 20, 40 seconds, and so forth.
-   **Monitoring `RateLimit` response headers** \- [Rate limits and quotas](./rate-limiting.md) are available [in the dashboard](https://app.withpersona.com/dashboard/api-rate-limits), with additional details provided dynamically in response headers for each API request. We recommend monitoring the `RateLimit-Remaining` header and, if it drops below 15% of the `RateLimit-Limit`, begin throttling requests to avoid reaching the limit. This is especially useful for operations that are high volume. You should also consider building alerting in your system to notify you when you’re approaching your rate limit.
-   **Monitoring `QuotaLimit` response headers** \- [Rate limits and quotas](./rate-limiting.md) are available [in the dashboard](https://app.withpersona.com/dashboard/api-rate-limits), with additional details provided dynamically in response headers for each API request. For API requests that create an object within Persona, we recommend monitoring the `QuotaLimit-Remaining` header and, if it drops below 15% of the `QuotaLimit-Limit`, begin throttling requests to avoid reaching the limit. Similarly to `RateLimit` response headers, it can be useful to build alerting into your system.

### Network errors

Network errors are the result of connectivity problems between client and server. These are likely caused by low-level errors from your HTTP client library, like socket or timeout exceptions. For example, a client may time out while trying to read from Persona’s servers, or an API response might never be received because a connection terminates prematurely. Although a network error _seems_ like it will succeed after you fix the connectivity problems, sometimes there’s another type of error hiding in the intermittent problem.

`POST` requests with large request bodies often are the root cause of timeout errors. We strongly recommend evaluating your HTTP client’s timeout settings when sending such requests. In addition, modifying the `content-type` to use `multipart/form-data` often also helps reduce such errors.

Idempotency keys and request retries are most valuable in addressing network errors. When intermittent issues occur, the client library is usually left in a state where it does not know whether or not the server received the request.

**For network errors, the client should retry such requests with the same idempotency key and the same parameters until it’s able to receive a result from the server.** Sending the same idempotency key with different parameters produces an error indicating that the new request didn’t match the original.

### Server errors

Server errors result from a problem with Persona’s servers. They return an HTTP response with a `5xx` error code. These errors are the most difficult to handle and the Persona team tries our best to ensure they occur as rarely as possible. The most likely time to observe a server error is during a production incident. You can check the status of Persona’s system on our [status page](https://status.withpersona.com/). You should treat the result of a server error as indeterminate.

If the request was able to reach the idempotency layer, the server will cache the result of requests. This means that retried attempts with the same idempotency key will produce the same `5xx` result. However, unlike for client errors, this is not guaranteed due to the server potentially being fully unavailable and the request not being successfully processed by the idempotency layer.

#### Best practices

-   **Structured Retry Logic** - While Persona strives to maintain high uptime, implementing retry logic for server errors is an industry best practice to improve resilience. **We recommend retrying requests with an exponential backoff strategy with new requests and new idempotency keys**, if it is safe for your use case. A backoff interval of 5, 10, 20, 40 seconds, and so forth is commonly used.
-   **Leverage Accounts** - [Accounts](./accounts.md) allow you to mirror how users, individuals, or entities are modeled in your system, but within Persona. Account `reference id` can be set as part of your integration, acting as a unique identifier for the resource. We recommend leveraging `reference id` and Accounts to properly group requests, to make it easy to track objects that were re-created, and to act as a system of record for your data.

## Error monitoring

Persona’s infrastructure is designed with redundancy and high availability to keep downtime to an absolute minimum, and server errors are rare.

Nonetheless, implementing monitoring and alerting mechanisms to detect and respond to error patterns promptly is encouraged. Simple alerting for error rate spikes can also offer helpful insight when troubleshooting. This proactive approach helps maintain a healthy integration and system reliability.

## Error codes

When an error is encountered, error codes are found in the `status` of the response. Additionally, the response body contains a list of errors with `title` and `details`.

```json
{
  "errors": [
    {
      "title": "Bad Request",
      "details": "data.attributes.name is missing"
    }
  ]
}
```

Below is a list of possible error codes with their meanings.

| HTTP Status Code | Description |
| --- | --- |
| 400 - Bad Request | The request was unacceptable, often due to invalid parameters. |
| 401 - Unauthorized | An invalid API key was provided. |
| 403 - Forbidden | The given API key doesn’t have permissions to perform the request or a quota has been exceeded. |
| 404 - Not Found | The requested resource doesn’t exist. |
| 409 - Conflict | The request conflicts with another request, often due to attempting to create a duplicate resource. |
| 422 - Unprocessable Entity | The request modifies the resource in an unacceptable way, often due to an invalid action or parameter. |
| 429 - Too Many Requests | Your organization’s rate limit has been exceeded. We recommend an exponential backoff on requests. |
| 500, 502, 503, 504 - Server Errors | Something went wrong on Persona’s end. These are rare. |
