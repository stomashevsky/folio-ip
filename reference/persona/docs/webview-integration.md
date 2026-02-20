# WebView

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)

# WebView

#### Native SDKs Recommended

We strongly recommend using our native mobile SDKs (Android, iOS) instead of WebView where possible. WebView integrations are more difficult to support due to performance constraints of WebView technology

For more information, see [Native mobile integration vs. WebView](./webview-vs-native-mobile-integration.md).

## Required URL Parameter

When implementing Persona in a WebView, you **must** include the `is-webview=true` parameter in your URL. This parameter activates the WebView flow and ensures proper functionality.

Your URL should look like:

```
https://withpersona.com/verify?is-webview=true&template-id=tmpl_123&environment-id=env_123
```

Or for Hosted Flow:

```
https://inquiry.withpersona.com/verify?is-webview=true&template-id=tmpl_123&environment-id=env_123
```

For implementation guides, see:

-   [Embedded Flow WebView Considerations](./embedded-flow-webview-considerations.md)
-   [Hosted Flow WebView Considerations](./hosted-flow-webview-considerations.md)
