# Automatically creating a Case for Inquiry that needs review

## Overview[](#overview)

You can streamline your manual review process on Persona by automatically creating a Case for any Inquiry that meets your criteria for review. You can use [Workflows](./6i3aAp6lBK3FCf08HJgPjh.md) to automate actions on Persona, including Case creation, based on custom logic that you define using a no-code visual interface.

## Example use case[](#example-use-case)

Let's say you want to mark an Inquiry for manual review if the end user is under 18 years old.

You could create a Workflow that:

-   Runs whenever an Inquiry completes—i.e. the event `inquiry.complete` happens.
-   Does logic to determine if the user is under 18. If so:
    -   Marks the Inquiry for review—i.e. changes the Inquiry status to `inquiry.needs_review`.
    -   Creates a Case.
    -   Waits for the Case to change to a "resolved" state. The Case's state will change when your team manually reviews it, and either approves or declines it.
    -   Updates the status of the Inquiry to either `inquiry.approved` or `inquiry.declined` based on whether the Case was approved or declined.

The only manual step here is the Case review. The rest is automated by the Workflow.

## Learn how[](#learn-how)

For instructions, see: [Set up an Inquiry review process using Workflows](./88I8H0eKR6qEh3O2OyXPl.md)
