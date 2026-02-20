# Inquiries

The inquiry represents a single instance of an individual attempting to verify their identity. The primary use of the inquiry endpoints is to fetch submitted information from the flow.

Inquiries are created when the individual begins to verify their identity. Check for the following statuses to determine whether the individual has finished the flow. See [Inquiry Model Lifecycle](../model-lifecycle.md) for a detailed overview of how an individual verifies their identity.

| Inquiry Status | Description |
| --- | --- |
| Created | The individual started the inquiry. |
| Pending | The individual submitted a verification within the inquiry. |
| Completed | The individual passed all required verifications within the inquiry. |
| Failed | The individual exceeded the allowed number of verification attempts on the inquiry and cannot continue. |
| Expired | The individual did not complete the inquiry within the configured expiration interval (24 hours by default). |
| Needs Review / Approved / Declined (Optional) | These are optional statuses applied by you to execute custom decisioning logic. |

Advanced actions for [sessions](../inquiry-sessions.md) and decisioning (e.g. [approving](./inquiries/approve-an-inquiry.md) and [declining](./inquiries/decline-an-inquiry.md)) are also available for this resource.
