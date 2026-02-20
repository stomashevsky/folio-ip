# Migrate Android Theming from Client to Server

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[Android](./android-sdk-v2-integration-guide.md)

# Migrate Android Theming from Client to Server

## Steps

1.  Identify the client-side theming code that defines the theme for a Persona flow on Android.
    
2.  Use the below table to map the existing theme attributes defined in client-side code to the theme editor in the Persona Dashboard.
    
    For more information on using the theme editor, see our [help article](https://help.withpersona.com/articles/6SIHupp847yaEuVMucKAff).
    
3.  Publish your theming changes.
    
4.  Remove all client-side theming code from your app.
    
5.  Test the Persona flow in your app to make sure the theming is accurate.
    
6.  Release a new version of your app without client-side theming code.
    
7.  Repeat above steps for as many Persona flows you use (also known as inquiry templates).
    

There are some properties that are not supported yet, and other that cannot be applied without component-level theming (e.g. custom assets and visuals). If you run into gaps that block your migration, please reach out.

| Client-side property | Theme editor Property |
| --- | --- |
| colorAccent | Icon fill color |
| colorBackground | Background color (located in Advanced) |
| colorError | Not available yet |
| colorOnBackground | Header button color |
| colorPrimary | Primary color |
| colorPrimaryDark | Icon stroke color |
| colorPrimaryVariant | Icon stroke color |
| colorSecondary | Not available yet |
| colorSurface | Background color (located in Advanced) |
| materialButtonStyle | Primary button fill color, Primary button text color, Button border radius, Body font |
| materialButtonStyleSecondary | Secondary button fill color, Secondary button text color, Button border radius, Secondary button outline color, Body font |
| personaFooterBackgroundColor | Background color (located in Advanced) |
| textAppearanceBody | Text align, Body text color, Body font, Body font size |
| textAppearanceCaption | Small text color, Body font, Small text font size |
| textAppearanceHeadline | Text align, Heading font, Heading font size, Heading font weight, Heading text color |
| textAppearanceListItem | Text align, Body text color, Body font, Body font size |
| textAppearanceSubtitle | Text align, Body text color, Body font, Body font size |
| textInputStyle | Body text color, Input background color, Input border color, Button border radius, Body font, Body font size |
