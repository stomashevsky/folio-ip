# How do I compare information and reverify individuals using Accounts?

## Why use Accounts for information comparison or Reverification?[](#why-use-accounts-for-information-comparison-or-reverification)

When it comes to verifying the identity of an individual, it may not be enough to ensure the individual provides an authentic government-issued ID, or that their information matches against a database. You may want to require that the information provided in the new verification matches against information previously collected or previously verified for the same individual. By comparing information acquired from an individual against existing information in the same Account, you can reverify an individual's identity at various points in time, for different reasons. Learn more about using Accounts for reverification in our [blog post](../../landing/blog/what-is-reverification-and-why-does-it-matter.md).

## How do Accounts support information comparison?[](#how-do-accounts-support-information-comparison)

Persona compares new information against existing information in two ways:

1.  **Inquiry - Account Comparison:** You can compare information from a new Inquiry against existing information on an Account, assuming both the Inquiry and the Account share the same reference ID.
    
2.  **Inquiry - Inquiry Comparison:** You can compare information from a new Inquiry against information from a previous Inquiry in the same Account, assuming the two Inquiries share a reference ID.
    

**Example:** Kathleen is signing up as a new user for Company A. She provides her name, DOB, email and phone # as part of Company A's onboarding flow. Company A creates an Account in Persona with a unique reference ID and populates it with the information provided by Kathleen. Company A then requires Kathleen to verify her identity with her Government ID through a Persona Inquiry with the same reference ID. Kathleen uses her son Daniel's driver's license for government ID verification. Although Daniel's driver's license is an authentic government-issued ID, because the name and DOB on Daniel's driver's license does not match the information found in the Account with the same reference ID, the Government ID verification will fail.

**Example:** Arush is signing up as a new user for Company A. As part of the onboarding process, he verifies his identity using his government ID and selfie. Several months later, Arush needs to change sensitive information in his Account. At this point, he is asked to reverify his identity with just a selfie. Persona compares the new selfie Inquiry against the previous Government ID and selfie inquiry, since the two Inquiries share a reference ID. Arush's new selfie matches both the photo in his verified Government ID and his previous selfie and he passes reverification.

## FAQs[](#faqs)

### How is information populated in an Account?[](#how-is-information-populated-in-an-account)

Information can be populated in an Account in two ways:

1.  If you create an Account via Dashboard or API, you can populate it with specific fields. This may be importing existing information from a prior vendor, or creating an account based on information you've collected outside of the Persona UI.
    
2.  If you do not populate an Account, information from the very first completed Inquiry under that reference ID will automatically populate the Account. Future Inquiries associated with this reference ID will be compared against the original inquiry.
    

### How do I use Accounts for Inquiry - Inquiry comparison?[](#how-do-i-use-accounts-for-inquiry---inquiry-comparison)

To ensure that the information on a new Inquiry matches information from an existing (completed or verified) Inquiry, simply [**pass in a reference ID**](../../docs/docs/parameters.md) for each of these Inquiries. Persona will take all Inquiries with the same reference ID and link them together in the same Account — without a reference ID, there is no way for Persona to know that the Inquiry should be linked to the Account even if the individual is the same. Persona will automatically require that the information from the latest Inquiry matches against the information from all previous completed (verified) Inquiries in order for the new Inquiry to pass.

### How do I use Accounts for Inquiry - Account comparison?[](#how-do-i-use-accounts-for-inquiry---account-comparison)

If you want to compare information from a new Inquiry against information that you've collected outside of Persona, you will want to [**create an Account**](./2gE7mjjLCIGJPnK6mTyjU9.md) and populate it with the information you've collected outside of Persona. You will also need to pass in a Reference ID on both the Account and Inquiry. Persona will automatically require that the information from the new Inquiry matches against the information from all previous completed (verified) Inquiries AND the information populated on the Account itself in order for the new Inquiry to pass.

### Why did an Inquiry fail due to Account Comparison or Inquiry Comparison?[](#why-did-an-inquiry-fail-due-to-account-comparison-or-inquiry-comparison)

Account Comparison and Inquiry Comparison are two verification checks that, when required, check that the information in a given Inquiry (1) matches against information from the Account; and (2) matches against information previous completed Inquiries respectively. If one of these checks fails, check the other Inquiries in the same Account and the information in the Account itself. It could be that a different individual is attempting to verify in the latest Inquiry. It could also be possible that information from a previously completed Inquiry or from the Account is outdated, incorrectly extracted, or incorrectly entered. If information on the Account is incorrect, you can **[edit the Account](./2gE7mjjLCIGJPnK6mTyjU9.md) information** from your Dashboard to ensure that future Inquiries in this Account do not fail for the same reason.
