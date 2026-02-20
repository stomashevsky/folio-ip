# What is the default Account Type when creating an Account?

⚠️ This question came from a member of the Persona Community - a product manager overseeing the implementation of KYB for her company. This question is useful for those looking to understand how to troubleshoot case objects issues within Cases.

# What is the default Account Type used when creating an Account?[](#what-is-the-default-account-type-used-when-creating-an-account)

## Question[](#question)

What is the default Account Type used?

## Answer[](#answer)

Accounts can be used in a variety of ways, and to determine which Account Type is being used to create an Account, it can depend on the specific action and method.

### Understanding if your instance has more than one Account Type available[](#understanding-if-your-instance-has-more-than-one-account-type-available)

A good first step is to check to see if your instance has more than one Account Type. You can view all Account Types (including their various fields and other configurations) by going to **Accounts** > **Types**. For most customers, there is only one Account Type representing an individual or a person. For some customers, you may have more than one Account Type and one Account Type may represent a person while another Account Type may represent the business that they work for.

If your organization only has one Account Type, you can presume that wherever you are creating an Account, it is likely that you are creating that Account with that singular Account Type. If you have more than one Account Type available to your instance, the best way to understand what the "default" Account Type is, is to review the method in which you are creating that Account.

### Reviewing the various ways an Account is created[](#reviewing-the-various-ways-an-account-is-created)

Accounts can be created in a variety of ways, and when they are, you can and should always configure the Account Type. This allows you to specify whether the entity being represented as an Account within Persona actually matches to how you want to model it. For example, you would want to model a business as a "business" Account Type, but you would not want to model an individual as a "business" Account Type.

To help you recall where you may be creating Accounts in order to investigate what Account Type is being used as a default in that operation, here are a few examples:

1.  **If you are creating an Account when a user is proceeding through an Inquiry**, you can find the associated Inquiry Template in Inquiries > Templates. Click on that Inquiry Template to proceed to the Flow Editor and look for a Create Account step. Within that step, a configuration allows you to set what Account Type to create the Account under.
2.  **If you are creating an Account via API**, you may be doing this as part of the [Create Inquiry](../../docs/reference/create-an-inquiry%20%22Create%20Inquiry%20API%20Endpoint%22.md) or [Create Account](../../docs/reference/create-an-account%20%22Create%20Account%20API%20Endpoint%22.md) endpoints. For both of these API calls, an Account Type can be specified. And the best way to review this is to take a look at your code or to review the [API Logs](https://app.withpersona.com/dashboard/api-logs "API Logs") in your dashboard to see if which Account Type is set as part of the API call.
3.  **If you are creating an Account via Workflows**, you may be doing this as part of the Create Inquiry workflow step or the Find or Create Account step. You can find the associated Workflows by navigating to Workflows > All Workflows. And then click on the Workflow you suspect contains the step you'd like to investigate and then looking for that step. Within that step, a configuration allows you to set what Account Type to create the Account under.

📌 This answer was last updated on January 6th, 2025 by Justin Sayarath, a product manager at Persona. FAQs, unlike other articles, are written to provide Persona Community members more specific answers to common questions. While we periodically review responses and answers, please note when this FAQ was last updated as information may have changed since then.

## Related articles

[Creating custom Account Types and Fields](./NrM9W6KETzMbzQXgdU3cV.md)
