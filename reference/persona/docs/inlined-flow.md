# Inlined

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)

# Inlined

The inline flow allows loading the Persona Inquiry flow directly within your page. It is intended for desktop flows that do not want a dropdown modal experience.

Verifying individuals with the Inlined Flow can be easily achieved with a short code snippet. You’ll only need your template ID which can be found in the [Integration Section](https://withpersona.com/dashboard/integration) of your Dashboard.

The latest version of the SDK is: [![Persona SDK latest](./images/persona_023bab4a5303.png)](https://www.npmjs.com/package/persona)

## Inlining the flow

Persona can be integrated with the following code snippet. Remember to replace `templateId` with your organization’s template ID.

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="text/javascript" src="../../packages/persona/dist/persona.js"></script>
    <script>
        window.addEventListener("DOMContentLoaded", function() {
          const containerId =
            "persona-widget-" +
            new Array(16)
                .fill(undefined)
                .map(() => Math.floor(Math.random() * 35).toString(35))
                .join("");
          const templateId = "<template id>";
          Persona.setupEvents(containerId, {
            onLoad: function () {
                console.log("On Load");
            },
            onReady: function () {
                console.log("On Ready");
            },
            onComplete: function () {
                console.log("On Complete");
            },
            onEvent: function () {
                console.log("On Event");
            },
            onCancel: function () {
                console.log("On Cancel");
            },
            onError: function () {
                console.log("On Error");
            },
            templateId,
          });
          const personaIframe = document.querySelector("#persona-inline-iframe");
          Persona.setupIframe(personaIframe, containerId, "inline", {
              templateId,
          });
        });
      </script>
    <iframe id="persona-inline-iframe"></iframe>
  </body>
</html>
```

To permit the Persona iframe to render on your domain, see [Security > Embedding the Persona iframe](./embedded-flow-security.md#embedding-the-persona-iframe).

In order to have multiple active widgets currently, make sure to give each widget a unique `containerId`

## Styling

For more granular or dynamic styling, the `iframe` can be targeted via CSS. We recommend targeting a selector provided by your app such as `.your-classname > iframe` instead of relying on Persona class names to avoid unexpected breakage.

**We recommend using a minimum height of `650px` and a minimum width of `400px` to ensure contents are properly displayed without excessive horizontal wrapping or scrolling.**

## Handling loading state

The Persona iframe starts loading when the Persona component is rendered. Thus, there will be a delay between when the component is rendered and when the Inquiry flow content is displayed. We recommend using the `onReady` [client callback](./embedded-flow-client-callbacks.md) to detect when loading is completed, and handling any loading UI outside of Persona.

Alternatively, if your use case allows it, you can pre-render the Persona component and visually hide it with CSS until it needs to be used.

## More Examples

### Angular

```
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "first-app": {
      "projectType": "application",
      "schematics": { /* ... */ },
      // ... other properties
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "outputPath": "dist/first-app",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.css"],
            "scripts": [
              // ADD HERE
              "node_modules/persona/dist/persona.js"
            ]
          },
          "configurations": { /* ... */ }
        },
        "serve": { /* serve settings */ }
    }
  }
}
```

```
import { Component, AfterViewInit } from "@angular/core";

@Component({
  selector: "app-root",
  imports: [],
  template: `
    <div id="persona-example-body">
      <h1>Persona Inline App Example</h1>
      <iframe id="persona-inline-iframe"></iframe>
    </div>
  `,
  styleUrls: ["./app.css"],
  styles: `
    iframe {
      width: 800px;
      height: 650px;
    }

    [id="persona-example-body"] {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `,
})
export class App implements AfterViewInit {
  title = "Persona Inline App Example";

  ngAfterViewInit(): void {
    const Persona = (window as any).Persona;

    const containerId =
      "persona-widget-" +
      new Array(16)
        .fill(undefined)
        .map(() => Math.floor(Math.random() * 35).toString(35))
        .join("");

    const templateId = "<template id>";
    Persona.setupEvents(containerId, {
      onLoad: function () {
        console.log("On Load");
      },
      onReady: function () {
        console.log("On Ready");
      },
      onComplete: function () {
        console.log("On Complete");
      },
      onEvent: function () {
        console.log("On Event");
      },
      onCancel: function () {
        console.log("On Cancel");
      },
      onError: function () {
        console.log("On Error");
      },
      templateId,
    });
    const personaIframe = document.querySelector("#persona-inline-iframe");
    Persona.setupIframe(personaIframe, containerId, "inline", {
      templateId,
    });
  }
}
```
