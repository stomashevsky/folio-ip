# Organization-level Workflows

## Overview[](#overview)

This guide describes how Workflows behave across environments.

## Key concepts[](#key-concepts)

### Workflow spans all environments[](#workflow-spans-all-environments)

**An organization-level Workflow** exists in and can be used in all environments in your Persona organization. For example, if your organization has one Sandbox environment and one Production environment, a single organization-level Workflow can be edited and used in both your Sandbox and Production environments.

In contrast, **an environment-level Workflow** exists in and can be used in only one environment in your Persona organization. For example, if your organization has one Sandbox environment and one Production environment, a single legacy Workflow could exist either in Sandbox, or in Production, but not both.

An environment is a runtime for Persona. Environments come in two types: Sandbox‚ which is useful for testing; and Production. To learn more about these types, see [Sandbox vs. Production Environments](./6I2kGhfPvSuUjYq4z6tpmB.md).

### Publish creates new version across all environments[](#publish-creates-new-version-across-all-environments)

An organization-level Workflow has one version history across all environments.

Publishing a new version of a Workflow publishes a new version to all environments. It is currently not possible to publish a new version of a Workflow to only some environments.

### Set a Workflow state for each environment[](#set-a-workflow-state-for-each-environment)

An organization-level Workflow can have a different state in each environment. For example, an organization-level Workflow can be active in a Sandbox environment while it is inactive in a Production environment.

To learn more about Workflow states, see [Workflows: Manage versions and state](./4cM7g2XVmqM6hicxsy9Js3.md).

## FAQ[](#faq)

### Can I run one Workflow version in one environment, and run a different version of the Workflow in another environment at the same time?[](#can-i-run-one-workflow-version-in-one-environment-and-run-a-different-version-of-the-workflow-in-another-environment-at-the-same-time)

No. Currently, the new version of a Workflow must be published to all environments at the same time.

Note that you can set a different state for each environment when you publish a new version. For example, you can have Sandbox set to active—so that the new version begins to run in Sandbox, and Production set to inactive—so that the Workflow does not run at all in Production.

### How does staging a roll-out work for an organization-level Workflow?[](#how-does-staging-a-roll-out-work-for-an-organization-level-workflow)

Staging a roll-out will deploy the new version to all environments at your chosen percentage.

For example, if you have a Sandbox environment and a Production environment, and you stage a roll-out of a new version at 50%, then the new Workflow will be rolled out to 50% in your Sandbox environment and 50% in your Production environment.

Note that you can set a different state for each environment during a rollout. For example, you can have Sandbox set to active—so that the new version begins to run alongside the previous version in Sandbox, and Production set to inactive—so that the Workflow does not run at all in Production.
