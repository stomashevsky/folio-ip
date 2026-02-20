# iOS Changelog

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[iOS](./tutorial-ios-sdk-precreate.md)

# iOS Changelog

Changes, Fixes, and Features for our iOS SDK.

## Releases

Watch [this repo](https://github.com/persona-id/inquiry-ios-2) to be notified when new versions of the iOS SDK are available.

We are continually releasing fixes and updates which improve the end user experience. We recommend staying up-to-date with releases to make sure you are taking advantage of the latest functionality and improvements.

#### Best practices for keeping the iOS SDK updated

Keeping your SDK up to date is essential for ensuring your app remains secure, performant, and compatible with the latest iOS versions and Persona features. Here are a few best practices we recommend:

-   ⏱ **Schedule regular updates** as part of your sprint or release cycle — aim for monthly or quarterly.
-   🔔 **Enable automated checks** using tools like [Dependabot](https://docs.github.com/en/code-security/dependabot) or [Renovate](https://docs.renovatebot.com/).
-   📬 **Subscribe to iOS SDK updates on GitHub**: [persona-id/inquiry-ios-2](https://github.com/persona-id/inquiry-ios-2)
-   📓 **Read the changelog thoroughly** to catch new features, deprecations, and breaking changes.
-   ✅ **Test safely** in your CI/CD pipeline—include functional, performance, and security tests before production deploy.

Adopting these habits reduces surprises and keeps your release process smooth.

## Changes

## \[v2.41.1\] - 2026-02-09

### Fixed

-   Fixed a bug where an inquiry could get stuck in a loading state if the user denied system permissions (location, camera, etc.).

## \[v2.41.0\] - 2026-02-02

### Added

-   Added InquiryEvent.pageChange event for gov id, selfie, document verification pending page.
-   Added `.styleVariant(StyleVariant?)` to `InquiryBuilder` and `InquiryTemplateBuilder` to allow overriding automatic handling light/dark mode.

## \[v2.40.0\] - 2026-01-20

### Changed

-   Improve NFC error messaging.

## \[v2.39.0\] - 2026-01-09

### Changed

-   Simplified document scanning flow.

## \[v2.38.0\] - 2025-12-22

### Changed

-   Temporarily reverted to building with Xcode 16.

### Fixed

-   Fixed a bug with 3rd party digital ID integrations.

## \[v2.37.0\] - 2025-12-15

### Added

-   Added support for mdoc passport verifications in Apple Wallet.

### Fixed

-   Addressed a minor issue preventing selfie redesign flow from launching.
-   Addressed focal distance issues in gov id flow in rare instances.

## \[v2.36.1\] - 2025-12-11

### Fixed

-   Fixed a race condition that could cause loading remote fonts to crash.

## \[v2.36.0\] - 2025-12-03

### Added

-   Added optional method `onReady()` to `PersonaInlineDelegate` to allow “preloading” sdk and skipping initial loading screen.

## \[v2.35.0\] - 2025-11-25

### Changed

-   Removed Bluetooth requirement introduced in v2.30.0.

## \[v2.34.1\] - 2025-11-25

### Fixed

Fix a bug where inquiry start events were not firing.

## \[v2.34.0\] - 2025-11-24

### Added

-   Added support for an inquiry’s `redirect_uri` which allows the sdk to redirect upon completion. You can set the redirect URI when creating an inquiry or in your inquiry template’s configuration.

```
let inquiry = Inquiry.from(templateId: "itmpl_123", delegate: self)
    .redirectUri(URL(string: "http://example.com")!)
    .build()
```

### Changed

-   Now building with Xcode 26.

### Fixed

-   Fixed a bug where inquiries could get stuck in a permissions loop if the device’s camera was not available.

## \[v2.33.1\] - 2025-11-20

### Fixed

-   Fixed a bug where depth data could have been captured without need.

## \[v2.33.0\] - 2025-11-14

### Added

-   Published the SNA SDK for phone number silent network authentication.

## \[v2.32.0\] - 2025-11-13

### Changed

-   The check animation at the end of the capture in old selfie flows now respects the color that is sent from the server. Note that this means it will no longer be green by default and will instead use your primary icon stroke color defined on your theme.
-   Changed cancel modal to stack buttons vertically to allow more space to fit longer localized strings.

## \[v2.31.0\] - 2025-10-28

### Added

-   Added support for capturing depth data during selfie flow.
-   Added support for redesigned selfie capture experience.

### Fixed

-   Fixed a bug where swiping down the photo picker would corrupt the current screen state.
-   Fixed a crash that could occur when a user selected multiple documents, navigated backward, and then selected another document from photos.
-   Fixed an inconsistency with how we enforce the file limit on document steps.

## \[v2.30.7\] - 2025-10-24

### Fixed

-   Fixed an issue with our camera permissions bottom sheet showing at the same time as the native camera permissions alert.
-   Fixed a bug where the camera permissions bottom sheet’s button needed to be tapped twice in order to deep link into settings.

## \[v2.30.6\] - 2025-10-20

### Added

-   Added support for a short capture tips blurb section below the government id capture feed.

## \[v2.30.5\] - 2025-10-10

### Added

-   Added an animation between sides of government id captures when video is enabled to make the transition more obvious.

## \[v2.30.4\] - 2025-10-07

### Added

-   Added support for credit card collection.

## \[v2.30.3\] - 2025-09-30

### Added

-   Added support for custom link text colors in checkbox component text.

## \[v2.30.2\] - 2025-09-29

### Changed

-   Checkboxes now align with the top of the text group in checkbox components.
-   Allows user to continue scanning NFC document if they pull their device away briefly.

### Added

-   Added support for disabling autocomplete on input address components.

### Fixed

-   Fixed brief stuttering when cached custom fonts load in input fields.
-   Fixed line height calculation for UITextViews.
-   Fixed some minor styling bugs with the bluetooth beacon ui component.

## \[v2.30.0\] - 2025-09-10

### Added

-   **Breaking change** Added support for bluetooth beacon ui components. This means that you will need to add a `Privacy - Bluetooth Always Usage Description` entry to your Info.plist file if you don’t already have one, even if your app or inquiry flow does not utilize this functionality. Unfortunately, Apple does not provide tools to differentiate when the Bluetooth API is in use, so you must do this.

### Fixed

-   Fixed an issue where a user could navigate back while transitioning to the next step within an Inquiry resulting in an invalid state.

## \[v2.29.2\] - 2025-08-15

### Fixed

-   Fixed an NFC scanning bug where BAC might not be used as a fallback when it should be.

## \[v2.29.1\] - 2025-08-06

### Fixed

-   Show invalid access key error message for new USA passports when the access key is incorrect rather than the generic error message.

## \[v2.29.0\] - 2025-07-21

### Fixed

-   Fixed a bug where text did not display on devices running iOS 14 and below.

### Changed

-   Reduced the main Persona SDK size from 9.6MB to 7.5MB.

## \[v2.28.1\] - 2025-07-07

### Added

-   Added additional nfc scan hints for passports.

## \[v2.28.0\] - 2025-07-02

### Added

-   Added support for external integrations such as Aadhaar and eID Easy.
-   Added support for downloading and using custom fonts at runtime.
-   Added nfc scan hints for ID cards.

### Changed

-   **Breaking change** Changed the associated values in the InquiryEvent enum to allow for more flexibility going forward.

Before:

```
func inquiryEventOccurred(event: InquiryEvent) {
    switch event {
    case .pageChange(let name, let page):
    ...
    }
 }
```

After:

```
func inquiryEventOccurred(event: InquiryEvent) {
    switch event {
    case .pageChange(let eventData):
        let name = eventData.name
        let path = eventData.path
    ...
    }
 }
```

### Fixed

-   Fixed a layout bug on iPad where the bottom of the create Reusable Persona sheet was cutoff.
-   Fixed a bug with NFC scanning where devices with system wide eastern arabic numerals were not able to unlock the NFC chip.
-   No longer show the add document button on the document review page if the number of uploaded documents is at the limit set on the template.
-   Fixed layout bugs with image components where they would appear to be the incorrect size if their widths and/or heights were not set on the server.

## \[v2.27.0\] - 2025-06-03

### Changed

-   Changed errors that are shown to the user when doing an NFC scan to be presented in modals rather than below the scan button.
-   Changed the appearance of phone number UI component. Now users can select country code by selecting country flag.

### Added

-   Added support for mdoc UI components (e.g. Apple Wallet in UI Steps).

### Fixed

-   Fixed an issue where images in buttons did not have the right color applied to them from the theme sent from the server.
-   Fixed a bug where default animations were not being themed with the correct colors.

## \[v2.26.2\] - 2025-05-16

### Added

-   Added an NFC scan tips dialog sheet to help users who are having trouble scanning their NFC chip.

### Fixed

-   Capture options in government id step now reflect template configuration.
-   We will now apply theme colors to the default document prompt screen image. We also now support markdown on the document prompt screen page.
-   Fixed Reusable Persona CTA card button.

## \[v2.26.1\] - 2025-05-07

### Changed

-   Changed the hint animations used for NFC scans.
-   Send component field values of the current screen when Reusable Personas is used.

### Added

-   Added `.accountReferenceId(_)` method to `SentinelEventBuilder` for Sentinel SDK. Use this to link a sentinel transaction to an account.

### Fixed

-   Fixed a bug where auto-capture sometimes would not work on a valid MRZ code.
-   Fixed images set to fill width on UI steps.

## \[v2.26.0\] - 2025-04-01

### Added

-   Added the ability to launch inquiries via one time link codes. The `Inquiry.from(oneTimeLinkCode: String, delegate: InquiryDelegate)` function can be called to do this. It can take in either the full Persona generated one time link code url or just the code itself.

### Changed

-   `RoutingCountry` enum, and `InquiryTemplateBuilder.routingCountry(string)`, `InquiryBuilder.routingCountry(string)` methods marked as deprecated. These will be fully removed as a breaking change in a coming release, please remove usage now to avoid compilation issues in future.
-   We now hide the hint box at the bottom of the camera feed on the gov id capture screen when the hint text is empty.

### Fixed

-   Fixed an issue where chevrons would not render in government id type select components on UI steps.
-   Fixed an issue with resend confirmation code button not unlocking email and phone 2fa flows.

## \[v2.25.5\] - 2025-03-13

### Fixed

-   Fixed a rare crash that could occur when leaving the selfie capture step.

## \[v2.25.4\] - 2025-03-10

### Added

-   Added support for auto submit buttons on ui steps.
-   Added alignment style for processing screens.

### Changed

-   Removed dependency on Down in favor of native AttributedString markdown support. Reduces SDK footprint.
-   Removed hardcoded padding on ui steps for platform parity.

## \[v2.25.3\] - 2025-02-28

### Fixed

-   Fixed a bug where checkbox text was not being styled to the correct font size.
-   Fixed a bug that was preventing Belgian national IDs’ and some Belgian residence permits’ NFC chips from being scanned.

## \[v2.25.2\] - 2025-02-11

### Fixed

-   Fixed a race condition that caused `PersonaInlineDelegate.navigationStateDidUpdate` to fire with stale data.

## \[v2.25.1\] - 2025-02-07

### Fixed

-   Fixed a bug where certain dates would not be populated depending on the timezone of the device and if the date was on a day in that timezone where daylight savings occurred at midnight.
-   Fixed a style issue on Selfie Review screen.

## \[v2.25.0\] - 2025-02-03

### Added

-   Added support for optional review screen on selfie flows.
-   Added the ability for the server to instruct the client to use fallback mode automatically. To use this, either pass in FallbackMode.defer to the .fallbackMode function on the InquiryTemplate builder, or pass in a valid fallback inquiry id (starts with `iqfs`) and a valid fallback session token (using the .sessionToken function) on the Inquiry builder.

### Changed

-   `InquiryDelegate` is now marked as `@MainActor` to reflect it’s existing behavior and eliminate warnings on implementations also marked as `@MainActor`.

### Fixed

-   Fixed a bug that was causing the cursor to jump to the end of input text components when the user was not making their edit at the end of the input text.
-   Fixed a rare crash during government id step.
-   Made the verify with Reusable Persona button component disableable.
-   Fixed a bug that could cause inquiries to show pages that async workflows triggered after the inquiry success screen was reached when creating a Reusable Persona.

## \[v2.24.0\] - 2024-12-20

### Added

-   Published the Sentinel SDK.

## \[v2.23.3\] - 2024-12-16

### Fixed

-   Attributes on `PersonaInlineNavigationState` now correctly marked as public.

## \[v2.23.2\] - 2024-12-11

### Fixed

-   Fixed an issue with international DB components where prefilled country and id type fields would not hide according to the instructions of the server.

### Added

-   Added support for markdown in the capture tips modal prompt text.

## \[v2.23.1\] - 2024-11-25

### Added

-   Added property `isPersonaNavigationHidden` to `PersonaInlineViewController` to ease formSheet presentation with inline mode.

## \[v2.23.0\] - 2024-11-18

### Added

-   Added experimental `startInline()` method to `Inquiry` used for embedding inquiry flow “inline” in your app. This feature allows custom handling of navigation elements within the flow.
-   Added optional `inquiryEventDidOccur` method to `inquiryDelegate`, this method is called on various events and can be used for logging purposes.

### Changed

-   Now returning `PersonaError.invalidSessionToken` instead of `PersonaError.networking` when invalid session tokens are passed to the SDK.
-   Now building with Xcode 16.

### Fixed

-   Manual country and id type select components in autoclassification flows now have the correct styling applied. The back and cancel buttons now show up on the manual select screen as well.
-   Input select components now respect the disabled styles that come from the server.
-   No longer crashing when json logic has a nested array as part of an “in” check.
-   Fixed UIAppearance bug on input select component sheets.

## \[v2.22.5\] - 2024-09-16

### Fixed

-   Fixed a regression when permissions are granted for first time.

## \[v2.22.4\] - 2024-08-29

### Added

-   Added support for GPS collection.

## \[v2.22.3\] - 2024-08-16

### Fixed

-   Fixed an issue where the auto complete suggestion drop down is blacked out when the phone is set to dark mode.

## \[v2.22.2\] - 2024-08-13

### Fixed

-   Fixed an issue where Ukrainian passport NFC chips would not scan correctly.
-   Fixed an issue where the background color of selected items in select sheets did not display.

## \[v2.22.1\] - 2024-08-09

### Changed

-   Hyperlinks are now underlined.

## \[v2.22.0\] - 2024-08-02

### Added

-   Added support for disabled styling on input select components.

### Changed

-   Upgraded lottie to 4.5.0.

### Fixed

-   Fixed an issue where some remote assets wouldn’t display.
-   Fixed sandbox support during fallback flows.

## \[v2.21.2\] - 2024-07-18

### Fixed

-   Fixed an issue where French national ids could not be scanned with NFC.
-   Fixed an issue where GPS location permission popped up incorrectly.
-   Fixed a styling issue with custom assets.

## \[v2.21.1\] - 2024-07-12

### Fixed

-   Fixed an issue with rendering document icon.

## \[v2.21.0\] - 2024-07-02

### Added

-   Added the ability to scan nfc chips using PACE IM.
-   Added support for Government Id flows that auto-classify id type and country code, eliminating these selection screens to end users.
-   Added the international database component.

## \[v2.20.3\] - 2024-06-18

### Added

-   Added the ability to configure audio recording enablement during video capture.

### Fixed

-   Fixed an issue where buttons in bottom sheets would not be locked during screen transitions.
-   Fixed an issue where some devices would not be able to find a suitable camera to use due to frame rate properties of the camera.
-   Fixed an issue where we would load a blank camera feed if camera permissions were not granted. We should not go to the capture page at all in this case.
-   Fixed an issue when voice over is turned on, read the text twice for some clickable cells. And doesn’t read out button for some clickable components.

## \[v2.20.2\] - 2024-05-13

### Fixed

-   No longer automatically setting reference id to nil if account id is set to nil on inquiry template builders (and vice-versa).
-   Fixed default distribution for horizontal stacks to match web & android defaults.
-   Fixed the scaling of character sizes when the accessibility feature for enlarged text is enabled.
-   Fixed a presentation bug with the microphone permissions request modal.

## \[v2.20.1\] - 2024-05-07

### Added

-   Added support for Card Access Number authentication for NFC scanning.

### Fixed

-   Fixed a network error when starting an unauthenicated inquiry from inquiryId (with nil or empty sessionToken).

## \[v2.20.0\] - 2024-04-30

### Fixed

-   Fixed a layout bug where Verify and Create Reusable Persona buttons would have the loading spinner sit on top of the button text when clicked.
-   Fixed an issue where custom hint assets from the server on pdf417 scans on the government id capture page were not being applied.
-   Fixed a layout bug when custom animations on the processing screens are not set to center align.

### Changed

-   Updated the PersonaNfc module to use version 2.0.1 of PersonaOpenSSL.
-   Improved selfie auto-capture logic.

## \[v2.19.1\] - 2024-04-15

### Fixed

-   Fixed a bug in prefill for input masked text component

## \[v2.19.0\] - 2024-04-12

### Added

-   Added support for custom server side assets on selfie prompt step.

### Changed

-   The NFC module now uses version 2.0.0 of the [Persona fork](https://github.com/persona-id/PersonaOpenSSL) of the iOS OpenSSL library.

## \[v2.18.1\] - 2024-04-10

### Changed

-   Started pulling in privacy manifest from our lottie dependency.

## \[v2.18.0\] - 2024-04-09

### Changed

-   The NFC module now uses the [Persona fork](https://github.com/persona-id/PersonaOpenSSL) of the iOS OpenSSL library.

### Added

-   Added Privacy Manifests to all Persona modules.
-   Added the ability to color the back and cancel buttons on the capture screens via the server.

## \[v2.17.1\] - 2024-04-03

### Fixed

-   Custom government id hint icons on the capture page now respect the size sent from the server.

## \[v2.17.0\] - 2024-04-02

### Added

-   Added the ability to add optional titles on government id and selfie capture screens.
-   Added the ability to control the layout axis of the buttons on the review captured government id screen via the server.
-   Added the ability to control processing text location on pending pages via the server.
-   Added the ability to set custom assets via the server for selfie verification hint animations.
-   Added the ability to set custom assets via the server for the verification processing animation.
-   Added the ability to set custom assets via the server for the hint icon on the government id capture page.
-   Added a selfie flow type `configurable_poses` which randomizes the capturing order of selfie poses.
-   Added ability to configure via the server which data groups are read during an nfc scan.

### Fixed

-   Fixed a bug where server driven styles were not being used for disabled buttons when another button was clicked.

## \[v2.16.1\] - 2024-03-25

### Changed

-   Now building with Xcode 15.3.

### Fixed

-   Fixed a layout bug that occurred on some devices when two input text components were embedded in a horizontal stack.
-   Fixed a rare crash that could occur during Government Id camera initialization.

### Added

-   Added support for custom server side assets on government id step.

## \[v2.16.0\] - 2024-03-07

### Added

-   Added `accountId(_: String)` to `InquiryTemplateBuilder` to be able to associate an inquiry with a Persona Account object when using this sdk entry point.

### Changed

-   Updated the minimum deployment target for our optional NFC package from iOS 13 to 15.

## \[v2.15.4\] - 2024-03-04

### Added

-   Added `Inquiry.cancel()` to programmatically cancel the inquiry flow.

### Fixed

-   Addressed a minor memory leak on barcode analysis.

## \[v2.15.3\] - 2024-02-27

### Fixed

-   Addressed an issue in our fallback service beta.
-   Fixed a layout issue on remote image components

## \[v2.15.2\] - 2024-02-22

### Added

-   Added more checks for autocapture when strict selfie is turn on.

### Changed

-   Addressed a camera specific error delegating to `inquiryError` as `PersonaError.UnknownError`, returning `PersonaError.CameraError` instead.
-   Modified the search bar to be case-insensitive.

## \[v2.15.1\] - 2024-02-06

### Fixed

-   Fixed an issue where some German passports would not be able to be scanned over nfc.

## \[v2.15.0\] - 2024-02-02

### Added

-   Added improved back button navigation support on gov id, selfie, document steps.

## \[v2.14.3\] - 2024-01-25

### Added

-   Added support for rows on text area component

### Changed

-   Improved error messaging for Government Id NFC flows.

## \[v2.14.2\] - 2024-01-10

### Added

-   Markdown is now supported in checkbox component labels.
-   Added support for localization overrides on government id capture feed instructions.
-   Added support for direction for footer component.

### Changed

-   Changed default assets for flows that allow uploading gov id from files or photos.

### Fixed

-   Fixed Chinese character input when using Pinyin.
-   Fixed input multi-select sheet behavior.

## \[v2.14.1\] - 2023-12-15

### Fixed

-   Fixed a video verification bug that occurs when establishing the webRTC connection.

## \[v2.14.0\] - 2023-12-15

### Added

-   Added the component checkbox group, has multi-select feature.
-   Added support for reusable Personas.
-   Added search bar for input select list.
-   Added the ability to stream government id and selfie verifications via WebRTC in the optional PersonaWebRtc framework.
-   Added currency text input components.

### Removed

-   Removed all usages of UserDefaults API to comply with new app store requirements. See [https://developer.apple.com/documentation/foundation/userdefaults](https://developer.apple.com/documentation/foundation/userdefaults).

### Fixed

-   Fixed styling for radio group component title

## \[v2.13.0\] - 2023-11-10

### Added

-   Improved support for advanced masks on MaskedInput components.

### Fixed

-   Addressed some retention cycle leaks.
-   Addressed an autocapture issue on iPhone 15 Pro / Pro max.
-   Fixed server side theming of font rendering for languages that use non-uniform character widths (e.g. Thai)

## \[v2.12.5\] - 2023-10-05

### Added

-   Added the ability to style buttons in the cancel modal separately from the general step button styles via the server.

## \[v2.12.4\] - 2023-09-21

### Added

-   Added ability to override device locale via `.locale(String)` method on `InquiryTemplateBuilder` or `InquiryBuilder`.

### Fixed

-   Fixed the crash that occurred when utilizing the remote asset for overlay images during the camera capture step for the Government ID.

## \[v2.12.3\] - 2023-09-18

### Fixed

-   Addressed an issue affecting barcode extraction rates in some cases.
-   Fixed a networking error when using Xcode 15.

### Changed

-   The popover alert window for govID and document would appear in the middle for iPad, no changes for iPhone
-   Changed the address input to appear as a single text field initially that can be expanded by the user.

## \[v2.12.2\] - 2023-09-01

### Changed

-   Now returning `PersonaError.rateLimitExceeded` instead of `PersonaError.networking` to `InquiryDelegate.inquiryError` when API quotas have been exceeded.

## \[v2.12.1\] - 2023-08-24

### Changed

-   No longer include `CHANGELOG.md` (16kb) in our SDK target.
-   No longer including `PhoneNumberMetadata.json` (310kb) in our SDK target.

## \[v2.12.0\] - 2023-08-18

### Added

-   Added the ability to color custom SVGs via the server.
-   Added the ability to add description texts under radio groups and checkbox input components.

### Changed

-   Updated ESignature component styling.
-   Are now compiling the Persona SDK with Xcode 14.3.
-   No longer requiring `NSPhotoLibraryUsageDescription` to access photo library.

## \[v2.11.0\] - 2023-07-20

### Added

-   Added `.environmentId` on `InquiryTemplateBuilder` to create inquiries with a specific environment token.

### Changed

-   **Breaking change** Changed `.routingCountry` on `InquiryTemplateBuilder` and `InquiryBuilder` to accept String instead of enum.
    -   Before: `.routingCountry(RoutingCountry.de)` after: `.routingCountry(RoutingCountry.de.rawValue)`
-   **Breaking change** Changed SST colors to parse as format `#RRGGBBAA` instead of `#AARRGGBB`
    -   From our audit, this change should not affect any customers. If you are affected by this change, please reach out to your account team.

### Fixed

-   Fixed the evaluation of hidden input components.

## \[v2.10.0\] - 2023-06-22

### Added

-   Added `.routingCountry` to `InquiryTemplateBuilder` and `InquiryBuilder` to choose which server region inquiry is routed to directly.

## \[v2.9.1\] - 2023-05-23

### Added

-   Added a hint on the government id capture screen to notify if the user is not holding the device still.

## \[v2.9.0\] - 2023-05-23

**UI UPDATES: GOVERNMENT ID CAMERA CAPTURE SCREEN** We’ve changed the animation that plays on the screen where the user is asked to take a photo of their government ID. The previous animation featured a line sweeping back and forth, horizontally. This animation has been replaced with a more subtle sweeping animation around the border of the camera preview frame. The new animation is designed to be performant and distraction-free. It is rendered with custom code for better performance.

We’ve also added a button to the government id capture screen that displays capture tips when tapped. This change was made to improve the quality of photos captured by the user.

If you have any questions about these changes, please reach out to your CSM.

### Added

-   Added an experimental feature to allow setting the themeSetId when starting an inquiry. This determines what theme set to read from on the server.
-   Added the ability to record and upload video during the selfie and government id flows.
-   Added a public method `assetBundle` to InquiryTemplateBuilder to allow setting the bundle from which the SDK retrieves resources. Defaults to Bundle.main.
-   Added capture hints to the government id capture screen.
-   Added a modal for capture help on the government id capture screen.

### Changed

-   Changed the default scanning animation on the government id capture screen.
-   Now allowing optionals on `InquiryTemplateBuilder` and `InquiryBuilder` methods for convenience.

### Fixed

-   Fixed an issue where the status bar text was not being set to the correct color when using server side theming.
-   Fixed spacing on government id select screen when using server side theming.
-   Fixed masked input (ssn) fields submission when submitting as masked.

## \[v2.8.0\] - 2023-04-14

### Added

-   Added new `InquiryTemplateBuilder` and `InquiryBuilder` to simplify creation of `Inquiry` objects. Acquire a builder with new `Inquiry.from` methods.

## \[v2.7.4\] - 2023-04-03

### Added

-   Added support for e-signature components.
-   Added functionality to extract text from government documents on the client.

### Changed

-   Now respecting the property `overrideUserInterfaceStyle` on window or view controller that presents the persona flow.

### Fixed

-   Fixed a memory leak.

## \[v2.7.3\] - 2023-03-08

### Fixed

-   Fixed a layout bug that caused some texts to not render on iOS 14.

## \[v2.7.2\] - 2023-03-06

### Fixed

-   Fixed a networking error.

### Removed

-   Removed vendorized JsonLogic types from our public interface.

## \[v2.7.1\] - 2023-03-02

### Fixed

-   Fixed an issue with app store connect rejecting our framework for usage of `CIFalseColor.inputImage`.

### Removed

-   Removed the dismiss button on permission info modal after App Store Rejection from Apple. Per Apple, “A message appears before the permission request, and the user can close the message and delay the permission request with the “Don’t Enable” button. The user should always proceed to the permission request after the message.”

## \[v2.7.0\] - 2023-02-22

### Changed

-   Deprecated the InquiryTheme() constructor. The InquiryTheme(themeSource: ThemeSource) constructor should be used instead. Pass in .server to use theming set in the Persona Dashboard. Pass in .client to keep current behavior that uses the client side theming api. Note that .client is also marked as deprecated.

## \[v2.6.2\] - 2023-02-14

### Fixed

-   Fixed a weak retention issue that could result in extra callbacks of `inquiryError`

## \[v2.6.1\] - 2023-02-13

### Fixed

-   Fixed buttons inside footer on ui steps will now disable properly after being tapped.

## \[v2.6.0\] - 2023-02-10

### Added

-   Added an optional client side callback to return the data collected during the inquiry flow to the host application.

### Fixed

-   Remote image assets now match Android / Web loading behavior and height.
-   Selfie flow on iOS Simulator no longer allows you to mash the shutter button and produce a network error.

## \[v2.5.11\] - 2023-01-25

### Added

-   Added support for input radio group components.

### Fixed

-   Fixed an issue where some camera feeds were not showing previews.

## \[v2.5.10\] - 2023-01-12

### Added

-   Added optional parameter, `animated`, to `Inquiry.start()` to disable the presentation and dismiss animation when launching the persona flow.

### Changed

-   Users will receive an error message when sdk fails to load a photo during document flow instead of flow resulting in an error.

### Fixed

-   Improved camera focus for iPhone 13 and 14 Pro / Pro max devices.
-   Now requesting camera permission prior to launching document scanner during document flow.

## \[v2.5.9\] - 2023-01-10

### Added

-   Added support for Welsh.

### Fixed

-   Fixed a crash on iOS 15 related to usage of Realm.

## \[v2.5.8\] - 2023-01-10

### Fixed

-   Fixed a bug with some government id image uploads.
-   Added better error handling when the dimensions of the uploaded government id are not accepted by the server.

## \[v2.5.7\] - 2023-01-06

### Fixed

-   Resuming a document flow will now load existing files
-   Fixed various styling and SST properties on document flows

## \[v2.5.5\] - 2022-12-19

### Fixed

-   Fixed a bug with checkboxes not applying the correct state.

## \[v2.5.4\] - 2022-12-15

### Added

-   Added support for server sheet corner radius style.

## \[v2.5.3\] - 2022-11-30

### Changed

-   Improved checkbox component UI and styling

## \[v2.5.2\] - 2022-11-21

### Added

-   Added support for government id localization overrides.

### Fixed

-   Fixed an issue where Gov id titles and prompts are not visible.
-   Fixed an issue where disabled button text is not visible in dark mode.

## \[v2.5.1\] - 2022-11-18

### Added

-   Added support for rendering QR code components.
-   Added improved error handling for document verification flows.
-   Added support for custom start screens on document verificiation flows.

### Changed

-   Removed section indexes from country select when there are few countries.

## \[v2.5.0\] - 2022-11-08

### Changed

-   Minimum deployment target is now iOS 13.0.

### Fixed

-   Fixed an issue where the processing animations stuttered after the camera feed was closed.

### Added

-   Added ability to configure margins on input components via the server.

## \[v2.4.3\] - 2022-10-20

### Added

-   Added support for customizing cancel modal texts via the server.

## \[v2.4.2\] - 2022-09-30

### Added

-   Added the ability to style the upload government id flow via the server.
-   Added support for json logic for hiding and disabling various ui components.
-   Added the ability to use mDLs in the SDK.
-   Added public logging for load times.

### Changed

-   Relaxed blur detection on government id autocapture for pro max devices.

### Fixed

-   Auto-capture during selfie flow will now pause while user is presented with cancel modal.

## \[v2.4.1\] - 2022-09-23

### Changed

-   Moved the Sandbox force verification pass/fail menu to top of screen and added the button to camera screens.
-   Now surfacing clearer error message when invalid `fields` value is supplied on `InquiryConfiguration`.

### Added

-   Added support for number only input components in UI steps.

### Fixed

-   No longer crashing after a user selects a country with no supported id types.

## \[v2.4.0\] - 2022-09-15

### Changed

-   Now building the SDK with Xcode 14 in order to make use of iOS 16 features.

### Added

-   Added the ability to style footer components as a bottom presented sheet

### Removed

-   Removed camera icon from camera permissions modal to be more consistent with other Persona modals.

## \[v2.3.11\] - 2022-10-20

### Added

-   Added support for customizing cancel modal texts via the server.

## \[v2.3.10\] - 2022-10-10

These changes have already been released in version 2.4.2 (built with xcode 14). This release is built with xcode 13 for customers who are not yet using xcode 14.

### Added

-   Added the ability to style the upload government id flow via the server.
-   Added support for json logic for hiding and disabling various ui components.
-   Added support for number only input components in UI steps.

### Changed

-   Relaxed blur detection on government id autocapture for pro max devices.
-   Moved the Sandbox force verification pass/fail menu to top of screen and added the button to camera screens.
-   Now surfacing clearer error message when invalid `fields` value is supplied on `InquiryConfiguration`.

### Fixed

-   Auto-capture during selfie flow will now pause while user is presented with cancel modal.
-   No longer crashing after a user selects a country with no supported id types.

### Removed

-   Removed camera icon from camera permissions modal to be more consistent with other Persona modals.

## \[v2.3.9\] - 2022-09-02

### Fixed

-   Fixed a bug in the success checkmark animation so that it shows all 8 of the radiating dots around the check instead of just one.
-   Fixed address component validations.

### Changed

-   Render the error text on input select components as red when we have other styles coming from the server.

## \[v2.3.8\] - 2022-08-30

### Fixed

-   Fixed a bug where the new processing animation was not being fully configured by colors from the server
-   Fixed a bug with hyperlinks not being tappable

## \[v2.3.7\] - 2022-08-26

### Changed

-   Autosubmit confirmation code after it has been typed in.

### Added

-   Added the ability to render the government id select screen as a more granularly configurable page type

## \[v2.3.6\] - 2022-08-18

### Changed

-   Processing and loading screens have been aligned to center of screen.
-   Selfie completion animation now plays when using static assets.

### Added

-   Added the ability to style processing screen text elements via the server

## \[v2.3.5\] - 2022-08-15

### Changed

-   Default assets for government id, selfie, and document processing animations have been updated.

### Removed

-   Removed unused ‘Try again’ button after users have denied permissions for the camera.

## \[v2.3.4\] - 2022-08-02

### Fixed

-   Fixed a bug where existing document previews were vanishing after deleting a different document.
-   Fixed a layout issue on the selfie start page where text would not be shown correctly when the device screen wasn’t large enough to show all of the content.

## \[v2.3.3\] - 2022-07-29

### Added

-   Added the ability to control page level vertical alignment via the server
-   Added the ability to style buttons on the government id capture page via the server.

### Fixed

-   Fixed a bug where document previews were not showing when the chosen file was a PDF.
-   Fixed a bug where government id capture page instructions were not respecting alignment coming from the server.

## \[v2.3.2\] - 2022-07-18

### Added

-   Added the following theme property:
    -   `initialLoadingBackgroundImage`
-   Added support for skipping the selfie start page.

### Changed

-   The color set for backgroundColor on the theme now applies to the initial loading screen.

### Fixed

-   Fixed a bug where new selfie animations where not using server side theming colors (again).

## \[v2.3.1\] - 2022-06-30

### Fixed

-   Fixed a bug where new selfie animations where not using server side theming colors.
-   Fixed a bug where selfie consent text was not using appropriate styles.

## \[v2.3.0\] - 2022-06-15

### Added

-   Added the IDFV to request headers ([https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor))
-   Added the following theme property:
    -   `selfieCountdownFont`
-   Added the ability to load custom assets locally on ui steps via dynamic asset names coming from the server.

### Changed

-   Match camera feed edge radius and hint box radius to the radius of the capture feed border.

**UI UPDATES: SELFIE CAMERA CAPTURE SCREEN**

We’ve made updates to the selfie verification flow to help reduce blurry and repeat pose captures. You’ll notice the following changes to the selfie verification flow:

-   New selfie animation includes an arrow that points users in the direction they should look for left and right pose capture.
    
-   Auto-capture is delayed for left and right pose until each animation plays. In addition, user will be able to clearly preview selfie during capture (blur overlay removed).
    

If you have any questions about these changes, please reach out to your CSM.

### Fixed

-   Fixed bug where selfie blur overlay would show up solid black when Reduce Transparency was enabled.
-   Fixed bug where selfie circle animation was not using the correct frame.

## \[v2.2.13\] - 2022-05-26

### Added

-   Added the ability to render markdown in body texts and titles.

## \[v2.2.12\] - 2022-05-16

### Changed

-   Network requests are now more resilient to connectivity errors and certain server errors are now recoverable.

### Fixed

-   Screen layouts has been fixed on first gen iPhone SE.

## \[v2.2.11\] - 2022-04-20

### Added

-   Added the ability to render markdown in the selfie step disclaimer

## \[v2.2.10\] - 2022-04-04

### Added

-   Added the following theme property: `centerAlignRemoteAsset`

### Changed

-   The loading icon for initial inquiry load has been changed to a neutral grey spinner

## \[v2.2.9\] - 2022-03-29

### Fixed

-   No longer returning a status value of “unknown” for `inquiryComplete`

## \[v2.2.8\] - 2022-03-16

### Changed

-   Transitive dependencies have been namespaced to avoid runtime symbol collisions

## \[v2.2.7\] - 2022-03-14

### Fixed

-   Dynamic screens use `titleTextAlignment` and `bodyTextAlignment` theme properties again
-   Custom animation assets now properly use `loopMode` on selfie start

### Removed

-   No longer showing a failure screen when client side errors occur

## \[v2.2.6\] - 2022-03-07

### Added

-   Added option for uploading a government ID from the file system
    
-   Added improved face detection for government id autocapture
    
-   Added support for optional cancel buttons
    
-   Following strings have been added to `Persona.strings`
    
    -   `cancelTitle`
    -   `cancelBody`
    -   `cancelResumeButton`
    -   `cancelConfirmButton`

### Fixed

-   Fixed back button not appearing on dynamic ui screens
-   Fixed a crash when capturing on old devices
-   Fixed layout for government id select disclaimer text

## \[v2.2.5\] - 2022-03-01

### Changed

-   Selfie camera hint style has changed to be consistent with Android

### Fixed

-   Fixed government id captures cropping too close to the bottom of the id

## \[v2.2.4\] - 2022-02-24

### Added

-   Added the following theme properties:
    
    -   `governmentIdOverlayGenericFrontImage`
    -   `governmentIdOverlayBarcodeImage`
    -   `governmentIdOverlayMrzImage`
    -   `selfieStartScreenHeaderIcon`

### Removed

-   Following strings have been removed from `Persona.strings`
    
    -   `selfieSubmittingTitle`
    -   `selfieSubmittingBody`
    -   `governmentIdSubmittingTitle`
    -   `governmentIdSubmittingBody`

## \[v2.2.3\] - 2022-02-16

### Added

-   Support for dark mode.

### Fixed

-   Improved blur detection during government id auto-capture.

## \[v2.2.2\] - 2022-02-10

### Added

-   Added the following theme properties:
    -   `tableViewChevronColor`
-   Added `build` method to `InquiryConfiguration` to build a config from all possible parameters.

### Fixed

-   Theme property `governmentIdHintBackgroundColor` is now properly used.

## \[v2.2.1\] - 2022-02-08

### Added

-   Added support for optional disclaimer on government id screens
    
-   Added the following theme properties:
    
    -   `governmentIdSelectScreenHeaderIcon`
    -   `governmentIdCaptureDisclaimerIcon`
    -   `governmentIdHintTextAlignment`
    -   `governmentIdHintTextColor`
    -   `governmentIdHintTextFont`
    -   `governmentIdHintBackgroundColor`
    -   `showGovernmentIdHintIcons`
-   Added support for SVGs in remote asset components
    
-   Added the ability to override the following strings:
    
    -   `cameraPermissionsTitle`
    -   `cameraPermissionsSelfieText`
    -   `cameraPermissionsGovernmentIdText`
    -   `cameraPermissionsSettingsDescription`
    -   `cameraPermissionsDismissButtonText`
    -   `cameraPermissionsEnableButtonText`
    -   `cameraPermissionsSettingsButtonText`
    -   `cameraPermissionsTryAgainButtonText`

### Changed

-   Spacing and margins have been adjusted for consistency

### Fixed

-   Fixed a bug with address autocomplete

## \[v2.2.0\] - 2022-01-27

### Changed

-   Persona module has been renamed to Persona2

## \[v2.1.3\] - 2022-01-25

### Added

-   Added the following theme properties:
    
    -   `governmentIdCaptureBackgroundColor`
    -   `governmentIdScanningStrokeStyle`
    -   `governmentIdCapturingStrokeStyle`
    -   `governmentIdConfirmingStrokeStyle`
    -   `governmentIdScanningAnimation`
    -   `showGovernmentIdOverlays`
    -   `selfieLookLeftAsset`
    -   `selfieLookRightAsset`

### Removed

-   Removed the following strings from `Persona.strings` (unused in dynamic flows):
    
    -   `governmentIdStartTitle`
    -   `governmentIdStartBody`
    -   `governmentIdChooseType`
    -   `selfieStartTitle`
    -   `selfieStartBody`
    -   `selfieStartButton`

## \[v2.1.2\] - 2021-12-13

### Added

-   Added support for server driven localizations on gov id capture screen.
-   Added support for multi-file document uploads.

## \[v2.1.1\] - 2021-11-23

### Added

-   The background color for the silhouette overlay, shown when taking automated selfies, can now be themed via `selfieOverlayBackgroundColor`. If no color is provided, a blur effect is used instead (the default behavior).

### Fixed

-   Fixed a bug where form field errors would not be displayed underneath the affected fields.
-   Fixed a bug where certain assets could be rendered at a lower resolution than expected.

## \[v2.1.0\] - 2021-11-16

### Added

-   Added themeable text alignment on title and body labels: `titleTextAlignment` and `bodyTextAlignment`.
-   Added themeable asset `selfieStartAsset` for pre-selfie collection screen.
-   Added `LoopMode` enum for `InquiryTheme.AnimationAsset` which determines loop mode of animation, defaults to `playOnce`.
-   Added support for completing an Inquiry without showing the completion screen.
-   Added support for Dynamic Type.
-   Added support for the Reduce Motion accessibility setting.

### Changed

-   Attempting to start an Inquiry on templates prefixed with `tmpl_` will now fail immediately.
-   Government ID camera capture experience has been redesigned.
-   Improved support for Voice Over.

## \[v2.0.1\] - 2021-09-01

### Added

-   Added support for Keypass ID and visa government id types.
-   The footer container now has themable options via `footerBackgroundColor`, `footerBorderColor` and `footerBorderWidth`.

### Changed

-   Standard `InquiryField` key values are now camelCase instead of kebab-case
-   `InquiryField` enum case values are now optional
-   `InquiryDelegate.inquiryComplete` parameter `status` has been made not optional

### Fixed

-   Relative links are no longer rendered as links in the `PrivacyPolicy` component.

## \[v2.0.0\] - 2021-08-06

### Added

-   `InquiryDelegate.inquiryCanceled` now includes a `sessionToken` parameter to resume the inquiry flow

### Changed

-   Support Inquiry templates prefixed with `itmpl_` instead of `tmpl_`
-   `InquiryDelegate.inquirySuccess` and `InquiryDelegate.inquiryFailed` are now represented by `InquiryDelegate.inquiryComplete` with a status of completed or failed (though can be customizable in the future)
-   `InquiryDelegate.inquiryCancelled` has been renamed to `InquiryDelegate.inquiryCanceled`
-   `Attributes` parameter in the `inquirySuccess` delegate are now a part of `inquiryComplete` fields parameter

### Removed

-   `Relationships` and the containing list of `Verification` no longer exists
