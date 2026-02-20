# iOS Integration Guide

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[iOS](./tutorial-ios-sdk-precreate.md)

# iOS Integration Guide

iOS Inquiry SDK Integration Guide and Technical Documentation

The Persona Inquiry flow lets you securely and seamlessly collect your user’s information.

## Integration

Integrate the Persona Inquiry flow directly into your iOS app with our native SDK.

To integrate the Persona Inquiry SDK in your iOS app you can use [Swift Package Manager](https://swift.org/package-manager/), [CocoaPods](https://cocoapods.org/), or download the XCFramework for manual integration or for use with Carthage.

### Installation

#### Install via Swift Package Manager

To install the SDK with [Swift Package Manager](https://swift.org/package-manager/):

1.  Select your project’s Swift Packages tab
2.  Click on the `+` to add a package
3.  Add the repository URL `https://github.com/persona-id/inquiry-ios-2.git`, and click Next
4.  Choose the package options version rule you want to use. We recommend the default (up to next major version), and click Next
5.  Check that the package is being added to the right target and click Finish.

#### Install via CocoaPods

To install the SDK with [CocoaPods](https://cocoapods.org/), add `PersonaInquirySDK2` as one of your target dependencies in your `Podfile`:

```ruby
source 'https://github.com/CocoaPods/Specs.git'
use_frameworks!

target 'Your Project' do
  pod 'PersonaInquirySDK2'
end
```

![Inquiry SDK latest](./images/PersonaInquirySDK2_0f3346a8b6a3.png)

Please be sure to run pod update and use pod install —repo-update to ensure you have the most recent version of the SDK installed.

#### Manual installation

The SDK is released as an XCFramework which makes manually installing the SDK a straightforward process:

1.  Go to the [Persona Inquiry SDK Releases page](https://github.com/persona-id/inquiry-ios-2/releases)
2.  Find the latest release
3.  Expand the `Assets` triangle and download the `PersonaSDK.xcframework.zip` file
4.  Unarchive the zip file and drag the `Persona2.xcframework` folder into your Xcode project
5.  A dialog prompt will pop up asking to choose options for adding these files. Please ensure that `Destination` has `Copy items if needed`ticked and that it will be added to the correct target.
6.  Click on `Finish`

### Minimum deployment target

The SDK requires a minimum deployment target of iOS 13.0 or later. Ensure your app’s minimum deployment is at least 13.0.

### Permissions

In addition to importing the dependency, you also need to modify your `Info.plist` and add the required permissions:

1.  Navigate to your project’s settings in Xcode and click the `Info` tab
2.  Add a new “Privacy - Camera Usage Description” (`NSCameraUsageDescription`) entry (if not already present) to enable camera access.
3.  Add a new “Privacy - Location When In Use Usage Description” (`NSLocationWhenInUseUsageDescription`) entry (if not already present) to enable GPS access. Unfortunately, Apple does not provide tools to differentiate when the API is in use. Therefore, even if your app or inquiry flow does not utilize the GPS functionality, the usage string must be included because the Persona SDK supports the functionality.
4.  Add a new “Privacy - Bluetooth Always Usage Description” (`NSBluetoothAlwaysUsageDescription`) entry (if not already present) to enable bluetooth scanning. Unfortunately, Apple does not provide tools to differentiate when the API is in use. Therefore, even if your app or inquiry flow does not utilize the bluetooth functionality, the usage string must be included because the Persona SDK supports the functionality.
5.  \[Optional\] If using our support for video verifications, add a new “Privacy - Microphone Usage Description” (`NSMicrophoneUsageDescription`) entry (if not already present) to enable microphone access.
6.  \[Optional\] If using our support for NFC verifications, “Privacy - NFC Scan Usage Description” (`NFCReaderUsageDescription`) entry (if not already present) to enable NFC access.

### Privacy Configuration

This SDK collects a user’s [IDFV](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor) for fraud prevention purposes. In [App Store Connect](https://appstoreconnect.apple.com/) > Your App > App Privacy, if you haven’t already add in a “Device Identifier,” and fill out the questionnaire with the following answers:

-   **Usage**: App Functionality (covers fraud prevention)
-   **Are the device IDs collected from this app linked to the user’s identity?** Yes
-   **Do you or your third-party partners use device IDs for tracking purposes?** No

Be sure to also update your privacy manifest according to the features you are making use of from the SDK. See our [iOS Privacy Manifest](./ios-privacy-manifest.md) instructions for more information.

## Usage

### Implement the InquiryDelegate for Inquiry’s Result

#### Do not rely on callbacks for critical business logic

SDK callbacks are intended for coordination between your app’s UI and Persona’s UI (e.g. opening and closing the flow UI). They do NOT guarantee that data are up-to-date, and cannot be reliably used to guarantee data integrity. Webhooks should be used for logic that depends on Inquiry state.

For more information, see [Accessing Inquiry status and data](./accessing-inquiry-status.md#webhooks-vs-sdk-callbacks).

In order to receive the inquiry result, please implement the `InquiryDelegate` protocol. For example:

```swift
extension MyViewController: InquiryDelegate {

  func inquiryComplete(inquiryId: String, status: String, fields: [String : InquiryField]) {
    // Inquiry completed
  }
  
  func inquiryCanceled(inquiryId: String?, sessionToken: String?) {
    // Inquiry cancelled by user
  }
  
  func inquiryError(_ error: Error) {
    // Inquiry errored
  }
}
```

### Build and Launch the Inquiry

The Persona Inquiry can be created with the `InquiryTemplateBuilder` or `InquiryBuilder`. Begin by calling `Inquiry.from(templateId:,delegate:)` or `Inquiry.from(inquiryId:,delegate:)`

Please refer to the code sample below and replace `itmpl_EXAMPLE` with your template ID. You can find your Inquiry Template ID in the Persona Dashboard.

This starts the Inquiry flow and takes control of the user interface. Once the flow completes the control of the user interface is returned to the app and the appropriate delegate method will be called.

```swift
class MyViewController: UIViewController {

  // This is hooked up to a button which starts the flow
  @objc
  private func buttonTapped(_ sender: UIButton) {
    // Build the inquiry with the view controller as delegate
    let inquiry = Inquiry.from(templateId: "itmpl_EXAMPLE", delegate: self)
      .build()
      .start(from: self) // start inquiry with view controller as presenter
  }
}
```

#### Persona recommends creating inquiries via API when possible

Please refer to [Creating inquiries](./creating-inquiries.md) for more information. After getting up and running consider moving inquiry creation to your backend for security reasons.

## Linking an Inquiry to your Users

To make it easier to find Inquiries in the Persona Dashboard, we recommend passing in your system’s user ID for the Inquiry reference ID.

```swift
let inquiry = Inquiry.from(templateId: "itmpl_EXAMPLE", delegate: delegate)
  .referenceId("myUser_123")
  .build()
```

### Pre-writing to the Inquiry

If you want to add extra information to the Inquiry before the user even starts, you can pass them in as `fields`.

```swift
let inquiry = Inquiry.from(templateId: "itmpl_EXAMPLE", delegate: delegate)
  .fields([
    "name_first": .string("Alexander"),
    "name_last": .string("Example")
  ])
  .build()
```

### Starting/Resuming an Inquiry from ID

When you create an Inquiry on the server, you can pass the Inquiry ID instead of the Template ID.

```swift
let inquiry = Inquiry.from(inquiryId: "inq_EXAMPLE", delegate: delegate)
  .build()
```

If the Inquiry has already started, you will need to also pass in the session token.

```swift
let inquiry = Inquiry.from(inquiryId: "inq_EXAMPLE", delegate: delegate)
  .sessionToken("ABD1234567890")
  .build()
```

### Overriding device locale

Our SDK will automatically use the language and region selected on a users device to determine localization. If your app has specific localization requirements independent of user’s device settings, you can pass the localization directly to the `InquiryBuilder` as follows:

```swift
let inquiry = Inquiry.from(templateId: "itmpl_EXAMPLE", delegate: delegate)
  .locale("fr")
  .build()
```

### Errors

In rare cases, the Persona Inquiry SDK may encounter client side errors that can not be resolved. When unrecoverable errors are encountered, the sdk will immediately callback to the main application with a debug description of the error.

The most common reasons the Persona Inquiry SDK will error include unrecoverable networking errors, misconfigured templates (should only be encountered during development), or failing to establish a connection to the device camera.

The error callback is located on the `InquiryDelegate` with the following signature: `func inquiryError(_ error: Error)`.

## Customization

Make the Persona Inquiry flow look and feel like your app.

### Custom Styling

You can configure the styles that are applied to the inquiry template in the Persona Dashboard. For more information on using the theme editor, see our [help article](https://help.withpersona.com/articles/6SIHupp847yaEuVMucKAff).

#### Custom Fonts

By default, the iOS SDK only has access to the device’s system font. Non system fonts can either be downloaded at runtime when uploaded to your inquiry template, or bundled into your hosting application.

Custom fonts that are not available in Persona themes are only available to customers on Enterprise plans.

**Bundling a font**

For example, if you choose the font ‘Rubik’ in your template’s Theme configuration, you will need to add a font file named `Rubik.ttf` (or any compatible format) to your project by following the instructions [here](https://developer.apple.com/documentation/uikit/text_display_and_fonts/adding_a_custom_font_to_your_app).

If you need to use different font weights for a given family, name each font file such that the weight is appended to the end of the family name with a `-`. For example, a bold version of the `Rubik` font would be named `Rubik-Bold.ttf`. Valid font weight suffixes are `Light`, `Regular`, `Medium`, `Bold`, and `ExtraBold`.

## Government Id NFC Integration

In order to use a template that includes Government Id NFC reading capabilities on iOS, follow these steps:

-   Include the [PersonaNfc project](https://github.com/persona-id/inquiry-ios-nfc) in your app via SPM or cocoapods. You can include this in the same way you would the main Persona SDK. Make sure that the version of PersonaNfc matches the version of the main Persona SDK that you are using.
-   Link the [PersonaOpenSSL](https://github.com/persona-id/PersonaOpenSSL) library into your app using SPM or cocoapods.
-   Add the NFC capability to your app (target → signing & capabilities → + Capability → Near Field Communication Tag Reading). You will also need to add the NFC capability to the Identifier for the app in the Apple Developer portal.
-   Make sure that the entitlements file for your app includes both `TAG` and `PACE` for the Near Field Communication Tag Reader Session Formats :
    
    ```
    <key>com.apple.developer.nfc.readersession.formats</key>
    <array>
      <string>TAG</string>
      <string>PACE</string>
    </array>
    ```
    
-   Add a `Privacy - NFC Scan Usage Description` to your info.plist file, along with a description.
-   Add a `ISO7816 application identifiers for NFC Tag Reader Session` to your info.plist file with these values **in the following order**: `A0000002471001`, `A0000002472001`, and `00000000000000`.
-   Pass in `PersonaNfcAdapter()` into the Inquiry builder for the `.nfcAdapter` function. You will need to import `PersonaNfc` to access this.

## Video Integration

In order to enable video recording over WebRTC on iOS follow these steps:

-   Include the [PersonaWebRtc project](https://github.com/persona-id/inquiry-ios-webrtc) in your app via SPM or cocoapods. You can include this in the same way you would the main Persona SDK. Make sure that the version of PersonaWebRtc matches the version of the main Persona SDK that you are using.
-   Link the [WebRTC version 111.0.0](https://github.com/stasel/WebRTC) library into your app.
-   Pass in `PersonaWebRtcAdapter()` into the Inquiry builder for the `.webRtcAdapter` function. You will need to import `PersonaWebRtc` to access this.
-   Add a `Privacy - Microphone Usage Description` to your Info.plist file.

In order to enable local video recording upload on iOS follow these steps:

-   Add a `Privacy - Microphone Usage Description` to your Info.plist file.

## Phone Number Silent Network Authentication (SNA) Integration

In order to use a template that includes phone number silent network authentication on iOS, follow these steps:

-   Include the [PersonaSna project](https://github.com/persona-id/inquiry-ios-sna) in your app via SPM or cocoapods. You can include this in the same way you would the main Persona SDK. Make sure that the version of PersonaSna matches the version of the main Persona SDK that you are using.
-   Pass in `PersonaSnaAdapter()` into the Inquiry builder for the `.snaAdapter` function. You will need to import `PersonaSna` to access this.

## Licenses

The Persona iOS SDK is shipped with the licenses for the 3rd party software that it uses. Be sure to include these licenses in your app as well. See [here](./ios-licenses.md) for a list of the 3rd party software that we use and their associated licenses.
