# React Native Changelog

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[React Native](./react-native-sdk-v2-integration-guide.md)

# React Native Changelog

Changes, Fixes, and Features for our React Native SDK.

#### Is your React Native app ready for AGP8?

Version 8.x of Android Gradle Plugin (AGP) requires breaking charges from both library and app developers. [Starting in React Native 0.73, AGP8 and Java 17 will be required for Android apps](https://github.com/react-native-community/discussions-and-proposals/issues/671).

We’ve added support for AGP8 starting in v2.7.0 of our RN SDK. However, due to the breaking changes required, this version will only work if your app is also on AGP8.

Support for AGP7 will continue under the v2.6.x branch of our RN SDK. Please use that release branch until you are ready to make the switch to AGP8, at which point you can upgrade to our latest releases.

## Releases

To monitor for new versions of the React Native SDK, check [react-native-persona on npm](https://www.npmjs.com/package/react-native-persona).

We are continually releasing fixes and updates which improve the end user experience. We recommend staying up-to-date with releases to make sure you are taking advantage of the latest functionality and improvements.

#### Best practices for keeping the React Native SDK updated

Keeping your SDK up to date is essential for ensuring your app remains secure, performant, and compatible with the latest React Native versions and Persona features. Here are a few best practices we recommend:

-   ⏱ **Schedule regular updates** as part of your sprint or release cycle — aim for monthly or quarterly.
-   🔔 **Enable automated checks** using tools like [Dependabot](https://docs.github.com/en/code-security/dependabot) or [Renovate](https://docs.renovatebot.com/).
-   📬 **Monitor the React Native SDK on npm**: [react-native-persona](https://www.npmjs.com/package/react-native-persona)
-   📓 **Read the changelog thoroughly** to catch new features, deprecations, and breaking changes.
-   ✅ **Test safely** in your CI/CD pipeline—include functional, performance, and security tests before production deploy.

Adopting these habits reduces surprises and keeps your release process smooth.

## Changes

## \[v2.31.0\] - 2026-02-03

### Changed

-   Upgrade to Android Inquiry SDK 2.31.0
    
    > #### \[v2.31.0\]
    > 
    > #### Changed
    > 
    > -   Bumped up kotlin version to 2.1.21
    > -   Bumped up ksp version to 2.1.21-2.0.2
    > -   Removed kotlinx-datetime dependency
    > -   Updated `inquiry-advanced-customizations-impl` to match latest UI specs.
    
-   Upgrade to iOS Inquiry SDK 2.41.0
    
    > #### \[v2.41.0\]
    > 
    > #### Added
    > 
    > -   Added InquiryEvent.pageChange event for gov id, selfie, document verification pending page.
    > -   Added `.styleVariant(StyleVariant?)` to `InquiryBuilder` and `InquiryTemplateBuilder` to allow overriding automatic handling light/dark mode.
    

## \[v2.30.1\] - 2026-01-26

### Changed

-   Upgrade to Android Inquiry SDK 2.30.4
    
    > #### \[v2.30.4\]
    > 
    > #### Fixed
    > 
    > -   Fixed a crash when the width or height of a hosted image is set to “auto”.
    > -   Fixed a bug where sometimes a transition happens twice when it should only happen once.
    

### Fixed

-   Fixed onEvent usage on iOS when using inline component.

## \[v2.30.0\] - 2026-01-21

### Changed

-   Upgrade to Android Inquiry SDK 2.30.3
    
    > #### \[v2.30.3\]
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where the capture method recorded is sometimes incorrect for Government ID steps.
    
-   Upgrade to iOS Inquiry SDK 2.40.0
    
    > #### \[v2.40.0\]
    > 
    > #### Changed
    > 
    > -   Improve NFC error messaging.
    

## \[v2.29.0\] - 2026-01-12

### Changed

-   Upgrade to Android Inquiry SDK 2.30.2
    
    > #### \[v2.30.2\]
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where manual capture will not work in the redesigned Selfie flow.
    > 
    > #### \[v2.30.1\]
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where spacers will not work in horizontal stacks.
    > -   Fixed a bug with 3rd party digital ID integrations.
    
-   Upgrade to iOS Inquiry SDK 2.39.0
    
    > #### \[v2.39.0\]
    > 
    > #### Changed
    > 
    > -   Simplified document scanning flow.
    

## \[v2.28.0\] - 2025-12-22

### Changed

-   Upgrade to Android Inquiry SDK 2.30.0
    
    > #### \[v2.30.0\]
    > 
    > #### Changed
    > 
    > -   Dynamically register NFC broadcast receiver only when NFC scanning screen is visible.
    > 
    > #### Fixed
    > 
    > -   Fixed a crash when the NFC scanner screen is open when the app is killed and restored.
    > -   Fixed a bug where the NFC scanner will not submit the correct NFC data if the scanner screen is killed and restored.
    > -   Fixed a bug where sometimes multiple NFC scanner screens can be shown.
    > -   Add workaround for devices with bad camera sensor data with certain resolutions.
    > 
    > #### Removed
    > 
    > -   **Breaking Change** Removed `InquiryBuilder.themeSetId`. This method was erroneously added, it can only be passed on inquiry creation and thus only valid on `InquiryTemplateBuilder`.
    
-   Upgrade to iOS Inquiry SDK 2.38.0
    
    > #### \[v2.38.0\]
    > 
    > #### Changed
    > 
    > -   Temporarily reverted to building with Xcode 16.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug with 3rd party digital ID integrations.
    

## \[v2.27.0\] - 2025-12-15

### Changed

-   Upgrade to iOS Inquiry SDK 2.37.0
    
    > #### \[v2.37.0\]
    > 
    > #### Added
    > 
    > -   Added support for mdoc passport verifications in Apple Wallet.
    > 
    > #### Fixed
    > 
    > -   Addressed a minor issue preventing selfie redesign flow from launching.
    > -   Addressed focal distance issues in gov id flow in rare instances.
    

## \[v2.26.2\] - 2025-12-11

### Changed

-   Upgrade to iOS Inquiry SDK 2.36.1
    
    > #### \[v2.36.1\]
    > 
    > #### Fixed
    > 
    > -   Fixed a race condition that could cause loading remote fonts to crash.
    

## \[v2.26.1\] - 2025-12-05

### Fixed

-   Fixed position of navigation buttons on iOS when using `<PersonaInquiryView/>`.

## \[v2.26.0\] - 2025-12-05

### Added

-   Added support for inline `<PersonaInquiryView/>` native component.

## \[v2.25.3\] - 2025-12-04

### Changed

-   Upgrade to Android Inquiry SDK 2.29.1
    
    > #### \[v2.29.1\]
    > 
    > #### Fixed
    > 
    > -   Fixed size attribute being ignored for image hosted components.
    
-   Upgrade to iOS Inquiry SDK 2.36.0
    
    > #### \[v2.36.0\]
    > 
    > #### Added
    > 
    > -   Added optional method `onReady()` to `PersonaInlineDelegate` to allow “preloading” sdk and skipping initial loading screen.
    

## \[v2.25.1\] - 2025-12-01

### Fixed

-   Fixed a CI issue that caused the iOS SDK version not to increment to the latest version.

## \[v2.25.0\] - 2025-11-25

### Changed

-   Upgrade to Android Inquiry SDK 2.29.0
    
    > #### \[v2.29.0\]
    > 
    > #### Added
    > 
    > -   Added support for an inquiry’s `redirect_uri` which allows the sdk to redirect upon completion. You can set the redirect URI when creating an inquiry or in your inquiry template’s configuration.
    > 
    > ```
    > Inquiry.fromTemplate(templateId)
    >   .redirectUri("http://example.com")
    >   .build()
    > ```
    
-   Upgrade to iOS Inquiry SDK 2.35.0
    
    > #### \[v2.35.0\]
    > 
    > #### Changed
    > 
    > -   Removed Bluetooth requirement introduced in v2.30.0.
    > 
    > #### \[v2.34.1\]
    > 
    > #### Fixed
    > 
    > Fix a bug where inquiry start events were not firing.
    > 
    > #### \[v2.34.0\]
    > 
    > #### Added
    > 
    > -   Added support for an inquiry’s `redirect_uri` which allows the sdk to redirect upon completion. You can set the redirect URI when creating an inquiry or in your inquiry template’s configuration.
    > 
    > ```
    > let inquiry = Inquiry.from(templateId: "itmpl_123", delegate: self)
    >     .redirectUri(URL(string: "http://example.com")!)
    >     .build()
    > ```
    > 
    > #### Changed
    > 
    > -   Now building with Xcode 26.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where inquiries could get stuck in a permissions loop if the device’s camera was not available.
    

## \[v2.24.0\] - 2025-11-20

### Changed

-   Upgrade to Android Inquiry SDK 2.28.0
    
    > #### \[v2.28.0\]
    > 
    > #### Added
    > 
    > -   Added support for advanced customizations.
    
-   Upgrade to Ios Inquiry SDK 2.33.1
    
    > #### \[v2.33.1\]
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where depth data could have been captured without need.
    

## \[v2.23.0\] - 2025-11-17

### Added

-   Added support for Phone Number Silent Network Authentication.

### Changed

-   Upgrade to Ios Inquiry SDK 2.33.0
    
    > #### \[v2.33.0\]
    > 
    > #### Added
    > 
    > -   Published the SNA SDK for phone number silent network authentication.
    > 
    > #### \[v2.32.0\]
    > 
    > #### Changed
    > 
    > -   The check animation at the end of the capture in old selfie flows now respects the color that is sent from the server. Note that this means it will no longer be green by default and will instead use your primary icon stroke color defined on your theme.
    > -   Changed cancel modal to stack buttons vertically to allow more space to fit longer localized strings.
    

## \[v2.22.0\] - 2025-11-13

### Changed

-   Upgrade to Android Inquiry SDK 2.27.0
    
    > #### \[v2.27.0\]
    > 
    > #### Added
    > 
    > -   Added troubleshooting tips to NFC step
    > -   Added progress bar to NFC scanning sheet
    > 
    > #### Changed
    > 
    > -   The check animation at the end of the capture in old selfie flows now respects the color that is sent from the server. Note that this means it will no longer be green by default and will instead use your primary icon stroke color defined on your theme.
    > -   Changed cancel modal to stack buttons vertically to allow more space to fit longer localized strings.
    > 
    > #### Fixed
    > 
    > -   Fixed incorrect overlay is being used for government ID back side capture.
    > -   Fixed a bug where GPS requirements are lost on step transition in certain cases.
    > -   Fixed a bug where the document step will misbehave if resumed when the file upload limit is 1.
    > 
    > #### \[v2.26.0\]
    > 
    > #### Added
    > 
    > -   Added support for Mdoc component with Google Wallet.
    > 
    > #### Fixed
    > 
    > -   Fixed a crash during phone number silent network authentication.
    > 
    > #### \[v2.25.5\]
    > 
    > #### Fixed
    > 
    > -   Fixed NFC scanning sheet layout issue.
    > -   Fixed an issue where NFC scanning remained active even after an error dialog appeared.
    > 
    > #### \[v2.25.4\]
    > 
    > #### Fixed
    > 
    > -   Fixed checkbox styling issue
    > -   Fixed a rare crash on the government ID step if the user cancels the inquiry flow immediately after pressing submit.
    
-   Upgrade to Ios Inquiry SDK 2.31.0
    
    > #### \[v2.31.0\]
    > 
    > #### Added
    > 
    > -   Added support for capturing depth data during selfie flow.
    > -   Added support for redesigned selfie capture experience.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where swiping down the photo picker would corrupt the current screen state.
    > -   Fixed a crash that could occur when a user selected multiple documents, navigated backward, and then selected another document from photos.
    > -   Fixed an inconsistency with how we enforce the file limit on document steps.
    

## \[v2.21.1\] - 2025-10-25

### Changed

-   Upgrade to Android Inquiry SDK 2.25.3
    
    > # \[v2.25.3\] - 2025-10-24
    > 
    > ### Added
    > 
    > -   Added an animation to the camera loading for government id captures.
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where the webRTC connection would not fully shut down if the inquiry was cancelled while the capture screen was showing.
    > -   Fix a back transition issue on the government id step when WebRTC is on.
    
-   Upgrade to iOS Inquiry SDK 2.30.7
    
    > ## \[v2.30.7\] - 2025-10-24
    > 
    > ### Fixed
    > 
    > -   Fixed an issue with our camera permissions bottom sheet showing at the same time as the native camera permissions alert.
    > -   Fixed a bug where the camera permissions bottom sheet’s button needed to be tapped twice in order to deep link into settings.
    

## \[v2.21.0\] - 2025-10-20

### Changed

-   Upgrade to Android Inquiry SDK 2.25.2
    
    > #### \[v2.25.2\]
    > 
    > #### Added
    > 
    > -   Added support for a short capture tips blurb section below the government id capture feed.
    > 
    > #### \[v2.25.1\]
    > 
    > #### Fixed
    > 
    > -   Fixed memory leak after a selfie inquiry is finished.
    > 
    > #### \[v2.25.0\]
    > 
    > #### Fixed
    > 
    > -   Fixed a visual bug where back captures of gov id images would appear to be slightly cutoff during end user review.
    > 
    > #### Added
    > 
    > -   Added `sna-impl` module that supports Phone Number Silent Network Authentication verification.
    > -   Added support for credit card collection.
    
-   Upgrade to Ios Inquiry SDK 2.30.6
    
    > #### \[v2.30.6\]
    > 
    > #### Added
    > 
    > -   Added support for a short capture tips blurb section below the government id capture feed.
    > 
    > #### \[v2.30.5\]
    > 
    > #### Added
    > 
    > -   Added an animation between sides of government id captures when video is enabled to make the transition more obvious.
    > 
    > #### \[v2.30.4\]
    > 
    > #### Added
    > 
    > -   Added support for credit card collection.
    > -   Added PersonaSna module that supports Phone Number Silent Network Authentication verification.
    

## \[v2.20.0\] - 2025-10-06

### Changed

-   Upgrade to iOS Inquiry SDK 2.30.3
    
    > #### \[v2.30.3\]
    > 
    > #### Added
    > 
    > -   Added support for custom link text colors in checkbox component text.
    > 
    > #### \[v2.30.2\]
    > 
    > #### Changed
    > 
    > -   Checkboxes now align with the top of the text group in checkbox components.
    > -   Allows user to continue scanning NFC document if they pull their device away briefly.
    > 
    > #### Added
    > 
    > -   Added support for disabling autocomplete on input address components.
    > 
    > #### Fixed
    > 
    > -   Fixed brief stuttering when cached custom fonts load in input fields.
    > -   Fixed line height calculation for UITextViews.
    > -   Fixed some minor styling bugs with the bluetooth beacon ui component.
    

## \[v2.19.0\] - 2025-09-26

### Added

-   Added `onEventListener` to `Inquiry`.

### Changed

-   Upgrade to Android Inquiry SDK 2.24.0
    
    > #### \[v2.24.0\]
    > 
    > #### Added
    > 
    > -   Added `onEventListener` to `Inquiry`.
    > 
    > #### Fixed
    > 
    > -   Fixed a crash if the Inquiry activity is killed and recreated.
    

## \[v2.18.0\] - 2025-09-25

### Changed

-   Bumped up the compile SDK from 34 to 36
    
-   Bumped up the target SDK from 34 to 35
    
-   Upgrade to Android Inquiry SDK 2.23.0
    
    > #### \[v2.23.0\]
    > 
    > #### Added
    > 
    > -   Added support for the “address auto-complete method” attribute on address components.
    > 
    > #### Fixed
    > 
    > -   Fixed a potential crash in the document step.
    > 
    > #### \[v2.22.2\]
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where the wrong background color was sometimes applied on document steps while in dark mode.
    > -   Fixed a bug where the SDK does not send GPS information even if it’s required by the template.
    

## \[v2.17.0\] - 2025-09-12

### Changed

-   Upgrade to Ios Inquiry SDK 2.30.0
    
    > #### \[v2.30.0\]
    > 
    > #### Added
    > 
    > -   **Breaking change** Added support for bluetooth beacon ui components. This means that you will need to add a `Privacy - Bluetooth Always Usage Description` entry to your Info.plist file if you don’t already have one, even if your app or inquiry flow does not utilize this functionality. Unfortunately, Apple does not provide tools to differentiate when the Bluetooth API is in use, so you must do this.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where a user could navigate back while transitioning to the next step within an Inquiry resulting in an invalid state.
    
-   Upgrade to Android Inquiry SDK 2.22.1
    
    > #### \[v2.22.1\]
    > 
    > #### Fixed
    > 
    > -   Changed the SDK to return a `SessionTokenError` instead of a generic `NetworkError` if a step transition fails due to an invalid session token.
    > 
    > #### \[v2.22.0\]
    > 
    > #### Added
    > 
    > -   Added Integration Step to support 3rd party integration flows.
    > 
    > #### Changed
    > 
    > -   Bumped up the compile SDK from 35 to 36
    > -   Bumped up the AGP version from 8.7.3 to 8.9.1
    > -   Bumped up androidx.browser:browser library from 1.8.0 to 1.9.0
    > -   Upgraded Coil dependency from Coil 2 to Coil 3.
    > -   Disable the switch camera button in the Selfie V1 design for left and right pose capture.
    > -   Changed the previews on the selfie review screen to be mirrored horizontally so that previews match the labels.
    > 
    > #### Fixed
    > 
    > -   Fix a bug where a transition animation would play when “Verify with Reusable Persona” is clicked but declined.
    > -   Fix a bug where selfie capture video recording errors after the app is backgrounded and then brought to the foreground again.
    > -   Fix a bug where pressing back on the selfie capture screen will not transition to the instructions screen.
    > -   Fix a memory leak on the selfie step.
    > -   Apply the correct background color to the government ID NFC modal and the error modal.
    > -   Fix a bug where the government ID NFC modal text can be cut off.
    

## \[v2.16.0\] - 2025-08-15

### Changed

-   Upgrade to Android Inquiry SDK 2.21.0
    
    > #### \[v2.21.0\]
    > 
    > #### Added
    > 
    > -   Added country picker to Phone Number Input component
    > 
    > #### Fixed
    > 
    > -   Fix a crash when upload fails on the government ID step.
    > -   Fix a rare crash in the ID NFC scan screen when the app is killed and recreated.
    > -   Fix check box being editable even when transitioning to the next UI step.
    > -   Fix a minor padding issue with the Selfie V1 design.
    > -   Fix a bug where NFC would error on certain days of the month.
    > -   Fix a visual bug where errors are not cleared on the address component when they are resolved.
    
-   Upgrade to Ios Inquiry SDK 2.29.2
    
    > #### \[v2.29.2\]
    > 
    > #### Fixed
    > 
    > -   Fixed an NFC scanning bug where BAC might not be used as a fallback when it should be.
    > 
    > #### \[v2.29.1\]
    > 
    > #### Fixed
    > 
    > -   Show invalid access key error message for new USA passports when the access key is incorrect rather than the generic error message.
    > 
    > #### \[v2.29.0\]
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where text did not display on devices running iOS 14 and below.
    > 
    > #### Changed
    > 
    > -   Reduced the main Persona SDK size from 9.6MB to 7.5MB.
    

## \[v2.15.0\] - 2025-07-08

### Changed

-   Upgrade to Android Inquiry SDK 2.20.0
    
    > #### \[v2.20.0\]
    > 
    > #### Added
    > 
    > -   Added support for Selfie V1 design.
    > 
    > #### Fixed
    > 
    > -   Fix a crash when upload fails on the government ID step.
    
-   Upgrade to Ios Inquiry SDK 2.28.1
    
    > #### \[v2.28.1\]
    > 
    > #### Added
    > 
    > -   Added additional nfc scan hints for passports.
    

## \[v2.14.0\] - 2025-07-02

### Changed

-   Upgrade to Android Inquiry SDK 2.19.0
    
    > #### \[v2.19.0\]
    > 
    > #### Added
    > 
    > -   Added support for 16kb page sizes.
    > 
    > #### Changed
    > 
    > -   Greatly increased the maximum number of UI components on a UI step before a TransactionTooLargeException exception is hit when the Activity is killed. The approximate increase is about 3x, from ~45 components to a theoretical ~135 components.
    > 
    > #### Fixed
    > 
    > -   Fix a crash that can occur after NFC is done scanning when SDK is used within a dynamic feature module.
    > 
    > #### \[v2.18.1\]
    > 
    > #### Fixed
    > 
    > -   Fixed malformed session token returned by InquiryEvent.StartEvent.
    > 
    > #### \[v2.18.0\]
    > 
    > #### Added
    > 
    > -   Added support for downloading and using custom fonts at runtime.
    > 
    > #### Changed
    > 
    > -   **Breaking change** InquiryEvent.StartEvent no longer indicates when an Inquiry is created. Instead the event is fired whenever an Inquiry session is created.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where the wrong background color was being applied to focused elements in input select component dropdowns.
    > -   Ensure files created by SDK are deleted once the inquiry completes.
    
-   Upgrade to Ios Inquiry SDK 2.28.0
    
    > #### \[v2.28.0\]
    > 
    > #### Added
    > 
    > -   Added support for external integrations such as Aadhaar and eID Easy.
    > -   Added support for downloading and using custom fonts at runtime.
    > -   Added nfc scan hints for ID cards.
    > 
    > #### Changed
    > 
    > -   **Breaking change** Changed the associated values in the InquiryEvent enum to allow for more flexibility going forward.
    > 
    > Before:
    > 
    > ```
    > func inquiryEventOccurred(event: InquiryEvent) {
    >     switch event {
    >     case .pageChange(let name, let page):
    >     ...
    >     }
    >  }
    > ```
    > 
    > After:
    > 
    > ```
    > func inquiryEventOccurred(event: InquiryEvent) {
    >     switch event {
    >     case .pageChange(let eventData):
    >         let name = eventData.name
    >         let path = eventData.path
    >     ...
    >     }
    >  }
    > ```
    > 
    > #### Fixed
    > 
    > -   Fixed a layout bug on iPad where the bottom of the create Reusable Persona sheet was cutoff.
    > -   Fixed a bug with NFC scanning where devices with system wide eastern arabic numerals were not able to unlock the NFC chip.
    > -   No longer show the add document button on the document review page if the number of uploaded documents is at the limit set on the template.
    > -   Fixed layout bugs with image components where they would appear to be the incorrect size if their widths and/or heights were not set on the server.
    

## \[v2.13.1\] - 2025-06-17

### Changed

-   Upgrade to Android Inquiry SDK 2.17.3
    
    > #### \[v2.17.3\]
    > 
    > #### Changed
    > 
    > -   No longer show the add document button if the file limit is reached in a document verification.
    

## \[v2.13.0\] - 2025-06-03

### Changed

-   Upgrade to Ios Inquiry SDK 2.27.0
    
    > #### \[v2.27.0\]
    > 
    > #### Changed
    > 
    > -   Changed errors that are shown to the user when doing an NFC scan to be presented in modals rather than below the scan button.
    > -   Changed the appearance of phone number UI component. Now users can select country code by selecting country flag.
    > 
    > #### Added
    > 
    > -   Added support for mdoc UI components (e.g. Apple Wallet in UI Steps).
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where images in buttons did not have the right color applied to them from the theme sent from the server.
    > -   Fixed a bug where default animations were not being themed with the correct colors.
    

## \[v2.12.0\] - 2025-05-27

### Changed

-   Upgrade to Android Inquiry SDK 2.17.2
    
    > #### \[v2.17.2\]
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where localization overrides are not applied correctly when auto-classification is on.
    > -   Fixed a crash in the document step when used within a react native project.
    > 
    > #### \[v2.17.1\]
    > 
    > #### Fixed
    > 
    > -   We will now apply theme colors to the default document prompt screen page buttons and image.
    > -   Fixed a race condition where a document is not uploaded when there are two or more document steps in an inquiry flow.
    
-   Upgrade to Ios Inquiry SDK 2.26.2
    
    > #### \[v2.26.2\]
    > 
    > #### Added
    > 
    > -   Added an NFC scan tips dialog sheet to help users who are having trouble scanning their NFC chip.
    > 
    > #### Fixed
    > 
    > -   Capture options in government id step now reflect template configuration.
    > -   We will now apply theme colors to the default document prompt screen image. We also now support markdown on the document prompt screen page.
    > -   Fixed Reusable Persona CTA card button.
    

## \[v2.11.2\] - 2025-05-07

### Changed

-   Upgrade to Android Inquiry SDK 2.17.0
    
    > #### \[v2.17.0\]
    > 
    > #### Changed
    > 
    > -   Optimized the Sentinel SDK size (~300kb after optimization) by changing module structures.
    > 
    > #### \[v2.16.4\]
    > 
    > #### Added
    > 
    > -   Added support for disabled and errored styles from the server for input select components.
    > 
    > #### Changed
    > 
    > -   Modify how component field values are sent up when Reusable Personas is used.
    
-   Upgrade to Ios Inquiry SDK 2.26.1
    
    > #### \[v2.26.1\]
    > 
    > #### Changed
    > 
    > -   Changed the hint animations used for NFC scans.
    > -   Send component field values of the current screen when Reusable Personas is used.
    > 
    > #### Added
    > 
    > -   Added `.accountReferenceId(_)` method to `SentinelEventBuilder` for Sentinel SDK. Use this to link a sentinel transaction to an account.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where auto-capture sometimes would not work on a valid MRZ code.
    > -   Fixed images set to fill width on UI steps.
    

## \[v2.11.1\] - 2025-05-06

### Changed

-   On iOS `Locale.preferredLanguages.first` will be used as a fallback locale to align with RN platform expectations.

## \[v2.11.0\] - 2025-04-23

### Changed

-   Upgrade to Android Inquiry SDK 2.16.3
    
    > #### \[v2.16.3\]
    > 
    > #### Changed
    > 
    > -   Send component field values of the current screen when Reusable Personas is used.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where auto-capture sometimes would not work on a valid MRZ code.
    > -   Fixed a crash when launching an inquiry as a dynamic feature module.
    > 
    > #### \[v2.16.2\]
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where `InlineInquiryScreen.goBack()` would crash if handleBackPress is set to false.
    > 
    > #### \[v2.16.1\]
    > 
    > #### Added
    > 
    > -   Added `.handleBackPress(_)` to `InlineInquiryBuilder` to control whether the inquiry screen should handle back presses when launched inline.
    > 
    > #### Fixed
    > 
    > -   Fixed a crash in the document step if the depending project also depends on `kotlin-reflect`.
    > -   Fixed a rare crash on the government ID preview screen.
    > 
    > #### \[v2.16.0\]
    > 
    > #### Added
    > 
    > -   Added `.accountReferenceId(_)` method to `SentinelEvent.Builder` for Sentinel SDK. Use this to link a sentinel transaction to an account.
    > 
    > #### Changed
    > 
    > -   Update dependencies.
    > -   Bumped Kotlin version to version 2.0.21.
    > 
    > #### Fixed
    > 
    > -   Fixed a race condition in the document step that can lead to a crash in rare cases.
    > 
    > #### \[v2.16.0\]
    > 
    > #### Added
    > 
    > -   Added `.accountReferenceId(_)` method to `SentinelEvent.Builder` for Sentinel SDK. Use this to link a sentinel transaction to an account.
    > 
    > #### Changed
    > 
    > -   Update dependencies.
    > -   Bumped Kotlin version to version 2.0.21.
    > 
    > #### Fixed
    > 
    > -   Fixed a race condition in the document step that can lead to a crash in rare cases.
    > 
    > #### \[v2.15.3\]
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where transitions fail when using a one-time-link code.
    > 
    > #### \[v2.15.2\]
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where the guide image on the government ID capture screen would shrink over time.
    > 
    > #### \[v2.15.1\]
    > 
    > #### Changed
    > 
    > -   Updated some dependencies to their latest patch version to resolve some bugs.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where chevrons would not render in government id type select components on UI steps.
    > 
    > #### \[v2.15.0\]
    > 
    > #### Changed
    > 
    > -   `RoutingCountry` enum, and `InquiryTemplateBuilder.routingCountry(string)`, `InquiryBuilder.routingCountry(string)` methods marked as deprecated. These will be fully removed as a breaking change in a coming release, please remove usage now to avoid compilation issues in future.
    > -   Hide the hint box on the government ID capture screen if the hint text is empty.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where UI elements are disabled during background polling when they should not be.
    > 
    > #### \[v2.14.2\]
    > 
    > #### Changed
    > 
    > -   Networking optimizations.
    
-   Upgrade to iOS Inquiry SDK 2.26.0
    
    > #### \[v2.26.0\] - 2025-04-01
    > 
    > #### Added
    > 
    > -   Added the ability to launch inquiries via one time link codes. The `Inquiry.from(oneTimeLinkCode: String, delegate: InquiryDelegate)` function can be called to do this. It can take in either the full Persona generated one time link code url or just the code itself.
    > 
    > #### Changed
    > 
    > -   `RoutingCountry` enum, and `InquiryTemplateBuilder.routingCountry(string)`, `InquiryBuilder.routingCountry(string)` methods marked as deprecated. These will be fully removed as a breaking change in a coming release, please remove usage now to avoid compilation issues in future.
    > -   We now hide the hint box at the bottom of the camera feed on the gov id capture screen when the hint text is empty.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where chevrons would not render in government id type select components on UI steps.
    > -   Fixed an issue with resend confirmation code button not unlocking email and phone 2fa flows.
    

## \[v2.10.0\] - 2025-03-17

### Removed

-   Removed the ability to pass in a `routingCountry` when launching an inquiry flow since it is no longer used.

### Added

-   Added ability to pass in a `themeSetId` when launching an inquiry flow.

### Changed

-   Upgrade to iOS Inquiry SDK 2.25.5
    
    > ## \[v2.25.5\] - 2025-03-13
    > 
    > ### Fixed
    > 
    > -   Fixed a rare crash that could occur when leaving the selfie capture step.
    > 
    > ## \[v2.25.4\] - 2025-03-10
    > 
    > ### Added
    > 
    > -   Added support for auto submit buttons on ui steps.
    > -   Added alignment style for processing screens.
    > 
    > ### Changed
    > 
    > -   Removed dependency on Down in favor of native AttributedString markdown support. Reduces SDK footprint.
    > -   Removed hardcoded padding on ui steps for platform parity.
    > 
    > ## \[v2.25.3\] - 2025-02-28
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where checkbox text was not being styled to the correct font size.
    > -   Fixed a bug that was preventing Belgian national IDs’ and some Belgian residence permits’ NFC chips from being scanned.
    
-   Upgrade to Android Inquiry SDK 2.13.2
    
    > # \[v2.14.2\] - 2025-03-13
    > 
    > ### Changed
    > 
    > -   Networking optimizations.
    > 
    > # \[v2.14.1\] - 2025-03-11
    > 
    > ### Added
    > 
    > -   Added support for vertical alignment on processing screens.
    > -   Added support for auto submit on UI step button components.
    > 
    > ## \[v2.14.0\] - 2025-03-10
    > 
    > ### Changed
    > 
    > -   Updated the SDK to be compatible for use within an on-demand dynamic feature module.
    > 
    > ### Fixed
    > 
    > -   Fixed a rare crash when uploading files in the government ID step.
    > 
    > ## \[v2.13.4\] - 2025-02-25
    > 
    > ### Changed
    > 
    > -   Update dependencies.
    > -   Inquiries launched in inline mode will no longer automatically remove themselves once the inquiry is complete. It is the responsibility of the implementor to clean up after the inquiry is done.
    > -   Changed Sentinel SDK’s API/public interface to Kotlin instead of Java.
    > 
    > ### Fixed
    > 
    > -   Fixed a rare crash that can occur at the end of an inquiry.
    > 
    > ## \[v2.13.3\] - 2025-02-21
    > 
    > ### Added
    > 
    > -   Added support in the Sentinel SDK for Java applications.
    

## \[v2.9.7\] - 2025-02-21

-   Upgrade to iOS Inquiry SDK 2.25.2
    
    > ## \[v2.25.2\] - 2025-02-11
    > 
    > ### Fixed
    > 
    > -   Fixed a race condition that caused `PersonaInlineDelegate.navigationStateDidUpdate` to fire with stale data.
    > -   Fixed a bug where checkbox text was not being styled to the correct font size.
    > 
    > ## \[v2.25.1\] - 2025-02-07
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where certain dates would not be populated depending on the timezone of the device and if the date was on a day in that timezone where daylight savings occurred at midnight.
    > -   Fixed a style issue on Selfie Review screen.
    > 
    > ## \[v2.25.0\] - 2025-02-03
    > 
    > ### Added
    > 
    > -   Added support for optional review screen on selfie flows.
    > -   Added the ability for the server to instruct the client to use fallback mode automatically. To use this, either pass in FallbackMode.defer to the .fallbackMode function on the InquiryTemplate builder, or pass in a valid fallback inquiry id (starts with `iqfs`) and a valid fallback session token (using the .sessionToken function) on the Inquiry builder.
    > 
    > ### Changed
    > 
    > -   `InquiryDelegate` is now marked as `@MainActor` to reflect it’s existing behavior and eliminate warnings on implementations also marked as `@MainActor`.
    > 
    > ### Fixed
    > 
    > -   Fixed a bug that was causing the cursor to jump to the end of input text components when the user was not making their edit at the end of the input text.
    > -   Fixed a rare crash during government id step.
    > -   Made the verify with Reusable Persona button component disableable.
    > -   Fixed a bug that could cause inquiries to show pages that async workflows triggered after the inquiry success screen was reached when creating a Reusable Persona.
    
-   Upgrade to Android Inquiry SDK 2.13.2
    
    > ## \[v2.13.2\] - 2025-02-20
    > 
    > ### Changed
    > 
    > -   Changed government ID auto-classification’s manual classification fallback screen to automatically select the country/ID type if there is only one option.
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where checkbox text were not correctly aligned with the checkbox.
    > 
    > ## \[v2.13.1\] - 2025-02-11
    > 
    > ### Fixed
    > 
    > -   Fixed a crash that occurred on the final steps of inquiries that are “complete” steps rather than “ui” steps.
    > 
    > ## \[v2.13.0\] - 2025-02-03
    > 
    > ### Added
    > 
    > -   Added the ability for the server to instruct the client to use fallback mode automatically. To use this, either pass in FallbackMode.defer to the .fallbackMode function on the InquiryTemplate builder, or pass in a valid fallback inquiry id (starts with `iqfs`) and a valid fallback session token (using the .sessionToken function) on the Inquiry builder.
    > 
    > ### Changed
    > 
    > -   Improve page transition performance for UI steps.
    

## \[v2.9.6\] - 2025-01-09

-   Upgrade to iOS Inquiry SDK 2.24.0
    
    > ## \[v2.24.0\] - 2024-12-20
    > 
    > ### Added
    > 
    > -   Published the Sentinel SDK.
    > 
    > ## \[v2.23.3\] - 2024-12-16
    > 
    > ### Fixed
    > 
    > -   Attributes on `PersonaInlineNavigationState` now correctly marked as public.
    > 
    > ## \[v2.23.2\] - 2024-12-11
    > 
    > ### Fixed
    > 
    > -   Fixed an issue with international DB components where prefilled country and id type fields would not hide according to the instructions of the server.
    > 
    > ### Added
    > 
    > -   Added support for markdown in the capture tips modal prompt text.
    > 
    > ## \[v2.23.1\] - 2024-11-25
    > 
    > ### Added
    > 
    > -   Added property `isPersonaNavigationHidden` to `PersonaInlineViewController` to ease formSheet presentation with inline mode.
    > 
    > ## \[v2.23.0\] - 2024-11-18
    > 
    > ### Added
    > 
    > -   Added experimental `startInline()` method to `Inquiry` used for embedding inquiry flow “inline” in your app. This feature allows custom handling of navigation elements within the flow.
    > -   Added optional `inquiryEventDidOccur` method to `inquiryDelegate`, this method is called on various events and can be used for logging purposes.
    > 
    > ### Changed
    > 
    > -   Now returning `PersonaError.invalidSessionToken` instead of `PersonaError.networking` when invalid session tokens are passed to the SDK.
    > -   Now building with Xcode 16.
    > 
    > ### Fixed
    > 
    > -   Manual country and id type select components in autoclassification flows now have the correct styling applied. The back and cancel buttons now show up on the manual select screen as well.
    > -   Input select components now respect the disabled styles that come from the server.
    > -   No longer crashing when json logic has a nested array as part of an “in” check.
    > -   Fixed UIAppearance bug on input select component sheets.
    
-   Upgrade to Android Inquiry SDK 2.12.17
    
    > ## \[v2.12.17\] - 2024-12-19
    > 
    > ### Added
    > 
    > -   Added support for selfie previews.
    > -   Added support for selfie auto-capture customization.
    > -   Added support for selfie manual-capture customization.
    > 
    > ### Fixed
    > 
    > -   Fixed a minor issue with the Sentinel SDK.
    > 
    > ## \[v2.12.16\] - 2024-12-17
    > 
    > ### Added
    > 
    > -   Published the Sentinel SDK.
    > 
    > ## \[v2.12.15\] - 2024-12-05
    > 
    > ### Fixed
    > 
    > -   Fixed a rare issue where the document file select picker might launch multiple times.
    > 
    > ## \[v2.12.14\] - 2024-11-27
    > 
    > ### Changed
    > 
    > -   Updated the layout for the government ID capture screen to handle smaller screens better.
    > -   Updated the layout for the selfie capture screen to handle smaller screens better.
    > 
    > ### Fixed
    > 
    > -   Fixed a rare crash when loading custom fonts.
    > -   Fixed a bug where a custom font cannot be found.
    > -   Fixed a bug where applying a theme when launching an inquiry in inline mode will change the theme of the host activity’s context.
    > 
    > ## \[v2.12.13\] - 2024-11-25
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where changes to an input select component does not trigger a render update.
    > 
    > ## \[v2.12.12\] - 2024-11-15
    > 
    > ### Changed
    > 
    > -   Inquiries launched inline will apply the given theme (if any) to the inquiry fragment.
    > -   Cancel modal will dismiss if “Cancel” is selected.
    > 
    > ### Fixed
    > 
    > -   Fixed an rare/improbable crash in the selfie step.
    

## \[v2.9.5\] - 2024-10-25

-   Upgrade to Android Inquiry SDK 2.12.11
    
    > ## \[v2.12.11\] - 2024-10-25
    > 
    > ### Added
    > 
    > -   Added an option to use simulated government ID NFC data in sandbox mode to make testing in sandbox mode easier. This option is on by default. The option can be changed by long pressing on the sandbox button.
    > -   Added network error logging for diagnostic purposes.
    > 
    > ### Changed
    > 
    > -   Update AGP to 8.3.2 and Gradle to 8.7
    > -   Update dependencies.
    > -   Now returning SessionTokenError for ErrorCode when inquiry is unauthorized.
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where a loading indicator is not shown on the submit button if the submit button is nested within a component group.
    > -   Fixed a bug where a loading indicator is not shown if the submit button is hidden. In this case, a loading indicator is shown on all components that support it (eg. other buttons).
    > -   Fixed a bug where UI steps with government ID NFC will not auto-submit if the submit button is nested within a component group.
    > 
    > ## \[v2.12.10\] - 2024-09-30
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where the camera preview on the selfie step will not load on certain devices.
    

## \[v2.9.4\] - 2024-09-19

-   Upgrade to iOS Inquiry SDK 2.22.5
    
    > ## \[v2.22.5\] - 2024-09-16
    > 
    > ### Fixed
    > 
    > -   Fixed a regression when permissions are granted for first time.
    > 
    > ## \[v2.22.4\] - 2024-08-29
    > 
    > ### Added
    > 
    > -   Added support for GPS collection.
    
-   Upgrade to Android Inquiry SDK 2.12.8
    
    > ## \[v2.12.8\] - 2024-09-13
    > 
    > ### Added
    > 
    > -   Added support for header icons specified by the server on the government ID select screen.
    > 
    > ## \[v2.12.7\] - 2024-09-09
    > 
    > ### Added
    > 
    > -   Added support for field types Choices and MultiChoices.
    > -   Added an error dialog when using government ID NFC but the device does not have a NFC reader.
    > 
    > ## \[v2.12.6\] - 2024-09-04
    > 
    > ### Fixed
    > 
    > -   Fixed a bug the initial spinner will not spin when using certain versions of Lottie.
    > 
    > ## \[v2.12.5\] - 2024-08-29
    > 
    > ### Added
    > 
    > -   Added support for collecting GPS data.
    

## \[v2.9.3\] - 2024-08-22

-   Upgrade to iOS Inquiry SDK 2.22.3
    
    > ## \[v2.22.3\] - 2024-08-16
    > 
    > ### Fixed
    > 
    > -   Fixed an issue where the auto complete suggestion drop down is blacked out when the phone is set to dark mode.
    > 
    > ## \[v2.22.2\] - 2024-08-13
    > 
    > ### Fixed
    > 
    > -   Fixed an issue where Ukrainian passport NFC chips would not scan correctly.
    > -   Fixed an issue where the background color of selected items in select sheets did not display.
    > 
    > ## \[v2.22.1\] - 2024-08-09
    > 
    > ### Changed
    > 
    > -   Hyperlinks are now underlined.
    
-   Upgrade to Android Inquiry SDK 2.12.4
    
    > ## \[v2.12.4\] - 2024-08-22
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where the create reusable Persona sheet would stick around after it dismisses.
    > -   Fixed a rare crash that can occur on UI step screens if the app is killed and restored.
    > -   Fixed a bug where the government ID NFC hint text is cut off in certain cases.
    

## \[v2.9.2\] - 2024-08-06

### Changed

-   Upgrade to iOS Inquiry SDK
    
    > ## \[v2.22.0\] - 2024-08-02
    > 
    > ### Added
    > 
    > -   Added support for disabled styling on input select components.
    > 
    > ### Changed
    > 
    > -   Upgraded lottie to 4.5.0.
    > 
    > ### Fixed
    > 
    > -   Fixed an issue where some remote assets wouldn’t display.
    > -   Fixed sandbox support during fallback flows.
    
-   Upgrade to Android Inquiry SDK 2.12.3
    
    > ## \[v2.12.3\] - 2024-08-06
    > 
    > ### Added
    > 
    > -   Added options to the inline inquiry builder to toggle whether inline inquiries can control the system UI.
    > 
    > ### Changed
    > 
    > -   Updated the design of the government ID NFC bottom sheet.
    > -   Marked inline inquiry API as experimental.
    > 
    > ### Fixed
    > 
    > -   Style government ID NFC bottom sheet based on SST (server sided theming)
    > -   Support markdown on texts for permissions related dialogs.
    > -   Fixed a crash that can occur if an inquiry flow errors while the app is in the background.
    > 
    > ## \[v2.12.2\] - 2024-07-19
    > 
    > ### Added
    > 
    > -   Added support for launching inquiries inline (i.e. within a fragment).
    > 
    > ### Fixed
    > 
    > -   Fixed an issue with rendering document icon.
    > -   Fixed an issue where the permission dialog overlaps with system UI.
    > 
    > ## \[v2.12.1\] - 2024-07-18
    > 
    > This is a technical release of v2.12.0.
    

## \[v2.9.1\] - 2024-07-19

### Changed

-   Upgrade to iOS Inquiry SDK 2.21.2
    
    > # \[v2.21.2\] - 2024-07-18
    > 
    > ### Fixed
    > 
    > -   Fixed an issue where French national ids could not be scanned with NFC.
    > -   Fixed an issue where GPS location permission popped up incorrectly.
    > -   Fixed a styling issue with custom assets.
    > 
    > # \[v2.21.1\] - 2024-07-12
    > 
    > ### Fixed
    > 
    > -   Fixed an issue with rendering document icon.
    

## \[v2.9.0\] - 2024-07-10

### Changed

-   Upgrade to iOS Inquiry SDK 2.21.0
    
    > # \[v2.21.0\] - 2024-07-02
    > 
    > ### Added
    > 
    > -   Added the ability to scan nfc chips using PACE IM.
    > -   Added support for Government Id flows that auto-classify id type and country code, eliminating these selection screens to end users.
    > -   Added the international database component.
    > 
    > ## \[v2.20.3\] - 2024-06-17
    > 
    > ### Added
    > 
    > -   Added the ability to configure audio recording enablement during video capture.
    > 
    > ### Fixed
    > 
    > -   Fixed an issue where buttons in bottom sheets would not be locked during screen transitions.
    > -   Fixed an issue where some devices would not be able to find a suitable camera to use due to frame rate properties of the camera.
    > -   Fixed an issue where we would load a blank camera feed if camera permissions were not granted. We should not go to the capture page at all in this case.
    > -   Fixed an issue when voice over is turned on, read the text twice for some clickable cells. And doesn’t read out button for some clickable components.
    
-   Upgrade to Android Inquiry SDK 2.12.0
    
    > ## \[v2.12.0\] - 2024-07-01
    > 
    > ### Added
    > 
    > -   Added support for Card Access Number authentication for NFC scanning.
    > -   Added support for rendering Persona option assets.
    > 
    > ### Changed
    > 
    > -   Bumped the server API version.
    > -   Added support for the international DB component.
    > 
    > ### Fixed
    > 
    > -   Fixed an issue where stroke/fill color overrides were not correctly applied to certain illustrations used in the government ID step.
    > -   Fixed an issue where the review capture image flickers.
    

## \[v2.8.13\] - 2024-05-13

### Fixed

-   Fixed an issue where reference id was not being populated when starting inquiries.

### Changed

-   Upgrade to iOS Inquiry SDK 2.20.2
    
    > ## \[v2.20.2\] - 2024-05-13
    > 
    > ### Fixed
    > 
    > -   Are no longer automatically setting reference id to nil if account id is set to nil on inquiry template builders (and vice-versa).
    > -   Fixed default distribution for horizontal stacks to match web & android defaults.
    > -   Fixed the scaling of character sizes when the accessibility feature for enlarged text is enabled.
    > -   Fixed a presentation bug with the microphone permissions request modal.
    > 
    > ## \[v2.20.1\] - 2024-05-07
    > 
    > ### Added
    > 
    > -   Added support for Card Access Number authentication for NFC scanning.
    > 
    > ### Fixed
    > 
    > -   Fixed a network error when starting an unauthenicated inquiry from inquiryId (with nil or empty sessionToken).
    

## \[v2.8.12\] - 2024-04-30

### Changed

-   Upgrade to iOS Inquiry SDK 2.20.0
    
    > ## \[v2.20.0\] - 2024-04-30
    > 
    > ### Fixed
    > 
    > -   Fixed a layout bug where Verify and Create Reusable Persona buttons would have the loading spinner sit on top of the button text when clicked.
    > -   Fixed an issue where custom hint assets from the server on pdf417 scans on the government id capture page were not being applied.
    > -   Fixed a layout bug when custom animations on the processing screens are not set to center align.
    > 
    > ### Changed
    > 
    > -   Updated the PersonaNfc module to use version 2.0.1 of PersonaOpenSSL.
    > -   Improved selfie auto-capture logic
    > 
    > ## \[v2.19.1\] - 2024-04-15
    > 
    > ### Fixed
    > 
    > -   Fixed a bug in prefill for input masked text component
    
-   Upgrade to Android Inquiry SDK 2.11.6
    
    > ## \[v2.11.6\] - 2024-04-29
    > 
    > ### Fixed
    > 
    > -   Fixed an issue where custom hint assets from the server on pdf417 scans on the government id capture page were not being applied.
    > -   Fixed an issue where address autocomplete does not pop up sometimes
    > 
    > ### Changed
    > 
    > -   Changed the scan NFC card button to show a progress indicator when transitioning to the next step.
    > 
    > ## \[v2.11.5\] - 2024-04-15
    > 
    > ### Added
    > 
    > -   Updated internal fallback mode API
    

## \[v2.8.11\] - 2024-04-12

### Changed

-   Upgrade to iOS Inquiry SDK 2.19.0
    
    > ## \[v2.19.0\] - 2024-04-12
    > 
    > ### Added
    > 
    > -   Added support for custom server side assets on selfie prompt step.
    > 
    > ### Changed
    > 
    > -   The NFC module now uses version 2.0.0 of the [Persona fork](https://github.com/persona-id/PersonaOpenSSL) of the iOS OpenSSL library.
    

## \[v2.8.10\] - 2024-04-11

### Changed

-   Upgrade to Android Inquiry SDK 2.11.4
    
    > ## \[v2.11.4\] - 2024-04-11
    > 
    > ### Fixed
    > 
    > -   Make sure the header button color from the server is applied on gov id review screens.
    

## \[v2.8.9\] - 2024-04-10

### Changed

-   Upgrade to iOS Inquiry SDK 2.18.2
    
    > ## \[v2.18.2\] - 2024-04-10
    > 
    > ### Changed
    > 
    > -   Changed Used For Tracking to NO for Coarse Location in privacy manifest for main SDK modules
    

## \[v2.8.8\] - 2024-04-10

### Changed

-   Upgrade to iOS Inquiry SDK 2.18.1
    
    > ## \[v2.18.1\] - 2024-04-10
    > 
    > ### Changed
    > 
    > -   Started pulling in privacy manifest from our lottie dependency.
    > 
    > ## \[v2.18.0\] - 2024-04-09
    > 
    > ### Changed
    > 
    > -   The NFC module now uses the [Persona fork](https://github.com/persona-id/PersonaOpenSSL) of the iOS OpenSSL library.
    > 
    > ### Added
    > 
    > -   Added Privacy Manifests to all Persona modules.
    > -   Added the ability to color the back and cancel buttons on the capture screens via the server.
    > -   Added privacy manifest.
    
-   Upgrade to Android Inquiry SDK 2.11.3
    
    > ## \[v2.11.3\] - 2024-04-09
    > 
    > ### Added
    > 
    > -   Added the ability to color the back and cancel buttons on the capture screens via the server.
    > 
    > ### Changed
    > 
    > -   Improved the messaging for NFC related errors.
    > 
    > ### Fixed
    > 
    > -   Fixed several NFC related bugs.
    > 
    > ## \[v2.11.2\] - 2024-04-05
    > 
    > ### Added
    > 
    > -   Added ability to configure via the server which data groups are read during an nfc scan.
    

## \[v2.8.7\] - 2024-04-03

### Changed

-   Upgrade to iOS Inquiry SDK 2.17.1
    
    > ## \[v2.17.1\] - 2024-04-03
    > 
    > ### Fixed
    > 
    > -   Custom government id hint icons on the capture page now respect the size sent from the server.
    

## \[v2.8.6\] - 2024-04-02

### Changed

-   Upgrade to Android Inquiry SDK 2.11.1
    
    > ## \[v2.11.1\] - 2024-04-02
    > 
    > ### Added
    > 
    > -   Added the ability to set custom assets via the server for the verification processing animation.
    > -   Added the ability to control the layout axis of the buttons on the review captured government id screen via the server.
    > -   Added the ability to add optional titles on government id and selfie capture screens.
    > -   Added the ability to customize the selfie verification processing loading animation via the server.
    > 
    > ### Changed
    > 
    > -   Changes the style of the processing screen when auto-classification is enabled.
    > 
    > ## \[v2.11.0\] - 2024-03-27
    > 
    > ### Added
    > 
    > -   Added a selfie flow type `configurable_poses` which randomizes the capturing order of selfie poses.
    > -   Added support for auto-classification for government ID steps.
    > 
    > ### Fixed
    > 
    > -   Fixed a layout bug on the selfie start page where vertical margins were not being applied to text views.
    > 
    > ## \[v2.10.19\] - 2024-03-15
    > 
    > ### Added
    > 
    > -   Added a stricter condition for autocapture when strict selfie flag is on
    
-   Upgrade to iOS Inquiry SDK 2.17.0
    
    > ## \[v2.17.0\] - 2024-04-02
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where server driven styles were not being used for disabled buttons when another button was clicked.
    > 
    > ### Added
    > 
    > -   Added the ability to add optional titles on government id and selfie capture screens.
    > -   Added the ability to control the layout axis of the buttons on the review captured government id screen via the server.
    > -   Added the ability to control processing text location on pending pages via the server.
    > -   Added the ability to set custom assets via the server for selfie verification hint animations.
    > -   Added the ability to set custom assets via the server for the verification processing animation.
    > -   Added the ability to set custom assets via the server for the hint icon on the government id capture page.
    > -   Added a selfie flow type `configurable_poses` which randomizes the capturing order of selfie poses.
    > -   Added ability to configure via the server which data groups are read during an nfc scan.
    > 
    > ## \[v2.16.1\] - 2024-03-25
    > 
    > ### Fixed
    > 
    > -   Fixed a layout bug that occurred on some devices when two input text components were embedded in a horizontal stack.
    > -   Fixed a rare crash that could occur during Government Id camera initialization.
    > 
    > ### Added
    > 
    > -   Added support for custom server side assets on government id step.
    > 
    > ### Changed
    > 
    > -   Now building with Xcode 15.3.
    

## \[v2.8.5\] - 2024-03-21

### Fixed

-   Fixed usage of `accountId` on `InquiryTemplateBuilder` for iOS.

### Changed

-   Upgrade to Android Inquiry SDK 2.10.18
    
    > ## \[v2.10.18\] - 2024-03-06
    > 
    > ### Fixed
    > 
    > -   Fixed an issue where the camera preview for government ID would be cropped if the sweep animation is disabled.
    > 
    > ## \[v2.10.17\] - 2024-03-05
    > 
    > ### Fixed
    > 
    > -   Addressed an issue with our beta fallback service.
    
-   Upgrade to iOS Inquiry SDK 2.16.0
    
    > ## \[v2.16.0\] - 2024-03-07
    > 
    > ### Added
    > 
    > -   Added `accountId(_: String)` to `InquiryTemplateBuilder` to be able to associate an inquiry with a Persona Account object when using this sdk entry point.
    > 
    > ### Changed
    > 
    > -   Updated the minimum deployment target for our optional NFC package from iOS 13 to 15.
    

## \[v2.8.4\] - 2024-03-04

### Changed

-   Upgrade to Android Inquiry SDK 2.10.16
    
    > #### \[v2.10.16\] - 2024-03-04
    > 
    > #### Added
    > 
    > -   Added a way to forcibly cancel all running inquiries within an application by calling `Inquiry.cancelRunningInquiries()`.
    > 
    > #### \[v2.10.15\] - 2024-02-28
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where the buttons in the review capture screen for government ID steps are in the wrong location.
    > 
    > #### \[v2.10.14\] - 2024-02-27
    > 
    > #### Added
    > 
    > -   Added a toggle to have the SDK consume any unhandled exceptions via `consumeExceptions()` on `InquiryTemplateBuilder` or `InquiryBuilder`.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where using reusable Personas to complete parts of the inquiry does not work.
    > 
    > #### \[v2.10.13\] - 2024-02-20
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where the capture button would overlap with other UI elements on devices with small screens.
    > -   Fixed an issue where the capture tips modal sometimes appears behind the navigation bar.
    > -   Fixed a crash that can occur in the government ID or selfie step if the cancel modal is shown and the app is backgrounded.
    
-   Upgrade to iOS Inquiry SDK 2.15.4
    
    > #### \[v2.15.4\] - 2024-03-04
    > 
    > #### Added
    > 
    > -   Added `Inquiry.cancel()` to programmatically cancel the inquiry flow.
    > 
    > #### Fixed
    > 
    > -   Addressed a minor memory leak on barcode analysis.
    > 
    > #### \[v2.15.3\] - 2024-02-27
    > 
    > #### Fixed
    > 
    > -   Addressed an issue in our fallback service beta.
    > -   Fixed a layout issue on remote image components
    > 
    > #### \[v2.15.2\] - 2024-02-22
    > 
    > #### Added
    > 
    > -   Added more checks for autocapture when strict selfie is turn on.
    > 
    > #### Changed
    > 
    > -   Addressed a camera specific error delegating to `inquiryError` as `PersonaError.UnknownError`, returning `PersonaError.CameraError` instead.
    > -   Modified the search bar to be case-insensitive.
    > 
    > #### \[v2.15.1\] - 2024-02-06
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where some German passports would not be able to be scanned over nfc.
    > 
    > #### \[v2.15.0\] - 2024-02-02
    > 
    > #### Added
    > 
    > -   Added improved back button navigation support on gov id, selfie, document steps.
    

## \[v2.8.3\] - 2024-02-01

### Changed

-   Upgrade to Android Inquiry SDK 2.10.12
    
    > #### \[v2.10.12\] - 2024-01-23
    > 
    > #### Added
    > 
    > -   Added support for the auto-complete flag for reusable Personas.
    > -   Added a new graphic for the passport NFC flow.
    > 
    > #### \[v2.10.11\] - 2024-01-10
    > 
    > #### Added
    > 
    > -   Added highlighted background color for selected item in input select list component.
    > -   Added support for localization overrides on government id capture feed instructions.
    > -   Support server-side asset configurations for selfie, government ID and document steps.
    > -   Support disabled for input select and input multi select.
    > -   Support hidden for stack, QRCode, and spacer component.
    > -   Support max rows for text area component.
    > 
    > #### Changed
    > 
    > -   Added additional default assets for gov id upload flows.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue with the navigation bar color on Android API levels 27 to 29 (inclusive).
    > -   Fixed an issue in Government ID step where tapping back from the capture screen would cause minor UI issues.
    
-   Upgrade to iOS Inquiry SDK 2.14.3
    
    > #### \[v2.14.3\] - 2024-01-25
    > 
    > #### Added
    > 
    > -   Added support for rows on text area component
    > 
    > #### Changed
    > 
    > -   Improved error messaging for Government Id NFC flows.
    > 
    > #### \[v2.14.2\] - 2024-01-10
    > 
    > #### Added
    > 
    > -   Markdown is now supported in checkbox component labels.
    > -   Added support for localization overrides on government id capture feed instructions.
    > 
    > #### Changed
    > 
    > -   Changed default assets for flows that allow uploading gov id from files or photos.
    > 
    > #### Fixed
    > 
    > -   Fixed Chinese character input when using Pinyin.
    > -   Fixed input multi-select sheet behavior.
    

## \[v2.8.2\] - 2023-12-15

### Fixed

-   Corrected a cocoapods issue with the new WebRtc subspec `RNPersonaInquiry2/WebRtc`.

## \[v2.8.1\] - 2023-12-15

### Changed

-   Upgrade to iOS Inquiry SDK 2.14.1
    
    > #### \[v2.14.1\] - 2023-12-15
    > 
    > #### Fixed
    > 
    > -   Fixed a video verification bug that occurs when establishing the webRTC connection.
    

## \[v2.8.0\] - 2023-12-15

### Added

-   Added the ability to use WebRtc for recording verification videos.

### Changed

-   Upgrade to iOS Inquiry SDK 2.14.0
    
    > #### \[v2.14.0\] - 2023-12-15
    > 
    > ### Removed
    > 
    > -   Removed all usages of UserDefaults API to comply with new app store requirements. See [https://developer.apple.com/documentation/foundation/userdefaults](https://developer.apple.com/documentation/foundation/userdefaults).
    > 
    > ### Added
    > 
    > -   Added the component checkbox group, has multi-select feature.
    > -   Added support for reusable Personas.
    > -   Added search bar for input select list.
    > -   Added the ability to stream government id and selfie verifications via WebRTC in the optional PersonaWebRtc framework.
    > -   Added currency text input components.
    
-   Upgrade to Android Inquiry SDK 2.10.10
    
    > ## \[v2.10.10\] - 2023-12-15
    > 
    > ### Added
    > 
    > -   Added checkbox group component, which has multi-select feature.
    > -   Added support for reusable Personas.
    > 
    > ### Fixed
    > 
    > -   Fixed a rare crash when sending users to the NFC settings page. This can happen if NFC is disabled and the user is going through the passport NFC flow.
    > -   Fixed some minor cosmetic issues with bottom sheets.
    > -   Introduced a workaround for a bug introduced in Lottie 6.2.0 that was causing a crash on the government id capture screen.
    

## \[v2.7.5\] - 2023-12-07

### Fixed

-   Fixed Android build generation issue introduced in 2.7.4 after the removal of AndroidManifest.xml

## \[v2.7.4\] - 2023-12-04

### Fixed

-   Overriding routing country or locale does not work for android when creating from inquiry ID
-   Remove package name from AndroidManifest.xml since this is no longer supported by the Android SDK.
-   Allow a range of OpenSSL versions for NFC scanning on iOS so that the flipper framework can be used.

### Changed

-   Added error code to onError callback.
    
-   Upgrade to Android Inquiry SDK 2.10.9
    
    > #### \[v2.10.9\] - 2023-11-27
    > 
    > #### Added
    > 
    > -   Added the ability to stream government id and selfie verifications via WebRTC.
    > -   Added advanced mask support for MaskedTextInput components.
    > -   Added search bar for countries select in GovID
    > -   Added support for markdown in checkboxes and radio buttons.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where address auto-complete would not be expanded if there are fields prefilled.
    > -   Fixed an issue where the address suggestion dropdown is shown even if no suggestions are available.
    > -   Fixed the behaviour of automatically filling in literals for mask text component, following the mask format
    > -   Handle out-of-space errors gracefully. An error will be returned by the SDK when the device runs out of disk space.
    > -   Improve performance and load times of UI steps, especially on lower end devices.
    > -   Prefixed some resources with “pi2” to avoid naming collisions.
    > 
    > #### \[v2.10.8\] - 2023-11-02
    > 
    > #### Fixed
    > 
    > -   Fixed a crash when using a custom government ID camera preview overlay.
    > 
    > #### \[v2.10.7\] - 2023-10-27
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where video capture would not be able to find a suitable camera even if one is available.
    > -   Fixed an issue where the cancel bottom sheet would not be anchored to the bottom.
    > -   Fixed an issue where the address component would not expand.
    > -   Fixed an edge case where the manual capture button will not show up when it should.
    > 
    > #### \[v2.10.6\] - 2023-10-23
    > 
    > #### Added
    > 
    > -   Added the ability to stream selfie verifications via WebRTC.
    > -   Added the component text area, that will resize automatically when there is multiple lines of text
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where users are not asked to enable the microphone permission if they permanently reject the permission. This only applies to video capture flows.
    > 
    > #### Changed
    > 
    > -   Display content edge-to-edge.
    > 
    > #### \[v2.10.5\] - 2023-10-05
    > 
    > #### Fixed
    > 
    > -   Workaround an issue with MLKit when used as a dynamic feature module.
    
-   Upgrade to iOS Inquiry SDK 2.13.0
    
    > #### \[v2.13.0\] - 2023-11-10
    > 
    > #### Added
    > 
    > -   Improved support for advanced masks on MaskedInput components.
    > 
    > #### Fixed
    > 
    > -   Addressed some retention cycle leaks.
    > -   Addressed an autocapture issue on iPhone 15 Pro / Pro max.
    > -   Fixed server side theming of font rendering for languages that use non-uniform character widths (e.g. Thai)
    

## \[v2.7.3\] - 2023-10-06

### Changed

-   Upgrade to iOS Inquiry SDK 2.12.6
    
    > #### \[v2.12.6\] - 2023-10-06
    > 
    > #### Added
    > 
    > -   Added the component text area, that will resize automatically when there is multiple lines of text.
    > -   Added PhoneNumberMetadata.json (310kb) back to SDK target.
    

## \[v2.7.2\] - 2023-10-05

### Fixed

-   Custom clientside iOS animations now default to loop instead of play once.

### Changed

-   Upgrade to iOS Inquiry SDK 2.12.5
    
    > #### \[v2.12.5\] - 2023-10-05
    > 
    > #### Added
    > 
    > -   Added the ability to style buttons in the cancel modal separately from the general step button styles via the server.
    
-   Upgrade to Android Inquiry SDK 2.10.4
    
    > #### \[v2.10.4\] - 2023-10-05
    > 
    > #### Added
    > 
    > -   Added the ability to style buttons in the cancel modal separately from the general step button styles via the server.
    > 
    > #### Fixed
    > 
    > -   Workaround a bug with Android’s dynamic feature plugin. Moved all declarations of content providers to the `dynamic-feature` module.
    

## \[v2.7.1\] - 2023-9-22

### Added

-   Added ability to override device locale via `.locale(String)` method on `InquiryTemplateBuilder` or `InquiryBuilder`.

### Changed

-   Upgrade to iOS Inquiry SDK 2.12.4
    
    > #### \[v2.12.4\] - 2023-09-21
    > 
    > #### Added
    > 
    > -   Added ability to override device locale via `.locale(String)` method on `InquiryTemplateBuilder` or `InquiryBuilder`.
    > 
    > #### Fixed
    > 
    > -   Fixed the crash that occurred when utilizing the remote asset for overlay images during the camera capture step for the Government ID.
    > 
    > #### \[v2.12.3\] - 2023-09-18
    > 
    > #### Fixed
    > 
    > -   Addressed an issue affecting barcode extraction rates in some cases.
    > -   Fixed a networking error when using Xcode 15.
    > 
    > #### Changed
    > 
    > -   The popover alert window for govID and document would appear in the middle for iPad, no changes for iPhone
    > -   Changed the address input to appear as a single text field initially that can be expanded by the user.
    > 
    > #### \[v2.12.2\] - 2023-09-01
    > 
    > #### Changed
    > 
    > -   Now returning `PersonaError.rateLimitExceeded` instead of `PersonaError.networking` to `InquiryDelegate.inquiryError` when API quotas have been exceeded.
    > 
    > #### \[v2.12.1\] - 2023-08-24
    > 
    > #### Changed
    > 
    > -   No longer include `CHANGELOG.md` (16kb) in our SDK target.
    > -   No longer including `PhoneNumberMetadata.json` (310kb) in our SDK target.
    
-   Upgrade to Android Inquiry SDK 2.10.2
    
    > #### \[v2.10.2\] - 2023-09-22
    > 
    > #### Added
    > 
    > -   Added ability to override device locale via `.locale(String)` method on `InquiryTemplateBuilder` or `InquiryBuilder`.
    > 
    > #### \[v2.10.1\] - 2023-09-21
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where the error message for required input was not cleared after the input was entered.
    > -   Fixed a crash that can occurs if the user presses backspace on the address auto-complete field.
    > 
    > #### \[v2.10.0\] - 2023-09-19
    > 
    > #### Changed
    > 
    > -   Changed the address input to appear as a single text field initially that can be expanded by the user.
    > -   Improved support for Government Id NFC.
    > 
    > #### \[v2.9.2\] - 2023-08-31
    > 
    > #### Added
    > 
    > -   Added an error code to error results.
    > 
    > #### Changed
    > 
    > -   Updated ESignature component styling.
    > -   Support the no overlay option for Government ID scan step.
    

## \[v2.7.0\] - 2023-8-22

### Changed

-   Update AGP and Gradle to 8.1.0
    
-   Update to Xcode 14.3
    
-   Changed `InquiryTemplateBuilder.routingCountry` to accept string instead of enum
    
-   Upgrade to iOS Inquiry SDK 2.12.0
    
    > #### \[v2.12.0\] - 2023-08-18
    > 
    > #### Added
    > 
    > -   Added the ability to color custom SVGs via the server.
    > -   Added the ability to add description texts under radio groups and checkbox input components.
    > 
    > #### Changed
    > 
    > -   Updated ESignature component styling.
    > -   Are now compiling the Persona SDK with Xcode 14.3.
    > -   No longer requiring `NSPhotoLibraryUsageDescription` to access photo library.
    > 
    > #### \[v2.11.0\] - 2023-07-20
    > 
    > #### Added
    > 
    > -   Added `.environmentId` on `InquiryTemplateBuilder` to create inquiries with a specific environment token.
    > 
    > #### Changed
    > 
    > -   **Breaking change** Changed `.routingCountry` on `InquiryTemplateBuilder` and `InquiryBuilder` to accept String instead of enum.
    >     -   Before: `.routingCountry(RoutingCountry.de)` after: `.routingCountry(RoutingCountry.de.rawValue)`
    > -   **Breaking change** Changed SST colors to parse as format `#RRGGBBAA` instead of `#AARRGGBB`
    >     -   From our audit, this change should not affect any customers. If you are affected by this change, please reach out to your account team.
    > 
    > #### Fixed
    > 
    > -   Fixed the evaluation of hidden input components.
    
-   Upgrade to Android Inquiry SDK 2.9.1
    
    > #### \[v2.9.1\] - 2023-08-08
    > 
    > #### Added
    > 
    > -   Added the ability to color custom SVGs via the server. Note that if loading the local custom asset, the SVG must be placed in the raw resources directory in order for the color replacement to occur since this process does not work on vector drawables.
    > -   Added the ability to add description texts under radio groups and checkbox input components.
    > 
    > #### Changed
    > 
    > -   Update AGP and Gradle to 8.1.0
    > -   Update dependencies.
    > 
    > #### Fixed
    > 
    > -   Fixed a crash that occurs when an app is built with R8 full mode.
    > 
    > #### \[v2.9.0\] - 2023-07-27
    > 
    > #### Added
    > 
    > -   Added the ability to hide local image components based on json logic from the server.
    > 
    > #### Changed
    > 
    > -   Update AGP to 8.0.2
    > 
    > #### \[v2.8.0\] - 2023-07-20
    > 
    > #### Added
    > 
    > -   Added `.environmentId` on `InquiryTemplateBuilder` to create inquiries with a specific environment token.
    > 
    > #### Changed
    > 
    > -   **Breaking change** Changed `.routingCountry` on `InquiryTemplateBuilder` and `InquiryBuilder` to accept String instead of enum.
    >     -   Before: `.routingCountry(RoutingCountry.DE)` after: `.routingCountry(RoutingCountry.DE.name)`
    > -   **Breaking change** Changed SST colors to parse as format `#RRGGBBAA` instead of `#AARRGGBB`
    >     -   From our audit, this change should not affect any customers. If you are affected by this change, please reach out to your account team.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where the values of hidden fields were being submitted to the inquiry.
    > 
    > #### \[v2.7.2\] - 2023-07-05
    > 
    > #### Fixed
    > 
    > -   Fixed `InquiryActivity` retention leak introduced in `v2.6.0`
    

### Fixed

-   Fixed behavior of `Inquiry.fromTemplateVersion` to launch inquiry from a version token (e.g. itmplv\_…)
-   Fixed error validation of `Inquiry.fromTemplate`, `Inquiry.fromTemplateVersion`, `Inquiry.fromInquiry` to consider undefined values.

## \[v2.6.15\] - 2024-04-30

### Changed

-   Upgrade to iOS Inquiry SDK 2.20.0
    
    > ## \[v2.20.0\] - 2024-04-30
    > 
    > ### Fixed
    > 
    > -   Fixed a layout bug where Verify and Create Reusable Persona buttons would have the loading spinner sit on top of the button text when clicked.
    > -   Fixed an issue where custom hint assets from the server on pdf417 scans on the government id capture page were not being applied.
    > -   Fixed a layout bug when custom animations on the processing screens are not set to center align.
    > 
    > ### Changed
    > 
    > -   Updated the PersonaNfc module to use version 2.0.1 of PersonaOpenSSL.
    > -   Improved selfie auto-capture logic
    > 
    > ## \[v2.19.1\] - 2024-04-15
    > 
    > ### Fixed
    > 
    > -   Fixed a bug in prefill for input masked text component
    

## \[v2.6.14\] - 2024-04-12

### Changed

-   Upgrade to iOS Inquiry SDK 2.19.0
    
    > ## \[v2.19.0\] - 2024-04-12
    > 
    > ### Added
    > 
    > -   Added support for custom server side assets on selfie prompt step.
    > 
    > ### Changed
    > 
    > -   The NFC module now uses version 2.0.0 of the [Persona fork](https://github.com/persona-id/PersonaOpenSSL) of the iOS OpenSSL library.
    

## \[v2.6.13\] - 2024-04-11

### Changed

-   Upgrade to Android Inquiry SDK 2.8.8
    
    > ## \[v2.8.8\] - 2024-04-11
    > 
    > ### Fixed
    > 
    > -   Make sure the header button color from the server is applied on gov id review screens.
    

## \[v2.6.12\] - 2024-04-11

### Changed

-   Upgrade to iOS Inquiry SDK 2.18.2
    
    > ## \[v2.18.2\] - 2024-04-10
    > 
    > ### Changed
    > 
    > -   Changed Used For Tracking to NO for Coarse Location in privacy manifest for main SDK modules
    

## \[v2.6.11\] - 2024-04-10

### Changed

-   Upgrade to iOS Inquiry SDK 2.18.1
    
    > ## \[v2.18.1\] - 2024-04-10
    > 
    > ### Changed
    > 
    > -   Started pulling in privacy manifest from our lottie dependency.
    

## \[v2.6.10\] - 2024-04-09

-   Upgrade to iOS SDK 2.18.0
    
    > ## \[v2.18.0\] - 2024-04-09
    > 
    > ### Changed
    > 
    > -   The NFC module now uses the [Persona fork](https://github.com/persona-id/PersonaOpenSSL) of the iOS OpenSSL library.
    > 
    > ### Added
    > 
    > -   Added Privacy Manifests to all Persona modules.
    > -   Added the ability to color the back and cancel buttons on the capture screens via the server.
    > -   Added privacy manifest.
    
-   Upgrade to Android SDK 2.8.7.
    
    > ## \[v2.8.7\] - 2024-04-09
    > 
    > ### Changed
    > 
    > -   Updated to include all changes up to v2.11.3
    

## \[v2.6.9\] - 2024-04-05

-   Upgrade to iOS SDK 2.17.1
    
    > ## \[v2.17.1\] - 2024-04-03
    > 
    > ### Fixed
    > 
    > -   Custom government id hint icons on the capture page now respect the size sent from the server.
    > 
    > ## \[v2.17.0\] - 2024-04-02
    > 
    > ### Added
    > 
    > -   Added the ability to add optional titles on government id and selfie capture screens.
    > -   Added the ability to control the layout axis of the buttons on the review captured government id screen via the server.
    > -   Added the ability to control processing text location on pending pages via the server.
    > -   Added the ability to set custom assets via the server for selfie verification hint animations.
    > -   Added the ability to set custom assets via the server for the verification processing animation.
    > -   Added the ability to set custom assets via the server for the hint icon on the government id capture page.
    > -   Added a selfie flow type `configurable_poses` which randomizes the capturing order of selfie poses.
    > -   Added ability to configure via the server which data groups are read during an nfc scan.
    > 
    > ### Fixed
    > 
    > -   Fixed a bug where server driven styles were not being used for disabled buttons when another button was clicked.
    > 
    > ## \[v2.16.1\] - 2024-03-25
    > 
    > ### Changed
    > 
    > -   Now building with Xcode 15.3.
    > 
    > ### Fixed
    > 
    > -   Fixed a layout bug that occurred on some devices when two input text components were embedded in a horizontal stack.
    > -   Fixed a rare crash that could occur during Government Id camera initialization.
    > 
    > ### Added
    > 
    > -   Added support for custom server side assets on government id step.
    
-   Upgrade to Android SDK 2.8.6. This is equivalent to Android SDK 2.11.1 but without any AGP 8 changes.
    

## \[v2.6.8\] - 2024-03-07

### Changed

-   Upgrade to iOS SDK 2.16.0
    
    > #### \[v2.16.0\] - 2024-03-07
    > 
    > #### Added
    > 
    > -   Added `accountId(_: String)` to `InquiryTemplateBuilder` to be able to associate an inquiry with a Persona Account object when using this sdk entry point.
    > 
    > #### Changed
    > 
    > -   Updated the minimum deployment target for our optional NFC package from iOS 13 to 15.
    > 
    > #### \[v2.15.4\] - 2024-03-04
    > 
    > #### Added
    > 
    > -   Added `Inquiry.cancel()` to programmatically cancel the inquiry flow.
    > 
    > #### Fixed
    > 
    > -   Addressed a minor memory leak on barcode analysis.
    > 
    > #### \[v2.15.3\] - 2024-02-27
    > 
    > #### Fixed
    > 
    > -   Addressed an issue in our fallback service beta.
    > -   Fixed a layout issue on remote image components
    > 
    > #### \[v2.15.2\] - 2024-02-22
    > 
    > #### Added
    > 
    > -   Added more checks for autocapture when strict selfie is turn on.
    > 
    > #### Changed
    > 
    > -   Addressed a camera specific error delegating to `inquiryError` as `PersonaError.UnknownError`, returning `PersonaError.CameraError` instead.
    > -   Modified the search bar to be case-insensitive.
    > 
    > #### \[v2.15.1\] - 2024-02-06
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where some German passports would not be able to be scanned over nfc.
    > 
    > #### \[v2.15.0\] - 2024-02-02
    > 
    > #### Added
    > 
    > -   Added improved back button navigation support on gov id, selfie, document steps.
    > 
    > #### \[v2.14.3\] - 2024-01-25
    > 
    > #### Added
    > 
    > -   Added support for rows on text area component
    > 
    > #### Changed
    > 
    > -   Improved error messaging for Government Id NFC flows.
    > 
    > #### \[v2.14.2\] - 2024-01-10
    > 
    > #### Added
    > 
    > -   Markdown is now supported in checkbox component labels.
    > -   Added support for localization overrides on government id capture feed instructions.
    > -   Added support for direction for footer component.
    > 
    > #### Changed
    > 
    > -   Changed default assets for flows that allow uploading gov id from files or photos.
    > 
    > #### Fixed
    > 
    > -   Fixed Chinese character input when using Pinyin.
    > -   Fixed input multi-select sheet behavior.
    > 
    > #### \[v2.14.1\] - 2023-12-15
    > 
    > #### Fixed
    > 
    > -   Fixed a video verification bug that occurs when establishing the webRTC connection.
    > 
    > #### \[v2.14.0\] - 2023-12-15
    > 
    > #### Removed
    > 
    > -   Removed all usages of UserDefaults API to comply with new app store requirements. See [https://developer.apple.com/documentation/foundation/userdefaults](https://developer.apple.com/documentation/foundation/userdefaults).
    > 
    > #### Added
    > 
    > -   Added the component checkbox group, has multi-select feature.
    > -   Added support for reusable Personas.
    > -   Added search bar for input select list.
    > -   Added the ability to stream government id and selfie verifications via WebRTC in the optional PersonaWebRtc framework.
    > -   Added currency text input components.
    > 
    > #### Fixed
    > 
    > -   Fixed styling for radio group component title.
    

### Fixed

-   Fixed usage of `accountId` on `InquiryTemplateBuilder` for iOS.

## \[v2.6.7\] - 2023-12-04

### Fixed

-   Allow a range of OpenSSL versions for NFC scanning on iOS so that the flipper framework can be used.

## \[v2.6.6\] - 2023-11-28

### Changed

-   Upgrade to Android Inquiry SDK 2.8.5
    
    > #### \[v2.8.5\] - 2023-11-27
    > 
    > #### Changed
    > 
    > -   Improved support for Government Id NFC.
    

## \[v2.6.5\] - 2023-11-14

### Fixed

-   Overriding routing country or locale does not work for android when creating from inquiry ID

### Changed

-   Upgrade to Android Inquiry SDK 2.8.4
    
    > #### \[v2.8.4\] - 2023-10-30
    > 
    > #### Added
    > 
    > -   Added an error code to error results.
    
-   Upgrade to iOS Inquiry SDK 2.13.0
    
    > #### \[v2.13.0\] - 2023-11-10
    > 
    > #### Added
    > 
    > -   Improved support for advanced masks on MaskedInput components.
    > 
    > #### Fixed
    > 
    > -   Addressed some retention cycle leaks.
    > -   Addressed an autocapture issue on iPhone 15 Pro / Pro max.
    > -   Fixed server side theming of font rendering for languages that use non-uniform character widths (e.g. Thai)
    > 
    > #### \[v2.12.6\] - 2023-10-06
    > 
    > #### Added
    > 
    > -   Added the component text area, that will resize automatically when there is multiple lines of text
    > -   Added PhoneNumberMetadata.json (310kb) back to SDK target.
    > 
    > #### \[v2.12.5\] - 2023-10-05
    > 
    > #### Added
    > 
    > -   Added the ability to style buttons in the cancel modal separately from the general step button styles via the server.
    

## \[v2.6.4\] - 2023-10-13

### Added

-   Added ability to override device locale via `.locale(String)` method on `InquiryTemplateBuilder` or `InquiryBuilder`.

### Changed

-   Upgrade to Android Inquiry SDK 2.8.3.
    
    > #### \[v2.8.3\] - 2023-10-13
    > 
    > #### Added
    > 
    > -   Added ability to override device locale via `.locale(String)` method on `InquiryTemplateBuilder` or `InquiryBuilder`.
    

## \[v2.6.3\] - 2023-10-04

### Fixed

-   Custom clientside iOS animations now default to loop instead of play once.

### Changed

-   Upgrade to Android Inquiry SDK 2.8.2.
    
    > #### \[v2.8.2\] - 2023-10-04
    > 
    > #### Added
    > 
    > -   Added the ability to style buttons in the cancel modal separately from the general step button styles via the server.
    

## \[v2.6.2\] - 2023-09-21

### Changed

-   Upgrade to Xcode 14.3.
    
-   Upgrade to Android Inquiry SDK 2.8.0.
    
    > #### \[v2.8.0\] - 2023-07-20
    > 
    > #### Added
    > 
    > -   Added `.environmentId` on `InquiryTemplateBuilder` to create inquiries with a specific environment token.
    > 
    > #### Changed
    > 
    > -   **Breaking change** Changed `.routingCountry` on `InquiryTemplateBuilder` and `InquiryBuilder` to accept String instead of enum.
    >     -   Before: `.routingCountry(RoutingCountry.DE)` after: `.routingCountry(RoutingCountry.DE.name)`
    > -   **Breaking change** Changed SST colors to parse as format `#RRGGBBAA` instead of `#AARRGGBB`
    >     -   From our audit, this change should not affect any customers. If you are affected by this change, please reach out to your account team.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where the values of hidden fields were being submitted to the inquiry.
    > 
    > #### \[v2.7.2\] - 2023-07-05
    > 
    > #### Fixed
    > 
    > -   Fixed `InquiryActivity` retention leak introduced in `v2.6.0`
    
-   Upgrade to iOS Inquiry SDK 2.12.4.
    
    > #### \[v2.12.4\] - 2023-09-21
    > 
    > #### Added
    > 
    > -   Added ability to override device locale via `.locale(String)` method on `InquiryTemplateBuilder` or `InquiryBuilder`.
    > 
    > #### Fixed
    > 
    > -   Fixed the crash that occurred when utilizing the remote asset for overlay images during the camera capture step for the Government ID.
    > 
    > #### \[v2.12.3\] - 2023-09-18
    > 
    > #### Fixed
    > 
    > -   Addressed an issue affecting barcode extraction rates in some cases.
    > -   Fixed a networking error when using Xcode 15.
    > 
    > #### Changed
    > 
    > -   The popover alert window for govID and document would appear in the middle for iPad, no changes for iPhone
    > -   Changed the address input to appear as a single text field initially that can be expanded by the user.
    > 
    > #### \[v2.12.2\] - 2023-09-01
    > 
    > #### Changed
    > 
    > -   Now returning `PersonaError.rateLimitExceeded` instead of `PersonaError.networking` to `InquiryDelegate.inquiryError` when API quotas have been exceeded.
    > 
    > #### \[v2.12.1\] - 2023-08-24
    > 
    > #### Changed
    > 
    > -   No longer include `CHANGELOG.md` (16kb) in our SDK target.
    > -   No longer including `PhoneNumberMetadata.json` (310kb) in our SDK target.
    > 
    > #### \[v2.12.0\] - 2023-08-18
    > 
    > #### Added
    > 
    > -   Added the ability to color custom SVGs via the server.
    > -   Added the ability to add description texts under radio groups and checkbox input components.
    > 
    > #### Changed
    > 
    > -   Updated ESignature component styling.
    > -   Are now compiling the Persona SDK with Xcode 14.3.
    > -   No longer requiring `NSPhotoLibraryUsageDescription` to access photo library.
    > 
    > #### \[v2.11.0\] - 2023-07-20
    > 
    > #### Added
    > 
    > -   Added `.environmentId` on `InquiryTemplateBuilder` to create inquiries with a specific environment token.
    > 
    > #### Changed
    > 
    > -   **Breaking change** Changed `.routingCountry` on `InquiryTemplateBuilder` and `InquiryBuilder` to accept String instead of enum.
    >     -   Before: `.routingCountry(RoutingCountry.de)` after: `.routingCountry(RoutingCountry.de.rawValue)`
    > -   **Breaking change** Changed SST colors to parse as format `#RRGGBBAA` instead of `#AARRGGBB`
    >     -   From our audit, this change should not affect any customers. If you are affected by this change, please reach out to your account team.
    > 
    > #### Fixed
    > 
    > -   Fixed the evaluation of hidden input components.
    

## \[v2.6.1\] - 2023-06-28

### Changed

-   Upgrade to Android Inquiry SDK 2.7.1

## \[v2.6.0\] - 2023-06-23

### Added

-   Added `.routingCountry` to `InquiryTemplateBuilder` and `InquiryBuilder` to choose which server region inquiry is routed to directly.

### Changed

-   Upgrade to iOS Inquiry SDK 2.10.0
    
    > #### \[v2.10.0\] - 2023-06-22
    > 
    > #### Added
    > 
    > -   Added `.routingCountry` to `InquiryTemplateBuilder` and `InquiryBuilder` to choose which server region inquiry is routed to directly.
    > 
    > #### \[v2.9.1\] - 2023-05-23
    > 
    > #### Added
    > 
    > -   Added a hint on the government id capture screen to notify if the user is not holding the device still.
    > 
    > #### \[v2.9.0\] - 2023-05-23
    > 
    > #### Added
    > 
    > -   Added an experimental feature to allow setting the themeSetId when starting an inquiry. This determines what theme set to read from on the server.
    > -   Added the ability to record and upload video during the selfie and government id flows.
    > -   Added a public method `assetBundle` to InquiryTemplateBuilder to allow setting the bundle from which the SDK retrieves resources. Defaults to Bundle.main.
    > -   Added capture hints to the government id capture screen.
    > -   Added a modal for capture help on the government id capture screen.
    > 
    > #### Changed
    > 
    > -   Changed the default scanning animation on the government id capture screen.
    > -   Now allowing optionals on `InquiryTemplateBuilder` and `InquiryBuilder` methods for convenience.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where the status bar text was not being set to the correct color when using server side theming.
    > -   Fixed spacing on government id select screen when using server side theming.
    > -   Fixed masked input (ssn) fields submission when submitting as masked.
    
-   Upgrade to Android Inquiry SDK 2.7.0
    
    > #### \[v2.7.0\] - 2023-06-22
    > 
    > #### Added
    > 
    > -   Added `.routingCountry` to `InquiryTemplateBuilder` and `InquiryBuilder` to choose which server region the inquiry is routed to directly.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug when passing empty string as `sessionToken` to `InquiryBuilder`.
    > 
    > #### \[v2.6.2\] - 2023-05-23
    > 
    > #### Added
    > 
    > -   Added an experimental feature to allow setting the themeSetId when starting an inquiry. This determines what theme set to read from on the server.
    

## \[v2.5.0\] - 2023-05-17

### Changed

-   Upgrade to iOS Inquiry SDK 2.8.0
    
    > #### \[v2.8.0\] - 2023-04-14
    > 
    > #### Added
    > 
    > -   Added new `InquiryTemplateBuilder` and `InquiryBuilder` to simplify creation of `Inquiry` objects. Acquire a builder with new `Inquiry.from` methods.
    > 
    > #### \[v2.7.4\] - 2023-04-03
    > 
    > #### Added
    > 
    > -   Added support for e-signature components.
    > -   Added functionality to extract text from government documents on the client.
    > 
    > #### Changed
    > 
    > -   Now respecting the property `overrideUserInterfaceStyle` on window or view controller that presents the persona flow.
    > 
    > #### Fixed
    > 
    > -   Fixed a memory leak.
    
-   Upgrade to Android Inquiry SDK 2.6.1
    
    > #### \[v2.6.1\] - 2023-05-16
    > 
    > #### Changed
    > 
    > -   Now setting status bar color to match default background color for initial loading screen.
    > -   Try multiple configurations for video capture if the first configuration doesn’t work.
    > -   Dismiss capture tips screen on back press instead of navigating back.
    > 
    > #### Fixed
    > 
    > -   Fix a possible crash that can occur if using Android Gradle Plugin 8.0.0 on Android 13.
    > -   Fix a rare crash with video capture.
    > -   Fix a layout bug with margins on input date select components.
    > 
    > #### \[v2.6.0\]
    > 
    > #### Changed
    > 
    > -   **UI UPDATES: GOVERNMENT ID CAMERA CAPTURE SCREEN** We’ve changed the animation that plays on the screen where the user is asked to take a photo of their government ID. The previous animation featured a line sweeping back and forth, horizontally. This animation has been replaced with a more subtle sweeping animation around the border of the camera preview frame. The new animation is designed to be performant and distraction-free. It is rendered with custom code for better performance. We’ve also added a button to the government id capture screen that displays capture tips when tapped. This change was made to improve the quality of photos captured by the user. If you have any questions about these changes, please reach out to your CSM.
    > 
    > #### Fixed
    > 
    > -   Fixed a rare native library crash where the native library could not be found due to an
    > 
    > #### \[v2.5.1\] - 2023-04-06
    > 
    > #### Changed
    > 
    > -   Update dependencies.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug that would cause government id steps to trigger auto capture immediately if auto capture is disabled.
    > 
    > #### \[v2.5.0\] - 2023-04-03
    > 
    > #### Added
    > 
    > -   Added the ability to load static templates from bundled json files. This can be accessed with the fromStaticTemplate(staticInquiryTemplate: StaticInquiryTemplate) function. Note that this is currently an experimental feature.
    > -   Added support for inquiries that require video capture.
    > -   Added functionality to extract text from government documents on the client.
    > 
    > #### Changed
    > 
    > -   Upgrade Lottie to 6.0.0.
    > 
    > #### Fixed
    > 
    > -   Fixed a crash that could occur when we failed to open a network connection for remote animation assets.
    > 
    > #### \[v2.4.1\] - 2023-03-29
    > 
    > #### Fixed
    > 
    > -   Return InquiryResponse.Cancel instead of InquiryResponse.Error if the SDK was killed due to an activity starting in a new task. Eg. an activity started with the `singleTask` flag.
    

## \[v2.4.4\] - 2023-03-08

### Changed

-   Upgrade to iOS Inquiry SDK 2.7.3
    
    > #### \[v2.7.3\] - 2023-03-08
    > 
    > #### Fixed
    > 
    > -   Fixed a layout bug that caused some texts to not render on iOS 14.
    

## \[v2.4.3\] - 2023-03-06

### Changed

-   Upgrade to iOS Inquiry SDK 2.7.2
    
    > #### \[v2.7.2\] - 2023-03-06
    > 
    > #### Fixed
    > 
    > -   Fixed a networking error.
    > 
    > #### Removed
    > 
    > -   Removed vendorized JsonLogic types from our public interface.
    

## \[v2.4.2\] - 2023-03-02

### Changed

-   Upgrade to iOS Inquiry SDK 2.7.1
    
    > #### \[v2.7.1\] - 2023-03-02
    > 
    > #### Fixed
    > 
    > -   Fixed an issue with app store connect rejecting our framework for usage of `CIFalseColor.inputImage`.
    > 
    > #### Removed
    > 
    > -   Removed the dismiss button on permission info modal after App Store Rejection from Apple. Per Apple, “A message appears before the permission request, and the user can close the message and delay the permission request with the “Don’t Enable” button. The user should always proceed to the permission request after the message.”
    

### Fixed

-   Fixed an iOS compiler bug that prevented our module from linking on select architectures (rosetta simulator and physical devices).

## \[v2.4.1\] - 2023-02-27

### Changed

-   No longer enforcing `use_frameworks!` requirement for iOS / Cocoapods, allowing RNPersonaInquiry2 to compile as a dynamic framework within cocoapods. This breaks support for Cocoapods 1.9.3.

## \[v2.4.0\] - 2023-02-24

### Changed

-   Upgrade to iOS Inquiry SDK 2.7.0
    
    > #### \[v2.7.0\] - 2023-02-22
    > 
    > #### Changed
    > 
    > -   Deprecated the `InquiryTheme()` constructor. The `InquiryTheme(themeSource: ThemeSource)` constructor should be used instead. Pass in `.server` to use theming set in the Persona Dashboard. Pass in `.client` to keep current behavior that uses the client side theming api. Note that `.client` is also marked as deprecated.
    
-   Upgrade to Android Inquiry SDK 2.4.0
    
    > #### \[v2.4.0\] - 2023-02-22
    > 
    > #### Changed
    > 
    > -   Deprecated the `theme(@StyleRes theme: Int)` function. `theme(themeSource: ThemeSource)` should be used instead. Pass in `ServerThemeSource(@StyleRes theme: Int)` to use theming set in the Persona Dashboard. Pass in `ClientThemeSource(theme: Int)` with your current client theme id to keep the current behavior that only uses client side theming. Note that `ClientThemeSource` is also marked as deprecated.
    
-   Deprecated the `iosTheme(themeObject: Object)` functions. The `iosThemeToUse(themeObject: Object, themeSource: ThemeSource)` functions should be used instead. Pass in a themeSource of `ThemeSource.SERVER` to use theming set in the Persona Dashboard. Pass in `ThemeSource.CLIENT` to keep current behavior that uses the client. Note that `ThemeSource.CLIENT` is also marked as deprecated. Also note that the Android theme source will be derived from this ThemeSource as well. If iosTheme is called instead of iosThemeToUse, `ThemeSource.Client` will be used. If neither iosThemeToUse nor iosTheme is called, `ThemeSource.SERVER` will be used by default. The themeObject can still be used to control certain properties like the initial loading icon even when the theme source is set to `ThemeSource.SERVER`.
    

## \[v2.3.0\] - 2023-02-16

### Added

-   Added optional support to receive data collected during inquiry flow on completion.

### Changed

-   Upgrade to iOS Inquiry SDK 2.6.2
    
    > #### \[v2.6.2\] - 2023-02-14
    > 
    > #### Fixed
    > 
    > -   Fixed a weak retention issue that could result in extra callbacks of `inquiryError`
    > 
    > #### \[v2.6.1\] - 2023-02-13
    > 
    > #### Fixed
    > 
    > -   Fixed buttons inside footer on ui steps will now disable properly after being tapped.
    > 
    > #### \[v2.6.0\] - 2023-02-10
    > 
    > #### Added
    > 
    > -   Added an optional client side callback to return the data collected during the inquiry flow to the host application.
    > 
    > #### Fixed
    > 
    > -   Remote image assets now match Android / Web loading behavior and height.
    > -   Selfie flow on iOS Simulator no longer allows you to mash the shutter button and produce a network error.
    
-   Upgrade to Android Inquiry SDK 2.3.6
    
    > #### \[v2.3.6\] - 2023-02-13
    > 
    > #### Added
    > 
    > -   Added welsh translations.
    > -   Added titles to camera permission modals.
    > 
    > #### Changed
    > 
    > -   Update dependencies.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where images could sometimes be cut-off if the value sent from the server was too large.
    

## \[v2.2.30\] - 2023-01-25

### Changed

-   Upgrade to iOS Inquiry SDK 2.5.11
    
    > #### \[v2.5.11\] - 2023-01-25
    > 
    > #### Added
    > 
    > -   Added support for input radio group components.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where some camera feeds were not showing previews.
    > 
    > #### \[v2.5.10\] - 2023-01-12
    > 
    > #### Added
    > 
    > -   Added optional parameter, `animated`, to `Inquiry.start()` to disable the presentation and dismiss animation when launching the persona flow.
    > 
    > #### Changed
    > 
    > -   Users will receive an error message when sdk fails to load a photo during document flow instead of flow resulting in an error.
    > 
    > #### Fixed
    > 
    > -   Improved camera focus for iPhone 13 and 14 Pro / Pro max devices.
    > -   Now requesting camera permission prior to launching document scanner during document flow.
    > 
    > #### \[v2.5.9\] - 2023-01-10
    > 
    > #### Added
    > 
    > -   Added support for Welsh.
    > 
    > #### Fixed
    > 
    > -   Fixed a crash on iOS 15 related to usage of Realm.
    > 
    > #### \[v2.5.8\] - 2023-01-10
    > 
    > #### Fixed
    > 
    > -   Fixed a bug with some government id image uploads.
    > -   Added better error handling when the dimensions of the uploaded government id are not accepted by the server.
    > 
    > #### \[v2.5.7\] - 2023-01-06
    > 
    > #### Fixed
    > 
    > -   Resuming a document flow will now load existing files
    > -   Fixed various styling and SST properties on document flows
    > 
    > #### \[v2.5.5\] - 2022-12-19
    > 
    > #### Fixed
    > 
    > -   Fixed a bug with checkboxes not applying the correct state.
    
-   Upgrade to Android Inquiry SDK 2.3.5
    
    > #### \[v2.3.5\] - 2023-01-25
    > 
    > #### Fixed
    > 
    > -   Fixed a performance issue with input select bottom sheets that contained a large number of options.
    > -   Expose classes of objects returned by collection mode in the SDK.
    > 
    > #### \[v2.3.4\] - 2023-01-23
    > 
    > #### Fixed
    > 
    > -   Fixed input radio button component titles and prefill behavior.
    > 
    > #### Added
    > 
    > -   Added the ability to use custom processing animations on the document processing screen.
    > -   Added status bar coloring behavior to match the background color of each page automatically when using styles from the server.
    > -   Added collection mode. When enabled, the SDK will return all locally collected data from the inquiry on inquiry completion.
    > -   Added support for radio button components
    > 
    > #### Changed
    > 
    > -   Removed drop shadows from document card previews.
    > 
    > #### \[v2.3.3\] - 2023-01-17
    > 
    > #### Fixed
    > 
    > -   Fixed problems with government id hint capture text alignment and border radii
    > 
    > #### \[v2.3.2\] - 2023-01-12
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where centering vertically on pages wasn’t working.
    > -   Camera feed radii did not match border radii around the feed.
    > -   Apply the correct font family from the server to disclaimer texts on capture steps.
    > -   Fixed broken text alignment when supportsRtl is not set to true in the hosting app manifest.
    > 
    > #### \[v2.3.1\] - 2023-01-10
    > 
    > #### Added
    > 
    > -   Support for various customizations and polish items on document upload steps.
    > 
    > #### Changed
    > 
    > -   Improve handling of certain network errors.
    > -   Document file uploads will now use progress bars instead of loading spinners.
    

## \[v2.2.29\] - 2022-12-15

### Changed

-   Upgrade to iOS Inquiry SDK 2.5.4
    
    > #### \[v2.5.4\] - 2022-12-15
    > 
    > #### Added
    > 
    > -   Added support for server sheet corner radius style.
    
-   Upgrade to Android Inquiry SDK 2.3.0
    
    > #### \[v2.3.0\] - 2022-12-15
    > 
    > #### Changed
    > 
    > -   Make nfc-impl module an extension module that is not include dy default.
    > -   Upgraded minimum SDK to 33.
    > 
    > #### \[v2.2.46\] - 2022-12-01
    > 
    > #### Changed
    > 
    > -   Downgraded minimum SDK from 33.
    

## \[v2.2.28\] - 2022-11-30

### Changed

-   Upgrade to iOS Inquiry SDK 2.5.3
    
    > #### \[v2.5.3\] - 2022-11-30
    > 
    > #### Changed
    > 
    > -   Improved checkbox component UI and styling.
    > 
    > #### \[v2.5.2\] - 2022-11-21
    > 
    > #### Added
    > 
    > -   Added support for government id localization overrides.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where Gov id titles and prompts are not visible.
    > -   Fixed an issue where disabled button text is not visible in dark mode.
    > 
    > #### \[v2.5.1\] - 2022-11-18
    > 
    > #### Added
    > 
    > -   Added support for rendering QR code components.
    > -   Added improved error handling for document verification flows.
    > -   Added support for custom start screens on document verification flows.
    > 
    > #### Changed
    > 
    > -   Removed section indexes from country select when there are few countries.
    
-   Upgrade to Android Inquiry SDK 2.2.45
    
    > #### \[v2.2.45\] - 2022-11-30
    > 
    > #### Added
    > 
    > -   Added some validations for SDK arguments.
    > 
    > #### Fixed
    > 
    > -   Fixed a crash when using split screen mode during the government id flow and the screen is resized.
    > -   Fixed a crash when split screen is enabled and the permission modal is shown.
    > 
    > #### \[v2.2.44\] - 2022-11-18
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where the selfie capture progress bar was too thin.
    > 
    > #### Added
    > 
    > -   Added support for government id localization overrides.
    

## \[v2.2.27\] - 2022-11-16

### Changed

-   Upgrade to iOS Inquiry SDK 2.5.0
    
    > #### \[v2.5.0\] - 2022-11-08
    > 
    > #### Changed
    > 
    > -   Minimum deployment target is now iOS 13.0.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where the processing animations stuttered after the camera feed was closed.
    > 
    > #### Added
    > 
    > -   Added ability to configure margins on input components via the server.
    > -   Added the ability to use custom copy for permissions modals via the server.
    
-   Upgrade to Android Inquiry SDK 2.2.43
    
    > #### \[v2.2.43\] - 2022-11-16
    > 
    > #### Added
    > 
    > -   Added the ability to use custom copy for permissions modals via the server.
    > -   Added support for rendering QR code components.
    > 
    > #### Changed
    > 
    > -   Document verification flow now uploads files prior to submit.
    > -   Improve error logging for certain types of errors.
    > 
    > #### Fixed
    > 
    > -   Fixed lateinit crash on camera screens.
    > -   Fixed a rare network error crash.
    > -   Fixed a crash if activity is killed and resumed while permission modal is shown.
    > -   Fixed an ANR that can occur if permissions are accepted after the activity has been killed and recreated.
    > -   Fixed a bug where input select components would not render correctly if multiple input select components existed on a single screen.
    > 
    > #### \[v2.2.42\] - 2022-11-08
    > 
    > #### Added
    > 
    > -   Added ability to configure margins on input components via the server.
    > -   Added the photo picker as an option when choosing documents to upload.
    > -   Added the ability to render the document combined step start screen as a configurable server driven screen.
    > -   Added improved error handling for document verification flows.
    > 
    > #### Changed
    > 
    > -   Improved accessibility throughout the flows, including talkback, touch target size, and speakable text.
    

## \[v2.2.26\] - 2022-10-20

### Changed

-   Upgrade to iOS Inquiry SDK 2.4.3
    
    > #### \[v2.4.3\] - 2022-10-20
    > 
    > #### Added
    > 
    > -   Added support for customizing cancel modal texts via the server.
    
-   Upgrade to Android Inquiry SDK 2.2.41
    
    > #### \[v2.2.41\] - 2022-10-19
    > 
    > #### Added
    > 
    > -   Added support for styling image preview borders in document flows.
    > -   Added support for customizing cancel modal texts via the server.
    > 
    > #### Changed
    > 
    > -   Update dependencies.
    > -   Input Select component now has sticky header and blocks clicks on background components.
    > 
    > #### Fixed
    > 
    > -   Don’t allow buttons to run up against the edge of the screen when using margins from the server.
    

## \[v2.2.25\] - 2022-10-06

### Changed

-   Upgrade to iOS Inquiry SDK 2.4.2
    
    > #### \[v2.4.2\] - 2022-09-30
    > 
    > #### Added
    > 
    > -   Added the ability to style the upload government id flow via the server.
    > -   Added support for json logic for hiding and disabling various ui components.
    > -   Added the ability to use mDLs in the SDK.
    > -   Added public logging for load times.
    > 
    > #### Changed
    > 
    > -   Relaxed blur detection on government id autocapture for pro max devices.
    > 
    > #### Fixed
    > 
    > -   Auto-capture during selfie flow will now pause while user is presented with cancel modal.
    > 
    > #### \[v2.4.1\] - 2022-09-23
    > 
    > #### Changed
    > 
    > -   Moved the Sandbox force verification pass/fail menu to top of screen and added the button to camera screens.
    > -   Now surfacing clearer error message when invalid `fields` value is supplied on `InquiryConfiguration`.
    > 
    > #### Added
    > 
    > -   Added support for number only input components in UI steps.
    > 
    > #### Fixed
    > 
    > -   No longer crashing after a user selects a country with no supported id types.
    
-   Upgrade to Android Inquiry SDK 2.2.40
    
    > #### \[v2.2.40\] - 2022-10-04
    > 
    > #### Changed
    > 
    > -   Make sure that there is always a minimum built in margin on the selfie start screen page.
    > 
    > #### \[v2.2.39\] - 2022-09-29
    > 
    > #### Fixed
    > 
    > -   Removed shadow on primary material buttons when using server side theming.
    > 
    > #### \[v2.2.38\] - 2022-09-29
    > 
    > #### Added
    > 
    > -   Added support for checkbox components in UI steps.
    > -   Added support for number only input components in UI steps.
    > -   Added support for theming the government id upload flow via the server.
    > 
    > #### Changed
    > 
    > -   Now surfacing clearer error message when invalid `fields` are included on the InquiryBuilder.
    > -   Update dependencies.
    > 
    > #### Fixed
    > 
    > -   Fixed issues where IO streams were not closed after use.
    > -   Added support for the ‘disabled’ field which some components use.
    > -   Fixed a bug where date inputs were not disabled while submitting information.
    > -   Fixed some minor layout issues on UI steps.
    > -   Fixed a line wrapping issue for the month field on date inputs.
    > -   Fixed placeholders for address components when country code is not `US`.
    > -   Fixed some layout issues when errors were shown on input fields.
    

## \[v2.2.24\] - 2022-09-22

### Changed

-   Upgrade to iOS Inquiry SDK 2.4.0
    
    > #### \[v2.4.0\] - 2022-09-15
    > 
    > #### Changed
    > 
    > -   Now building the SDK with Xcode 14 in order to make use of iOS 16 features.
    > 
    > #### Added
    > 
    > -   Added the ability to style footer components as a bottom presented sheet.
    > 
    > #### Removed
    > 
    > -   Removed camera icon from camera permissions modal to be more consistent with other Persona modals.
    
-   Upgrade to Android Inquiry SDK 2.2.37
    
    > #### \[v2.2.37\] - 2022-09-13
    > 
    > #### Added
    > 
    > -   Added the ability to style footer components as a bottom presented sheet.
    > -   Added support for the ‘hidden’ field which some components use.
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where buttons were not getting paddings from the server properly applied.
    > -   Fixed an issue where buttons on the final complete screen were being added to footers incorrectly.
    > -   Fixed an issue where date input does not display error.
    > -   Fixed a crash when using custom styled buttons on API 21.
    

## \[v2.2.23\] - 2022-09-07

### Changed

-   Upgrade to iOS Inquiry SDK 2.3.9
    
    > #### \[v2.3.9\] - 2022-09-02
    > 
    > #### Fixed
    > 
    > -   Fixed a bug in the success checkmark animation so that it shows all 8 of the radiating dots around the check instead of just one.
    > -   Fixed address component validations.
    > 
    > #### Changed
    > 
    > -   Render the error text on input select components as red when we have other styles coming from the server.
    > 
    > #### \[v2.3.8\] - 2022-08-30
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where the new processing animation was not being fully configured by colors from the server.
    > -   Fixed a bug with hyperlinks not being tappable.
    > 
    > #### \[v2.3.7\] - 2022-08-26
    > 
    > #### Changed
    > 
    > -   Auto-submit confirmation code after it has been typed in.
    > 
    > #### Added
    > 
    > -   Added the ability to render the government id select screen as a more granularly configurable page type.
    
-   Upgrade to Android Inquiry SDK 2.2.36
    
    > #### \[v2.2.36\] - 2022-09-06
    > 
    > #### Fixed
    > 
    > -   Added padding to branding elements to prevent run-up against the edge of the screen.
    > -   Fixed validation on address input.
    > -   Fixed location of disclaimer on government id camera screens.
    > 
    > #### \[v2.2.35\] - 2022-09-01
    > 
    > #### Fixed
    > 
    > -   Fixed an issue where submit buttons in footer components could get into a state where they appear to spin forever.
    > -   Fixed an issue where nested vertical stacks within UI steps would not render properly.
    > 
    > #### \[v2.2.34\] - 2022-08-30
    > 
    > #### Fixed
    > 
    > -   Fixed a crash when custom text attributes are set on the overlay hint of the government ID capture screen.
    > 
    > #### \[v2.2.33\] - 2022-08-30
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where background images and colors wouldn’t stretch to fill the screen.
    > 
    > #### \[v2.2.32\] - 2022-08-29
    > 
    > #### Changed
    > 
    > -   Autosubmit confirmation code after it has been typed in.
    > -   Confirmation code fields now paste properly and align with expected behavior when deleting and changing numbers.
    > -   Give a default margin of 24dp to footers
    > 
    > #### Fixed
    > 
    > -   Fixed a crash related to lottie.
    > -   Fixed text layouts when the device is set to render large font sizes for accessibility.
    > -   Fixed a bug that caused inquiries which contained back-to-back combined steps of the same type to hang.
    

## \[v2.2.22\] - 2022-08-25

### Changed

-   Upgrade to iOS Inquiry SDK 2.3.6
    
    > #### \[v2.3.6\] - 2022-08-18
    > 
    > #### Changed
    > 
    > -   Processing and loading screens have been aligned to center of screen.
    > -   Selfie completion animation now plays when using static assets.
    > 
    > #### Added
    > 
    > -   Added the ability to style processing screen text elements via the server.
    
-   Upgrade to Android Inquiry SDK 2.2.31
    
    > #### \[v2.2.31\] - 2022-08-22
    > 
    > #### Added
    > 
    > -   Added the ability to render the government id select screen as a more granularly configurable page type
    > -   Added the ability to style processing screen text elements via the server
    > 
    > #### Fixed
    > 
    > -   Fix a bug where text fields will not retain their state on activity recreate.
    > -   Fix a bug where cursor will jump to the front in text fields on text input.
    > 
    > #### Changed
    > 
    > -   Downgrade dependency on bouncy castle from jdk18on to jdk15to18.
    

## \[v2.2.21\] - 2022-08-18

### Fixed

-   Fixed a bug where the inquiry flow failed to present on iOS

## \[v2.2.20\] - 2022-08-15

### Changed

-   Upgrade to iOS Inquiry SDK 2.3.5
    
    > #### \[v2.3.5\] - 2022-08-15
    > 
    > #### Changed
    > 
    > -   Default assets for government id, selfie, and document processing animations have been updated.
    > 
    > #### Removed
    > 
    > -   Removed unused ‘Try again’ button after users have denied permissions for the camera.
    
-   Upgrade to Android Inquiry SDK 2.2.30
    
    > #### \[v2.2.30\] - 2022-08-15
    > 
    > #### Fixed
    > 
    > -   Workaround an Android 12 bugs where requesting permissions can cause a memory leak.
    > -   Fix a crash that would occur when a selfie/government id flow is launched on a device has no cameras.
    > 
    > #### Changed
    > 
    > -   Keep screen on camera capture screens.
    > -   Default assets for government id, selfie, and document processing animations have been updated.
    > -   Permission request popup has been moved for the government ID step. It was moved from the ID select screen to the camera capture screen.
    

## \[v2.2.19\] - 2022-08-02

### Changed

-   Upgrade to iOS Inquiry SDK 2.3.4
    
    > #### \[v2.3.4\] - 2022-08-02
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where existing document previews were vanishing after deleting a different document.
    > -   Fixed a layout issue on the selfie start page where text would not be shown correctly when the device screen wasn’t large enough to show all of the content.
    > 
    > #### \[v2.3.3\] - 2022-07-29
    > 
    > #### Added
    > 
    > -   Added the ability to control page level vertical alignment via the server.
    > -   Added the ability to style buttons on the government id capture page via the server.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where document previews were not showing when the chosen file was a PDF.
    > -   Fixed a bug where government id capture page instructions were not respecting alignment coming from the server.
    
-   Upgrade to Android Inquiry SDK 2.2.29
    
    > #### \[v2.2.29\] - 2022-07-29
    > 
    > #### Added
    > 
    > -   Added the ability to control page level vertical alignment via the server.
    > -   Added the ability to style buttons on the government id capture page via the server.
    > 
    > #### Fixed
    > 
    > -   Fixed an animation bug on small screens on the review captured image screen.
    > -   Swapped the order of the buttons on the permission request bottom sheet to be consistent with Android standards.
    > -   Fixed an issue where you couldn’t resume inquiries created in sandbox mode and have the pass/fail toggle show up.
    

## \[v2.2.18\] - 2022-07-27

### Changed

-   Upgrade to iOS Inquiry SDK 2.3.2
    
    > #### \[v2.3.2\] - 2022-07-18
    > 
    > #### Added
    > 
    > -   Added the following theme property:
    > -   `initialLoadingBackgroundImage`
    > -   Added support for skipping the selfie start page.
    > 
    > #### Changed
    > 
    > -   The color set for backgroundColor on the theme now applies to the initial loading screen.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where new selfie animations where not using server side theming colors (again).
    

## \[v2.2.17\] - 2022-07-19

### Changed

-   Upgrade to Android Inquiry SDK 2.2.28
    
    > #### \[v2.2.28\] - 2022-07-19
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where buttons were not being properly aligned when a loading indicator is built into the button.
    > 
    > #### \[v2.2.27\] - 2022-07-18
    > 
    > #### Added
    > 
    > -   Support configuration to skip the instructions screen for selfie capture.
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where the government ID step will send the wrong parameters to the server in certain edge cases.
    

## \[v2.2.16\] - 2022-07-14

### Added

-   Added various iOS theming property wrappers to the persona-tool

### Changed

-   Upgrade to Android Inquiry SDK 2.2.26
    
    > #### \[v2.2.26\] - 2022-07-08
    > 
    > #### Added
    > 
    > -   Added the following theme property:
    >     -   `personaInitialLoadingBackgroundDrawable`
    > -   Added animations when transitioning between screens
    > 
    > #### Changed
    > 
    > -   Improve barcode scanning to detect barcodes faster
    > -   Removed loading screens when navigating back
    > -   Update dependencies
    

## \[v2.2.15\] - 2022-07-01

### Fixed

-   Fixed iOS compiler error

## \[v2.2.14\] - 2022-06-30

### Changed

-   Upgrade to iOS Inquiry SDK 2.3.1
    
    > #### \[v2.3.1\] - 2022-06-30
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where new selfie animations where not using server side theming colors.
    > -   Fixed a bug where selfie consent text was not using appropriate styles.
    

## \[v2.2.13\] - 2022-06-27

### Changed

-   Upgrade to Android Inquiry SDK 2.2.25
    
    > #### \[v2.2.25\] - 2022-06-27
    > 
    > #### Changed
    > 
    > -   When transitioning to the next step, show a progress bar embedded into the action button as opposed to showing a full screen progress bar.
    > 
    > #### Fixed
    > 
    > -   Fix a crash for the document select step when a selected document cannot be opened.
    > -   Fix a bug that caused the government ID step to upload one more photo than necessary.
    > -   Made lottie animation loading more resilient.
    

## \[v2.2.12\] - 2022-06-15

### Changed

-   Upgrade to iOS Inquiry SDK 2.3.0
    
    > #### \[v2.3.0\] - 2022-06-15
    > 
    > #### Added
    > 
    > -   Added the IDFV to request headers ([https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor))
    > -   Added the following theme property:
    >     -   `selfieCountdownFont`
    > -   Added the ability to load custom assets locally on ui steps via dynamic asset names coming from the server.
    > 
    > #### Changed
    > 
    > -   Match camera feed edge radius and hint box radius to the radius of the capture feed border.
    > 
    > **UI UPDATES: SELFIE CAMERA CAPTURE SCREEN**
    > 
    > We’ve made updates to the selfie verification flow to help reduce blurry and repeat pose captures. You’ll notice the following changes to the selfie verification flow:
    > 
    > -   New selfie animation includes an arrow that points users in the direction they should look for left and right pose capture.
    >     
    > -   Auto-capture is delayed for left and right pose until each animation plays. In addition, user will be able to clearly preview selfie during capture (blur overlay removed).
    >     
    > 
    > If you have any questions about these changes, please reach out to your CSM.
    > 
    > #### Fixed
    > 
    > -   Fixed bug where selfie blur overlay would show up solid black when Reduce Transparency was enabled.
    > -   Fixed bug where selfie circle animation was not using the correct frame.
    > 
    > #### \[v2.2.13\] - 2022-05-26
    > 
    > #### Added
    > 
    > -   Added the ability to render markdown in body texts and titles.
    
-   Upgrade to Android Inquiry SDK 2.2.24
    
    > #### \[v2.2.24\] - 2022-06-15
    > 
    > #### Fixed
    > 
    > -   Confirm back press when users press the back button on transition/load screens.
    > -   Disable submit button on document select screen if no documents are selected.
    > -   Show an icon for PDF documents selected for the document verification step.
    > 
    > #### Added
    > 
    > -   Added a hint shadow that indicates when there is more content to be scrolled.
    > -   Added the app set ID to request headers ([https://developer.android.com/training/articles/app-set-id](https://developer.android.com/training/articles/app-set-id))
    > 
    > #### Changed
    > 
    > -   Match camera feed edge radius and hint box radius to the radius of the capture feed border.
    > -   Updated the implementation of government id auto capture to allow server configurability.
    > -   Update dependencies
    > -   Limit polling for inquiry status update to 90 seconds. Previously there was no time limit.
    > -   Update the network write timeout to 1 minute. Previously this was 10 seconds.
    

## \[v2.2.11\] - 2022-05-25

### Changed

-   Upgrade to Android Inquiry SDK 2.2.23
    
    > #### \[v2.2.23\] - 2022-05-24
    > 
    > #### Added
    > 
    > -   Added support for the following `InquiryField` types: `date`, `datetime`, `float`
    > 
    > #### Changed
    > 
    > -   Change the government ID select screen to be configurable by the server
    > -   Update dependencies
    > -   Depend on Kotlin 1.6.10
    > 
    > #### \[v2.2.22\] - 2022-05-20
    > 
    > #### Fixed
    > 
    > -   Disable back action for government id flows without a back step
    > -   Improve handling of network errors
    

### Fixed

-   Passed through Inquiry Fields that weren’t getting sent to the server

## \[v2.2.10\] - 2022-05-17

### Changed

-   Upgrade to iOS Inquiry SDK 2.2.12
    
    > #### \[v2.2.12\] - 2022-05-16
    > 
    > #### Changed
    > 
    > -   Network requests are now more resilient to connectivity errors and certain server errors are now recoverable.
    
-   Upgrade to Android Inquiry SDK 2.2.21
    
    > #### \[v2.2.21\] - 2022-05-16
    > 
    > #### Changed
    > 
    > -   Make the number of images captured for the government id step configurable by the server
    > -   Make the manual capture button delay for the government id step configurable by the server
    > -   Update the image shown when there was an error verifying the back side of a government id
    > 
    > #### \[v2.2.20\] - 2022-05-06
    > 
    > #### Changed
    > 
    > -   Allow users to retry navigating between certain steps on recoverable network errors
    > -   Allow users to retry uploading government id/document files
    > -   Improve network calls so they are more resilient
    > -   Update dependency of Coil from 0.12.0 to 2.0.0-rc03
    > 
    > #### Fixed
    > 
    > -   Display errors on input fields when there is a user input error
    > -   Fix flickering of image/document previews in rare cases.
    > 
    > #### \[v2.2.19\] - 2022-04-29
    > 
    > #### Fixed
    > 
    > -   Fix the resolution of font names when loading custom font families in texts
    > 
    > #### \[v2.2.18\] - 2022-04-27
    > 
    > #### Changed
    > 
    > -   Handle more types of network errors
    > 
    > #### \[v2.2.17\] - 2022-04-22
    > 
    > #### Changed
    > 
    > -   Make the clickable area of the back and close button slightly bigger
    > 
    > #### Fixed
    > 
    > -   Fix a race condition crash on the inquiry success screen
    

## \[v2.2.9\] - 2022-04-20

### Changed

-   Upgrade to iOS Inquiry SDK 2.2.11
    
    > #### \[v2.2.11\] - 2022-04-20
    > 
    > #### Added
    > 
    > -   Added the ability to render markdown in the selfie step disclaimer.
    
-   Upgrade to Android Inquiry SDK 2.2.16
    
    > #### \[v2.2.16\] - 2022-04-20
    > 
    > #### Added
    > 
    > -   Added the ability to render markdown on selfie step disclosure text
    > 
    > #### \[v2.2.15\] - 2022-04-13
    > 
    > #### Removed
    > 
    > -   The following string resources have been removed, their values are now supplied by the server:
    >     -   `pi2_selfie_hold_still`
    

## \[v2.2.8\] - 2022-04-06

### Changed

-   Upgrade to iOS Inquiry SDK 2.2.10
    
    > #### \[v2.2.10\] - 2022-04-04
    > 
    > #### Added
    > 
    > -   Added the following theme property: `centerAlignRemoteAsset`.
    > 
    > #### Changed
    > 
    > -   The loading icon for initial inquiry load has been changed to a neutral grey spinner.
    > -   Removed the done button on the country select bottom sheet. Tapping a country now selects that country and dismisses the sheet automatically. This mirrors the experience on the android sdk.
    > 
    > #### Fixed
    > 
    > -   The correct color is applied to images on disabled buttons.
    
-   Upgrade to Android Inquiry SDK 2.2.14
    
    > #### \[v2.2.14\] - 2022-04-04
    > 
    > #### Added
    > 
    > -   Added the following style attribute: `personaCenterAlignRemoteAsset`
    > 
    > #### Fixed
    > 
    > -   Handle 404s more gracefully
    

## \[v2.2.7\] - 2022-04-02

### Changed

-   Upgrade to iOS Inquiry SDK 2.2.9
    
    > #### \[v2.2.9\] - 2022-03-29
    > 
    > #### Fixed
    > 
    > -   No longer returning a status value of “unknown” for `inquiryComplete`.
    
-   Upgrade to Android Inquiry SDK 2.2.13
    
    > #### \[v2.2.13\] - 2022-03-30
    > 
    > #### Changed
    > 
    > -   Skip government ID select screen if only one ID class is available
    > -   The loading icon for initial inquiry load has been changed to a neutral grey spinner
    > 
    > #### Fixed
    > 
    > -   Allow for server-defined images to have nullable widths/heights without crashing
    > 
    > #### \[v2.2.12\] - 2022-03-24
    > 
    > #### Changed
    > 
    > -   Selfie manual capture button for the center pose now triggers a capture immediately for behavior consistency. Previously it would trigger a countdown instead.
    > 
    > #### Fixed
    > 
    > -   Show users the manual capture button immediately if auto capture cannot be performed on the device
    > -   Recover from camera related errors more gracefully, allow users to retake photos on error
    

## \[v2.2.6\] - 2022-03-28

### Changed

-   Upgrade to iOS Inquiry SDK 2.2.8
    
    > #### \[v2.2.8\] - 2022-03-16
    > 
    > #### Changed
    > 
    > -   Transitive dependencies have been namespaced to avoid runtime symbol collisions.
    > 
    > #### \[v2.2.7\] - 2022-03-14
    > 
    > #### Fixed
    > 
    > -   Dynamic screens use `titleTextAlignment` and `bodyTextAlignment` theme properties again.
    > -   Custom animation assets now properly use `loopMode` on selfie start.
    > 
    > #### Removed
    > 
    > -   No longer showing a failure screen when client side errors occur.
    
-   Upgrade to Android Inquiry SDK 2.2.11
    
    > #### \[v2.2.11\] - 2022-03-22
    > 
    > #### Changed
    > 
    > -   Government id list items now use `textAppearanceListItem` instead of `textAppearanceSubtitle1`
    > -   Selfie capture animations are now customizable via `personaSelfieLookLeftLottieRaw` and `personaSelfieLookRightLottieRaw`
    > -   When a static image (drawable) is set instead of a Lottie animation via `personaSelfieLookLeftDrawable` and `personaSelfieLookRightDrawable`, the animation will not play. Instead, the given static image will be used instead.
    > 
    > #### Fixed
    > 
    > -   Respect the values of `personaSelfieLookLeftDrawable` and `personaSelfieLookRightDrawable`
    > -   Prevent buttons from overlapping with UI elements on government ID flow
    > 
    > #### \[v2.2.10\] - 2022-03-16
    > 
    > #### Changed
    > 
    > -   Various animations and drawables are more themeable
    > 
    > **UI UPDATES: SELFIE CAMERA CAPTURE SCREEN**
    > 
    > We’ve made updates to the selfie verification flow to help reduce blurry and repeat pose captures. You’ll notice the following changes to the selfie verification flow:
    > 
    > -   New selfie animation includes an arrow that points users in the direction they should look for left and right pose capture.
    >     
    > -   Auto-capture is delayed for left and right pose until each animation plays. In addition, user will be able to clearly preview selfie during capture (blur overlay removed).
    >     
    > 
    > If you have any questions about these changes, please reach out to your CSM.
    > 
    > #### Fixed
    > 
    > -   Reduce flickering due to re-layouts during first render pass
    > -   Title/body text fields can now honor `android:textAlignment` properly
    > -   Improve government ID capture’s user experience on lower end devices; make UI more responsive
    > -   Improve the capture speed of government ID auto capture and manual capture
    

## \[v2.2.5\] - 2022-03-22

### Fixed

-   Point the type definition to the correct file

## \[v2.2.4\] - 2022-03-07

### Changed

-   Upgrade to Android Inquiry SDK 2.2.9
    
    > #### \[v2.2.9\] - 2022-03-07
    > 
    > #### Added
    > 
    > -   Show a (hide-able) cancel “X” on every non-loading screen to match iOS and web
    > -   Added support for upload option with government id verification
    > 
    > #### Changed
    > 
    > -   Buttons on government id review screen will flow vertically when text is more than one line
    > -   Update the cancel sheet’s copy
    > 
    > #### Fixed
    > 
    > -   Fix compatibility issues with Lottie 5.0+
    > -   Fix layout on government id select screen when no back button is shown
    > -   Fix back button on government id review screen
    
-   Upgrade to iOS Inquiry SDK 2.2.6
    
    > #### \[v2.2.6\] - 2022-03-07
    > 
    > #### Added
    > 
    > -   Added option for uploading a government ID from the file system.
    >     
    > -   Added improved face detection for government id autocapture.
    >     
    > -   Added support for optional cancel buttons.
    >     
    > -   Following strings have been added to `Persona.strings`
    >     
    >     -   `cancelTitle`
    >     -   `cancelBody`
    >     -   `cancelResumeButton`
    >     -   `cancelConfirmButton`
    > 
    > #### Fixed
    > 
    > -   Fixed back button not appearing on dynamic ui screens.
    > -   Fixed a crash when capturing on old devices.
    > -   Fixed layout for government id select disclaimer text.
    > 
    > #### \[v2.2.5\] - 2022-03-01
    > 
    > #### Changed
    > 
    > -   Selfie camera hint style has changed to be consistent with Android.
    > 
    > #### Fixed
    > 
    > -   Fixed government id captures cropping too close to the bottom of the id.
    

## \[v2.2.3\] - 2022-03-02

### Fixed

-   Re-added `persona-tool` which was removed by accident in a refactor

## \[v2.2.2\] - 2022-02-24

### Changed

-   Upgrade to Android Inquiry SDK 2.2.8
    
    > #### \[v2.2.8\] - 2022-02-24
    > 
    > #### Added
    > 
    > -   Added support for custom government id scanning lottie animation
    > -   Added support for custom selfie look left and look right drawable
    > 
    > #### \[v2.2.7\] - 2022-02-22
    > 
    > #### Added
    > 
    > -   Added support for custom government id overlays and hint animations
    > 
    > #### Fixed
    > 
    > -   Allow “center-only” selfie experiences to pass
    > -   Fixed crash in government id
    
-   Upgrade to iOS Inquiry SDK 2.2.4
    
    > #### \[v2.2.4\] - 2022-02-24
    > 
    > #### Added
    > 
    > -   Added the following theme properties:
    >     
    >     -   `governmentIdOverlayGenericFrontImage`
    >     -   `governmentIdOverlayBarcodeImage`
    >     -   `governmentIdOverlayMrzImage`
    >     -   `selfieStartScreenHeaderIcon`
    > 
    > #### Removed
    > 
    > -   Following strings have been removed from `Persona.strings`
    >     
    >     -   `selfieSubmittingTitle`
    >     -   `selfieSubmittingBody`
    >     -   `governmentIdSubmittingTitle`
    >     -   `governmentIdSubmittingBody`
    

## \[v2.2.1\] - 2022-02-17

### Changed

-   Upgrade to Android Inquiry SDK 2.2.6
    
    > #### \[v2.2.6\] - 2022-02-16
    > 
    > #### Added
    > 
    > -   Various theme attributes have been added
    > 
    > #### Changed
    > 
    > -   Default alignment of ui step screens
    > -   Country select now presents a bottom sheet instead of a dropdown
    > 
    > #### \[v2.2.5\] - 2022-02-11
    > 
    > #### Added
    > 
    > -   Auto-capture for center pose selfies
    >     
    > -   Support for additional government IDs
    >     
    >     -   Citizenship Certificate
    >     -   Consular ID
    >     -   Foreigner ID
    >     -   Health Insurance Card
    >     -   Long Term Pass
    >     -   National Bureau of Investigation Certificate
    >     -   Permanant Account Number card (SSN)
    > 
    > #### Changed
    > 
    > -   Autofocus first input field on page load
    > -   Only allow digits (0-9) in day/month input fields
    
-   Upgrade to iOS Inquiry SDK 2.2.3
    
    > #### \[v2.2.3\] - 2022-02-16
    > 
    > #### Added
    > 
    > -   Support for dark mode.
    > 
    > #### Fixed
    > 
    > -   Improved blur detection during government id auto-capture.
    

### Added

-   Expose underlying Android/iOS SDK version with `#nativeSdkVersion`
-   Add `#fromInquiry`, `#fromTemplate`, and `#fromTemplateVersion` static methods to `Inquiry`

### Deprecated

-   Deprecate the default namespace and it’s methods: `#fromInquiry`, `#fromTemplate`, and `#fromTemplateVersion`

## \[v2.2.0\] - 2022-02-16

### Changed

-   Upgrade to iOS Inquiry SDK 2.2.2
    
    > #### \[v2.2.2\] - 2022-02-10
    > 
    > #### Added
    > 
    > -   Added the following theme properties:
    >     -   `tableViewChevronColor`
    > -   Added `build` method to `InquiryConfiguration` to build a config from all possible parameters.
    > 
    > #### Fixed
    > 
    > -   Theme property `governmentIdHintBackgroundColor` is now properly used.
    > 
    > #### \[v2.2.1\] - 2022-02-08
    > 
    > #### Added
    > 
    > -   Added support for optional disclaimer on government id screens
    >     
    > -   Added the following theme properties:
    >     
    >     -   `governmentIdCaptureDisclaimerIcon`
    >     -   `governmentIdHintTextAlignment`
    >     -   `governmentIdHintTextColor`
    >     -   `governmentIdHintTextFont`
    >     -   `governmentIdHintBackgroundColor`
    >     -   `showGovernmentIdHintIcons`
    > -   Added support for SVGs in remote asset components
    >     
    > -   Added the ability to override the following strings:
    >     
    >     -   `cameraPermissionsTitle`
    >     -   `cameraPermissionsSelfieText`
    >     -   `cameraPermissionsGovernmentIdText`
    >     -   `cameraPermissionsSettingsDescription`
    >     -   `cameraPermissionsDismissButtonText`
    >     -   `cameraPermissionsEnableButtonText`
    >     -   `cameraPermissionsSettingsButtonText`
    >     -   `cameraPermissionsTryAgainButtonText`
    > 
    > #### Changed
    > 
    > -   Spacing and margins have been adjusted for consistency
    > 
    > #### Fixed
    > 
    > -   Fixed a bug with address autocomplete
    > 
    > #### \[v2.2.0\] - 2022-01-27
    > 
    > #### Changed
    > 
    > -   Persona module has been renamed to Persona2
    
-   Upgrade to Android Inquiry SDK 2.2.4
    
    > #### \[v2.2.4\] - 2022-02-04
    > 
    > #### Added
    > 
    > -   Added support for custom Selfie animation on selfie start view with
    >     
    >     -   Lottie file `personaInquirySelfieLottieRaw`
    >     -   Size between 0.0 and 1.0 for `personaInquirySelfieLottieWidthPercent`
    > -   Added support for additional ID types
    >     
    > 
    > #### Removed
    > 
    > -   The following string resources have been removed, their values are now supplied by the server:
    >     
    >     -   `persona_selfie_persona_governmentid_submitting_title`
    >     -   `persona_selfie_persona_governmentid_submitting_body`
    >     -   `selfie_hint_center`
    >     -   `selfie_hint_look_left`
    >     -   `selfie_hint_look_right`
    >     -   `governmentid_idlabel_dl`
    >     -   `governmentid_idlabel_id`
    >     -   `governmentid_idlabel_keyp`
    >     -   `governmentid_idlabel_mid`
    >     -   `governmentid_idlabel_myn`
    >     -   `governmentid_idlabel_nric`
    >     -   `governmentid_idlabel_ofw`
    >     -   `governmentid_idlabel_pp`
    >     -   `governmentid_idlabel_ppc`
    >     -   `governmentid_idlabel_pr`
    >     -   `governmentid_idlabel_rp`
    >     -   `governmentid_idlabel_sp`
    >     -   `governmentid_idlabel_sss`
    >     -   `governmentid_idlabel_umid`
    >     -   `governmentid_idlabel_pid`
    >     -   `governmentid_idlabel_vid`
    >     -   `governmentid_idlabel_visa`
    >     -   `governmentid_idlabel_wp`
    > 
    > #### \[v2.2.3\] - 2022-02-03
    > 
    > #### Fixed
    > 
    > -   Use styles that are night-mode friendly for chevrons and arrows
    > 
    > #### \[v2.2.2\] - 2022-02-01
    > 
    > #### Added
    > 
    > -   Support SVGs from the server
    > 
    > #### Fixed
    > 
    > -   Enable haptic feedback on older versions of Android
    > -   Address resource contention that stopped the camera after many usages
    > 
    > #### \[v2.2.1\] - 2022-01-28
    > 
    > #### Added
    > 
    > -   Show the countdown on the overlay
    > 
    > #### Changed
    > 
    > -   Change selfie capture to be more strict, surface errors to users
    > -   Depend on Kotlin 1.5.31
    > -   Update resources to prevent name collisions with the v1.x SDK
    > 
    > #### \[v2.2.0\] - 2022-01-25
    > 
    > #### Breaking
    > 
    > -   `com.withpersona.sdk` has been changed to `com.withpersona.sdk2` everywhere
    
-   Update iOS and Android’s namespace to allow for 1.x and 2.x implementations in parallel
    

## \[v2.1.3\] - 2022-01-31

### Changed

-   Upgrade to iOS Inquiry SDK 2.1.3
    
    > #### \[v2.1.3\] - 2022-01-25
    > 
    > #### Added
    > 
    > -   Added the following theme properties:
    >     
    >     -   `governmentIdCaptureBackgroundColor`
    >     -   `governmentIdScanningStrokeStyle`
    >     -   `governmentIdCapturingStrokeStyle`
    >     -   `governmentIdConfirmingStrokeStyle`
    >     -   `governmentIdScanningAnimation`
    >     -   `showGovernmentIdOverlays`
    >     -   `selfieLookLeftAsset`
    >     -   `selfieLookRightAsset`
    > 
    > #### Removed
    > 
    > -   Removed the following strings from `Persona.strings` (unused in dynamic flows):
    >     
    >     -   `governmentIdStartTitle`
    >     -   `governmentIdStartBody`
    >     -   `governmentIdChooseType`
    >     -   `selfieStartTitle`
    >     -   `selfieStartBody`
    >     -   `selfieStartButton`
    
-   Upgrade to Android Inquiry SDK 2.1.3
    
    > #### \[v2.1.3\] - 2022-01-24
    > 
    > #### Added
    > 
    > -   Support for server driven localizations in selfie templates
    > 
    > #### Changed
    > 
    > -   Cancel modal now uses `textAppearanceHeadline6` and `textAppearanceSubtitle1`
    > 
    > #### Removed
    > 
    > -   The following string resources have been removed:
    >     
    >     -   `persona_selfie_start_title`
    >     -   `persona_selfie_start_body`
    >     -   `persona_selfie_start_button`
    > 
    > #### \[v2.1.2\] - 2022-01-18
    > 
    > #### Added
    > 
    > -   Support for more server driven localizations on government ID templates
    > -   Support more components for form templates
    > -   Added address auto complete on address fields
    > -   Improve auto capture to take better pictures
    > 
    > #### Changed
    > 
    > -   Update dependencies
    > -   Various bug fixes
    

## \[v2.1.2\] - 2021-12-17

### Changed

-   Upgrade to iOS Inquiry SDK 2.1.2
    
    > #### \[v2.1.2\] - 2021-12-13
    > 
    > #### Added
    > 
    > -   Added support for server driven localizations on gov id capture screen.
    > -   Added support for multi-file document uploads.
    
-   Upgrade to Android Inquiry SDK 2.1.1
    
    > #### \[v2.1.1\] - 2021-12-13
    > 
    > #### Added
    > 
    > -   Allow multiple documents to be added on the same step
    > -   Support for server driven localizations in government ID templates
    > 
    > #### Changed
    > 
    > -   Update dependencies
    > 
    > #### Removed
    > 
    > -   The following string resources have been removed:
    >     
    >     -   `persona_governmentid_start_title`
    >     -   `persona_governmentid_start_body`
    >     -   `persona_governmentid_failed_title`
    >     -   `persona_governmentid_submitting_title`
    >     -   `persona_governmentid_submitting_body`
    

## \[v2.1.1\] - 2021-12-02

### Changed

-   Upgrade to iOS Inquiry SDK 2.1.1
    
    > #### \[v2.1.1\] - 2021-11-23
    > 
    > #### Added
    > 
    > -   The background color for the silhouette overlay, shown when taking automated selfies, can now be themed via `selfieOverlayBackgroundColor`. If no color is provided, a blur effect is used instead (the default behavior).
    > 
    > #### Fixed
    > 
    > -   Fixed a bug where form field errors would not be displayed underneath the affected fields.
    > -   Fixed a bug where certain assets could be rendered at a lower resolution than expected.
    

## \[v2.1.0\] - 2021-11-18

### Changed

-   Upgrade to iOS Inquiry SDK 2.1.0
    
    > #### \[v2.1.0\] - 2021-11-16
    > 
    > #### Added
    > 
    > -   Added themeable text alignment on title and body labels: `titleTextAlignment` and `bodyTextAlignment`.
    > -   Added `LoopMode` enum for `InquiryTheme.AnimationAsset` which determines loop mode of animation, defaults to `playOnce`.
    > -   Added support for completing an Inquiry without showing the completion screen.
    > -   Added support for Dynamic Type.
    > -   Added support for the Reduce Motion accessibility setting.
    > 
    > #### Changed
    > 
    > -   Attempting to start an Inquiry on templates prefixed with `tmpl_` will now fail immediately.
    > -   Government ID camera capture experience has been redesigned.
    > -   Improved support for Voice Over.
    
-   Upgrade to Android Inquiry SDK 2.1.0
    
    > #### \[v2.1.0\] - 2021-11-18
    > 
    > #### Added
    > 
    > -   Support completing an Inquiry flow without showing a completion screen
    > 
    > #### Changed
    > 
    > -   Redesign Government ID capture screens
    > -   Secondary buttons are now outlined
    > -   Update dependencies
    > 
    > #### Fixed
    > 
    > -   Remove Snackbar usage in Sandbox which older versions of AGP strips out
    > -   Use the Material UI background for `materialButtonStyle` and `materialButtonStyleSecondary`
    > 
    > #### \[v2.0.3\] - 2021-10-20
    > 
    > #### Fixed
    > 
    > -   Return an error when the SDK is launched without internet
    > -   Return session when canceling from document upload step
    

## \[v2.0.3\] - 2021-10-14

### Changed

-   Upgrade to Android Inquiry SDK 2.0.2
    
    > #### \[v2.0.2\] - 2021-10-13
    > 
    > #### Added
    > 
    > -   Support document upload step
    > -   Forward along server errors on the Inquiry creation step
    > -   Return error if using an incompatible template ID
    > 
    > #### Fixed
    > 
    > -   Starting an Inquiry by Inquiry Template Version has been fixed
    > -   Removed loading indicator blip after selfie and document verifications
    > -   Re-add Field population on client-side Inquiry creation
    > 
    > #### Changed
    > 
    > -   Update dependencies
    > 
    > #### \[v2.0.1\] - 2021-08-26
    > 
    > #### Added
    > 
    > -   Support the Keypass ID and Visa government ID types
    > -   Show a cancel confirmation pop-up
    > 
    > #### Fixed
    > 
    > -   `InquiryField.Unknown` return the name of the unknown type instead of just “unknown”
    > 
    > #### Changed
    > 
    > -   Footer now has a thin line on top of it
    

## \[v2.0.2\] - 2021-09-09

### Fixed

-   Re-added missing compiled JavaScript files

## \[v2.0.1\] - 2021-09-08

### Changed

-   Upgrade to iOS Inquiry SDK 2.0.1
    
    > #### \[v2.0.1\] - 2021-09-01
    > 
    > #### Added
    > 
    > -   Added support for Keypass ID and visa government id types.
    > -   The footer container now has themable options via `footerBackgroundColor`, `footerBorderColor` and `footerBorderWidth`.
    > 
    > #### Changed
    > 
    > -   Standard `InquiryField` key values are now camelCase instead of kebab-case.
    > -   `InquiryField` enum case values are now optional.
    > -   `InquiryDelegate.inquiryComplete` parameter `status` has been made not optional.
    > 
    > #### Fixed
    > 
    > -   Relative links are no longer rendered as links in the `PrivacyPolicy` component.
    

## \[v2.0.0\] - 2021-08-26

### Added

-   `onCanceled` response now returns the sessionToken so the Inquiry flow can be resumed

### Changed

-   Upgrade to iOS Inquiry SDK 2.0.0
    
    > #### \[v2.0.0\] - 2021-08-06
    > 
    > #### Added
    > 
    > -   `InquiryDelegate.inquiryCanceled` now includes a `sessionToken` parameter to resume the inquiry flow.
    > 
    > #### Changed
    > 
    > -   Support Inquiry templates prefixed with `itmpl_` instead of `tmpl_`.
    > -   `InquiryDelegate.inquirySuccess` and `InquiryDelegate.inquiryFailed` are now represented by `InquiryDelegate.inquiryComplete` with a status of completed or failed (though can be customizable in the future).
    > -   `InquiryDelegate.inquiryCancelled` has been renamed to `InquiryDelegate.inquiryCanceled`.
    > -   `Attributes` parameter in the `inquirySuccess` delegate are now a part of `inquiryComplete` fields parameter.
    > 
    > #### Removed
    > 
    > -   `Relationships` and the containing list of `Verification` no longer exists.
    
-   Upgrade to Android Inquiry SDK 2.0.0
    
    > #### \[v2.0.0\] - 2021-08-05
    > 
    > #### Added
    > 
    > -   Support AndroidX’s `registerForActivityResult` for interacting with the Inquiry
    > -   `Cancel` response now returns the `sessionToken` so the Inquiry flow can be resumed
    > 
    > #### Changed
    > 
    > -   `Success` and `Failure` callbacks are now represented by `Complete` with a status of `completed` or `failed` (though can be customizable in the future)
    > -   Support Inquiry templates prefixed with `itmpl_` instead of `tmpl_`
    > -   `Attributes` returned in the `Success` response are now in the `Complete`’s `fields` response
    > 
    > #### Deprecated
    > 
    > -   Recommend moving off `Inquiry#onActivityResult` and onto AndroidX’s `registerForActivityResult`
    > 
    > #### Removed
    > 
    > -   `Relationships` and the containing list of `Verification` no longer exists
    
-   `onSuccess` and `onFailure` callbacks are now represented by `onComplete` with a `status` of “completed” or “failed” ( though can be customizable in the future)
    
-   Support Inquiry templates prefixed with `itmpl_` instead of `tmpl_`
    
-   `Attributes` returned in the `Success` response are now in the `Complete`’s `fields` response
    
-   `accessToken` has been renamed to `sessionToken` on the Inquiry builder
