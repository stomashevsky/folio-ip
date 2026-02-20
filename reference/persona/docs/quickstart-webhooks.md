# 

Quickstart: Webhooks

This guide demonstrates how to set up and test Persona webhooks.

## What you’ll build

You’ll create a simple local webhook server with one endpoint that receives webhook events. You’ll configure Persona to send events to this endpoint.

#### Security note

The server implementation below is meant for learning purposes only—not production usage.

For demonstration purposes, we will keep the server simple:

-   The server will _not_ implement authentication or access controls.
-   The server will be exposed to the internet via a third-party tunneling service (ngrok or a similar tool).

When you test webhooks that contain real production data, your server should run in a secure environment you control with appropriate authentication, validation, and logging.

## Prerequisites

You’ll need access to:

-   A Persona account
-   An [ngrok](https://ngrok.com/) account—the free plan is sufficient
    -   Feel free to use any similar tunneling tool. ngrok is just one tool commonly used during development.
-   A local development environment for either NodeJS or Python
    -   This guide provides code for NodeJS and Python, but you can adapt the code to another language.

Before you start, you should:

-   Sign into the [Persona dashboard](https://help.withpersona.com/articles/3QGnmQLLnykxUkPl1wIdLT/)
-   Add at least one [inquiry template](./inquiry-templates.md) to your Persona [Sandbox environment](./environments.md)
    -   Persona offers a suite of [solutions](https://help.withpersona.com/solutions/all-solutions/) that include preconfigured inquiry templates. You can follow [these instructions](https://help.withpersona.com/articles/67J7FurQtIgwxkWWvUropu/) to add any solution to your Sandbox environment.

## Step 1: Create a local webhook server

Create a new directory called `webhook-demo/`.

Add the sample code below to create a local server:

###### NodeJS

###### Python

1.  Create `webhook-demo/webhook-server.js`:

```
const express = require('express');
const app = express();
app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
    console.log('📩 Webhook received:');
    console.log('Headers:', req.headers);

    if (req.headers['persona-signature'] != null) {
        const data = req.body.data;
        console.log('Event type: ', data.attributes.name);
        console.log('Payload entity type: ', data.attributes.payload.data.type);
        console.log('Payload entity ID: ', data.attributes.payload.data.id);
    } else {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }

    // Send a success response
    res.status(200).json({
        success: true,
        message: 'Webhook received successfully',
    });
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Webhook server is running. Send POST requests to /webhook');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Webhook server listening on port ' + PORT);
    console.log('Webhook endpoint: http://localhost:' + PORT + '/webhook');
});
```

2.  Create `webhook-demo/package.json`:

```
{
    "name": "persona-webhook-demo-server",
    "version": "1.0.0",
    "description": "Simple webhook server for receiving webhook events",
    "main": "webhook-server.js",
    "scripts": {
        "start": "node webhook-server.js"
    },
    "dependencies": {
        "express": "^4.22.1"
    }
}
```

3.  Install dependencies:

```
cd webhook-demo/
npm install
```

4.  Start the server:

```
npm start
```

Now, test the server:

```
curl -X POST http://localhost:3000/webhook \
-H "Content-Type: application/json" \
-d '{"event": "test", "data": {"message": "Hello from webhook!"}}'
```

You should receive “Webhook received successfully” from the server. In the server logs, you should see the request headers and body.

## Step 2: Expose the webhook endpoint with ngrok

Follow [ngrok’s documentation](https://dashboard.ngrok.com/get-started/setup/) to install ngrok locally and configure it with your ngrok `authtoken`.

Then expose your webhook server to the internet:

```
ngrok http 3000
```

Note your ngrok domain (e.g. `http://abs123.ngrok-free.dev`). You’ll need this in the next step.

## Step 3: Set up webhook in Persona

In the Persona dashboard:

1.  Switch into your [Sandbox environment](./environments.md)
2.  Navigate to **Webhooks** > **Webhooks**
3.  Click **Create webhook**
4.  Submit the form with the following values:
    -   `URL`: `<your ngrok domain>/webhook`
    -   `Enabled events`: `inquiry.created`, `inquiry.started`, `inquiry.completed`, `inquiry.approved`
    -   For other fields, feel free to provide any value.
5.  Click **Enable** and confirm you want to enable the webhook.

At the top of the resulting page:

1.  Note the “Webhook secret”
2.  Click the “eye” icon to reveal the value.
3.  Click **Copy** and save the value somewhere secure. You will use this value in Step 7.

## Step 4: Trigger test events

You selected inquiry-related events in your webhook. Now, create an inquiry and interact with it to trigger events.

In the Persona dashboard (still in your Sandbox environment):

1.  Navigate to **Inquiries** > **All Inquiries**.
2.  Click **Create inquiry** and fill out the form (any values are fine).
3.  Load the newly-created inquiry link in a browser.
4.  Click through the verification flow.
    -   Note: Do not provide any real personal information.
    -   Keep the “Pass verifications” toggle (visible at the bottom of the flow) enabled to simulate you passing all checks.

## Step 5: View events in your server logs

Look at your server logs. You should see events for: `inquiry.created`, `inquiry.started`, and `inquiry.completed`.

You may also see an event for `inquiry.approved` if your inquiry template has an associated [Workflow](./workflows.md) that takes action on completed inquiries.

## Step 6: Learn about webhook headers for retries and authenticity

In the previous step, you saw the webhook request headers printed in your server logs:

```
{
  host: '...',
  'user-agent': '...',
  'content-length': '...',
  'content-type': 'application/json; charset=utf-8',
  'persona-signature': 't=1764686826,v1=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'persona-webhook-attempts-left': '7',
  'persona-webhook-attempts-made': '1',
  'persona-webhook-first-attempted-at': '1764686826',
  '...',
}
```

Look at the `persona-` prefixed headers. These headers provide information about:

-   **Retries**: Persona [retries](./webhooks.md#retry-logic) webhooks if it doesn’t receive a successful response from your webhook endpoint within 5 seconds. Persona will attempt to deliver your webhook up to 7 additional times with an exponential backoff between attempts.
-   **Authenticity**: Persona includes a [signature](./webhooks-best-practices.md#checking-signatures) created from a secret that only you and Persona share. This signature lets you verify that the request is from Persona.

You need to implement logic in your server to check the Persona signature. Let’s do that next.

## Step 7: Improve the server: check that webhook requests are authentic

The value of the `persona-signature` header consists of a timestamp (`t=<unix_timestamp>`) plus a signature (`v1=<signature>`).

The signature is computed from your webhook secret (which you found in Step 3) and a dot-separated string composed of the unix timestamp joined with the request body.

Update your server code to verify the signature:

###### NodeJS

###### Python

1.  Update `webhook-demo/webhook-server.js`:

```
const express = require('express');
const crypto = require('crypto');
const app = express();

// TODO: Set your Persona webhook secret here
// You can find this in your Persona Dashboard under Webhooks > <your specific webhook>
const WEBHOOK_SECRET = process.env.PERSONA_WEBHOOK_SECRET || 'your_webhook_secret_here';

// Middleware to capture raw body for signature verification
app.use(express.json({
verify: (req, res, buf, encoding) => {
if (buf && buf.length) {
  req.rawBody = buf.toString(encoding || 'utf8');
}
}
}));

function verifyPersonaSignature(rawBody, signatureHeader, webhookSecret) {
try {
// Parse the signature header
// Format: "t=<timestamp>,v1=<signature>" or multiple space-separated pairs during rotation
const signaturePairs = signatureHeader.split(' ');

// Extract timestamp from first pair
const firstPair = signaturePairs[0];
const timestamp = firstPair.split(',')[0].split('=')[1];

// Extract all signatures (in case of key rotation)
const signatures = signaturePairs.map(pair => {
  const v1Match = pair.match(/v1=([^,]+)/);
  return v1Match ? v1Match[1] : null;
}).filter(sig => sig !== null);

// Compute expected signature
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(timestamp + '.' + rawBody)
  .digest('hex');

// Check if any of the signatures match the expected (for key rotation support)
const isValid = signatures.some(signature => {
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch (e) {
    return false;
  }
});

return isValid;
} catch (error) {
console.error('Error verifying signature:', error.message);
return false;
}
}

// Webhook endpoint
app.post('/webhook', (req, res) => {
console.log('📩 Webhook received:');
console.log('Headers:', req.headers);
const personaSignature = req.headers['persona-signature'];

if (personaSignature) {
const isValid = verifyPersonaSignature(req.rawBody, personaSignature, WEBHOOK_SECRET);
if (!isValid) {
  console.log('❌ Invalid signature - webhook rejected');
  return res.status(401).json({
    success: false,
    message: 'Invalid webhook signature'
  });
}
console.log('✅ Signature verified');

const data = req.body.data;
console.log('Event type:', data.attributes.name);
console.log('Payload entity type:', data.attributes.payload.data.type);
console.log('Payload entity ID:', data.attributes.payload.data.id);
} else {
console.log('Body:', JSON.stringify(req.body, null, 2));
}

res.status(200).json({
success: true,
message: 'Webhook received successfully'
});
});

// Health check endpoint
app.get('/', (req, res) => {
res.send('Webhook server is running. Send POST requests to /webhook');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log('Webhook server listening on port ' + PORT);
console.log('Webhook endpoint: http://localhost:' + PORT + '/webhook');
});
```

2.  Set your webhook secret (from Step 3) as an environment variable:

```
export PERSONA_WEBHOOK_SECRET=wbhsec_your_actual_secret_here
```

Or paste it directly into the code for testing only.

3.  Restart the server:

```
npm start
```

## Step 8: Trigger test events again and view results

Repeat Steps 4 and 5: Create another inquiry in Sandbox and complete it, then check your server logs for events.

This time, you should see the server log ”✅ Signature verified” for each event.

You can also send a fake webhook request, and check that the server logs ”❌ Invalid signature”:

```
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "Persona-Signature: t=1234567890,v1=invalid_signature" \
  -d '{"test": "data"}'
```

## Summary

In this tutorial, you:

-   Created a local webhook server in Node.js or Python
-   Configured webhooks in Persona’s dashboard
-   Triggered webhook events by completing an inquiry
-   Implemented signature verification in your server for security

## Next steps

To learn more, check out the following resources:

-   [Webhook best practices](./webhooks-best-practices.md) - Tips for using webhooks in production
-   [Webhooks documentation](./webhooks.md) - Complete webhook reference
-   [Inquiry Events reference](./model-lifecycle.md#events) - Full list of available inquiry events
