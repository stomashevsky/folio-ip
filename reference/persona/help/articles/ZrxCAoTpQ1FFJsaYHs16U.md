# Can Persona identify the same user from different Inquiries?

Yes, you can link multiple Inquiries to the same user by using a feature called Accounts.

## Accounts: a quick overview[](#accounts-a-quick-overview)

Each Account represents one unique user. Each Account is identified by a unique “reference ID”, which you define. For example, you can set the reference ID of an Account to the UUID of the corresponding user in your system.

When you create an Inquiry, you can pass in a reference ID, and that Inquiry will be linked to an Account with that reference ID. If you create many Inquiries with the same reference ID, they will all be linked to the same Account.

## Why use an Account?[](#why-use-an-account)

Accounts can be helpful if you want to reverify an individual user throughout their time with you. For example, you might reverify a user whenever they make a large transaction, and/or every year. Accounts help with reverification because they let you build a history about an individual. You can use information tied to an Account, including previous Inquiries, in future reverifications.

Accounts also works well with our Workflows product. You can use a Workflow to automate decisions you want to make using the history of an individual. For example, you can create a Workflow that automatically checks whether the collected attributes on an Account—such as government ID number, name, and email—matches attributes you want to flag, and then flags these Accounts.

## Learn more[](#learn-more)

To learn more about Accounts, see [Accounts overview](./2gE7mjjLCIGJPnK6mTyjU9.md).
