# API Changelog

[

# API Changelog

](./api-changelog.md)

Subscribe via RSS

## About

Below is a log of changes to the Persona API. Updates that affect only products or features in beta or limited release may not be reflected.

Each change can be described as either a breaking change or an ongoing change.

-   **Breaking changes = new API version**: When we make any backwards-incompatible changes, we release a new version of the API. In addition to being assigned a new API version, these changes are marked in the changelog with the 💥 symbol. You’re in charge of when you get breaking changes—you get them when you upgrade your API version. Learn how to try out and upgrade to newer API versions.
-   **Ongoing changes**: Ongoing changes are backwards-compatible, and are added on an ongoing basis. You don’t need to update your API version to get these updates.

##### SDK changelogs

Each Persona SDK has a separate changelog: [Android SDK](../../android-sdk-v2-changelog.md), [iOS SDK](../../ios-sdk-v2-changelog.md), [React Native SDK](../../react-native-sdk-v2-changelog.md), [Javascript SDK](../../embedded-flow-changelog.md), [Inlined React SDK](../../inlined-react-changelog.md), [Inlined Vue SDK](../../inlined-vue-changelog.md)

## Key

🌱 New feature

🍃 Improvement

🔧 Fix

💥 Breaking change

🔒 Security-related

[January 12, 2026](./api-changelog/2026/1/12.md)

[January 12, 2026](./api-changelog/2026/1/12.md)

### Reports

-   🍃 **Add position topics, start dates, and end dates to Politically Exposed Person Reports**: The `positions` attribute in Politically Exposed Person Reports now exposes position topics as well as the start and end dates indicating the duration each position was held. See the [Retrieve a Report](../reports/retrieve-a-report.md) endpoint for details.

### Events

-   🍃 **Add `context` attribute to Events and Webhook Events**: Events and Webhook Event resources now include a **`context`** [**attribute**](../events/retrieve-an-event.md#response.body.data.attributes.context) that can hold additional information for certain event types. To start, the `account.added-relation` and `account.removed-relation` events will have `relation-schema-key` and `target-account-id` attributes within `context`.

---

[December 16, 2025](./api-changelog/2025/12/16.md)

[December 16, 2025](./api-changelog/2025/12/16.md)

### Accounts

-   🌱 **Add endpoint to search Accounts**: You can now use complex queries to search for Accounts via [the search endpoint](../accounts/search-accounts.md). Using search is a faster alternative to using the [list all Accounts endpoint](../accounts/list-all-accounts.md). It is not appropriate for read-after-write flows because the data is not immediately available to search.

### Cases

-   🌱 **Add endpoint to search Cases**: You can now use complex queries to search for Cases via [the search endpoint](../cases/search-cases.md). Using search is a faster alternative to using the [list all Cases endpoint](../cases/list-all-cases.md). It is not appropriate for read-after-write flows because the data is not immediately available to search.

### Reports

-   🌱 **Add endpoint to retrieve Report history**: You can now retrieve the full audit history of the report, including the scheduled and ad-hoc report runs + report actions from [a dedicated endpoint](../reports/list-report-history.md).

---

[December 8, 2025](./api-changelog/2025/12/8.md)

[December 8, 2025](./api-changelog/2025/12/8.md)

## API version: 2025-12-08

### Reports

-   💥 **Stop returning Report run-history:** The run-history attribute has been deprecated from being part of a Report response.
    
    **Migration:** Clients should call the [List Report history](../../2025-10-27/api-reference/reports/list-report-history.md) endpoint to retrieve the run history of a Report by its ID.
    

---

[October 27, 2025](./api-changelog/2025/10/27.md)

[October 27, 2025](./api-changelog/2025/10/27.md)

### Government ID Documents and Verifications

-   🍃 **Surface non-Latin name extractions**: Government ID [Document](../documents/retrieve-a-government-id-document.md#response.body.data.attributes.native-name-first) and [Verification](../verifications/retrieve-a-verification.md#response.body.data.Government-ID-Verification.attributes.native-name-first) resources now include `native_name_first`, `native_name_middle`, `native_name_last`, and `native_name_title`.

## API version: 2025-10-27

This version improves performance and consistency across endpoints for different products.

### Cross-API

-   💥 **Stop returning full relationship representations by default:** All endpoints will no longer return fully serialized relationship objects within the `included` array by default. To receive full representations, clients must now explicitly pass the `include` query parameter (for example, `?include=account,inquiry`).
    
    **Migration:** When upgrading to this version, update any client code that relied on implicit relationship inclusion to add the appropriate `include` query parameter for the relationships you need. See the [inclusion of related resources](../../response-body.md#specify-related-resources) guide for more details.
    
-   💥 **Stop applying key inflection to `data.attributes.fields`:** For endpoints returning Cases, Transactions, or Inquiries, key inflection will no longer be applied to field names within `data.attributes.fields`. Keys will now appear using the original inflection scheme configured for the field on the corresponding Case template, Inquiry template, or Transaction type.
    
    **Migration:** Update any client code that accesses custom field keys to use their configured inflection style instead of the previously transformed keys. Review [API key inflection](../../api-key-inflection.md) and the [Fields integration guide](../../integration-guide-understanding-a-persona-api-payload.md#fields) for reference.
    
-   🍃 **Sparse fieldset improvements:** We’ve made two improvements to how [sparse fieldsets](../../response-body.md#specify-attributes) work with the `fields[TYPE]` query parameter:
    
    1.  **Parent type filtering:** When you specify a parent resource type in a sparse fieldset, the filtering now automatically applies to all related subtypes. Example: If you filter by `fields[report]=status`, the filtering will now also apply to all specific report types like `report/business-lookup`, `report/watchlist`, etc.
    2.  **Inflection normalization:** Attribute names in the value of the `fields` parameter are now normalized, meaning you can use kebab-case, snake\_case, or camelCase interchangeably. Previously, you had to match the inflection of the attribute keys exactly to what would be returned in the response.

### Accounts

-   💥 **Remove Persona-provided PII fields from Account response:** Persona-provided PII fields (e.g. `name_first`, `name_last`, `birthdate`) will now only be accessible in `data.attributes.fields`.
    
    **Migration:** Clients should access the `data.attributes.fields` object from the Account resource. Field keys will not be inflected.
    
-   💥 **Don’t return full Account resource for HTTP 409 responses:** In some cases for older API versions, a full Account resource would be returned with an HTTP 409 (Conflict) response. We’ve made this consistent so all 4xx response bodies will include an error detail instead of a full Account resource.
    

### Cases

-   💥 **Ignore custom fields from Case create and update requests:** Customer-defined fields will no longer be valid top-level parameters for Case create and update requests. They can now only be specified in `data.attributes.fields`.
    
    **Migration:** Client requests should pass their values under `data.attributes.fields` instead of at the top level. This object should be a map where the keys are field keys and values are the intended field value. Field keys should not be inflected.
    
-   💥 **Require `status` to be passed in `meta` when setting Case status:** The set status on Case endpoint request body now requires the `status` value to be passed in `meta` instead of in `data.attributes`. Passing `status` within `data.attributes` will no longer be accepted.
    
    **Migration:** Update all client requests that call the [set status on Case endpoint](../cases/set-status-for-a-case.md) to include `status` inside the `meta` object.
    

### Inquiries

-   💥 **Ignore Persona-provided fields and custom fields from Inquiry create and update requests:** Persona-provided PII fields and customer-defined fields will no longer be valid top-level parameters for Inquiries create and update requests. They can now only be specified in `data.attributes.fields`.
    
    **Migration:** Client requests should pass their values under `data.attributes.fields` instead of at the top level. This object should be a map where the keys are field keys and values are the intended field value. Field keys should not be inflected. Commonly used attributes that may need to be moved include `name_first`, `name_last`, `country_code`, and address fields. As a special case, the top-level attribute `country_code` previously corresponded to the Persona-provided field `selected_country_code`. Users of this attribute should instead pass `data.attributes.fields.selected_country_code`.
    
-   💥 **Remove Persona-provided PII fields from Inquiry response:** Persona-provided PII fields (e.g. `name_first`, `name_last`, `birthdate`) will now only be accessible in `data.attributes.fields`.
    
    **Migration:** Clients should access the `data.attributes.fields` object from the Inquiry resource. This object will be a map where the keys are field keys and values are a map with keys `type`, which specifies the data type, and `value`, which specifies the collected value. Field keys will not be inflected.
    

### List Items

-   💥 **Remove `inquiry_matches` attribute from List Item response:** List Item resources will no longer include the `inquiry_matches` attribute. In previous versions, this was always an empty array.

### Reports

-   💥 **Remove `legal_entity_type` field from individual registry records:** The `legal_entity_type` field has been removed from individual registry records in Business Registrations Lookup Reports (BRRs). This field has historically been `null` for individual registry records and continues to be populated at the top level of the Report based on domestic registration data.

### Transactions

-   💥 **Limit size of `related-objects` relationship in Transaction responses:** The amount of `related-objects` that can be returned as part of a Transaction resource is now limited to 100. Transactions can _have_ more than 100 related objects, but only the first 100 will be present on Transaction responses.

### Verifications

-   💥 **Deprecate `database_business_ai_identity_comparison` check**: The `database_business_ai_identity_comparison` check has been deprecated. All AI-powered identity comparison results are now available in `database_business_identity_comparison`. This consolidation simplifies data retrieval by unifying AI and rules-based comparison outputs under a single check type.

### Workflow Runs

-   💥 **Require fields to be passed in `data.attribute.fields` when create Workflow Runs:** The [create a Workflow Run endpoint](../workflows/create-a-workflow-run.md) request body now requires fields to be passed in `data.attributes.fields` instead of `meta.params` or `data.attributes`.
    
    **Migration:** Client requests should pass their values under `data.attributes.fields` instead of at the top level or through `meta.params`. This object should be a map where the keys are field keys and values are the intended field value. The schema is defined by the trigger payload schema on your Workflow Version.
    

---

[October 20, 2025](./api-changelog/2025/10/20.md)

[October 20, 2025](./api-changelog/2025/10/20.md)

### Accounts

-   🌱 **Add endpoint to run an Account action**: You can now [run an account action](../accounts/run-account-action.md) via API.

### User Audit Logs

-   🍃 **Add `context.inquiry_id` attribute to User Audit Logs**: [User Audit Log](../user-audit-logs/retrieve-a-user-audit-log.md) resources now include a `context.inquiry_id` [attribute](../user-audit-logs/retrieve-a-user-audit-log.md#response.body.data.attributes.context) to retrieve the `inquiry-id` of an inquiry created via dashboard.

---

[September 29, 2025](./api-changelog/2025/9/29.md)

[September 29, 2025](./api-changelog/2025/9/29.md)

### Tags

-   💥 **Active tags limited to 1000 per organization:** API requests that would result in additional tags being created will receive 422 response code if the organization has at least 1000 tags currently active.

### Verifications

-   🍃 **Add `non-domiciled` to the list of possible ID designations:** `non-domiciled` is now among the list of possible ID designations.

---

[September 15, 2025](./api-changelog/2025/9/15.md)

[September 15, 2025](./api-changelog/2025/9/15.md)

### Lists

-   🍃 **Allow creating String Lists via API**: You can now [create String Lists](../lists/create-a-strings-list.md) via API.

---

[August 18, 2025](./api-changelog/2025/8/18.md)

[August 18, 2025](./api-changelog/2025/8/18.md)

### Accounts

-   🍃 **Allow filtering Accounts by multiple reference IDs**: You can now [list all Accounts](../accounts/list-all-accounts.md) by filtering on an array of reference IDs.

---

[July 30, 2025](./api-changelog/2025/7/30.md)

[July 30, 2025](./api-changelog/2025/7/30.md)

### Verifications

-   🍃 **Add `account` relationship to Verifications**: [Verification resources](../verifications/retrieve-a-verification.md) now include the related `account` in `data.relationships`. This allows you to determine which Account a given Verification is associated with directly from the response, without making an additional query.

---

[July 7, 2025](./api-changelog/2025/7/7.md)

[July 7, 2025](./api-changelog/2025/7/7.md)

### Verifications

-   🍃 **Add `redacted-at` to Verifications**: [Verification resources](../verifications/retrieve-a-verification.md) now include a `redacted-at` attribute, which will be the timestamp of when the Verification was redacted, if applicable.

[

#### Older posts

Next](./api-changelog.md#page-2)

[Built with](https://buildwithfern.com/?utm_campaign=buildWith&utm_medium=docs&utm_source=docs.withpersona.com)
