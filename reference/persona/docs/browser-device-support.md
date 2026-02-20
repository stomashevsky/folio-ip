# Browser & Device Support

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration References](./browser-device-support.md)

# 

Browser & Device Support

The Persona Inquiry flow supports for the web browsers listed below. Modern mobile browsers are supported, including most iPhone and Android devices.

[Internet Explorer 11 is not supported.](https://learn.microsoft.com/en-us/lifecycle/products/internet-explorer-11) In-app browsers (e.g. Facebook Browser, Instagram Browser) are not supported. Aspects of the Inquiry flow may be degraded or not function entirely.

We aim to support browser major versions **released in the last 3 years or with >0.1% global usage**.

|  |  |  |
| --- | --- | --- |
| ![Chrome](./images/chrome_fa7c71c63add.png) Fully supported after v79 | ![Firefox](./images/firefox_e7184ca17797.png) Fully supported after v74 | ![Safari](./images/safari_1d6fa2b29cf4.png) Fully supported after v13 |
| ![Edge](./images/edge_343653e25447.png) Fully supported after v80 | ![Brave](./images/brave_f428c56c1c48.png) Fully supported | ![IE](./images/ie_4dd578dbb1d0.png) **Not supported** |

## Camera resolution

For the best capture experience, a camera with resolution of at least 1920 x 1080 should be used.

Cameras with lower resolution may see higher failure rates and reduced autocapture performance. 1280 x 720 is a common resolution that can experience inconsistent autocapture that is more heavily affected by environmental factors such as light level.

Cameras with resolution lower than 640 x 480 are not supported; users will be prompted to switch to a different device or to upload images directly instead, if this is enabled on your template.

## Camera permissions

Some individuals may have trouble going through a verification that requires the on-device camera if their browser has restrictive default camera permissions or they have accidentally or intentionally blocked access to their on-device camera and/or have blocked all video autoplay.

If they are seeing a black screen when trying to use the camera, then please indicate to the individual to double check their camera permissions and autoplay permissions.

Browser Camera and Autoplay settings should be: “Ask when a site wants to …” rather than “Blocked”. Your website also cannot be in their “Block” list.
