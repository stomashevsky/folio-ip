# How are my emails getting routed?

⚠️ This question came from a member of the Persona Community - a team manager responsible for manual review of cases. This question is useful for those looking to debug issues with email threading or replies to emails used within the Cases email module.

# Question[](#question)

How are my emails getting routed?

# Answer[](#answer)

When using the email functionality within Cases, customers can either reply to an existing email thread (where the new message will be added to the current conversation) or start a completely new email thread.

To ensure that customer emails are directed to the correct thread and to prevent delays in customer service, Persona uses unique email identifiers to accurately route messages. Persona uses two unique email identifiers: `Message-ID` and `Ticket-ID`.

⚠️ Removing all of the text from an email conversation (or when replying to a conversation) will remove these email identifiers causing the threading to fail. It is best practice to simply reply to conversations, keeping the body of the conversation intact for the purposes of threading and keeping an audit log of conversations between the case reviewer and the end user.

### Message-ID[](#message-id)

Persona’s email threading logic follows RFC standards, where the "In-Reply-To" and "References" fields must contain unique values. When an email is created within the Case Messaging module, Persona automatically assigns it a unique identifier called `Message-ID`.

When you reply to an email, the Message-ID of the original email is included in the "In-Reply-To," "References" section. This Reference ID is used to thread the reply to the original email. For every inbound email, Persona scans Message-IDs stored in "In-Reply-to" and "References" fields. If that message-ID matches an existing outbound email, then the email is added to the email thread.

### Ticket-ID[](#ticket-id)

In addition to the Message-ID, Persona assigns a unique identifier called a `Ticket-ID` to each email or notification via an embedded HTML tag. This `Ticket-ID` helps ensure that emails are correctly threaded. As long as the tag remains intact, the email will maintain proper threading.

## Unthreaded email conversations[](#unthreaded-email-conversations)

If a customer sends an email message to the email address used in your Cases email functionality (i.e. [organization-name@cases.withpersona.com](mailto:organization-name@cases.withpersona.com)) without a `Message-ID` or `Ticket-ID`, it will be treated as a new thread.

These unthreaded emails may be manually routed within your organization, which can lead to delays. To avoid potential response delays, avoid sending one-off emails to [organization-name@cases.withpersona.com](mailto:organization-name@cases.withpersona.com). Instead, reply within an existing thread whenever possible.

📌 This answer was last updated on October 20, 2024 by Karen Islas, a product manager for Cases. FAQs, unlike other articles, are written to provide Persona Community members more specific answers to common questions. While we periodically review responses and answers, please note when this FAQ was last updated as information may have changed since then.

## Related articles

[Why did my email attachment fail?](./3QmLXcECBb6rzlDOblpcse.md)

[Cases Email module](./qcQ5CqIFeDQaS8TJt0JUD.md)
