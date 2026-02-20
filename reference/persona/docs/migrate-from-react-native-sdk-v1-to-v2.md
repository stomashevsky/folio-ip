# Migrate from React Native SDK v1 to v2

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[React Native](./react-native-sdk-v2-integration-guide.md)

# Migrate from React Native SDK v1 to v2

[React Native SDK v2](./react-native-sdk-v2-integration-guide.md) brings support for Dynamic Flow Templates, which represent the next generation of Persona’s inquiry flow. Dynamic Flow Templates allow for greater flexibility in data collection by allowing custom UIs and collection fields.

Dynamic Flow Templates support versioning and fully custom, component-based views. If you are an existing customer and are interested in using Dynamic Flow Templates, please [contact us](https://app.withpersona.com/dashboard/contact-us) or talk to your CSM.

## Am I using Dynamic Flow Templates?

If your template ID starts with `tmpl_`, then you are using the old **Template** and should use the [React Native SDK v1](./react-native-sdk-integration-guide.md).

If your template ID starts with `itmpl_`, then you are using the new **Dynamic Flow Template** and must use [React Native SDK v2](./react-native-sdk-v2-integration-guide.md).

## I am an existing customer using React Native SDK v1. Do I need to migrate?

You must use React Native SDK v2 if you are using Dynamic Flow Templates. Inquiries created via Dynamic Flow Templates will not work properly with React Native SDK v1.

Existing users who are not using Dynamic Flow Templates will not need to migrate to React Native SDK v2, and React Native SDK v1 will continue working for the immediate future. However, we encourage using the latest version whenever possible to take advantage of improvements and bug fixes.

If you have a hard reliance on removed features, but want/need to use Dynamic Flow Templates, please [contact us](https://app.withpersona.com/dashboard/contact-us) or talk to your CSM for a migration path.

## What do I need to do to migrate to React Native SDK v2 API?

The following table lists breaking changes in the 2.x version of our SDK.

## Update dependencies

### React Native Dependencies

In `package.json`, update the latest version of the React Native SDK v2.

```
dependencies {
    // ...
-    "react-native-persona": "^1.x.y",
+    "react-native-persona": "^2.a.b",
    // ...
}
```

### iOS dependencies

Update the pods with `cd ios && pod install`.

## Updated callbacks

### Before

```typescript
import Inquiry from 'react-native-persona';

const createInquiry = (templateId: string) => {
  Inquiry
    .fromTemplate(templateId)
    .onSuccess((inquiryId, attributes) => {
      // Inquiry Success Callback
    })
    .onFailed((inquiryId) => {
      // Inquiry Failed Callback
    })
    .onCancelled(() => {
      // Inquiry Cancelled Callback
    })
    .onError((error) => {
      // Inquiry Errored Callback
    })
    .build()
    .start()
};
```

### After

```typescript
import Inquiry from 'react-native-persona';

const createInquiry = (templateId: string) => {
  Inquiry
    .fromTemplate(templateId)
    .onComplete((inquiryId, status, fields) => {
      // Inquiry Complete callback
    })
    .onCanceled((inquiryId, sessionToken) => {
      // Inquiry Canceled Callback
    })
    .onError((error) => {
      // Inquiry Errored Callback
    })
    .build()
    .start()
};
```

## Supporting both v1 and v2 in parallel

Make sure the v1 instance is at least React Native SDK v1.3.0.

### Update Android

Add the following snippet to your `app/build.gradle` file to prevent a compilation error.

```
android {
  // ...
  packagingOptions {
    exclude 'META-INF/*.kotlin_module'
  }
}
```

### Alias versions of the SDK

Alias the two packages with different names.

```
yarn add react-native-persona1@npm:react-native-persona@1.3.0
yarn add react-native-persona2@npm:react-native-persona@2.2.15
```

In your files, reference the two packages separately.

```typescript
import Inquiry, {Environment} from 'react-native-persona1';
import Inquiry2, {Environment as Environment2} from 'react-native-persona2';
```

## Full list of breaking changes

| Change | Replacement |
| --- | --- |
| `InquiryBuilder.onSuccess` and `InquiryBuilder.onFailed` callbacks have been removed. | A new callback, `InquiryBuilder.onComplete`, returns a dynamic `status` argument; check for failure with `status == 'failed'`. Ask your CSM about custom statuses. |
| `InquiryBuilder.onCancelled` renamed. | `InquiryBuilder.onCanceled` |
| `InquiryAttributes` removed. | Fields such as `birthdate`, `name`, `address` are now returned on the generic `Fields` object in the `onCompete` callback. Ask your CSM about custom fields. |

## What’s new in React Native SDK v2 API?

| Change | Purpose |
| --- | --- |
| `fromTemplateVersion` builder | Allows locking inquiry creation to a specific template version. Only Dynamic Flow Templates have versions. |
| `onCanceled` callback now returns `inquiryId` and `sessionToken` | Allows for resuming the Inquiry flow without needing to make a server call. |
| `onComplete` returns a map of field names to `InquiryField``export type Fields = Record<string, InquiryField | null>;` | Enable custom data returned to the client. Contact us for your use case. |
