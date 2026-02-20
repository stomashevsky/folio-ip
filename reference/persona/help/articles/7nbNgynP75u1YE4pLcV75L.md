# Phone Carrier Verification

## Overview[](#overview)

The Phone Carrier Verification verifies the authenticity of inputted phone numbers by checking the legal name and phone number against global telecommunications carrier databases. It adds an additional layer of data to ensure not only that the physical phone is with the individual, but that it’s actually associated with that individual’s name. A Phone Carrier Verification answers the question “Do telco operators corroborate provided user data?”

## Verification Features[](#verification-features)

### Verification Inputs[](#verification-inputs)

-   Phone Number (Required)
-   First Name
-   Last Name
-   Birthdate
-   Address

### Verification Outputs[](#verification-outputs)

**Verification status** A Verification’s status is an indicator of where the Verification is in its lifecycle. After a Verification has run the simplest output and indicator is the status as `failed` or `passed`. This is an easy way to ascertain, at a high level, if the attempt to verify the identity met the requirements set forth in the configurations of the Verification Template.

**Verification Check statuses** Each Verification check will be shown as `passed`, `failed`, or `not applicable`. This will give a more detailed look at which of the Verification Checks the attempt failed. In the Dashboard, the results view of the Verification also show which checks were required on the Verification Template when the Verification ran. Those that were required determine what checks are necessary to receive a `passed` at the Verification Status level.

**Verification Check details** Given that the Verification checks can determine whether the attempt passes or fails the Verification, some Verification checks offer more detail about the failure reason and the specifics around why the attempt failed or passed that particular check. This allows a reviewer to understand more granularly what constitutes pass and fail, and gives insights into what Verification Template configurations may need to be optimized or adjusted.

## Configuration options[](#configuration-options)

The Phone Carrier Verification offers configurations including various required or un-required verification checks.

## Database Verification (Phone Carrier) access by plan[](#database-verification-phone-carrier-access-by-plan)

|  | **Startup Program** | **Essential Plan** | **Growth and Enterprise Plans** |
| --- | --- | --- | --- |
| Phone Carrier Verification | Not Available | Available | Available |

[Learn about pricing and plans](../../landing/pricing.md)
