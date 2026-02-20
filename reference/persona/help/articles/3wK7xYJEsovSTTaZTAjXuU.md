# Creating a Verification

# Creating Verifications[](#creating-verifications)

## Overview[](#overview)

[Verifications](../../docs/docs/verifications.md) are modular building blocks that help answer the question: _“Is this person who they claim to be?”_ These checks are used to verify digital transactions by tying user-provided data to physical identities using documents, databases, biometrics, and more.

Persona offers a wide variety of **Verification Types**—such as Government ID, Selfie, Document, and Database—that can be mixed and matched depending on your risk thresholds, compliance requirements, and user experience goals. Each Verification Type is designed to work in conjunction with others for maximum flexibility and assurance.

## Methods for creating a Verification[](#methods-for-creating-a-verification)

### 1\. As part of an Inquiry (Recommended)[](#1-as-part-of-an-inquiry-recommended)

Verifications are most often created as part of an Inquiry flow. Verifications Templates can be configured within an Inquiry Template and when an Inquiry is created and a user moves through the flow the Verification is created when they reach that verification step.That Inquiry template defines which Verification Types will be included in the flow and how each will behave.

By creating an Inquiry using the appropriate Inquiry Template, you trigger the eventual creation of one or more Verifications that as the user reaches those points in the flow.

#### Relevant objects and API endpoints[](#relevant-objects-and-api-endpoints)

-   [Create an Inquiry](../../docs/reference/create-an-inquiry.md)

### 2\. Within a Workflow[](#2-within-a-workflow)

You can also create Verifications within a Workflow using different steps. This provides a solution when a Verification is not included in an Inquiry Template or when a Verification Template needs to be used independently.

### 3\. Creating Verifications in the API request[](#3-creating-verifications-in-the-api-request)

Though it is possible to create Verifications via the Create Verification-related API endpoints directly, it is not recommended. For the most robust and stable experiences, we recommend running verifications within a Workflow or as part of an Inquiry.

#### Relevant Workflow steps[](#relevant-workflow-steps)

-   [Workflows: Run Verification step](./5og9iSBjuzRbdpjHPwMUBH.md)

Similar to the method above, you will need to specify the Verification Template for newly created Verifications. See the article on [Workflows: Run Verification step](./5og9iSBjuzRbdpjHPwMUBH.md) for step-specific configurations.

## Related articles

[Workflows: Run Verification step](./5og9iSBjuzRbdpjHPwMUBH.md)

[Inquiry Template Steps](./1z8F1l9Q28qNxQFtKoMfY3.md)

[What is a Dynamic Flow Inquiry Template?](./27izB0uVteJugv9I7IlVb3.md)
