# Ensuring user access to Inquiries

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Inquiry Tutorials](./inquiries-best-practices.md)

# Ensuring user access to Inquiries

This is a comprehensive guide on why users lose access to inquiries, how to ensure your users always have access to their inquiries, and what types of inquiries to use for your integration scenario.

## What causes users to lose access to their inquiry?

1.  **The inquiry has expired based on pre-configured expiration settings on the template**: You may not want a user to have access to a Persona inquiry for longer than a certain period of time, so you can [configure the expiration intervals](./inquiry-expiration.md#configuring-expiration-intervals) in the inquiry template itself.
2.  **The user is unable to access their inquiry for security reasons**: Persona creates and stores a [session token](./inquiry-sessions.md#session-tokens) in the user’s browser session when they first access an inquiry. If the user closes their browser or app in the midst of the inquiry flow, they will lose that session token and will no longer be able to access the inquiry. Persona requires a session token to be provided in subsequent attempts to complete the inquiry in order to ensure the safe storage of PII.

---

## What types of inquiries should I use?

Persona’s [Hosted Flow Integration](./hosted-flow.md) requires sending an inquiry link to the end user. The Hosted Flow takes different parameters, which can affect the user’s access to their inquiry. Different parameters may be more appropriate based on your specific use case and requirements.

Persona’s SDKs ([iOS Integration Guide](./ios-sdk-v2-integration-guide.md), [Android Integration Guide](./android-sdk-v2-integration-guide.md), [Embedded Integration](./embedded-flow.md)) do not require sending links, but use the same parameters to control inquiry creation and load.

| Type | Parameter required | Best suited for | Considerations |
| --- | --- | --- | --- |
| Dedicated Inquiry | `inquiry-id` | \- Inquiries that are prefilled with the user’s PII or other fields - Data cleanliness (one inquiry per user) | The given inquiry is loaded when the link is accessed. In-progress inquiries are inaccessible without a session token. You should have a strategy for resuming the inquiry (see below). |
| ”Just in time” inquiry / static link | `inquiry-template-id` | \- Links posted on a website for many people to access | A new inquiry is created every time the static link is accessed or the SDK is instantiated with the `inquiry-template-id` parameter. Static links allow users the ability to access the Persona verification flow more than once, resulting in multiple inquiries being created. |

---

## Scenarios and recommendations

### You have embedded Persona into your app and want to ensure that a user can always access their dedicated inquiry until the configured expiration time

If a user has started a flow and then exits for whatever reason, you will need to resume the inquiry for them when they try to regain access to it. Make an API call to resume the inquiry when they try to re-access it, and load both the `inquiry-id` and `session-token` parameters into the SDK.

Note: Depending on your business strategy, you may decide to create a new inquiry if the current one is on a previous version. Read more about that [here](./resuming-inquiries.md#resuming-inquiries-vs-creating-new-inquiries).

### You are sending inquiry links by email, and are unsure when the users will start the inquiry

**Option 1:** Send the user a static link but make sure to include an opaque (but unique) token as their reference ID. This will ensure that the user always has access to the link, but that all of their inquiries will be created on the same account.

e.g `https://inquiry.withpersona.com/verify?inquiry-template-id=itmpl_123&reference_id=123-abc-456`

**Option 2:** If you have information you need to securely pre-fill into the inquiry, you can create it via API and instruct the user in the email that they must complete the inquiry in one sitting.

In this scenario, we also recommend configuring a long expiration time in the template itself.

#### Appending a session token to a link

Another option you can utilize is to create a dedicated link and append the session token to it. This will allow you to both prefill values _and_ ensure the user does not lose access. However, as including the session token in the link grants permanent access to the inquiry (until it expires) to anyone with the link, we recommend caution with this approach and recommend that you ensure these links are transmitted securely.

### You have a B2B2C business model and provide Persona inquiries to your customers to give to their end users.

The above recommendations will also apply in this scenario! The added nuance with a B2B2C model is that your customers will be unable to hit the Persona endpoint themselves to resume inquiries. Your options are:

1.  Making an API call to get a session token on creation of the inquiry and passing both the inquiry ID and session token to your customer in a secure manner
2.  Building your own `resume` API endpoint for customers to hit whenever they need a new session token. This would call Persona’s `resume` endpoint in the backend.

In either implementation, you will want to ensure you’re setting a practical inquiry expiration time.

---

## Other considerations

#### Ensuring you’re on a recent inquiry version

When a dedicated inquiry is created, it’s pinned to the latest inquiry _version_. Having a dedicated inquiry be active for too long (months or more) may mean that users going through these inquiries going through outdated flows and configurations.

#### Configuring a reasonable expiration timeframe

Keeping in mind the balance between outdated inquiries and user friction, you will want to work with your team to determine how long you want to keep an inquiry active for.

#### Resuming an inquiry after it’s expired

You can continue to resume the inquiry after its expired to get another session token to present the user, but you will likely want to check how old the inquiry is before you resume it, as a new inquiry version with updated logic may have been published. More information [here](./resuming-inquiries.md#resuming-inquiries-vs-creating-new-inquiries).

#### Eagerly resuming inquiries when using the SDK

We recommend against _always_ making a call to resume the inquiry every time the user loads your app (instead of saving the session token), as you may run into API and inquiry session limits.
