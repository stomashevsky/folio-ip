# Events

Events are actions in the Persona system that you can use to trigger [Webhooks](./webhooks.md) and [Workflows](./workflows.md).

You can view events and their payloads in the Dashboard under [Integration > Events](https://withpersona.com/dashboard/events). Events up to 3 months old can be viewed.

Retrieve Events for your Organization programmatically through the [Events API](./api-reference/events/list-all-events.md).

## Types of Events

The following is a list of all the events that currently may be emitted by the Persona service.

This list can grow at any time so when developing against Persona events, please do not assume within your code that this is the full exhaustive list.

**account.created**  
Occurs whenever an account is created.

**account.redacted**  
Occurs whenever an account is redacted.

**account.archived**  
Occurs whenever an account is archived.

**account.restored**  
Occurs whenever an account is un-archived.

**account.consolidated**  
Occurs when the account was combined with another account.

**account.tag-added**  
Occurs when a tag was added to an account.

**account.tag-removed**  
Occurs when a tag was removed from an account.

**case.created**  
Occurs when a case is created.

**case.assigned**  
Occurs when a case is assigned.

**case.resolved**  
Occurs when a case is resolved.

**case.reopened**  
Occurs when a case is reopened.

**case.updated**  
Occurs when a case is updated.

**document.created**  
Occurs whenever a document is created.

**document.submitted**  
Occurs whenever a document is submitted.

**document.processed**  
Occurs whenever a document is processed.

**document.errored**  
Occurs whenever a document errors while processing.

**inquiry.created**  
Occurs whenever an inquiry is created.

**inquiry.started**  
Occurs whenever an inquiry is started. This happens the moment a verification is created or submitted on an inquiry.

**inquiry.expired**  
Occurs when an inquiry expires. The default expiry is 24 hours.

**inquiry.completed**  
Occurs whenever an inquiry completes all the configured verifications.

**inquiry.failed**  
Occurs whenever an inquiry exceeds the configured number of verifications.

**inquiry.marked-for-review**  
Occurs when an inquiry was marked for review either through Workflows or the API.

**inquiry.approved**  
Occurs whenever an inquiry is approved manually in the dashboard or automatically through Workflows or the API.

**inquiry.declined**  
Occurs when an inquiry is declined manually in the dashboard or automatically through Workflows or the API.

**inquiry.transitioned**  
Occurs whenever a dynamic flow inquiry moves from one step in the inquiry flow to the next.

**inquiry-session.started**  
Occurs whenever a user starts a session on an inquiry with a device. Multiple devices will each spawn a session.

**inquiry-session.expired**  
Occurs when a session expires.

**inquiry-session.canceled**  
Occurs when a session is manually canceled by the user. Because sessions may be resumed, there may be multiple cancel events for a given session.

**report/address-lookup.ready**  
Occurs when an address lookup report has completed processing.

**report/address-lookup.errored**  
Occurs when an address lookup report’s processing has errored.

**report/adverse-media.matched**  
Occurs when an adverse media report has matched against at least one adverse media source as specified within the configuration.

**report/adverse-media.ready**  
Occurs when an adverse media report has completed processing.

**report/adverse-media.errored**  
Occurs when an adverse media report’s processing has errored.

**report/business-adverse-media.matched**  
Occurs when a business adverse media report has matched against at least one adverse media source as specified within configuration.

**report/business-adverse-media.ready**  
Occurs when a business adverse media report has completed processing.

**report/business-adverse-media.errored**  
Occurs when a business adverse media report’s processing has errored.

**report/business-watchlist.ready**  
Occurs when a business watchlist report has completed processing.

**report/business-watchlist.matched**  
Occurs when a business watchlist report has matched against a watchlist as specified within the configuration.

**report/business-watchlist.errored**  
Occurs when a business watchlist report’s processing has errored.

**report/email-address.ready**  
Occurs when an email address report has completed processing.

**report/email-address.errored**  
Occurs when an email address report’s processing has errored.

**report/phone-number.ready**  
Occurs when a phone number report is ready.

**report/phone-number.errored**  
Occurs when a phone number report’s processing has errored.

**report/profile.ready**  
Occurs when a profile report is ready.

**report/profile.errored**  
Occurs when a profile report’s processing has errored.

**report/politically-exposed-person.matched**  
Occurs when a politically exposed person (PEP) report has matched against a watchlist as specified within the configuration.

**report/politically-exposed-person.ready**  
Occurs when a politically exposed person (PEP) report has completed processing.

**report/politically-exposed-person.errored**  
Occurs when a politically exposed person (PEP) report’s processing has errored.

**report/watchlist.matched**  
Occurs when a watchlist report has matched against a watchlist as specified within the configuration.

**report/watchlist.ready**  
Occurs when a watchlist report has completed processing.

**report/watchlist.errored**  
Occurs when a watchlist report’s processing has errored.

**selfie.created**  
Occurs whenever a selfie is created.

**selfie.submitted**  
Occurs whenever a selfie is submitted.

**selfie.processed**  
Occurs whenever a selfie is processed.

**selfie.errored**  
Occurs whenever a selfie’s processing has errored.

**transaction.created**  
Occurs whenever a transaction is created.

**transaction.redacted**  
Occurs whenever a transaction is redacted.

**transaction.status-updated**  
Occurs whenever a transaction’s status is updated.

**verification.created**  
Occurs whenever a verification is created.

**verification.submitted**  
Occurs when a verification is submitted.

**verification.passed**  
Occurs when a verification passes.

**verification.failed**  
Occurs when a verification fails.

**verification.requires-retry**  
Occurs when a verification requires the individual to retry.

**verification.canceled**  
Occurs when a verification gets canceled.
