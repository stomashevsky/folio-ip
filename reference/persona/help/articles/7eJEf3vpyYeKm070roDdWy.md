# Cases Checklist

## Overview[](#overview)

Within a [Case template](./5WFMyVPjzgXQNljqg2xf4h.md), you can create a custom checklist for agents to follow and complete when reviewing each case.

## Example use case - Update Account[](#example-use-case---update-account)

Let's say you have a Workflow set up that runs a Watchlist Report for every completed Inquiry.

There are specific inputs required for a Watchlist Report **First Name, Last Name, and DOB** and you rely on data extraction in order to obtain those inputs in order for a successful run through the Workflow and Watchlist Report.

However, for a subset of your end users, data extraction fails because it is not currently supported or for some other reason. You need a way to modify the Account for which data extraction failed on its associated Inquiries.

Cases can be helpful here as a way to centralize the review process for your agent.

After creating a new Case template, navigate to the template by going to **Cases > Templates**, and clicking on the template name. This will lead you to your Case template page where you can modify your template. To the right is a Component Library with prebuilt modules you can add to your template.

Click on the Checklist module and drag it to your template.

Add items to your checklist by highlighting the Checklist module in your template. To the right, you'll see the Settings menu. Click on the **Add Item** button, and a window will appear.

Type in the Item description.

Under the Required for Statuses drop-down menu, choose which status you would like the Case to transition to once the item is completed and checked off.

In this case, we want to make sure that the agent updates the First Name, Last Name, and Birthdate on the account. This must be completed before the Case can have an `Approved` status.

Once items is added to your Checklist settings, add them to the Checklist itself by toggling it to **On**.

Lastly, hit **Save** at the top right to save your work!

Be sure to modify your existing Workflow by adding a new route that addresses Inquiries with a failed extraction. Within that new route, add an Action step to create a Case. Choose the case you created.
