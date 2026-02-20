# Inquiry Sessions

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Model References](./model-lifecycle.md)

# Inquiry Sessions

An inquiry session represents a single instance of an end user accessing an inquiry. For example, it’s common for an end user to begin an inquiry on a desktop computer, then use Persona’s device handoff feature to switch over to their phone so they can more easily take a photo. In this scenario, a second session is created when the user switches to their phone.

#### Inquiry Sessions and Devices

An inquiry session is not the same as a device — a single device may have many sessions, but one session is tied to one device.

## Session tokens

A session token is a JWT representation of an inquiry session. A session token enables an end user to access an in-progress inquiry (i.e. an inquiry with a “pending” [status](./model-lifecycle.md)). In browser-based flows, session tokens are stored in [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), which is local to the browser window that an end user is using to complete their inquiry. If a user closes an in-progress inquiry and reopens it in a separate browser window, they will lose their session token and see a ‘Session expired’ error. They will be unable to continue the inquiry unless [a new session token is created](./resuming-inquiries.md) or [a new one-time link is generated](./inquiry-one-time-links.md).

## Session expiration

When an inquiry session is created, its expiry time is set to match the inquiry’s expiry time. For more information, see [Inquiry Expiration](./inquiry-expiration.md).

Note that modifying the inquiry’s expiry time (e.g. by [resuming the inquiry](./resuming-inquiries.md)) will not change the session’s expiry time.

## Session limit per inquiry

By default, inquiries have a maximum of 25 sessions, after which no more sessions can be created. If you need to change this limit, please [contact support](https://app.withpersona.com/dashboard/contact-us) or talk to your CSM.
