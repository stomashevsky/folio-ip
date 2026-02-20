# Migrate from Android SDK v1 to v2

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[Android](./android-sdk-v2-integration-guide.md)

# Migrate from Android SDK v1 to v2

#### v1 is deprecated

As of **December 31, 2022**, the v1 SDK and Legacy Templates are considered deprecated.

[Android SDK v2](./android-sdk-v2-integration-guide.md) brings support for **Dynamic Flow Templates**, which represent the next generation of Persona’s inquiry flow. Dynamic Flow Templates allow for greater flexibility in data collection by allowing custom UIs and collection fields.

Dynamic Flow Templates support versioning and fully custom, component-based views. If you are an existing customer and are interested in using Dynamic Flow Templates, please [contact us](https://app.withpersona.com/dashboard/contact-us) or talk to your CSM.

## Am I using Dynamic Flow Templates?

If your template ID starts with `tmpl_`, then you are using the old **Template** and should use the [Android SDK v1](./android-sdk-integration-guide.md).

If your template ID starts with `itmpl_`, then you are using the new **Dynamic Flow Template** and must use [Android SDK v2](./android-sdk-v2-integration-guide.md).

## I am an existing customer using Android SDK v1. Do I need to migrate?

You must use Android SDK v2 if you are using Dynamic Flow Templates. Inquiries created via Dynamic Flow Templates will not work properly with Android SDK v1.

Existing users who are not using Dynamic Flow Templates will not need to migrate to Android SDK v2, and Android SDK v1 will continue working for the immediate future. However, we encourage using the latest version whenever possible to take advantage of improvements and bug fixes.

If you have a hard reliance on removed features, but want/need to use Dynamic Flow Templates, please [contact us](https://app.withpersona.com/dashboard/contact-us) or talk to your CSM for a migration path.

## What do I need to do to migrate to Android SDK v2 API?

The following table lists breaking changes in the 2.x version of our SDK.

## Updated namespace

The Android SDK v2 now has a new namespace. You can safely load v1 and v2 concurrently if you require a phased rollout to upgrade to Dynamic Flow.

## Updating the SDKv2 namespace on Android

The package `com.withpersona.sdk` has been renamed to `com.withpersona.sdk2` so the easiest way to migrate to the new namespace is to do a project wide find and replace, changing all occurrences of `com.withpersona.sdk` with `com.withpersona.sdk2`.

## Update dependency

```
dependencies {
    // ...
-    implementation 'com.withpersona.sdk:inquiry:1.a.b'
+    implementation 'com.withpersona.sdk2:inquiry:2.x.y'
    // ...
}
```

![Inquiry SDK latest](./images/v_66d2718512c5.png)

## Updated callbacks

### Before

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
  super.onActivityResult(requestCode, resultCode, data)
  if (requestCode == INQUIRY_REQUEST_CODE) {
    when (val response = Inquiry.onActivityResult(data)) {
      is Inquiry.Response.Success -> {
        // response.inquiryId
        // response.attributes
        // response.relationships.verifications
      }
      is Inquiry.Response.Failure -> {
        // response.inquiryId
        // response.attributes
        // response.relationships.verifications
      }
      is Inquiry.Response.Cancel -> {
      }
      is Inquiry.Response.Error -> {
        // response.debugMessage
      }
    }
  }
  // ...
}
```

### After

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
  super.onActivityResult(requestCode, resultCode, data)
  if (requestCode == INQUIRY_REQUEST_CODE) {
    when (val response = Inquiry.onActivityResult(data)) {
      is InquiryResponse.Complete -> {
        // response.status ('failed', 'completed')
        // response.inquiryId
        // response.fields
      }
      is InquiryResponse.Cancel -> {
        // response.inquiryId
        // response.sessionToken
      }
      is InquiryResponse.Error -> {
        // response.debugMessage
      }
    }
  }
  // ...
}
```

## Supporting both v1 and v2 in parallel

Make sure the v1 instance is at least Android SDK v1.1.18. ![Inquiry SDK latest](./images/v_a4c73e60b0dd.png)

Use the `Persona.Inquiry2.Theme` and `Persona.Inquiry1.Theme` and their corresponding fields to support the v1 themes (AppCompat-based) and v2 themes (Material-based).

#### Inquiry#start and Inquiry.onActivityResult are deprecated

The recommended way is to use the [Activity Results API’s `registerForActivityResult` method](https://developer.android.com/training/basics/intents/result) with the `Inquiry.Contract()` object.

## Update theming

Persona’s styles are now based on Material light as opposed to AppCompat’s day-night theme.

```
<resources>
  <!--...-->
  <style name="ExampleCustomTheme" parent="@style/Persona.Inquiry.Theme">
    <item name="colorPrimary">#2196f3</item>
-    <item name="colorAccent">#6ec6ff</item>
-    <item name="colorPrimaryDark">#0069c0</item>
+    <item name="colorSecondary">#6ec6ff</item>
+    <item name="colorPrimaryVariant">#0069c0</item>
  </style>
</resources>
```

## Full list of breaking changes

| Change | Replacement |
| --- | --- |
| [`Inquiry.Response.Success`](https://sdk.withpersona.com/android/v1/docs/com/withpersona/sdk/inquiry/Inquiry.Response.Success.html) and [`Inquiry.Response.Failure`](https://sdk.withpersona.com/android/v1/docs/com/withpersona/sdk/inquiry/Inquiry.Response.Failure.html) removed | [`InquiryResponse.Complete`](https://sdk.withpersona.com/android/docs/com/withpersona/sdk2/inquiry/InquiryResponse.Complete.html) returned for both passes and fails with a new `status` argument; check for failure with `status == 'failed'`. |
| `Inquiry.Response.Cancel` and `Inquiry.Response.Error` renamed | `InquiryResponse.Cancel` and `InquiryResponse.Error` |
| `Inquiry.InquiryBuilder#accessToken` renamed | `InquiryBuilder#sessionToken` |
| `Inquiry.InquiryBuilder#note` removed | Both Dynamic Flow Templates and Templates support custom fields. Contact us to configure custom fields as a replacement. |
| `Fields.Builder#emailAddress`, `Fields.Builder#phoneNumber`, `Fields.Builder#name`, `Fields.Builder#address`, and `Attributes` | `Fields.Builder#field` with “emailAddress”, “phoneNumber”, “nameFirst”, “nameMiddle”, “nameLast”, “addressStreet1”, “addressStreet2”, “addressCity”, and other names passed in as strings (when available). |
| `Relationships` and `Verification` removed | These response objects were used to support use cases Dynamic Flow supports more robustly. Please contact us about your use case if you were using the fields. |
| `Inquiry#start` deprecated | `registerForActivityResult(Inquiry.Contract())` is the recommended way to go |

## What’s new in Android SDK v2 API?

| Change | Purpose |
| --- | --- |
| `Inquiry#fromTemplateVersion` builder | Allows locking inquiry creation to a specific template version. Only Dynamic Flow Templates have versions. |
| `Cancel` now returns `inquiryId` and `sessionToken` | Allows for resuming the Inquiry flow without needing to make a server call. |
| `Complete` returns a map of field names to `InquiryField` | Enable custom data returned to the client. Contact us for your use case. |
