# Accessing Inquiry status and data

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Inquiry Tutorials](./inquiries-best-practices.md)

# Accessing Inquiry status and data

## Using webhooks to fetch the inquiry status

Persona recommends setting up Webhooks to listen for any relevant inquiry statuses. Webhooks are sent immediately upon the event firing and eliminate the need to continuously poll an inquiry for updates.

See our [Webhooks](./webhooks.md) documentation for setup instructions.

### Webhooks vs Polling

Although we recommend implementing a webhook listener if possible, it may be sufficient to poll the API directly for the inquiry decision if you are:

-   Blocking the user from the next step in your flow based on the inquiry decision
-   Unable to support infrastructure to handle webhooks (e.g. do not have a server actively listening for webhooks)
-   Unlikely to hit any API rate limits
-   Not marking many inquiries for manual review (where you might be polling for a long time before the inquiry is decisioned)

### Webhooks vs SDK Callbacks

Avoid relying on SDK callbacks to fetch inquiry data. Persona’s SDK client callbacks are intended to allow taking action on start, iframe load, complete, and additional client-only events; for example, they can be used to open the widget once the Inquiry has loaded. The callbacks do not guarantee that the included Inquiry data is the most up-to-date representation of the Inquiry. You should leverage callbacks to coordinate your UI and the Persona widget, and _should not_ use them to keep data in sync between Persona and your server. Webhooks are the only reliable way to track inquiry status (and all other inquiry data).

Client callbacks cannot be used reliably to fetch inquiry status if you are utilizing any post-inquiry features (workflows or manual review). As they are meant only to tell you that the inquiry itself has finished, the status retrieved may be non-deterministic if there is any post-inquiry processing done.

**Note:** If your only option is to use the client callback for status and you are not implementing any post-inquiry logic, you can disregard the next section on utilizing inquiry decisioning statuses.

## Ensure you’re actioning on the correct inquiry statuses

Inquiries will reach a `completed` or `failed` status depending on the status of the required verification checks. If your implementation includes any _post-inquiry_ processing (e.g report runs, manual review, or other business logic), you’ll want to utilize the inquiry’s _decisioning_ statuses to determine how to proceed. These statuses are: `approved`, `declined`, and `needs-review`.

See the [Inquiry Model Lifecycle](./model-lifecycle.md) for more details.

### Future-proofing your implementation

We recommend [setting up a basic workflow](https://help.withpersona.com/articles/20Zvcq50493eMUdt7aDhRY) triggered on the `inquiry.completed` event to approve the inquiry. After this is done, you can disregard the `completed` status and only use the `approved` status to signify that you can proceed with the user on your platform.

Similarly, you can set up another workflow triggered on `inquiry.failed` to automatically decline the inquiry so you can disregard the `failed` status.

Making both of these changes upfront means that any decisions to add post-inquiry processing in the future will not require additional developer resources, because the integration will already be utilizing the correct statuses to know how to proceed.
