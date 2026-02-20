# Verification Lifecycle

Verifications move through various statuses as they progress from initialization to data submission and finally verification completion. Verifications are independent objects that are associated with an Organization. In order to configure collection options and requirement status verification checks, a VerificationTemplate is needed. A Verification can be created either through our hosted/embedded flows or through an external API.

## Verification lifecycle

The basic flow of a verification looks like this:

1.  A new Verification is initialized with the status `initiated` with configuration from a VerificationTemplate
2.  Attributes and images are attached to the verification
3.  A verification is submitted with the status of `submitted` and attributes and images are no longer able to be changed.
4.  Persona will process the submitted data and generate checks and decision status based on the configuration from the VerificationTemplate
5.  If verification passes, the verification status is updated to `passed`
6.  If verification fails, the verification status is updated to `failed`
7.  If verification skipped, the verification status is updated to `skipped`

## Verification statuses

| Status | Description |
| --- | --- |
| `initiated` | Verification has started, claimed information can now sent and saved to the server for verification |
| `confirmed` | Verification has been confirmed. This status is specific to PhoneNumber and Email verifications, where a confirmation code has been entered and verified. |
| `submitted` | Verification has been submitted, the claimed information is frozen and the server will process the verification |
| `passed` | Verification has passed. The required checks have passed and the information is verified |
| `failed` | Verification has failed. Some or all of the required checks have failed and verification has failed |
| `requires_retry` | Verification requires a resubmission. The checks could not be fully processed due to issues with the submitted information. _Note: This status is now deprecated. For use cases that may require a retrying a verification, it is recommended to condition on the `passed` status, `failed` status, or if within an Inquiry, number of failed verification attempts within the Inquiry._ |
| `canceled` | Verification timed out. This is usually indicative of an internal server error |
| `skipped` | Verification skipped. This is a status specific to AAMVA verifications submitted for a non-participating jurisdiction. |
