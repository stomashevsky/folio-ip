# I'm failing passport verification because of a long name

## I can’t verify my passport because my name is too long?[](#i-cant-verify-my-passport-because-my-name-is-too-long)

With Machine-readable zones (MRZs) encoding there are limits on the length of a name, with a preference for including the full last name at the expense of the first name. So if someone has a long name that exceeds the character limit for MRZ, the first name will be truncated or shorted to fit in the MRZ. For example `Alexander` might be shorted to `Alex`, `Ale`, `Alexa`, or some other variation.

When the near-field communication (NFC) chip is encoded, the data from the MRZ is used. So if the MRZ shorted `Alexander` to `Ale`, then the NFC will also encode `Ale` as the first name. The decoded NFC data and the MRZ data is supposed to match and we support a document check to see if they do.

The problem arises when the passport verification prompts you to see if the extracted name from the MRZ on the passport is correct. If you are prompted to confirm your name value, and your name has been shorted, please look at the MRZ to determine if this is expected or not. If the value matches the MRZ, please confirm, but if the value doesn’t match the MRZ, try retaking the picture of your passport.

### MRZ shortened my first name and now it doesn’t match my LinkedIn profile[](#mrz-shortened-my-first-name-and-now-it-doesnt-match-my-linkedin-profile)

When a verified passport name doesn’t match your LinkedIn profile name `Ale ≠ Alexander` , LinkedIn will block the approval on their system, not via Persona. To address the issue with LinkedIn you can contact LinkedIn support here: [https://www.linkedin.com/help/linkedin/ask/ravl](https://www.linkedin.com/help/linkedin/ask/ravl).
