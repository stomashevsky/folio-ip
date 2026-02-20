# Troubleshooting Inquiries

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Inquiry Tutorials](./inquiries-best-practices.md)

# Troubleshooting Inquiries

When encountering issues with latency, loading, or web integration, please contact support with the following:

1.  The HAR file (instructions are provided below for how to retrieve generate the HAR files on iOS and Android)
2.  The code written to launch Persona if possible

## HAR File

### IOS

1.  On the iOS Device, go to Settings > Safari > Advanced > Enable Web Inspector.
2.  Connect the iOS device to the Mac computer using a cable and make sure the iOS device is recognized.
3.  On the iOS device, launch Safari and reproduce the issue.
4.  Using the Mac computer, launch Safari, then click on Develop > Select the relevant iPad > Click on the session, which will open the developer tools.
5.  From here, export the HAR file.

### Android

Below uses Chrome’s remote debugging tools on a desktop computer that’s connected to the device.

1.  Enable USB Debugging on your Android device:
    -   Go to Settings > System > About phone.
    -   Tap on the Build number field 7 times until you see a message that you are now a developer.
    -   Go back to Settings > System > Developer options and enable USB debugging.
2.  Connect your Android device to your computer:
    -   Plug your Android device into your computer using a USB cable.
    -   If prompted on your phone, allow USB debugging for your computer.
3.  Access the WebView in Chrome DevTools:
    -   On your computer, open Google Chrome.
    -   In the address bar, type chrome://inspect/#devices and press Enter.
    -   Your connected device should appear under the “Remote Target” section. The running WebViews within your app will be listed below the device name.
4.  Open the Inspector for the target WebView:
    -   Locate the specific WebView you want to inspect (they might have titles set).
    -   Click the inspect link below the target WebView’s title to open the Chrome DevTools panel in a new window.
5.  Record and Export the HAR file:
    -   In the opened DevTools panel, click on the Network tab.
    -   Ensure the record button (a red circle at the top left) is active. If it’s grey, click it to start recording.
    -   (Optional but recommended) Check the Preserve log box to maintain logs across page navigations and click the clear button (a circle with a diagonal line) to remove any existing logs.
    -   On your Android device, reproduce the issue or perform the actions you need to log within the app’s WebView.
    -   Once the actions are complete and the network traffic is recorded in DevTools, click the Export HAR icon (a downward arrow) at the top of the Network tab.
    -   Save the .har file to your computer
