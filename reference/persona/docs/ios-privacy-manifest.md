# iOS Privacy Manifest

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[iOS](./tutorial-ios-sdk-precreate.md)

# iOS Privacy Manifest

Declare to Apple the data collected by your app or by third-party SDKs.

Apple’s privacy manifest is a file type used to record the categories of data that your app and third-party SDKs collect about the person using the app, and the reasons they collect the data. For more information on privacy manifest files, see [Apple’s developer documentation](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files).

## Configuring Data Types

All data collected using the SDK should use the following configuration:

| Key | Value |
| --- | --- |
| Linked to User | Yes |
| Used for Tracking | No |
| Collection Purpose | App functionality |

## Using the Inquiry SDK Module

Persona includes its own privacy manifest in SDK v2.18.0 and above for the default collected data types. Based on the verifications you have configured, you will need to add collected data types to the privacy manifest for your app. Refer to [the section below](./ios-privacy-manifest.md#updating-your-privacy-manifest-file) for adding data types to your privacy manifest file.

By default, Persona’s own privacy manifest includes the following collected data types:

| Data Type | Description |
| --- | --- |
| Coarse location | IP address. |
| Device ID | Device-level ID assigned by Persona. |
| User ID | User and account IDs assigned by Persona. |
| Other Diagnostic Data | Error logging. |
| Product Interaction | Inquiry flow events logging. |

### Updating your Privacy Manifest File

The sections below summarize collected data types you should declare based on the verification types applied in the flow. Based on custom logic in your flow, additional data types may need to be included. Refer to [Apple’s developer documentation on describing data use in privacy manifests](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests).

#### Government ID

The collected data types below include generic data collected on government ID capture, they may vary depending on the pieces of government ID supported in the flow.

| Data Type | Description |
| --- | --- |
| Name | From the government ID. |
| Physical address | From the government ID, if applicable. |
| Sensitive info | Biometric data. |
| Photos or videos | Photo of the government ID. |
| Audio data | Only if video recording is supported. |

#### Document

The collected data types below are suggestions based on [common document types collected from Persona](https://withpersona.com/product/verifications/documents), they will vary based on the specific document types collected in your flow.

| Data Type | Description |
| --- | --- |
| Name | From the business or supplemental documents. |
| Email address | From the business or supplemental documents. |
| Phone number | From the business or supplemental documents. |
| Physical address | From the business or supplemental documents. |
| Payment info | From bank statement or other supplemental documents. |
| Credit info | From proof of income or other supplemental documents. |
| Other financial info | From proof of income or other supplemental documents. |
| Photos or videos | Photo of the document. |

#### Selfie

Selfie verification uses the phone’s camera for liveness checks.

| Data Type | Description |
| --- | --- |
| Sensitive info | Biometric data. |
| Photos or videos | Photo of the selfie. |
| Audio data | Only if video recording is supported. |

#### Database

The collected data types for database verification will vary depending on the use case, refer to the information required on the inquiry flow’s forms.

| Data Type | Description |
| --- | --- |
| Name | From the form. |
| Email address | From the form, if applicable. |
| Phone number | From the form, if applicable. |
| Physical address | From the form, if applicable. |
| Other financial info | For TIN verification. |

#### Phone and Email

Depending on whether one or both of these verifications are applied, they will need to be included in the collected data types.

| Data Type | Description |
| --- | --- |
| Email address | If email verification is used. |
| Phone number | If phone verification is used. |

#### Other

For other verifications, go through the flow and refer to [Apple’s developer documentation](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests) to identify the collected data types.

## Using the NFC Module

By default, the NFC module’s privacy manifest doesn’t list any collected data types. However, when the NFC module is utilized alongside the Inquiry SDK module, it typically requires the addition of the following collected data types. If there’s a need to include additional collected data types, please consult [the section above](./ios-privacy-manifest.md#updating-your-privacy-manifest-file) and [Apple’s developer documentation](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests) for guidance.

| Data Type | Description |
| --- | --- |
| Name | From the government ID. |
| Physical address | From the government ID, if applicable. |
| Sensitive info | Biometric data. |
| Photos or videos | Photo of the government ID. |
| Audio data | Only if video recording is supported. |

## Using the WebRTC Module

As of SDK v2.18.0, the WebRTC module has its own privacy manifest with the following collected data types. Refer to [the section above](./ios-privacy-manifest.md#updating-your-privacy-manifest-file) and [Apple’s developer documentation](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests) for including additional collected data types.

| Data Type | Description |
| --- | --- |
| Sensitive info | Biometric data. |
| Photos or videos | Video recording enabled. |
| Audio data | Video recording enabled. |
