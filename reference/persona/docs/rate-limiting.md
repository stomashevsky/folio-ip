# Rate Limiting

## Rate Limits

We use rate limiting to safeguard the stability of our API. There are two main types of rate limits to consider: Environment Rate Limits and product-specific Quotas.

### Environment Rate Limits

Every environment has a rate limit that determines the number of API requests that can be made within a specific timeframe.

The default rate limiter for production environments allows up to 300 requests per minute timeframe for all API requests from any API key within the environment. The request count starts when the first request is made, allowing up to 300 requests within the first 60 seconds. The count resets at the start of the next minute.

You can see the rate limits by navigating to [API > Rate Limits](https://app.withpersona.com/dashboard/api-rate-limits) within the Persona Dashboard, with the appropriate environment selected.

Any request over the limit will return a `429 Too Many Requests` error.

Our server responses also return your API limit, remaining requests, and seconds until the limit resets as headers. If you `curl` the endpoints with the `-vvv` flag, you’ll see the headers as such.

```
...
< ratelimit-limit: 300
< ratelimit-remaining: 280
< ratelimit-reset: 53
```

### Product-specific Quotas

Within an environment, there are product-specific rate limits that determine the number of API calls that can be made to create an object (for a particular product) within a specific timeframe. These product-specific rate limits are referred to as Quotas.

As an example, for a particular production environment, there may be an Inquiry Quota which allows up to 150 requests per minute timeframe for Inquiry Created requests from any API key within the environment. The request count starts when the first request is made, allowing up to 150 requests within the first 60 seconds. The count resets at the start of the next minute.

Most environments have Quotas for the following: Inquiry creation, Verification creation, Report creation, Case creation, and Transaction creation.

You can see Quotas by navigating to [API > Rate Limits](https://app.withpersona.com/dashboard/api-rate-limits) within the Persona Dashboard, with the appropriate environment selected.

Any request over the limit will return a `429 Too Many Requests` error.

Our server responses also return your API limit, remaining requests, and seconds until the limit resets as headers. If you `curl` the endpoints with the `-vvv` flag, you’ll see the headers as such.

```
...
< quota-limit: 150
< quota-remaining: 141
< quota-reset: 53
```

## Best Practices

-   **Structured Retry Logic** - To react to a `429`, we recommend implementing an exponential backoff strategy. This approach helps manage rate limits effectively, ensuring your requests are processed as soon as capacity becomes available. A sample backoff interval could start with delays of 5 seconds, then progressively increase to 10, 20, 40 seconds, and so forth.
-   **Monitoring `RateLimit` response headers** \- [Rate limits and quotas](./rate-limiting.md) are available [in the dashboard](https://app.withpersona.com/dashboard/api-rate-limits), with additional details provided dynamically in response headers for each API request. We recommend monitoring the `RateLimit-Remaining` header and, if it drops below 15% of the `RateLimit-Limit`, begin throttling requests to avoid reaching the limit. This is especially useful for operations that are high volume. You should also consider building alerting in your system to notify you when you’re approaching your rate limit.
-   **Monitoring `QuotaLimit` response headers** \- [Rate limits and quotas](./rate-limiting.md) are available [in the dashboard](https://app.withpersona.com/dashboard/api-rate-limits), with additional details provided dynamically in response headers for each API request. For API requests that create an object within Persona, we recommend monitoring the `QuotaLimit-Remaining` header and, if it drops below 15% of the `QuotaLimit-Limit`, begin throttling requests to avoid reaching the limit. Similarly to `RateLimit` response headers, it can be useful to build alerting into your system.
