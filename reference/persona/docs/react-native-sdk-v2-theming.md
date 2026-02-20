# React Native Legacy Client Side Theming

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[React Native](./react-native-sdk-v2-integration-guide.md)

# React Native Legacy Client Side Theming

## Theming

The Persona React Native SDK relies on theming capabilities provided by underlying native platforms to ensure that themes run smoothly and have no negative impact on the overall performance and user experience.

#### Platform differences

Because Android and iOS look and feel different, there are discrepancies to consider when theming each platform. We recommend tackling theming on each platform separately.

## Using the built-in CLI tool

The React Native Persona SDK comes with a built-in CLI tool that aims to help you work with the native theming capabilities supported on Android and iOS.

### Run `persona-tool`

```
# with yarn
yarn persona-tool

# with npx
npx persona-tool
```

Follow the instructions to configure the tool. Copy the configuration snippet into your application’s `package.json`. As of `2021-07-20` it looks something like this:

```json
  "persona": {
    "androidTheme": {
      "backgroundColor": null,
      "primaryColor": null,
      "darkPrimaryColor": null,
      "accentColor": null,
      "titleTextColor": null,
      "titleTextFont": null,
      "bodyTextColor": null,
      "bodyTextFont": null,
      "footnoteTextColor": null,
      "footnoteTextFont": null,
      "textFieldTextColor": null,
      "textFieldTextFont": null,
      "pickerTextColor": null,
      "pickerTextFont": null,
      "buttonBackgroundColor": null,
      "buttonDisabledBackgroundColor": null,
      "buttonTouchedBackgroundColor": null,
      "buttonTextColor": null,
      "buttonDisabledTextColor": null,
      "buttonCornerRadius": null,
      "buttonFont": null,
      "progressColor": null,
      "loadingAnimationAsset": null,
      "loadingAnimationWidthPercent": null,
      "selfieAnimationAsset": null,
      "selfieAnimationWidthPercent": null
    },
    "iosTheme": {
      "backgroundColor": null,
      "primaryColor": null,
      "darkPrimaryColor": null,
      "accentColor": null,
      "overlayBackgroundColor": null,
      "titleTextColor": null,
      "titleTextFont": null,
      "bodyTextColor": null,
      "bodyTextFont": null,
      "footnoteTextColor": null,
      "footnoteTextFont": null,
      "formLabelTextColor": null,
      "formLabelTextFont": null,
      "textFieldTextColor": null,
      "textFieldBackgroundColor": null,
      "textFieldBorderColor": null,
      "pickerTextColor": null,
      "pickerTextFont": null,
      "buttonBackgroundColor": null,
      "buttonDisabledBackgroundColor": null,
      "buttonTouchedBackgroundColor": null,
      "buttonImageTintColor": null,
      "buttonImageHidden": null,
      "buttonTextColor": null,
      "buttonDisabledTextColor": null,
      "buttonTextAlignment": null,
      "buttonCornerRadius": null,
      "buttonFont": null,
      "selectedCellBackgroundColor": null,
      "closeButtonTintColor": null,
      "cancelButtonBackgroundColor": null,
      "progressColor": null,
      "cameraGuideCornersColor": null,
      "cameraButtonBackgroundColor": null,
      "cameraInstructionsTextColor": null,
      "cameraInstructionsTextFont": null,
      "loadingAnimationAssetName": null,
      "loadingAnimationAssetWidth": null,
      "loadingAnimationAssetHeight": null,
      "processingAnimationAssetName": null,
      "processingAnimationAssetWidth": null,
      "processingAnimationAssetHeight": null,
      "selfieAnimationAssetName": null,
      "selfieAnimationAssetWidth": null,
      "selfieAnimationAssetHeight": null
    }
  }
```

**Colors**

Optionally modify the color values to valid hexadecimal color codes. Examples: #0000FF, 4700EB.

**Fonts**

Optionally modify the font values to font names that are either built-in to the platform or have been built into your application. Examples: `sans-serif` (Android), `San Francisco` (iOS), `@font/customira` (Android custom).

For the smoothest installation and overall experience, we recommend sticking with system defaults, but if font change is desired, view additional information in [Customizing Fonts on iOS](./react-native-sdk-v2-theming.md#customizing-fonts-on-ios) and [Customizing Fonts on Android](./react-native-sdk-v2-theming.md#customizing-fonts-on-android).

### Callouts for Android

-   The `pickerTextColor` and `pickerTextFont` theme keys style Android’s `Spinner` components.

### What to theme first

To get started with theming, we recommend starting with the main colors: `backgroundColor`, `primaryColor`, `darkPrimaryColor`, and `accentColor`, and the `textColors`.

After these match your brand’s colors, you can tweak individual elements as desired.

### What to theme next on Android

After theming the core colors, you can theme text fields, picker (spinner)s, and buttons. Text fields and pickers may not show up within your template, so they may be irrelevant for your integration. Text fields and pickers should look similar since they are form controls.

### What to theme next on iOS

iOS has an additional `overlayBackgroundColor` that determines the background color of the Toast element that pops up if an individual decides to cancel. This option is not available on Android as the component does not exist.

After theming the core colors, you can theme text fields, pickers, and buttons. Text fields and pickers may not show up within your template, so they may be irrelevant for your integration. Text fields and pickers should look similar since they are form controls.

`selectedCellBackgroundColor` determines the color of the cells in the country picker (may not exist in your template)

`closeButtonTintColor` determines the color of the “x” to close the Inquiry flow should an individual choose not to complete. This close button opens the cancel toast element.

`cancelButtonBackgroundColor` determines the color of the cancel button within the cancel toast element.

### Customizing Fonts on Android

In order to specify fonts on Android, the fonts either must be system fonts or fonts bundled into your application. For a list of system fonts available out of the box, view: [https://github.com/react-native-training/react-native-fonts#android](https://github.com/react-native-training/react-native-fonts#android).

As an example, If you want to use `sans-serif-medium` on Android, then set`persona.androidTheme.titleTextFont`:

```json
"persona": {
  "androidTheme": {
    "titleTextFont": "sans-serif-medium"
  }
}
```

#### Providing a custom font

If you would like to provide your own custom font, first create a font resource by following the follow guide: [https://developer.android.com/guide/topics/ui/look-and-feel/fonts-in-xml](https://developer.android.com/guide/topics/ui/look-and-feel/fonts-in-xml).

```json
"persona": {
  "androidTheme": {
    "titleTextFont": "@font/custom-font"
  }
}
```

### Customizing Fonts on iOS

In order to specify fonts on iOS, the fonts must be either system fonts or fonts bundled into your application. For a list of system fonts available out of the box, view: [https://github.com/react-native-training/react-native-fonts#ios](https://github.com/react-native-training/react-native-fonts#ios)

#### Providing a custom font

If you would like to provide your own custom font, add a font file to the Xcode project by following the guide here: [https://developer.apple.com/documentation/uikit/text\_display\_and\_fonts/adding\_a\_custom\_font\_to\_your\_app](https://developer.apple.com/documentation/uikit/text_display_and_fonts/adding_a_custom_font_to_your_app).

Then, you can specify your custom font.

```json
"persona": {
  "iosTheme": {
    "titleTextFont": "CustomFont-light"
  }
}
```
