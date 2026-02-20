# Android Integration Guide

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[Android](./android-sdk-v2-integration-guide.md)

# Android Integration Guide

Android Inquiry SDK Integration Guide and Technical Documentation

The Persona Inquiry flow lets you securely and seamlessly collect your user’s information.

## Integration

Integrate the Persona Inquiry flow directly into your Android app with our native SDK.

### Requirements - Make sure the SDK is compatible

Your application needs to have a `minSdkVersion` set to API 21 (Lollipop, 5.0) or higher.

### Dependencies - Adding Persona to your project

In your `app/build.gradle` file (or wherever you plan on using the SDK) include the following:

```
repositories {
  // ...
  maven {
    url = uri("https://sdk.withpersona.com/android/releases")
  }
}

android {
  // ...
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
}

dependencies {
  // ...
  implementation("com.withpersona.sdk2:inquiry:X.Y.Z")
  // ...
}
```

![Inquiry SDK latest](./images/v_66d2718512c5.png)

### Privacy Configuration

This SDK collects a user’s [App-Set ID](https://developer.android.com/training/articles/app-set-id) for Fraud Prevention purposes. When publishing to the Play Store, disclose the usage of Device Identifiers as follows:

| Data Types | Collected | Shared | Processed Ephemerally | Required or Optional | Purposes |
| --- | --- | --- | --- | --- | --- |
| Device or other IDs | Yes | No | No | Required | Fraud Prevention |

### Required permissions

Our manifest files declare the following permissions.

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

If using our optional NFC package, `<uses-permission android:name="android.permission.NFC" />` is also included.

## Usage

### Register for Inquiry’s Result

#### Do not rely on callbacks for critical business logic

SDK callbacks are intended for coordination between your app’s UI and Persona’s UI (e.g. opening and closing the flow UI). They do NOT guarantee that data are up-to-date, and cannot be reliably used to guarantee data integrity. Webhooks should be used for logic that depends on Inquiry state.

For more information, see [Accessing Inquiry status and data](./accessing-inquiry-status.md#webhooks-vs-sdk-callbacks).

Use the `androidx.activity.ComponentActivity#registerForActivityResult` or `androidx.fragment.app.Fragment#registerForActivityResult` method for retrieving the Inquiry result. Set it up using the `Inquiry.Contract()` as a `val`.

The SDK still supports launching an `Intent` and parsing the result with `Inquiry#onActivityResult`, but that method is deprecated.

```
val getInquiryResult =
  registerForActivityResult(Inquiry.Contract()) { result ->
    when (result) {
      is InquiryResponse.Complete -> {
        // ... completed flow
      }
      is InquiryResponse.Cancel -> {
        // ... abandoned flow
      }
      is InquiryResponse.Error -> {
        // ... something went wrong
      }
    }
  }
```

### Build and Launch the Inquiry

The `Inquiry` flow is initiated with a builder pattern based on either Inquiry Template ID, Inquiry Template Version, or Inquiry ID. Everything on the builder is optional: `theme`, `referenceId`, `accountId`, and `environment` (which defaults to `PRODUCTION`).

```
// Get the template ID from the Dashboard
// <https://app.withpersona.com/dashboard/getting-started/mobile-sdks>
val TEMPLATE_ID = "itmpl_EXAMPLE"
// ...

val inquiry = Inquiry.fromTemplate(TEMPLATE_ID)
  .environment(Environment.SANDBOX)
  .build()
// ...

getInquiryResult.launch(inquiry)
```

#### Persona recommends creating inquiries via API when possible

Please refer to [Creating inquiries](./creating-inquiries.md) for more information. After getting up and running consider moving inquiry creation to your backend for security reasons.

### Linking an Inquiry to your Users

To make it easier to find Inquiries in the Persona Dashboard, we recommend passing in your system’s user ID for the Inquiry reference ID.

```kotlin
val inquiry = Inquiry.fromTemplate(TEMPLATE_ID)
  .referenceId("myUser_123")
  .build()
```

### Pre-writing to the Inquiry

If you want to add extra information to the Inquiry before the user even starts, you can pass them in as `Fields`.

```kotlin
val inquiry = Inquiry.fromTemplate(TEMPLATE_ID)
  .fields(
    Fields.Builder()
      .field("name_first", "Alexander")
      .field("name_last", "Example")
      .build()
  )
  .build()
```

### Starting/Resuming an Inquiry from ID

When you create an Inquiry on the server, you can pass the Inquiry ID instead of the Template ID.

```kotlin
val inquiry = Inquiry.fromInquiry("inq_EXAMPLE")
  .build()
```

If the Inquiry has already started, you will need to also pass in the session token.

```kotlin
val inquiry = Inquiry.fromInquiry("inq_EXAMPLE")
  .sessionToken("ABD1234567890")
  .build()
```

### Overriding device locale

Our SDK will automatically use the language and region selected on a users device to determine localization. If your app has specific localization requirements independent of user’s device settings, you can pass the localization directly to the `InquiryBuilder` as follows:

```kotlin
val inquiry = Inquiry.fromTemplate("itmpl_EXAMPLE")
  .locale("fr")
  .build()
```

### Errors

It is rare but, the Persona Inquiry SDK may encounter a few categories of client side errors that can not be resolved. When unrecoverable errors are encountered, the SDK will immediately callback to the main application with a debug description of the error.

The most common reasons the Persona Inquiry SDK will error include unrecoverable networking errors, misconfigured templates (should only be encountered during development), or failing to establish a connection to the device camera.

## Customization

Make the Persona Inquiry flow look and feel like your app.

### Custom Styling

Set your own colors, buttons, fonts, and more. This can be done via the Persona Dashboard. For more information on using the theme editor, see our [help article](https://help.withpersona.com/articles/6SIHupp847yaEuVMucKAff).

To make other optional customizations such as custom loading icons, make a style in your `styles.xml` file that extends the Persona style.

The following example would generate `R.style.CustomLoadingIconTheme`.

```xml
<resources>
  <!-- other style declarations -->
  <style name="CustomLoadingIconTheme" parent="@style/Persona.Inquiry.Theme">
    <item name="personaInquiryLoadingLottieRaw">@raw/custom_loading_icon</item>
  </style>
</resources>
```

Then set it as the theme in `Inquiry` builder.

```kotlin
val customLoadingIconTheme = ServerThemeSource(R.style.CustomLoadingIconTheme)
val inquiry = Inquiry.fromTemplate(TEMPLATE_ID)
  .theme(customLoadingIconTheme)
  .build()
```

### Custom Fonts

By default, the Android SDK only has access to the device’s system font. Non system fonts can either be downloaded at runtime when uploaded to your inquiry template, or bundled into your hosting application.

Custom fonts that are not available in Persona themes are only available to customers on Enterprise plans.

**Bundling a font**

The font must be bundled in the hosting application in order to be loaded at runtime. The font can either be bundled in `res/font` or `assets/fonts`. If the font is located in `res/font`, the SDK will automatically lowercase the font name specified in the Persona Dashboard and will replace any `-` or space characters with `_` when searching for the font to allow compatibility with Android resource naming conventions.

For example, if you set the font to be ‘Rubik’ in your template’s Theme configuration, you will either need to add a font file named `rubik` to your project’s `res/font` directory, or add a font file named `Rubik.ttf` to your project’s `assets/fonts` directory.

Note: Android only allows the creation of bold and normal font weights for custom fonts at runtime on Android Q and above. If you need a font weight on a text component beyond bold and normal for a custom font, or need any sort of font weighting on versions < Q, add another font file that is already the correct weight and specify this font name as the font to use on that component specifically.

## Government Id NFC Integration

To enable Government Id NFC functionality, add the following to your app/module level `build.gradle` file:

```
repositories {
  ...
  maven { url = uri("https://jitpack.io") }
  ...
}
  
...

dependencies {
  implementation("com.withpersona.sdk2:nfc-impl:X.Y.Z")
}
```

where `X.Y.Z` matches the version of the `com.withpersona.sdk2:inquiry` module you are using.

## WebRTC Integration

To enable video recording over WebRTC on Android, add the following to your `build.gradle` file:

```
dependencies {
  implementation("com.withpersona.sdk2:webrtc-impl:X.Y.Z")
}
```

where `X.Y.Z` matches the version of the `com.withpersona.sdk2:inquiry` module you are using.

## Phone Number Silent Network Authentication (SNA) Integration

To enable phone number silent network authentication on Android, add the following to your `build.gradle` file:

```
dependencies {
  implementation("com.withpersona.sdk2:sna-impl:X.Y.Z")
}
```

where `X.Y.Z` matches the version of the `com.withpersona.sdk2:inquiry` module you are using.

## Local Repository Integration

If you cannot use our remote SDK repository for any reason, you can also choose to download our library and host it in a local repository or in an internal repository. To host our SDK within a local repository do the following:

1.  Download the zip file containing the release builds for our SDK at `https://sdk.withpersona.com/android/release_archives/v[X.Y.Z]/repo.zip` replacing `[X.Y.Z]` with the version of the SDK you want to use. Eg. [https://sdk.withpersona.com/android/release\_archives/v2.12.15/repo.zip](https://sdk.withpersona.com/android/release_archives/v2.12.15/repo.zip)
2.  Unzip the contents and move it within your Android project folder.
3.  In your app/module level `build.gradle` file include the following (where `X.Y.Z` is the version of the SDK you downloaded.

```
repositories {
  maven {
    // Declare local repository in "repo" folder.
    maven { url = uri("$rootDir/repo") }
  }
}

dependencies {
  // ...
  implementation("com.withpersona.sdk2:inquiry:X.Y.Z")
}
```

## Licenses

See [here](./android-sdk-v2-licenses.md) for a list of the 3rd party software that we use and their associated licenses. Be sure to include these licenses in your app.
