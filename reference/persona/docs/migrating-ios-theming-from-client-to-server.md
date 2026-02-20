# Migrate iOS Theming from Client to Server

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[iOS](./tutorial-ios-sdk-precreate.md)

# Migrate iOS Theming from Client to Server

## Steps

1.  Identify the client-side theming code that defines the theme for a Persona flow on iOS.
    
2.  Use the below table to map the existing theme attributes defined in client-side code to the theme editor in the Persona Dashboard.
    
    For more information on using the theme editor, see our [help article](https://help.withpersona.com/articles/6SIHupp847yaEuVMucKAff).
    
3.  Publish your theming changes.
    
4.  Remove all client-side theming code from your app.
    
5.  Test the Persona flow in your app to make sure the theming is accurate.
    
6.  Release a new version of your app without client-side theming code.
    
7.  Repeat above steps for as many Persona flows you use (also known as inquiry templates).
    

There are some properties that are not supported yet, and other that cannot be applied without component-level theming (e.g. custom assets and visuals). If you run into gaps that block your migration, please reach out.

| Client-side property | Theme Editor Property |
| --- | --- |
| accentColor | Icon fill color |
| backgroundColor | Background color (located in Advanced) |
| bodyTextAlignment | Text align |
| bodyTextColor | Body text color |
| bodyTextFont | Body font, Body font size |
| buttonBackgroundColor | Primary button fill color |
| buttonBorderColor | Primary button fill color |
| buttonCornerRadius | Button border radius |
| buttonDisabledBackgroundColor | Not available yet |
| buttonFont | Body font |
| buttonSecondaryBackgroundColor | Secondary button fill color |
| buttonSecondaryBorderColor | Secondary button outline color |
| buttonSecondaryCornerRadius | Button border radius |
| buttonSecondaryDisabledBackgroundColor | Not available yet |
| buttonSecondaryFont | Body font |
| buttonSecondaryTextColor | Secondary button text color |
| buttonSecondaryTouchedBackgroundColor | Secondary button fill color |
| buttonTextColor | Primary button text color |
| buttonTouchedBackgroundColor | Primary button fill color |
| cardTitleTextFont | Heading font, Heading font size, Heading font weight |
| darkPrimaryColor | Icon stroke color |
| errorColor | Not available yet |
| footerBackgroundColor | Background color (located in Advanced) |
| footnoteTextColor | Small text color |
| footnoteTextFont | Body font, Small text font size |
| formLabelTextColor | Body text color |
| formLabelTextFont | Body font, Body font size |
| governmentIdHintTextAlignment | Text align |
| governmentIdHintTextFont | Body font, Body font size |
| navigationBarTextColor | Header button color |
| pickerTextColor | Body text color |
| pickerTextFont | Body font, Body font size |
| primaryColor | Primary color |
| processingLabelsTextAlignment | Text align |
| textFieldBackgroundColor | Input background color |
| textFieldBorderColor | Input border color |
| textFieldCornerRadius | Button border radius |
| textFieldFont | Body font, Body font size |
| textFieldPlaceholderFont | Body font, Body font size |
| textFieldTextColor | Body text color |
| titleTextAlignment | Text align |
| titleTextColor | Heading text color |
| titleTextFont | Heading font, Heading font size, Heading font weight |
