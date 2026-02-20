# Android Instant App

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[MiniApp Integration](./miniapp-integration.md)

# Android Instant App

Google has announced the sunset of Instant Apps later this year. Learn more in the [Android developer documentation](https://developer.android.com/topic/google-play-instant).

The `https://miniapp.withpersona.com/inquiry` and `https://miniapp.withpersona.com/verify` links can be used to launch the MiniApp Flow in the following scenarios:

-   Launching a `miniapp` link with a `ACTION_VIEW` intent.
-   Clicking a link in most 3rd party apps (eg. Gmail, Whatsapp).

Limitations:

-   Google Play Instant does not support NFC. This means the Persona instant app cannot be used to launch a NFC flow. The full Persona app is required for NFC flows.
-   If the user has disabled instant apps on their device or if instant apps is not supported by their device then the links will not work unless the user has the full Persona app installed.
