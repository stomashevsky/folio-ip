# iOS AppClip

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[MiniApp Integration](./miniapp-integration.md)

# iOS AppClip

The `https://miniapp.withpersona.com/inquiry` and `https://miniapp.withpersona.com/verify` links can be used to launch MiniApp Flow in the following scenarios:

-   Clicking a link presented via the [Link Presentation](https://developer.apple.com/documentation/appclip/launching-another-app-s-app-clip-from-your-app#Display-a-preview-of-the-App-Clip) framework in your iOS app.
    
-   Clicking a link shown in iMessage. Note that at least one of the following has to be true for the link to be clickable:
    
    -   The end user has the sender added as a contact.
    -   The end user has responded to the sender at least once.
    -   The message is coming from a number trusted by Apple to present links in iMessage.
-   Reading a link embedded in a QR code or NFC tag.
    

The MiniApp Flow can also be launched on iOS using the default AppClip URL provided by Apple directly. When using `https://appclip.apple.com/id?p=com.withpersona.app.Reusable-Personas.Clip` as the base link instead of `https://miniapp.withpersona.com/inquiry`or `https://miniapp.withpersona.com/verify`, the MiniApp Flow can be launched in the following scenarios:

-   Clicking links displayed with markdown (e.g. links shown in Safari, Chrome, email, or other apps that display links).
-   Clicking a link presented via the [Link Presentation](https://developer.apple.com/documentation/appclip/launching-another-app-s-app-clip-from-your-app#Display-a-preview-of-the-App-Clip) in your iOS app.
-   Clicking a link shown in iMessage. Note that the end user must have the sender added as a contact for the link to be clickable.
-   Reading a link embedded in a QR code or NFC tag.

All features, except for video over WebRTC, that are available in our iOS SDK are available in iOS Native Hosted Flow.
