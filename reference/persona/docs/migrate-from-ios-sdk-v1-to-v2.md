# Migrate from iOS SDK v1 to v2

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[iOS](./tutorial-ios-sdk-precreate.md)

# Migrate from iOS SDK v1 to v2

#### v1 is deprecated

As of **December 31, 2022**, the v1 SDK and Legacy Templates are considered deprecated.

[iOS SDK v2](./ios-sdk-v2-integration-guide.md) brings support for **Dynamic Flow Templates**, which represent the next generation of Persona’s inquiry flow. Dynamic Flow Templates allow for greater flexibility in data collection by allowing custom UIs and collection fields.

Dynamic Flow Templates support versioning and fully custom, component-based views. If you are an existing customer and are interested in using Dynamic Flow Templates, please [contact us](https://app.withpersona.com/dashboard/contact-us) or talk to your CSM.

## Am I using Dynamic Flow Templates?

If your template ID starts with `tmpl_`, then you are using the old **Template** and should use the [iOS SDK v1 Integration Guide](./ios-inquiry-sdk-integration-guide.md).

If your template ID starts with `itmpl_`, then you are using the new **Dynamic Flow Template** and must use [iOS SDK v2 Integration Guide](./ios-sdk-v2-integration-guide.md).

## I am an existing customer using iOS SDK v1. Do I need to migrate?

You must use iOS SDK v2 if you are using Dynamic Flow Templates. Inquiries created via Dynamic Flow Templates will not work properly with iOS SDK v1.

Existing users who are not using Dynamic Flow Templates will not need to migrate to iOS SDK v2, and iOS SDK v1 will continue working for the immediate future. However, we encourage using the latest version whenever possible to take advantage of improvements and bug fixes.

If you have a hard reliance on removed features, but want or need to use Dynamic Flow Templates, please [contact us](https://app.withpersona.com/dashboard/contact-us) or talk to your CSM for a migration path.

## What do I need to do to migrate to iOS SDK v2 API?

The following lists breaking changes in the 2.x version of our SDK.

## Updated package name

The Inquiry iOS SDK v2 is a now an entirely new package and module. You can safely load v1 and v2 concurrently if you require a phased rollout to upgrade to Dynamic Flow.

### Swift Package Manager

The Inquiry iOS SDK v2 lives at: [https://github.com/persona-id/inquiry-ios-2.git](https://github.com/persona-id/inquiry-ios-2.git).

### Cocoapods

The Inquiry iOS SDK v2 pod is now named `PersonaInquirySDK2` update your podfile accordingly.

![Inquiry SDK latest](./images/PersonaInquirySDK2_0f3346a8b6a3.png)

## Updated InquiryDelegate

### Before

```swift
extension MyViewController: InquiryDelegate {

    func inquirySuccess(inquiryId: String, attributes: Attributes, relationships: Relationships) {
        // Inquiry succeeded
    }

    func inquiryCancelled() {
        // Inquiry cancelled by user
    }

    func inquiryFailed(inquiryId: String, attributes: Attributes, relationships: Relationships) {
        // Inquiry failed
    }

    func inquiryError(_ error: Error) {
        // Inquiry errored
    }
}
```

### After

```swift
extension MyViewController: InquiryDelegate {

    func inquiryComplete(inquiryId: String, status: String, fields: [String : InquiryField]) {
        // Inquiry completed
    }
    
    func inquiryCanceled(inquiryId: String?, sessionToken: String?) {
        // Inquiry canceled by user
    }
    
    func inquiryError(_ error: Error) {
        // Inquiry errored
    }
}
```

## Full list of breaking changes

| Change | Replacement |
| --- | --- |
| Module name has changed.`import Persona` | `import Persona2` |
| [`InquiryDelegate.inquirySuccess(_, _, _)`](https://sdk.withpersona.com/ios/v1/docs/Protocols/InquiryDelegate.html#/s:7Persona15InquiryDelegateP14inquirySuccess0D2Id10attributes13relationshipsySS_AA10AttributesVAA13RelationshipsVtF) and [`InquiryDelegate.inquiryFailed(_, _, _)`](https://sdk.withpersona.com/ios/v1/docs/Protocols/InquiryDelegate.html#/s:7Persona15InquiryDelegateP13inquiryFailed0D2Id10attributes13relationshipsySS_AA10AttributesVAA13RelationshipsVtF) removed | [`InquiryDelegate.inquiryComplete(_, _, _)`](https://sdk.withpersona.com/ios/docs/Protocols/InquiryDelegate.html#/s:7Persona15InquiryDelegateP15inquiryComplete0D2Id6status6fieldsySS_SSSgSDySSAA0B5FieldOGtF) returned for both passes and fails with a new `status` argument; check for failure with `status == 'failed'`. |
| [`InquiryDelegate.inquiryCancelled()`](https://sdk.withpersona.com/ios/v1/docs/Protocols/InquiryDelegate.html#/s:7Persona15InquiryDelegateP16inquiryCancelledyyF) renamed | [`InquiryDelegate.inquiryCanceled(_, _)`](https://sdk.withpersona.com/ios/docs/Protocols/InquiryDelegate.html#/s:7Persona15InquiryDelegateP15inquiryCanceled0D2Id12sessionTokenySSSg_AGtF) |
| [`InquiryConfiguration.accessToken`](https://sdk.withpersona.com/ios/v1/docs/Structs/InquiryConfiguration.html#/s:7Persona20InquiryConfigurationV9inquiryId11accessToken5themeACSS_SSSgAA0B5ThemeVSgtcfc) renamed | [`InquiryConfiguration.sessionToken`](https://sdk.withpersona.com/ios/docs/Structs/InquiryConfiguration.html#/s:7Persona20InquiryConfigurationV9inquiryId12sessionToken5themeACSS_SSSgAA0B5ThemeVSgtcfc) |
| [`Relationships`](https://sdk.withpersona.com/ios/v1/docs/Structs/Relationships.html) and [`Attributes`](https://sdk.withpersona.com/ios/v1/docs/Structs/Attributes.html) removed | These response objects were used to support use cases Dynamic Flow supports more robustly. Please contact us about your use case if you were using the fields. [`InquiryField`](https://sdk.withpersona.com/ios/docs/Enums/InquiryField.html) has replaced these structs. |

## What’s new in iOS SDK v2 API?

| Change | Purpose |
| --- | --- |
| [`InquiryConfiguration`](https://sdk.withpersona.com/ios/docs/Structs/InquiryConfiguration.html) now includes TemplateVersion based initializers. | Allows locking inquiry creation to a specific template version. Only Dynamic Flow Templates have versions. This is designed to enabled better development experience and support for incrementally rolling out changes. |
| [`InquiryDelegate.inquiryCanceled(_, _)`](https://sdk.withpersona.com/ios/docs/Protocols/InquiryDelegate.html#/s:7Persona15InquiryDelegateP15inquiryCanceled0D2Id12sessionTokenySSSg_AGtF) callback now includes an `inquiryId` and a `sessionToken`. | Allows for resuming the Inquiry flow without needing to make a server call. See the [`InquiryConfiguration inquiryId initializers`](https://sdk.withpersona.com/ios/docs/Structs/InquiryConfiguration.html#/s:7Persona20InquiryConfigurationV9inquiryId12sessionToken5themeACSS_SSSgAA0B5ThemeVSgtcfc). |
| [`InquiryDelegate.inquiryComplete`](https://sdk.withpersona.com/ios/docs/Protocols/InquiryDelegate.html#/s:7Persona15InquiryDelegateP15inquiryComplete0D2Id6status6fieldsySS_SSSgSDySSAA0B5FieldOGtF) callback includes a map of field names to [`InquiryField`](https://sdk.withpersona.com/ios/docs/Enums/InquiryField.html). | Enable custom data returned to the client. Contact us for your use case. |

## View an example migration from SDK v1.1.18 to v2.0.1

[`Click here`](https://github.com/persona-id/persona-ios-sdk/commit/bddc9103539e3b7303a45782997155f1fbeea96a?branch=bddc9103539e3b7303a45782997155f1fbeea96a&diff=unified) to view an example migration in our public demo app.
