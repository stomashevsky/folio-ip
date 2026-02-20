# Phone Number Verification

## Overview[](#overview)

The Phone Number Verification verifies the ownership of an inputted phone number with two-factor authentication via text. It is often used for additional friction at onboarding or reverification flow. A Phone Number Verification answers the question “Does the user possess their claimed phone number?”

## Verification Features[](#verification-features)

### Verification Inputs[](#verification-inputs)

-   Phone number

### Verification Outputs[](#verification-outputs)

**Verification status** A Verification’s status is an indicator of where the Verification is in its lifecycle. After a Verification has run the simplest output and indicator is the status as `failed` or `passed`. This is an easy way to ascertain, at a high level, if the attempt to verify the identity met the requirements set forth in the configurations of the Verification Template.

**Verification Check statuses** Each Verification check will be shown as `passed`, `failed`, or `not applicable`. This will give a more detailed look at which of the Verification Checks the attempt failed. In the Dashboard, the results view of the Verification also show which checks were required on the Verification Template when the Verification ran. Those that were required determine what checks are necessary to receive a `passed` at the Verification Status level.

## Configuration options[](#configuration-options)

The Phone Number Verification offers a few configurations, including required or un-required verification checks, and maximum retries (the number of confirmation code attempts allowed).

## Phone Number Verification access by plan[](#phone-number-verification-access-by-plan)

|  | Startup Program | Essential Plan | Growth Plan | Enterprise Plan |
| --- | --- | --- | --- | --- |
| Phone Number Verification | Not Available | Available | Available | Available |

[Learn about pricing and plans](../../landing/pricing.md)
