# Capture Methods

## Overview[](#overview)

Some Verification types require the end user of your Inquiry to submit an image or live camera capture of themselves, an ID, or another document.

Persona lets you configure how your end users are allowed to submit these images and captures, via an Inquiry Template configuration called **Capture Methods**. Capture Methods allow you to balance conversion with fraud prevention by limiting how user can provide their images.

## When and why to configure Capture Methods[](#when-and-why-to-configure-capture-methods)

Capture Methods are a key part of how your verification flow handles image-based inputs like Government ID and Selfie.

By default, users can either **capture a new photo** using their camera or **upload an existing image** from their device. For some businesses or user experiences, allowing uploads may introduce risk: uploaded files can be reused, shared, or spoofed. For this reason, some businesses choose to disable uploads to encourage in-the-moment, harder-to-fake captures.

You can also analyze how users are submitting images and measure success rates by method. For more, see [View Capture Method Analytics](./3c2XDYIxmf9PjivgeJtx3i.md).

## Relevant verification types[](#relevant-verification-types)

Capture Methods settings are only relevant to Verification types that require the end user of an Inquiry to submit an image or live camera capture.

These Verification types include:

-   [Government ID Verification](./5vXD7S7pQCq8Q9Z4RztxLw.md)
-   [Selfie Verification](./1l0WTbR5UsfiggNDPWbnUp.md)
-   [Document Verification](./2ipL09vsPcus5OXuOXdeO9.md)

## Example configurations[](#example-configurations)

Some examples of how you might configure Capture Methods:

-   Require end users to use guided capture on mobile web.
-   Prevent end users from uploading an image (on desktop, mobile web, or mobile native).
-   Adjust capture options depending on the device used.

## Set device-specific settings[](#set-device-specific-settings)

You can apply different Capture Method settings for:

-   Desktop web
-   Mobile web
-   Native mobile apps _(if you are integrated with the Inquiries product via Mobile SDK)_

For example, you can allow uploads on desktop, but require camera capture on mobile. This helps teams fine-tune user experience and reduce fraud without sacrificing too much conversion.

## Where to configure[](#where-to-configure)

You can configure Capture Methods within each Inquiry Template in the Dashboard.

To find the settings:

1.  In the Persona Dashboard, select **Inquiries > Template** in the navigation bar.
2.  Select the Inquiry Template you want to edit.
3.  In the upper corner of the Flow Editor, click **Configure**.
4.  Under **Configurations > General** scroll down until you see **Image capture methods.**

![capturemethods](../images/capturemethods_223deedd34b3.png)

5.  Use the toggle buttons to customize the capture methods.
6.  Click **Save** on the top right corner when done.

## Plans Explained[](#plans-explained)

|  | **Startup Program** | **Essential Plan** | **Growth Plan** | **Enterprise Plan** |
| --- | --- | --- | --- | --- |
| Capture Methods | Available | Available | Available | Available |

[Learn more about pricing and plans](./6oZbzp7jb7AWGClF5vpY3K.md)

## Related articles

[Viewing Capture Method analytics](./3c2XDYIxmf9PjivgeJtx3i.md)

[Why should I disable image uploads?](./3bU3AKdWw5gSN8DxWQVv8p.md)

[Government ID Verification](./5vXD7S7pQCq8Q9Z4RztxLw.md)

[Selfie Verification](./1l0WTbR5UsfiggNDPWbnUp.md)

[Document AI](./2ipL09vsPcus5OXuOXdeO9.md)
