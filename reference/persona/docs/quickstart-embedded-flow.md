# Getting Started

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)

# Getting Started

The latest version of the SDK is: [![Persona SDK latest](./images/persona_023bab4a5303.png)](https://www.npmjs.com/package/persona)

There are two ways to use Embedded Flow. Both require some code:

1.  **Generate inquiries from an inquiry template** (Minimal code required)
    -   Embed the web SDK and configure it with your inquiry template ID.
    -   A new inquiry is created each time a user starts the flow.
    -   Best for: small numbers of users, simple use cases
    -   Warning: Users who load your page multiple times will create duplicate inquiries.
2.  **Pre-create inquiries via API** (More code required)
    -   Embed the web SDK.
    -   For each new user, create a new inquiry ID via API, then pass the inquiry ID to the SDK.
    -   Best for: High volume and/or personalized experiences
    -   Recommended for production use

Note that you can get started with the simpler implementation, and build up to the more scalable approach later.

## Tutorials

-   [Tutorial: Embedded Flow with Inquiry Template](./tutorial-embedded-flow-inquiry-template.md)
-   [Tutorial: Pre-create inquiries for Embedded Flow](./tutorial-embedded-flow-precreate.md)

## Quick reference

### Embed Code Snippet

Creating inquiries through the [Embedded](./embedded-flow.md) integration can be easily achieved with a short code snippet. You’ll only need your inquiry template ID which can be found in the [Documentation](https://app.withpersona.com/dashboard/getting-started/embedded-flow) section of your Dashboard.

```
import Persona from 'persona';

const client = new Persona.Client({
  templateId: "<your template ID starting with itmpl_>",
  referenceId: "<your reference ID for this user>",
  environmentId: "<your environment ID starting with env_>",
  onReady: () => client.open(),
  onComplete: ({ inquiryId, status, fields }) => {
    // Inquiry completed. Optionally tell your server about it.
    console.log('Sending finished inquiry ' + inquiryId + ' to backend');
  },
  onCancel: ({ inquiryId, sessionToken }) => console.log('onCancel'),
  onError: (error) => console.log(error),
});
```

To permit the Persona iframe to render on your domain, see [Security > Embedding the Persona iframe](./embedded-flow-security.md#embedding-the-persona-iframe).

### Callbacks

You can also use optional callbacks for advanced [Event Handling](./embedded-flow-client-callbacks.md).

```javascript
const client = new Persona.Client({
  templateId: "<your template ID starting with itmpl_>",
  environmentId: "<your environment ID starting with env_>",
  onReady: () => client.open(),
  onEvent: (name, meta) => {
    switch (name) {
      case 'start':
        console.log('Received event: start with inquiry ID ' + meta.inquiryId);
        break;
      default:
        console.log('Received event: ' + name + ' with meta: ' + JSON.stringify(meta));
    }
  }
});
```

### Methods

Use the client’s [Methods](./embedded-flow-client-methods.md) to show, hide, or cleanup the embedded flow widget.

```javascript
const client = new Persona.Client({
	templateId: "<your template ID starting with itmpl_>",
  environmentId: "<your environment ID starting with env_>",
  onComplete: ({ inquiryId, status, fields }) => {
	  // Inquiry completed. Optionally tell your server about it.
	  console.log('Sending finished inquiry ' + inquiryId + ' to backend');
	  fetch('/server-handler?inquiry-id=' + inquiryId);
  }
});

function openClient() { client.open(); }
function cancelClient() { client.cancel(true); }
```
