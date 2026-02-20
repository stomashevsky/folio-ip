# React Native Integration Guide

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[React Native](./react-native-sdk-v2-integration-guide.md)

# React Native Integration Guide

React Native Inquiry SDK v2 Integration Guide and Technical Documentation

#### Is your React Native app ready for AGP8?

Version 8.x of Android Gradle Plugin (AGP) requires breaking charges from both library and app developers. [Starting in React Native 0.73, AGP8 and Java 17 will be required for Android apps](https://github.com/react-native-community/discussions-and-proposals/issues/671).

We’ve added support for AGP8 starting in v2.7.0 of our RN SDK. However, due to the breaking changes required, this version will only work if your app is also on AGP8.

Support for AGP7 will continue under the v2.6.x branch of our RN SDK. Please use that release branch until you are ready to make the switch to AGP8, at which point you can upgrade to our latest releases.

## Installation

To install the Persona React Native SDK within your React Native application, if you use `yarn` to manage your project dependencies

```shell
# Install the latest AGP8 compatible sdk
yarn add react-native-persona@">=2.7.0"

# Install the latest AGP7 compatible sdk
yarn add react-native-persona@"<2.7.0"
```

If you use `npm` to manage your project dependencies

```shell
# Install the latest AGP8 compatible sdk
npm i react-native-persona@">=2.7.0"

# Install the latest AGP7 compatible sdk
npm i react-native-persona@"<2.7.0"
```

### Configure Android

#### Add Android Maven repository

Open your `android/build.gradle` file. Add the Persona Maven repository to the bottom of your repository list.

```
allprojects {
    repositories {
        // ...
        maven {
            url 'https://sdk.withpersona.com/android/releases'
        }
    }
}
```

#### Ensure minimum compile sdk

In the `app/build.gradle` file, make sure the `compileSdkVersion` is at least 33.

```
android {
   // ...
   compileSdkVersion = 33
   // ...
}
```

### Common Android issues

#### `android/build.gradle` not found

If you’re using Expo and can’t find your `android/build.gradle` file try running `npx expo run:android` to generate the native android project for your app. If your app doesn’t load our Android native module you’ll receive the following runtime error:

> Cannot read property ‘startInquiry’ of null

After running this command and generating the `build.gradle` file, you can then configure it according to the instructions above.

### Standard library functions not supported, e.g. `defineEntityReplacementText() not supported`

Please ensure you are on at least version 8.0 of Android Gradle Plugin (AGP).

We’ve added support for AGP8 starting in v2.7.0 of our RN SDK. However, due to the breaking changes required, this version will only work if your app is also on AGP8.

Support for AGP7 will continue under the v2.6.x branch of our RN SDK. Please use that release branch until you are ready to make the switch to AGP8, at which point you can upgrade to our latest releases.

#### Maven can’t resolve `com.withpersona.sdk2:inquiry`

```
Could not determine the dependencies of task ':app:processDebugResources'.
> Could not resolve all dependencies for configuration ':app:debugRuntimeClasspath'.
   > Could not find com.withpersona.sdk2:inquiry:2.x.y.
     Searched in the following locations:
       - https://repo.maven.apache.org/maven2/com/withpersona/sdk2/inquiry/2.x.y/inquiry-2.x.y.pom
       ...
```

Refer to instructions above on adding our maven repo url to your project’s `build.gradle` file, you can also reference our example here [https://github.com/persona-id/persona-react-native-sample/blob/main/SampleApp/android/build.gradle#L38-L40](https://github.com/persona-id/persona-react-native-sample/blob/main/SampleApp/android/build.gradle#L38-L40).

### Configure iOS

#### Install iOS pods

Ensure Cocoapods v1.10.x or higher is installed.

```
cd ios; pod install
```

#### iOS Permissions

Modify your `Info.plist` file to add the appropriate Privacy Usage Descriptions (if not already present). Navigate to your project’s settings in Xcode and click the Info tab.

| Info.plist Key | Note |
| --- | --- |
| Privacy - Camera Usage Description NSCameraUsageDescription | Used to access Camera for Government Id, Selfie, and Document flows. |
| Privacy - Location When In Use Usage Description NSLocationWhenInUseUsageDescription | Required. Used for GPS collections. Unfortunately, Apple does not provide tools to differentiate when the API is in use. Therefore, even if your app does not utilize the GPS functionality, we must include the usage string because our SDK includes geolocation features. |
| Privacy - Photo Library Usage Description NSPhotoLibraryUsageDescription | Optional. Used on Document flows and on Government Id flows when file upload is enabled. |
| Privacy - NFC Scan Usage Description NFCReaderUsageDescription | Optional. Used for Passport NFC flows. |
| Privacy - Microphone Usage Description NSMicrophoneUsageDescription | Optional. Used for video flows. |

#### iOS minimum deployment target

Our native iOS SDK requires a minimum iOS deployment target of 13.0.

In your project’s `ios/Podfile`, ensure your `platform` target is set to 13.0.

```
platform :ios '13.0'
```

#### iOS Privacy Configuration

This SDK collects a user’s [IDFV](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor) for fraud prevention purposes. In [App Store Connect](https://appstoreconnect.apple.com/) > Your App > App Privacy, if you haven’t already add in a “Device Identifier,” and fill out the questionnaire with the following answers:

-   **Usage**: App Functionality (covers fraud prevention)
-   **Are the device IDs collected from this app linked to the user’s identity?** Yes
-   **Do you or your third-party partners use device IDs for tracking purposes?** No

### Common iOS issues

#### `ios/` folder not found

If you’re using expo and can’t find your `ios` folder, try running `npx expo run:ios` to generate the native iOS project for your app. Then run `pod install` from the `ios` folder. If your app doesn’t load our iOS native module you’ll receive the following runtime error:

> Your JavaScript code tried to access a native module that doesn’t exist.

## Usage

The Persona Inquiry flow can be initiated with either a `template ID` or an `inquiry ID`.

Please refer to the code sample below and replace `my_template_id` with your `template ID`. You can find your `template ID` on the Persona Dashboard under [Integration](https://withpersona.com/dashboard/integration).

This starts the Inquiry flow and takes control of the user interface. Once the flow completes, the control of the user interface is returned to the app and the appropriate callbacks are called.

```javascript
import {Inquiry, Environment} from 'react-native-persona';
// ...
<Button
  title="Start Inquiry"
  onPress={() => {
    Inquiry.fromTemplate('itmpl_EXAMPLE')
      .environment(Environment.SANDBOX)
      .onComplete((inquiryId, status, fields) =>
        Alert.alert(
          'Complete',
          'Inquiry ' + inquiryId + ' completed with status "' + status + '."',
        ),
      )
      .onCanceled((inquiryId, sessionToken) =>
        Alert.alert('Canceled', 'Inquiry ' + inquiryId + ' was cancelled'),
      )
      .onError(error => Alert.alert('Error', error.message))
      .build()
      .start();
  }}
/>
```

### Inquiry Fields

The `onComplete` callback returns `fields`, which is an object containing information extracted during the inquiry. Refer to the field schema for a given template in the Persona Dashboard.

### Configuration options

Some different configuration example can be found below

```javascript
// Configuration with only a template ID
Inquiry.fromTemplate("itmpl_EXAMPLE").build().start();

// Configuration with only a template ID in the sandbox
Inquiry.fromTemplate("itmpl_EXAMPLE")
   .environment(Environment.SANDBOX)
   .build()
   .start();

// Configuration with a template and reference ID
Inquiry.fromTemplate("itmpl_EXAMPLE")
   .referenceId("myUser_123")
   .build()
   .start();

// Configuration passing fields to profile data into the inquiry. 
// Refer to the field schema for a given template in the Persona Dashboard.
Inquiry.fromTemplate("itmpl_EXAMPLE")
  .fields(
    Fields.builder()
      .string('nameFirst', 'Alexander')
      .string('nameLast', 'Example')
      .build(),
  )
  .build()
  .start();

// Configuration with only an inquiry ID
Inquiry.fromInquiry("inq_EXAMPLE").build().start();

// Configuration resuming an inquiry session with an access token 
Inquiry.fromInquiry("inq_EXAMPLE")
    .sessionToken("SOME_SESSION_TOKEN")
    .build()
    .start();
```

## Inline Inquiry Integration

### Overview

**PersonaInquiryView** is a React Native component that renders the Persona Inquiry flow inline within your app’s UI. Unlike a modal presentation, this component allows you to embed identity verification directly into your app’s navigation flow, providing a more seamless user experience.

```typescript
<PersonaInquiryView
  inquiry={inquiry}
  onComplete={(inquiryId, status, fields, extraData) => { /* ... */ }}
  onCanceled={(inquiryId, sessionToken) => { /* ... */ }}
  onError={(error, errorCode) => { /* ... */ }}
/>
```

### Leveraging OnReady for Preloading

Preloading allows you to initialize the Persona SDK in the background before displaying it to the user. This eliminates the initial loading screen.

The `onReady` callback is triggered when:

1.  The native SDK has been initialized
2.  The first page of the inquiry has loaded
3.  The component is ready to display to the user

#### Example

Here’s an example implementation of SDK preloading by rendering the component offscreen:

```typescript
export default function InquiryScreen() {
  const [isReady, setIsReady] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: isReady ? 0 : 1 }}>
        { /* render your placeholder here */ }
      </View>

      <PersonaInquiryView 
        style={{ flex: isReady ? 1 : 0 }}
        inquiry={inquiry}
        onReady={() => {
          console.log('Ready!');
          setIsReady(true)
        }}
        onComplete={(inquiryId, status, fields, extraData) => { /* ... */ }}
        onCanceled={(inquiryId, sessionToken) => { /* ... */ }}
        onError={(error, errorCode) => { /* ... */ }}
      />
    </View>
  );
}
```

### Overriding device locale

Our SDK will automatically use the language and region selected on a users device to determine localization. If your app has specific localization requirements independent of user’s device settings, you can pass the localization directly to the `InquiryBuilder` as follows:

```typescript
Inquiry.fromTemplate("itmpl_EXAMPLE")
  .locale("fr")
  .build()
```

## Custom Copy and Localization

Work with your account team to edit copy and localization for a given Inquiry Template. Self serve support for editing copy and localizations is coming to the Persona Dashboard soon.

## Theming

Set your own colors, buttons, fonts and more.

You can configure the styles that are applied to the inquiry template in the Persona Dashboard. For more information on using the theme editor, see our [help article](https://help.withpersona.com/articles/6SIHupp847yaEuVMucKAff).

Ensure your app is using react-native-persona v2.4.0 or higher to enable Server Side Theming.

### Custom Fonts

The React Native SDK will use the font name set in the Persona Dashboard for various text fields. Note that the font must be bundled in the hosting application in order to be loaded at runtime. The SDK will automatically lowercase the font name specified in the Persona Dashboard when rendering on Android and will replace any `-` or space characters with `_` to allow compatibility with Android resource naming conventions.

To bundle your own custom font on Android, create a font resource by following the follow guide: [https://developer.android.com/guide/topics/ui/look-and-feel/fonts-in-xml](https://developer.android.com/guide/topics/ui/look-and-feel/fonts-in-xml).

To bundle your own custom font on iOS, add a font file to the Xcode project by following the guide here: [https://developer.apple.com/documentation/uikit/text\_display\_and\_fonts/adding\_a\_custom\_font\_to\_your\_app](https://developer.apple.com/documentation/uikit/text_display_and_fonts/adding_a_custom_font_to_your_app).

### Dark mode

Work with your account team to enable a dark mode variant of your theme. Self serve support for enabling dark mode on your theme is coming to the Persona Dashboard soon.

## Government Id NFC Integration

### Android

To enable Government Id NFC functionality on Android, add the following plugin to your `build.gradle` file:

```
repositories {
  ...
  maven { url = uri("https://jitpack.io") }
  ...
}

...

dependencies {
  implementation 'com.withpersona.sdk2:nfc-impl:X.Y.Z'
}
```

To determine the correct version to use see the section [Determining the correct version to include for optional modules](./react-native-sdk-v2-integration-guide.md#determining-the-correct-version-to-include-for-optional-modules).

### iOS

To enable Government Id NFC functionality on iOS, follow the instructions below:

-   Add the Nfc pod subspec and base pod to your Podfile: `pod 'RNPersonaInquiry2', :path => '../node_modules/react-native-persona'` `pod 'RNPersonaInquiry2/Nfc', :path => '../node_modules/react-native-persona'`
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
-   Add a `ISO7816 application identifiers for NFC Tag Reader Session` to your info.plist file with these values **in the following order**: `A0000002471001`, `A0000002472001`, and `00000000000000`

## Video Integration

### Android

To enable video recording over WebRTC on Android, add the following to your `build.gradle` file:

```
dependencies {
  implementation 'com.withpersona.sdk2:webrtc-impl:X.Y.Z'
}
```

To determine the correct version to use see the section [Determining the correct version to include for optional modules](./react-native-sdk-v2-integration-guide.md#determining-the-correct-version-to-include-for-optional-modules).

### iOS

To enable video recording over WebRTC on iOS, follow the instructions below:

-   Add the WebRtc pod subspec and base pod to your Podfile: `pod 'RNPersonaInquiry2', :path => '../node_modules/react-native-persona'` `pod 'RNPersonaInquiry2/WebRtc', :path => '../node_modules/react-native-persona'`
-   Add a `Privacy - Microphone Usage Description` to your info.plist file, along with a description.

To enable local video recording upload on iOS follow these steps:

-   Add a `Privacy - Microphone Usage Description` to your Info.plist file.

## Phone Number Silent Network Authentication Integration

### Android

To enable phone number silent network authentication on Android, add the following to your `build.gradle` file:

```
dependencies {
  implementation 'com.withpersona.sdk2:sna-impl:X.Y.Z'
}
```

To determine the correct version to use see the section [Determining the correct version to include for optional modules](./react-native-sdk-v2-integration-guide.md#determining-the-correct-version-to-include-for-optional-modules).

### iOS

To enable phone number silent network authentication on iOS, follow the instructions below:

-   Add the Sna pod subspec and base pod to your Podfile: `pod 'RNPersonaInquiry2', :path => '../node_modules/react-native-persona'` `pod 'RNPersonaInquiry2/Sna', :path => '../node_modules/react-native-persona'`

## Determining the correct version to include for optional modules

For optional modules/feature you may need to include additional Android modules. Before you can include these modules you will need to determine the version of Android modules to include based on the version of the React Native SDK you use. **The React Native SDK version is not the same as the Android module version.**

To find out the correct Android version to include, first note the version of the React Native SDK you are using. Then look at the [React Native SDK changelogs](./react-native-sdk-v2-changelog.md). Find the changelogs for the version you are using and note the associated Android SDK version. As an example, if you are using v2.9.5 of the React Native SDK the associated Android SDK version is v2.12.11.

If the changelogs for your React Native SDK version does not state an associated Android SDK, look for the closest release before your version that states an associated Android SDK version.

## Licenses

See [here](./react-native-licenses.md) for a list of the 3rd party software that we use and their associated licenses. Be sure to include these licenses in your app.
