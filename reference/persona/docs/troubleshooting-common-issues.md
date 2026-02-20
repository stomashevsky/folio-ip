# Troubleshooting Common Issues

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration References](./browser-device-support.md)

# Troubleshooting Common Issues

This page documents common issues encountered when integrating with the Persona flow.

Also see our integration-specific troubleshooting guides:

-   [Embedded flow](./embedded-flow-troubleshooting-common-issues.md)

## User is seeing a “Session expired” page

There are several reasons why a user may see a “Session expired” page.

1.  The inquiry is in progress and the user does not have a session token.
2.  The user lost their session token.
3.  The inquiry has expired.
4.  The inquiry session has expired.

For more information, see [Resuming Inquiries](./resuming-inquiries.md).

## 409 network errors

Persona will return a 409 on inquiry load when the inquiry isn’t in a valid state to be interacted with - either the inquiry is expired or already finished.

## Camera capture flows crash the browser, freeze the device, or show a black square

Users rarely experience device-specific crashes which can be related to the user’s browser version, OS version, device capabilities, or other hardware attributes. Generally, these issues are encountered when the user’s device runs out of memory (RAM or GPU).

Additionally, ensure that you are testing on production builds of your app. This issue has been noted to occur more frequently when the Persona flow has been embedded into apps built in development mode.

From an end user’s perspective, ensuring that device versions are up-to-date, closing other apps or browser tabs, reloading the Persona page, and restarting the device have been shown to help.

## Camera feeds briefly show an overlaid ‘play’ icon

Some devices will briefly flash a video ‘play’ icon when the device is in low power mode. This is related to how HTML video elements are loaded in low power mode. This is a device-specific issue and cannot be modified.

## Government ID upload unavailable on mobile devices

File upload as a capture method is disabled by default on mobile devices (for both web and mobile SDKs). This can be configured on the [Inquiry Templates](./inquiry-templates.md#configuration) page via Configure > General > Image capture methods.
