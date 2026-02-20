# Client Callbacks

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)

# Client Callbacks

#### Do not rely on callbacks for critical business logic

SDK callbacks are intended for coordination between your app’s UI and Persona’s UI (e.g. opening and closing the flow UI). They do NOT guarantee that data are up-to-date, and cannot be reliably used to guarantee data integrity. Webhooks should be used for logic that depends on Inquiry state.

For more information, see [Accessing Inquiry status and data](./accessing-inquiry-status.md#webhooks-vs-sdk-callbacks).

## onLoad & onReady

The `onLoad` callback is called when the `iframe` finishes loading and is ready to be displayed. It does not take any arguments.

The `onReady` callback is called when the inquiry flow is ready for user interaction. It does not take any arguments.

## onCancel

The `onCancel` callback is called when an individual cancels the inquiry flow before completion.

| Parameter | Type | Description |
| --- | --- | --- |
| `{ inquiryId, sessionToken }` | Object | Object containing information about the canceled inquiry. `inquiryId` is the ID of the inquiry used in this instance of the flow. `sessionToken` is a token that can be used to resume the inquiry. Values will be `undefined` if the flow is canceled before an inquiry is created. |

## onComplete

The `onComplete` callback is called when the inquiry has completed the inquiry flow and the individual clicks on the complete button to close the flow.

The purpose of this callback is to signal when the user has completed the Persona flow and should be sent back to your application. `onComplete` is **not guaranteed to be called**; it is possible that the user never presses the complete button.

`onComplete` receives the current status of the inquiry as an argument. These values are passed for convenience, and are **not guaranteed to be up to date**. For instance, a [Workflow](./api-reference/workflows.md) may have been executed between when the inquiry was completed and when the user pressed the complete button, resulting in a status change. If you need the most up to date state of the inquiry, please use [Webhooks](./webhooks.md).

| Parameter | Type | Description |
| --- | --- | --- |
| `{ inquiryId, status, fields }` | Object | Object containing information about the completed inquiry. `inquiryId` is the ID of the inquiry used in this instance of the flow. `status` is the status of the completed inquiry (e.g. `'completed'`, `'failed'`). `fields` is a map of field values. See [Fields](./embedded-flow-fields.md) documentation. |

## onError

The `onError` callback is called in response to errors in the inquiry flow that prevent the inquiry flow from being usable. These generally occur on initial load.

`onError` is not fired for network errors (e.g. dropped requests from bad connections, blocked requests due to application security settings, etc.)

| Parameter | Type | Description |
| --- | --- | --- |
| `{ status, code }` | Object | Error object. `status` is the HTTP error status, if applicable. The code will be `0` if the error was an application error. `code` is a short string describing the error. |

Below is a list of Persona error codes.

| Error codes | Status | Meaning |
| --- | --- | --- |
| `'application_error'` | `0` | An internal error occurred in the Persona web application. Please contact support. |
| `'invalid_config'` | `400` | The `persona` client was initialized with invalid arguments. |
| `'unauthenticated'` | `409` | An inquiry was resumed without a valid `sessionToken`. Retrieve one from the external API and pass it to the client. |
| `'inactive_template'` | `422` | An attempt was made to create an inquiry from an inactive template. Activate the template before attempting to create inquiries. |
| `'unknown'` | `number` | Catch-all error. |

## onEvent

The `onEvent` callback is called at certain points in the Persona flow. It takes two arguments, an `eventName` string and a `metadata` object.

`onEvent` is sometimes passed the current state of the inquiry for convenience purposes. These values are not guaranteed to be the latest values on the inquiry, and thus should not be used for critical logic. If your business logic depends on granular verification and inquiry status changes, we recommend using [Webhooks](./webhooks.md).

| Parameter | Type | Description |
| --- | --- | --- |
| `eventName` | String | A string representing the event that has just occurred in the Persona flow. |
| `metadata` | Object | An object containing information about the event. |

Other supported events include:

| `eventName` | Description |
| --- | --- |
| `start` | Triggered when an Inquiry object has been created in the client. Dynamic Flow Templates will send this event at the same time as `'ready'`, and it will not indicate user interaction. Legacy 2.0 Templates will send this event only when the user clicks ‘Continue’ on the start screen. `start` events receive a `metadata` object containing `inquiryId`. |
| `document-camera-select` | The individual is opening the camera for the government ID verification. The metadata includes a `stepData` object containing the following fields:
-   `idClass`: the class of the government ID being captured, if known

 |
| `document-camera-capture` | The individual took a photo for the government ID verification. The metadata includes a `stepData` object containing the following fields:

-   `idClass`: the class of the government ID being captured
-   `files`: an array of objects with `side` (which side of the document) and `captureMethod` (i.e. `manual`, `auto`)

 |
| `document-upload` | The individual uploaded a government ID photo. The metadata includes a `stepData` object containing the following fields:

-   `idClass`: the class of the government ID being uploaded
-   `files`: an array of objects with `side` (which side of the document) and `captureMethod`

 |
| `documents-save-successful` | The inquiry flow successfully saved captured documents. The metadata includes a `stepData` object containing the following fields:

-   `idClass`: the class of the government ID that was saved
-   `files`: an array of objects with `side` (which side of the document) and `captureMethod`

 |
| `documents-save-fail` | The inquiry flow failed to save captured documents. The metadata includes a `stepData` object containing the following fields:

-   `idClass`: the class of the government ID that failed to save
-   `files`: an array of objects with `side` (which side of the document) and `captureMethod`

 |
| `selfie-camera-select` | The individual is opening the camera for the selfie verification. |
| `selfie-camera-capture` | The individual took a photo for the selfie verification. The metadata includes a `stepData` object containing the following fields:

-   `files`: an array of objects with `pose` (the pose of the selfie) and `captureMethod`

 |
| `selfie-record-upload` | The individual uploaded a selfie photo. We allow uploads when their browser does not support embedded video. |
| `load-camera-failed` | The inquiry flow failed to load the camera during a government ID capture, selfie, or document upload flow. This can happen due to missing permissions or a hardware error. |
| `one-time-link-sent` | The individual sent a one time link to their mobile device. |
| `one-time-link-start` | The individual resumed their flow on their mobile device using a one-time link. |
| `one-time-link-exit` | The individual returned to their initial device after sending a link to their mobile device. |
| `complete` | The individual is exiting the flow after verifying their identity. |
| `page-change` | The current page in the Inquiry flow changed. This is primarily used with the [Inlined React](./inlined-flow.md) flow to dynamically resize the widget based on the contents of the current page. `page-change` events receive a `metadata` object containing the following fields:

-   `name`: name (unique identifier) of the next step
-   `nameDisplay`: descriptive name of the next step as seen and configured in Flow Editor
-   `path`: string representing the step type
-   `metadata.pageHeight`: height in pixels of the content on the current page

 |
