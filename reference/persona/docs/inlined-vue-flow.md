# Troubleshooting common issues

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)

# Troubleshooting common issues

## Speeding up initial load of the Persona integration

The Persona JS SDK functions by rendering an `iframe` that loads Persona’s [Hosted Flow Integration](./hosted-flow.md). Loading the assets needed can take a significant amount of time on low-quality connections. We provide several APIs and recommendations for improving initial load.

### Preloading JavaScript assets

The SDK client provides a `Client.preload()` method that preloads the necessary assets into the browser’s cache. Calling this method before calling `new Client(...)` can speed up initial load times. For more information, see [Client Methods](./embedded-flow-client-methods.md).

### Eagerly instantiating Persona client

We generally recommend instantiating the Persona client as early as possible based on when the user signals intent to begin the flow, and calling `open()` on the client instance once the flow is ready to be displayed. This allows the Persona flow to begin loading in the background.

### Opening widget `onReady` instead of `onLoad`

We provide two [client callbacks](./embedded-flow-client-callbacks.md) related to initial load. `onLoad` fires when the `iframe` finishes loading, but the contents have not yet loaded, while `onReady` fires when the contents have loaded and are ready for user interaction. Opening the widget `onReady` and handling loading UI on your side can provide a smoother experience.

## Refused to display `https://withpersona.com/` in a frame because it set ‘X-Frame-Options’ to ‘deny’

### What this means

This error message is a result of a security feature that Persona offers when you integrate Persona using Embedded Flow.

Persona lets you specify, via an allowlist, which domains can load the embedded flow. You should specify only the domains where you embed your Persona flow. Potential attackers will then be blocked from embedding and loading your flow on their domain.

If you see this error, it means that the domain the embedded flow is being loaded on is not on the allowlist.

### How to fix

If you see this error, go to the [Embedded Flow documentation page](https://app.withpersona.com/dashboard/getting-started/embedded-flow) in the Persona Dashboard, and locate “Step 3 Configure allowed domains”. Here, you’ll see the Domain allowlist.

Ensure that:

1.  The domain from which you are trying to load the Embedded Flow (and where you’re seeing the error message) is on the Domain allowlist.
2.  The domain in the Domain allowlist is correctly spelled and properly formatted. Note: a domain name should NOT include the `http://` or `https://` part of the URL.

If you are testing, please note:

-   `localhost` is enabled by default for Inquiries created in your [Sandbox environment](./environments.md). `localhost` must be manually added to be usable for Production inquiries.

If you have a more complex setup, please note:

-   If your embedded flow is loaded on a webpage that is itself loaded as an iframe on another parent webpage, you must specify all parent origins by setting the `frameAncestors` option in the JS SDK. See [Parameters](./embedded-flow-parameters.md) for details.

## High memory usage in browser

If you are seeing elevated memory usage, ensure you are not repeatedly calling `new Persona.Client({ ... })` without cleaning up old clients with `client.destroy()`. Calling `new Persona.Client({ ... })` multiple times without cleanup will load multiple instances of the Persona web flow via `iframe`, which will quickly consume available memory even if the `iframe`s are not visible on the screen.

## Server rendering

The Persona JS SDK requires client-side JavaScript and cannot be server rendered. If you are using a server rendered framework such as next.js or Remix, you will need to use the framework’s client rendering escape hatch.

### next.js

This error will manifest as `ReferenceError: self is not defined when using next.js`. To solve the problem, update your app structure to have a `next/dynamic` component that loads the component that imports the Persona package as a client component. Below is an implementation sample:

```typescript
// YourServerRenderedPage.tsx -- server component
import PersonaWrapper from './components/PersonaWrapper';

export default function Home() {
  return (
    <div>
      <h1>Persona Integration</h1>
      <PersonaWrapper />
    </div>
  );
}

// PersonaWrapper.tsx -- client component
'use client';

import dynamic from 'next/dynamic';

const PersonaClient = dynamic(() => import('./PersonaClient'), {
  ssr: false,
  loading: () => <p>Loading Persona verification...</p>
});

export default function PersonaWrapper() {
  return <PersonaClient />;
}

// PersonaClient.tsx -- client component
'use client';

import { Client as Persona } from 'persona';
// Your own integration code below...
```

### Remix

Dynamically import the embedded flow with

```typescript
import { useEffect, useState } from "react";

export default function PersonaInquiry() {
  const [clientLoaded, setClientLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    import('persona').then((module) => {
      // interact with module.Inquiry based on your integration
    });
  }, []);

  // coordinate UI with clientLoaded
}
```

## PDFs linked from the Inquiry flow cannot be loaded

Links that trigger PDFs to open in a popup require relaxing `iframe` sandbox restrictions via the `allow-top-navigation-by-user-activation` attribute. Note that relaxing sandbox restrictions has security implications and should be done with care.

Note that if you are testing your integration with an `iframe`\-based tool such as JSFiddle, Codepen, or CodeSandbox, you may still see issues. This is because the Persona `iframe` is nested within the tool’s own `iframe`, which has its own set of sandbox attributes. To properly test, use a local HTML file.

For more information, see [iframe sandbox attributes](./embedded-flow-security.md#iframe-sandbox-attributes).

## Issues when testing locally

If testing locally, ensure your webpage is served by a local web server instead of being opened as a static file. This is due to the origin for local files (`file://`) not being a valid origin for `window.postMessage()`, which the Persona flow uses to communicate with your code.

For example:

```python
python -m http.server
open http://localhost:8000/your_html_file.html
```

If you are testing on a mobile device and are running into camera permission errors, you will need to serve your webpage over HTTPS. Browsers restrict insecure origins from accessing certain hardware features. Depending on your testing setup, we recommend:

1.  Using a service like [Codepen](https://codepen.io/trending) or [CodeSandbox](https://codesandbox.io/) to host your test page, and then access it over HTTPS.
2.  Using a tool like [ngrok](https://ngrok.com/) to access your test page over HTTPS.
3.  Using `mkcert` to generate a certificate and serve HTTPS locally. If testing using third party services, please ensure that you are not exposing sensitive information about your integration publicly.
