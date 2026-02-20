# WebView Considerations

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Hosted Flow](./hosted-flow.md)

# WebView Considerations

When implementing Persona’s Hosted Flow within a WebView, there are several important considerations and configuration requirements to ensure optimal performance and functionality.

#### Native SDKs Recommended

We strongly recommend using our native mobile SDKs (Android, iOS) instead of WebView where possible. WebView integrations are more difficult to support due to performance constraints of WebView technology.

For more information, see [Native mobile integration vs. WebView](./webview-vs-native-mobile-integration.md).

## Required URL Parameter

When implementing Hosted Flow in a WebView, you **must** include the `is-webview=true` parameter in your URL. This parameter activates the WebView flow and ensures proper functionality.

Your URL should look like:

```
https://inquiry.withpersona.com/verify?is-webview=true&template-id=tmpl_123&environment-id=env_123
```

## WebKit Inline Media Playback

Please ensure `allowsInlineMediaPlayback` is enabled when creating a webview on a webkit browser (mobile Safari). This defaults to false and the camera preview will incorrectly open as a fullscreen live broadcast.

## Camera Configuration

The WebView Flow requires access to the device camera. Please include the `NSCameraUsageDescription` key your app’s `Info.plist` file as described in the [Apple Developer documentation](https://developer.apple.com/documentation/avfoundation/cameras_and_media_capture/requesting_authorization_for_media_capture_on_ios).

## External Network Requests

Persona makes external network calls within the Inquiry Flow that need to be allowlisted for the flow to properly function. Certain frameworks such as [Cordova](https://cordova.apache.org/docs/en/11.x/guide/appdev/allowlist/index.html#network-request-allow-list) require such requests to be allow listed. Please include `*.withpersona.com/*` in such an allow list if needed.

## Custom User Agents

Custom user agents can be parsed incorrectly and cause the flow to behave incorrectly or incorrectly trigger device or browser version specific behavior. We recommend using the default user agent provided by your WebView implementation.

## Additional Resources

For detailed implementation examples and code snippets, see our legacy WebView documentation:

-   [Android WebView Implementation](./quickstart-android-webview.md)
-   [iOS WKWebView Implementation](./quickstart-ios-wkwebview.md)
-   [WebView Troubleshooting](./troubleshooting-common-issues-webview.md)
