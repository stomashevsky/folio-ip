# Tutorial: Unique Hosted Flow links via API

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Hosted Flow](./hosted-flow.md)

# 

Tutorial: Unique Hosted Flow links via API

There are [three ways to use Hosted Flow](./choosing-an-integration-method.md#hosted-flow):

1.  **Create a generic link** (No code)
2.  **Create unique links manually** (No code)
3.  **Create unique links via API** (Some code required)

This guide walks you through the third method: creating unique links via Persona’s API. This is the method we recommend you use at scale.

You will:

-   Make an API call to create an inquiry
-   Create a Hosted Flow inquiry link
-   Send that link to a “user” (which can be yourself)
-   View the results via API
-   (optional) Set up and receive webhook alerts about changes to the inquiry

To learn how to use the other two no-code methods, see the [Help Center guide on Hosted Flow](https://help.withpersona.com/articles/4pZBZYAFLkKMyXycGeAMV2/).

## Prerequisites

You’ll need access to:

-   A Persona account
-   A Persona [API key](./api-keys.md) - use the **Sandbox API key**
-   A tool that lets you make HTTP requests (e.g. curl, Postman, a programming language)

Before you start, you should:

-   Understand what an [inquiry](./inquiries.md) is
-   Sign into the [Persona dashboard](https://help.withpersona.com/articles/3QGnmQLLnykxUkPl1wIdLT/)

## Scenario

A user named Alexander Sample just joined your dog walking app as a dog walker. You want to verify his identity to ensure the safety of users on your service.

Alexander’s user ID in _your_ app is “usr\_ABC123”. During account signup in your app, he stated his birthdate is August 31, 1977.

## Step 1: Create an inquiry template

Every inquiry is created from an [inquiry template](./inquiry-templates.md), which defines details like the specific verification logic and UI text and branding of that inquiry. You can think of inquiry templates as a mold that lets you create many inquiries.

Persona offers a suite of [solutions](https://help.withpersona.com/solutions/all-solutions/) that include preconfigured inquiry templates. In this tutorial, use the “KYC” solution to verify your dog walkers.

**Follow [these instructions](https://help.withpersona.com/articles/67J7FurQtIgwxkWWvUropu/)** to add the “KYC” solution to your Sandbox environment.

## Step 2: Locate the inquiry template ID

Find the ID of the newly-created inquiry template.

In the Persona dashboard, navigate to **Inquiries** > **Templates**. Find the “KYC” template in the list of inquiry templates, and note the value in the `ID` field. The value should begin with `itmpl_`.

## Step 3: Create an inquiry via API

Now, create an inquiry for Alexander Sample using the “KYC” inquiry template.

Make a POST request to [`/api/v1/inquiries`](./api-reference/inquiries/create-an-inquiry.md):

```
curl https://api.withpersona.com/api/v1/inquiries \
-X POST \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json" \
-H "Persona-Version: 2025-10-27" \
-d '{
    "data": {
        "attributes": {
            "inquiry-template-id": "itmpl_XXXXXXXXXXXXX",
            "reference-id": "usr_ABC123",
            "fields": {
                "name_first": "Alexander",
                "name_last": "Sample",
                "birthdate": "1977-08-31"
            }
        }
    }
}'

# Replace:
# - YOUR_API_KEY with your API key
# - itmpl_XXXXXXXXXXXXX with the inquiry template ID from Step 2
```

This code demonstrates two best practices when creating inquiries:

-   **Pass a [reference ID](./reference-ids.md)**: “usr\_ABC123” is set as the `reference-id`. A reference ID lets you tag an inquiry as being associated with a particular end user. Persona recommends using the user’s UID from your internal systems.
-   **[Pre-fill inquiry fields](./inquiry-fields.md#prefilling-inquiry-fields)**: We pre-fill the inquiry with information we know about Alexander: his first name, last name, and birthdate. Providing this information helps streamline the verification experience for Alexander, and helps increase your confidence that his information is valid.

After you make this request, you should receive a JSON object as the response. The JSON has the following shape:

```
{
    "data": {
        "type":"inquiry",
        "id":"inq_XXXXXXXXXXXXX",
        "attributes": {
            ...
        }
    }
}
```

In the JSON, locate the top-level `id` field. This is the ID of the created inquiry, and it should begin with `inq_`. We’ll need this value in the next step.

## Step 4: Create the Hosted Flow inquiry link

Create Alexander’s unique verification link by combining the following base URL with your inquiry ID:

`https://inquiry.withpersona.com/verify?inquiry-id=inq_XXXXXXXXXXXXX`

Replace `inq_XXXXXXXXXXXXX` with the inquiry ID from Step 3.

This URL directs Alexander to a personalized verification flow with his information pre-filled. You can visit this URL to test that it works—but don’t start the verification yet. We’ll do that in Step 7. (Note: you’ll see a warning about being in a Sandbox environment. This is expected because you’re using Sandbox for testing.)

## Step 5: Set up a webhook (optional)

You can receive notifications when any inquiry’s state changes. For example, you can be alerted when any inquiry is started by a user, or when any inquiry is completed. See the [full list of inquiry events](./model-lifecycle.md#events) you can be alerted about.

To receive automatic notifications:

1.  Create a webhook endpoint (for a sample server, see [Webhook quickstart](./quickstart-webhooks.md))
2.  In the dashboard, navigate to **Webhooks** > **Webhooks**.
3.  Add your endpoint URL
4.  Select the following “Enabled events”: `inquiry.started`, `inquiry.completed`, `inquiry.approved`, `inquiry.declined`, and `inquiry.failed`

For this tutorial, you can skip webhooks and view results in the dashboard.

## Step 6: Send the inquiry link to “Alexander”

Now you’re ready to share the Hosted Flow inquiry link with Alexander Sample. In a real production situation, you could share the link programmatically (e.g. within a user flow in your dog walking app, or via a programmatic SMS/email) or even manually (e.g. via an SMS/email) if you’re working at a small scale.

For this tutorial, you don’t actually have to send the link to anyone—you can pretend to be Alexander.

## Step 7: Complete the inquiry

In production, Alexander would click the link and complete verification on his own.

For this tutorial, you’ll complete the flow yourself as Alexander:

-   Open the link from Step 4.
-   Click through the verification flow. Do not enter real personal information, since this is Sandbox.
-   Keep the “Pass verifications” toggle enabled (visible at the bottom of the flow) to simulate passing all the checks.

Note: by default, an inquiry will expire if not completed within 24 hours. See [Inquiry expiration](./inquiry-expiration.md) for details.

## Step 8: (optional) Inspect webhook events

If you set up the webhook in Step 5, check your server logs. You should see events from `inquiry.started`, `inquiry.completed`, and `inquiry.approved`.

Note: If you want to receive the `inquiry.failed` event, you can create a second inquiry using the curl command from Step 3. Then click through the verification flow, this time with the “Pass verifications” toggle _disabled_.

## Step 9: View inquiry results via API

Now that you’ve completed the inquiry, take a look at the results. Note that because this inquiry was created in Sandbox, some of the data will be demo data.

Retrieve the inquiry details:

```
curl https://api.withpersona.com/api/v1/inquiries/inq_XXXXXXXXXXXXX \
-X GET \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json" \
-H "Persona-Version: 2025-10-27"

# Replace:
# - YOUR_API_KEY with your API key
# - inq_XXXXXXXXXXXXX with the inquiry ID from Step 3
```

The response includes:

-   `data.attributes.reference-id`: The reference ID you provided
-   `data.attributes.status`: Should be `approved`
-   `data.attributes.fields`: Pre-filled and collected data

Note that:

-   The final status of your inquiry is `approved` instead of `completed` because the KYC solution includes Workflows that automatically approve passing inquiries. See the Next Steps section to learn more.
-   Because this inquiry was created in Sandbox, much of the data will be null or empty. Keep in mind you’ll see different outputs in Production.

**Alternative: View in Dashboard** You can also view results in the dashboard at **Inquiries** > **All Inquiries**. See [this Help Center guide](https://help.withpersona.com/articles/nqBDRxxIjiIvnOwsCpri6/) for details.

## Summary

In this tutorial, you:

-   Created an inquiry via API with pre-filled data about a user
-   Constructed a Hosted Flow inquiry link
-   Completed the verification flow
-   (Optional) Received alerts about changes to the inquiry, via webhook
-   Retrieved inquiry results via API

This is a complete API-based Hosted Flow integration.

## Next steps

To learn more, check out the following resources:

-   **Pre-fill additional fields**: To see what other fields you can pre-fill in an inquiry, look at the `fields` object in the [Create Inquiry API doc](./api-reference/inquiries/create-an-inquiry.md), under `request` > `data` > `attributes` > `fields`.
-   **Subscribe to additional events**: Understand the different [inquiry events](./model-lifecycle.md#events) you can be alerted about, and the difference between the “Done” and “Post-inquiry” phases.
-   **Handle inquiry expiration:** Learn how to manage inquiries that aren’t completed in time. See [Inquiry expiration](./inquiry-expiration.md).
-   **Learn webhook best practices**: In production, you’ll need to handle duplicate events and [other issues](./webhooks-best-practices.md).
-   **Explore the KYC solution**: The [KYC solution](https://help.withpersona.com/articles/2OOWdhAoEeVrMRKRFENneW/) includes two [Workflows](./workflows.md) and a [Case](./cases.md) template. In this tutorial, the Workflows seamlessly ran in the background and changed the final status of your inquiry from `completed` to `approved`.
-   **Explore other integration methods:** Try Embedded Flow for seamless integration with your website. See [Choosing an integration method](./choosing-an-integration-method.md).
