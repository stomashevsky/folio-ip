# How do I resume an expired Inquiry?

# Overview[](#overview)

In order to let a user continue an expired Inquiry where they left off, you can either generate a one-time link, or create a session token which can be used multiple times.

You can use either the Dashboard or the API to generate a one-time link, but session tokens can only be generated via the API.

# Steps for creating one-time links via Dashboard[](#steps-for-creating-one-time-links-via-dashboard)

To help a user resume an Inquiry:

1.  In the Dashboard, navigate to **Inquiries** > **All Inquiries.**
2.  Select the expired Inquiry.
3.  On the Inquiry details page, click **Resume** in the upper corner.
4.  (optional) Choose whether to automatically email the recipient.
5.  Click **Create link**.
6.  Copy the link.

You can now send this link to the user. When the user opens the link, they will start from where they previously left off.

# Steps for resuming an Inquiry via API[](#steps-for-resuming-an-inquiry-via-api)

To help a user resume an Inquiry, use the ['Resume Inquiry' API endpoint](../../docs/reference/resume-an-inquiry.md).

-   For this, you will need an API key. You can learn how to get an API key [here](../../docs/reference/api-keys.md#getting-an-api-key).

You can get a code example for how to use this endpoint by following these steps:

1.  Open your Dashboard’s [API Key page](https://app.withpersona.com/dashboard/api-keys) (**API** > **API Key)**.
    
2.  Copy your API key.
    
3.  Open the API reference for [resuming an inquiry](../../docs/reference/resume-an-inquiry.md).
    
4.  Paste your API key in the top-right “Bearer” field to populate the code sample.
    
5.  Find an expired Inquiry ID in your [Dashboard](https://app.withpersona.com/dashboard/home) by going to **Inquiries > All Inquiries** in the sidebar.
    
    1.  You can add a filter for “Status” is “Expired” or “Pending”.
    2.  If you don’t have an expired Inquiry, you can make a test one by creating a new Inquiry and waiting 24 hours or by updating a template with a shorter expiration, then creating a new Inquiry.
6.  Click on the expired Inquiry, and copy the Inquiry ID.
    
7.  On the [reference page](../../docs/reference/resume-an-inquiry.md) for resuming the Inquiry, scroll down and paste the Inquiry ID into the “inquiry-id” field.
    
    1.  The example code in the top right corner of the screen will update with your inquiry-id.
8.  You can run the example code in the top-right corner by clicking “Try it!”
    
    -   Your session token should appear in the `meta.session-token` field.
    -   At this point, the Inquiry has been resumed in the backend.
    
    ⚠️ Note: \`redacted\` Inquiries cannot be resumed and will return an error from this endpoint.
    
    -   You can copy the example code for your desired language by clicking the 'Copy' icon in the bottom right corner.
9.  In order to allow the user to continue their resumed Inquiry, use the `session-token` as a parameter to the proper flow for your application:
    
    1.  For resuming with a [Hosted flow](../../docs/docs/hosted-flow.md), append the `session-token` to the end of the hosted flow URL: `&session-token=<session-token>`
    2.  For resuming with an [Embedded flow](../../docs/docs/embedded-flow.md), add the `session-token` as an input to the builder.

```html
<!-- Replace "X.Y.Z" with the Inquiry SDK version you want to use. -->
<script src="https://cdn.withpersona.com/dist/persona-vX.Y.Z.js"></script>

<script>
  const client = new Persona.Client({
    inquiryId: "inq_SOME_INQUIRY_ID",
    sessionToken: "SOME_SESSION_TOKEN"
    onLoad: (_error) => client.open(),
    onComplete: meta => {
      // Inquiry completed. Optionally tell your server about it.
      console.log(`Sending finished inquiry ${meta.inquiryId} to backend`);
      fetch(`/server-handler?inquiry-id=${meta.inquiryId}`);
    }
  });
</script>
```

See: [When does a link to an Inquiry expire?](./4m6n5LkyT8po1eefaBmBBO.md)

## Learn more[](#learn-more)

-   You can also generate one-time links [via API](../../docs/docs/inquiry-one-time-links.md).
