# Managing Workflow versions and state

## Overview[](#overview)

Workflows can be continually edited. Learn about features that help you to manage the state of a Workflow, and to edit and deploy updates.

You can:

-   Set a Workflow to active or inactive.
-   Draft and publish new versions of a Workflow.
-   Stage a gradual roll-out of a new version.
-   Restore a previous version.
-   Archive a Workflow.

## Key concepts[](#key-concepts)

### Versions[](#versions)

A version represents one variant of a Workflow. Because a Workflow can be edited, it may have one or more versions.

When a Workflow is active, the most recent version of the Workflow will run.

### State[](#state)

You can set the state of a Workflow to active or inactive.

-   **Active**: Workflow is live and running.
-   **Inactive**: Workflow is not running.

## Edit and publish a Workflow[](#edit-and-publish-a-workflow)

![workflows-versions.svg](../images/4cM7g2XVmqM6hicxsy9Js3-14182505248915_24b556e08067.png)

### Edit a draft[](#edit-a-draft)

Each Workflow can be edited. When you edit a Workflow, a new draft is created. You can save changes to the draft and continue editing it later.

### Publish a new version[](#publish-a-new-version)

When you are ready, you can publish a draft. Publishing a draft creates a new version of the Workflow.

When you publish a draft, you decide:

-   **Roll out percentage**: The fraction of users to roll out the new version to. By default, the new version will be rolled out to all users. If you want to roll out a new version gradually, you can “stage a roll-out”.
-   **Environments** **\[Only in organization-level Workflows\]**: The environments where the Workflow will be active after the new version is published. You can choose to activate the Workflow in any environment where it’s inactive; and to inactivate the Workflow in any environment where it’s active.
    -   Learn more about organization-level Workflows [here](./4rjJO3TZUWqgcL8DgQkSPq.md).

### Publish: Stage a Roll-out[](#publish-stage-a-roll-out)

If you want to roll out a new version of a Workflow gradually (for example, for testing purposes), you can “stage a roll-out”.

When you stage a roll-out, the new version of a Workflow is created, but runs for only a percentage of Workflow runs. You choose the percentage. Remaining runs continue to use the previous version of the Workflow.

**Edits are locked**

While you are staging a roll-out of a Workflow, you cannot edit the Workflow.

You must either finish or undo the roll-out before you can edit the Workflow.

**Modify roll-out percentage**

You can progressively roll out to a larger percentage of users, or roll back to a smaller percentage of users, by changing the roll-out percentage.

**Finish a roll-out**

To roll out the Workflow to all users, increase the roll-out percentage to 100%.

**Undo a roll-out**

To undo a roll-out, decrease the roll-out percentage to 0%.

### Restore a previous version[](#restore-a-previous-version)

You can access previous versions of a Workflow in its version history, and restore a previous version of a Workflow. Restoring a previous version creates a new Workflow draft. You can further edit this draft, then publish it.

If you are staging a roll-out and wish to “roll back” to the previous version, you must undo the roll-out by setting the roll-out percentage to 0%.

## Activate or deactivate a Workflow[](#activate-or-deactivate-a-workflow)

You can set the state of a Workflow to active or inactive.

For each Workflow, you can set the state of the Workflow within its environment. You can change this setting at any time using the “… More” button in the upper right corner of the Workflow editor.

## Archive a Workflow[](#archive-a-workflow)

You can archive a Workflow to permanently remove it.

If a Workflow is active when it is archived, it will be deactivated when it is archived. An archived Workflow is no longer findable through the Dashboard and cannot be viewed in the Dashboard.
