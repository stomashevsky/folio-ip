# Business Website Verification

## Overview[](#overview)

The Business Website Verification verifies the validity and legitimacy of a business's website during the Know Your Business process.

## Why is this verification valuable?[](#why-is-this-verification-valuable)

**Replace manual review of a business website**

Manually checking a business’s website is a part of most business onboarding processes. This verification can help automate parts of that process.

**Help prevent business impersonation**

The business's website serves as a tool to detect fraud and is collected and analyzed during KYB to prevent business impersonation. If the provided website does not correspond to the business it claims to represent, this inconsistency can be identified and highlighted with the verification.

**Establish the relationship between a business and individual**

The Business Website Verification can be used with [Email (2FA) Verification](./2FauPy2tquCwnyeMjtpVly.md) as a way to verify the association between a business and an individual (i.e. employment verification). For instance,

-   We verify that the individual Bill owns an email `bill@acme.com` by using the email verification
-   We verify that the email domain [`acme.com`](http://acme.com) is associated to the business Acme Examples Inc
-   If we can confirm that acme.com is the website associated with ACME Examples Inc, and Bill is able to receive emails at that domain, we can draw the conclusion that it is highly likely that Bill is associated with ACME Examples Inc

## What checks does this verification provide?[](#what-checks-does-this-verification-provide)

The Business Website Verification takes the business's name, URL, and address (optional but recommended) and returns back a "Passed" or "Failed" depending on if required checks pass. It can also optionally take in a business's address, phone number, and email address.

The checks available for use in the BWV are listed below:

| **Check Name** | **Description** | **Possible Failure Reasons** |
| :-: | --- | --- |
| Identity Comparison | Compares website information with provided business details | Domain not resolvable; insufficient content; insufficient match |
| Domain Resolvable Detection | Checks whether the website's IP address is resolvable and the domain is accessible | Failed to resolve |
| Domain Redirect Detection | Detects if the input URL redirects to another domain | Domain redirected or not resolvable |
| Domain Age Detection | Checks if the domain age meets minimum requirements | Domain is newly created; unable to determine domain age |
| Domain Expiration Detection | Detects if the domain is expired or expiring soon | Domain is expired; domain is expiring soon; unable to determine domain expiration |
| Supported Domain Detection | Verifies the domain platform is supported | Domain is unsupported |
| Sufficient Content Detection | Checks if the site has enough useful information to review | Insufficient content (ex: “Coming soon!”); parked domain/domain is for sale |
| Terms of Service Legitimacy Detection | Detects if the site has a legitimate Terms of Service | Broken link; insufficient content; error page; placeholder text; no URLs found |
| Backlink Detection | Checks if other websites link to this website | Below threshold (not enough backlinks) |
| Malicious Website Detection | Flags if the website is flagged for unsafe content. | Website is reported for malware; social engineering; email spam |
| Privacy Policy Legitimacy Detection | Detects if the site has a clear and valid Privacy Policy | Missing or broken link; not found on homepage/footer |
| Cookie Banner Detection | Detects if the site shows a valid and functional cookie consent banner | Missing banner; broken banner; no reject option |

### Frequently Asked Questions[](#frequently-asked-questions)

**Does this verification cover the online presence of a business?**

It does not verify the full online presence of a business, which could encompass things like social media presence and third party review sites (e.g., Yelp, TripAdvisor). This is covered in the [Business Online Presence Report](./4PXsPj48k67OR26o2ToN5x.md).

**What should we do if a company's website fails certain checks?**

Investigate the reasons behind the failure. Use this insight to request additional documentation or perform manual review.

**What locales and languages do this report support?**

The report isn’t limited to English and generally performs well across other languages. No special locale setup is required.

## Related articles

[Verifying Businesses: How Persona can help verify businesses](./3OGe9IwySJmDvXL2DOfV7N.md)

[Business Classification Report](./60dDv0ttzy8rDFNPLaiszs.md)

[Business Online Presence Report](./4PXsPj48k67OR26o2ToN5x.md)
