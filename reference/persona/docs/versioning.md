# Versioning

When we make backwards-incompatible changes to the API, we release new, dated versions. The latest released version is 2025-12-08.

All requests will use your API key’s settings, unless you override the API version. To set the API version on a specific request, send a `Persona-Version: <version>` header.

You can visit [your Dashboard](https://withpersona.com/dashboard/api-keys) to upgrade your API version. As a precaution, use API versioning to test a new API version before committing to an upgrade. Different API keys can be on different API versions.

Keep track of changes and upgrades to the Persona API through our [API Changelog](./changelog.md).

## Backwards-compatible changes

We do NOT consider the following types of changes to be breaking changes.

#### Changes made on an ongoing basis

Your implementation MUST be resilient to these types of changes. In an effort to continue improving our platform, Persona makes these types of changes on an ongoing basis.

-   Adding new API resources, paths, and methods.
    
    -   ⚠️ **WARNING:** When adding new resources, we will add a new possible value for the `type` attributes used to indicate what kind of Persona resource an object is. You should NOT expect these attributes to be a static enumeration.
        
    -   Example: [Adding new type of Verification](./changelog/2023/10/2.md).
        
-   Adding new optional request parameters or headers to existing APIs.
    
    -   Example: [Adding `phone-number` to Report creation](./changelog/2023/11/27.md).
-   Expanding acceptable values for an existing request parameter or header.
    
    -   Example: [Allow updating Inquiries in more states](./changelog/2024/2/26.md).
-   Adding new attributes to existing API responses.
    
    -   Example: [Add assigner attributes to Cases](./changelog/2024/2/5.md).
-   Expanding or collapsing possible values for an attribute in existing API responses.
    
    -   ⚠️ **WARNING:** Your implementation should gracefully handle unknown values. You should NOT expect string attributes to be a static enumeration.
        
    -   Examples:
        
        -   [Consolidate `result.identifiers.status` for Business Lookup Reports](./changelog/2023/9/18.md).
        -   [Expanded Document classification to include new types](./changelog/2023/5/1.md).
-   Adding new items in array attribute values.
    
    -   Example: [Adding Inquiry Templates to `included` array for Inquiries](./changelog/2023/8/21.md).
-   Adding new relationships between different Persona resources.
    
    -   Example: [Adding Transactions to Cases](./changelog/2023/3/20.md).
-   Reordering of items in array attribute values.
    
-   Changing the order of properties in existing API responses.
    
-   Adding new event types.
    
-   Changing the length or format of opaque strings, such as object IDs, error messages, and other human-readable strings.
    
    -   This includes adding or removing fixed prefixes (such as `inq_` on Inquiry IDs).
-   New validations or restrictions added to protect our systems from bad behavior, such as rate limits or restrictions against malicious input in requests.
    

## Breaking changes

We consider the following types of changes to be backwards-incompatible. When we make these changes, we release a new version of the API. You’re in charge of when you get breaking changes—you get them when you upgrade your API version.

-   Removing or renaming an existing API.
    
-   Removing or renaming existing request parameters or headers.
    
-   Removing support for a previously acceptable request parameter or header value.
    
-   Adding a new required request parameter or header value to an existing API.
    
-   Adding validations or restrictions that would cause previously valid requests to be considered invalid.
    
-   Removing or renaming an attribute in existing API responses.
    
-   Changing the type of an attribute in existing API responses.
    
-   Changing the status code for a particular scenario (except when the existing status code is `404` or `5xx`).
    
-   Changing the semantics of a value for an existing request parameter, header, or attribute in existing API responses.
    
-   Removing relationships between different Persona resources.
