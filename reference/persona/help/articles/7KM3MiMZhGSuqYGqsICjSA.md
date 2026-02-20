# Workflows Slack Integration

This article describes how to use the older version of the Slack integration that depends on Slack webhooks. For the newer method, see [Set up Slack integration](./7FlnOvBKFu6k7sunbzQH0K.md).

## Overview[](#overview)

You can automatically send Slack messages from a Workflow using Persona's Slack integration.

In this article, you’ll learn how you can use Workflows to:

-   Send a Slack message.
-   Include dynamic values in a Slack message.
-   \[Deprecated Slack webhooks only\] Post into a different Slack channel than the default defined by your Slack webhook.

### Background[](#background)

-   Before you can set up the Slack integration in Persona, you’ll need to create an incoming webhook URL for your Slack instance. For instructions, see [this guide from Slack's help center](https://api.slack.com/messaging/webhooks).
-   Learn the basics of [how to create and edit a Workflow](./20Zvcq50493eMUdt7aDhRY.md).

### Prerequisites[](#prerequisites)

-   To edit a Workflow, you need the following permissions in your Persona organization: "Create new workflow and make updates to existing workflows".

## Send a Slack message from a Workflow[](#send-a-slack-message-from-a-workflow)

The Slack integration is available in Workflows as an Action step.

To make your Workflow send a Slack message:

1.  Add an Action step type to the Workflow. 
    
2.  In the Configuration section, find the Action input. Select: **App Integration > Slack > Send Slack Message**.
    
3.  Configure the required settings:
    
    -   **Slack Webhook URL**: an incoming webhook URL for your Slack instance. Note: this URL defines the Slack channel where messages are sent.
    -   **Message**: the content of the Slack message.
        -   See [Slack's documentation](https://api.slack.com/reference/surfaces/formatting) to learn how you can format your message.
4.  Save the Workflow, and publish it when you’re ready to roll out the change.
    

## Include dynamic values in a Slack message[](#include-dynamic-values-in-a-slack-message)

The Slack message can include dynamic values from other parts of the Workflow. 

To view and insert available variables, click the "**+**" sign on the side of the "Message" field. 

### Examples[](#examples)

You can copy and paste these examples into the “Message” field.

**Inquiry approved**

**Note:** You can use `{{trigger.status}}` to get the current status of the inquiry, and use that in a workflow conditional to determine whether to send this message.

```
  An inquiry has been *approved.*   
  See the inquiry in Persona <https://app.withpersona.com/dashboard/inquiries/{{trigger.id}}|here>
```

**Additional information about an inquiry**

`Reference ID: {{trigger.account.reference\_id}}`  
`First name: {{trigger.fields.name\_first}}`

## \[Deprecated\] Post into a different Slack channel than the default[](#deprecated-post-into-a-different-slack-channel-than-the-default)

_**Note:** This setting only works for an older, now-deprecated version of Slack webhooks._

To post into a different Slack channel than the one specified by your webhook, specify the alternate Slack channel in the **Advanced Configuration > Recipient Override** setting of the Action step. 

Note that in order for your message to successfully post, your Slack webhook must have permission to post into that channel.

The alternate Slack channel name can contain dynamic values. To view and insert available variables, click the "**+**" sign on the side of the Recipient Override input.
