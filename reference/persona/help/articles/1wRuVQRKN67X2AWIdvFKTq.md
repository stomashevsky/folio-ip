# Notify on stuck workflows

## Set a workflow to notify if another workflow doesn’t finish in 5 mins.[](#set-a-workflow-to-notify-if-another-workflow-doesnt-finish-in-5-mins)

Occasionally workflows get stuck or take longer than expected to complete. And if a workflow is stuck, then having a step inside of that workflow to notify you is also never going to trigger because it’s stuck. So what we’re going to outline here is how to set up a separate workflow that notifies you if the first workflow get stuck.

## Name our Objects[](#name-our-objects)

Let’s refer to the triggering inquiry as “Original inquiry” and the workflow that occasionally gets stuck as “Review inquiry workflow”. The review inquiry workflow is triggered to run off of the original inquiry entering the `Completed` status. We don’t need to change anything with those two objects.

The “Notification Workflow” will be our new workflow and it will do the following:

-   Also trigger off the original inquiry entering the `Completed` statues
-   Wait for any of 3 Events: Inquiry approved, Inquiry declined, Inquiry marked for review.
-   Conditional branch off of those same inquiry statues and send a notification if none of them are met (because the Review Inquiry workflow got stuck)

![NotificationWorkflowExample001](../images/NotificationWorkflowExample001_da7aed841f2f.png)

## Step by Step[](#step-by-step)

Let’s walkthrough the process for building this workflow from creation to published.

### Create Workflow[](#create-workflow)

-   From the Workflows page, click the **Create workflow** button at the top right.

![Screenshot 2025-09-25 at 12.38.32 PM](../images/Screenshot_2025-09-25_at_12.38.32_C3_A2__PM_f4ef30e08294.png)

-   In the New Workflow widget:

![Screenshot 2025-09-25 at 12.39.58 PM](../images/Screenshot_2025-09-25_at_12.39.58_C3_A2__PM_7ae9233d8921.png)

-   Enter a descriptive name
-   Optionally fill out the description field
-   Leave the Trigger Type on Event
-   Leave the Trigger event on `inquiry.completed`

⚠️ We want this new workflow to start at the same time as the Review Workflow so we can base the wait step on the same starting point.

-   Click the **Continue** button.

### Set Trigger Criteria[](#set-trigger-criteria)

⚠️ Unless you set a Trigger Criteria, every single inquiry that gets set to `inquiry.completed` will trigger this workflow. Let’s use the trigger criteria to narrow the scope.

-   Select the On Inquiry completed step at the top of the flow.

![Screenshot 2025-09-25 at 12.40.32 PM](../images/Screenshot_2025-09-25_at_12.40.32_C3_A2__PM_37adf210b100.png)

-   Click the **Edit** icon to the right of **Trigger Criteria**.

![Screenshot 2025-09-25 at 12.41.03 PM](../images/Screenshot_2025-09-25_at_12.41.03_C3_A2__PM_39e56ee1b4b5.png)

-   In the where field, set it to Trigger template id.
-   Then from the value drop down on the right, scroll and select the specific inquiry template you want this workflow to trigger from.
-   Click the **Close** button.

## Wait Step[](#wait-step)

![Screenshot 2025-09-25 at 12.42.18 PM](../images/Screenshot_2025-09-25_at_12.42.18_C3_A2__PM_dd848787e4dc.png)

-   Click the empty node between On Inquiry Completed and Output Data.
-   From the list on the right, click **Wait**.
-   Leave the Wait for field on `Object`.
-   Set Target Object to Workflow Trigger, which is the original inquiry.

![Screenshot 2025-09-25 at 12.42.38 PM](../images/Screenshot_2025-09-25_at_12.42.38_C3_A2__PM_4e8767a5c9b1.png)

-   For events, set all three of the options: Inquiry approved, Inquiry declined, & Inquiry marked for review
-   Set the time to `300s` for 5min.

❓Why 5 mins? Most workflows with reports and database verifications complete well before five mins. So if it’s taking it longer than 5min, that’s a good time to investigate.

-   Click the **Close** button.

### Conditional Step[](#conditional-step)

-   Add a new step after the Wait Step, and select `Conditional` from the list on the right.

![Screenshot 2025-09-25 at 12.43.18 PM](../images/Screenshot_2025-09-25_at_12.43.18_C3_A2__PM_c6ef16de092c.png)

-   For Route 1, click the **Edit** icon to the right.

![Screenshot 2025-09-25 at 12.48.00 PM](../images/Screenshot_2025-09-25_at_12.48.00_C3_A2__PM_8adec8aa00a1.png)

-   Update the Label to `Post-Inquiry` since we want to indicate a route for runs where the trigger object, the original inquiry, has moved into one of the Post-Inquiry statues.
-   In the Condition:
    -   Set Where to Trigger status
    -   Set the Operator (in the middle) to `is in`
    -   Set the value to `approved`, `declined`, & `needs_review`
-   Click back to the flow.

![Screenshot 2025-09-25 at 12.48.32 PM](../images/Screenshot_2025-09-25_at_12.48.32_C3_A2__PM_ab19df19ce2c.png)

⚠️ The point of the condition is to check that after five minutes if the original inquiry is still in the Completed status, and needs to send a notification, or it’s in one of the Post-Inquiry statues. Depending on how you set up your condition, you’ll need to adjust where you place the notification step. Since we’re checking in Route 1 if it’s in Post-Inquiry (which we don’t need a notification for) we need to place the notification in the Else route instead.

-   Select the blank step in Route one and cancel it via the **Cancel** button at the bottom right.

![Screenshot 2025-09-25 at 12.48.49 PM](../images/Screenshot_2025-09-25_at_12.48.49_C3_A2__PM_7634464744a3.png)

-   Click the new step node under the Else Route.
-   Select Action step, and then search for “Send”. This will bring up a number of notification options. Select a configure the one you’d prefer.

![Screenshot 2025-09-25 at 12.49.15 PM](../images/Screenshot_2025-09-25_at_12.49.15_C3_A2__PM_aecadb130eb4.png)

-   OR select Action, step and then search for “HTTP”. This will bring up the Make HTTPS Request Action step, allowing you to configure a HTTPS request to your system.

![Screenshot 2025-09-25 at 12.49.35 PM](../images/Screenshot_2025-09-25_at_12.49.35_C3_A2__PM_b2db8c07ce88.png)

-   Lastly, review and Publish the workflow.
