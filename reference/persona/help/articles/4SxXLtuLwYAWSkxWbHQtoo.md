# Security and Privacy Overview

As an identity verification platform that handles sensitive data, we take data security and privacy very seriously and have designed our platform with security and privacy in mind.

## Data privacy[](#data-privacy)

Persona is GDPR and CCPA compliant, which means we've implemented a robust privacy program that includes secure data transfer and processing practices. We securely store data on behalf of our customers for legal, audit, and support purposes. We do not sell any individual's data or allow access to third parties for any reason. Retention and deletion of end user data is controlled by you — our customer. We provide multiple ways for our customers to control, retain and delete data — via API, dashboard, and automated retention policies. Please see our FAQs, [Privacy Policy](../../landing/legal/privacy-policy.md), and [Security Page](http://withpersona.com/security) for additional details about how we handle sensitive data.

## Data security[](#data-security)

Persona implements bank-grade security and is certified for SOC 2 Type II, a leading global security framework. Our comprehensive security program includes but is not limited to: third party audits, data encryption, logical access controls, vulnerability scanning, and network protections. Please see our FAQs and [Security Page](../../landing/security.md) for more details about our commitment to security.

## FAQs[](#faqs)

### How do I set up MFA for my Persona Dashboard?[](#how-do-i-set-up-mfa-for-my-persona-dashboard)

We support multiple option of MFA. Please see [Two-factor authentication (2FA) for Persona Dashboard](./2FtrbknhJ3rDsMlWaEag8e.md) for more detail.

### Is Persona GDPR compliant?[](#is-persona-gdpr-compliant)

Persona is GDPR and CCPA compliant, which means we've implemented a robust privacy program that includes secure data transfer and processing practices. We also achieved SOC 2 Type II at the end of 2019. We have an intake process for data subject rights requests, continuous privacy impact assessments, secure data transfer and storage, and privacy and cookie policies reviewed by external legal counsel. We also maintain records of processing as both a controller and processor.

### Is Persona CCPA compliant?[](#is-persona-ccpa-compliant)

The California Consumer Privacy Act is a new privacy law that came into effect in January 2020 and has been nicknamed California's GDPR. Persona has ensured that our platform is both GDPR and CCPA compliant.

### How does Persona encrypt and store data collected from end users?[](#how-does-persona-encrypt-and-store-data-collected-from-end-users)

Persona encrypts sensitive data at rest using AES-256 encryption and industry standard tokenization and hashing. Each data element is encrypted using an AES-256 cipher with a unique initialization vector and an encryption key that is rotated on a regular basis. All data in transit through the Persona web application uses Hypertext Transfer Protocol Secure (HTTPS) forced using TLS 1.2 or higher to ensure confidentiality of web sessions.

Our database and technical infrastructure are hosted within SOC 2 and ISO accredited data centers. Physical security controls at our data centers include 24/7 monitoring, cameras, visitor logs, and entry requirements.

### How does Persona ensure that sensitive data is protected?[](#how-does-persona-ensure-that-sensitive-data-is-protected)

Access to production systems and sensitive data is restricted on an explicit need-to-know basis, utilizes the principle of least privilege, and is monitored and audited on a scheduled cadence. Employees accessing production systems are required to use multiple factors of authentication, VPN enforced via IP whitelisting through firewall, and valid SSH keys that are access-controlled by IAM.

We maintain a documented vulnerability management program which includes third-party independent penetration testing, periodic scans, identification, and remediation of security vulnerabilities on servers, workstations, network equipment, and applications. All networks, including test and production environments are regularly scanned. Access to production systems is audit logged. Critical patches are applied to servers on a priority basis and as appropriate for all other patches.

Persona's information security management system (ISMS) outlines rigorous policies and procedures for creating, handling, storing, retaining, and securing data. We process all subject access and deletion data requests in 72 hours and have an incident response plan that has been reviewed and tested to be prepare appropriate remediation and notification for any security incidents like data breaches.

### How do we access the information collected by Persona?[](#how-do-we-access-the-information-collected-by-persona)

All information from Persona's verifications (e.g. the verification results, verification checks, documents, reports, etc) can be retrieved via API. Please see our [API Reference](../../docs/reference.md#introduction) for more information. You will also have access to the [Persona Dashboard](../../landing/dashboard/inquiries.md) where you can view information from your end users' verifications and export this information from the Dashboard itself.

### Can Persona send us the personally identifiable information (PII) provided by individuals (e.g. Name, DOB, address)?[](#can-persona-send-us-the-personally-identifiable-information-pii-provided-by-individuals-eg-name-dob-address)

Yes, in the [API / Configuration section of the Dashboard](https://app.withpersona.com/dashboard/api-configuration) under "Enabled API attributes" you can specify the PII you'd like to retrieve via the API. By default, we do not expose the attributes directly provided by individuals (e.g. name, birthdate, address) via API for data privacy reasons.

### What does Persona do with the collected information?[](#what-does-persona-do-with-the-collected-information)

Persona stores the data on our customers' behalf for legal, audit, and support purposes. We allow you to delete or export the data as needed. We do not sell any individual's data or allow access to third parties for any reason. See our [Privacy Policy](../../landing/legal/privacy-policy.md) and our [Security Page](http://withpersona.com/security) for additional details about how we handle sensitive data.

Persona is GDPR-compliant, and as a processor under the GDPR, our retention for end user data is determined by you, the controller. As such, we provide an API and a dashboard for you to control and delete data. We can also support automatic deletion of data after a specified time period.

If individuals need to change or correct their personal data, or wish to have it deleted, they must reach out you (as the controller) directly. As a processor of the data, any requests received by Persona will be forwarded to you for resolution. These requests should be addressed in a timely manner as required by applicable law.

### How long does Persona retain data from individuals?[](#how-long-does-persona-retain-data-from-individuals)

As a processor under GDPR, Persona retains the data indefinitely for audit and compliance purposes unless and until you, as the controller, tell us to delete the data - which you can do via API or via dashboard. We can also set an automated retention period for you, after which we permanently delete all PII.

### How do I delete an individual's data on Persona?[](#how-do-i-delete-an-individuals-data-on-persona)

Persona supports data deletion and data export in accordance with data privacy regulations like GDPR. An individual's personally identifiable information (PII) can be redacted (i.e. permanently deleted from Persona's database) in one of three ways:

1.  Using the Persona API, you can redact an individual's PII via the [delete endpoint](../../docs/reference.md#section-redact-the-pii-from-an-inquiry-).
2.  Using the [Persona Dashboard](../../landing/dashboard/inquiries.md), in the inquiry details page, you can use the "Redact" button on the top right hand side to delete an individual's PII.
3.  We can also set a data retention period after which we automatically redact all PII from our database after a specified time period.

Please [contact our support team](https://app.withpersona.com/dashboard/contact-us)to set your data retention period. After the individual's PII is redacted it is permanently deleted and cannot be returned. However, the record of the inquiry itself (without any PII) will remain.

### What does it mean to redact data? Is the deletion permanent? How do I set up an automated data retention period?[](#what-does-it-mean-to-redact-data-is-the-deletion-permanent-how-do-i-set-up-an-automated-data-retention-period)

Please contact your customer success manager or [contact our support team](https://app.withpersona.com/dashboard/contact-us)to set your data retention period. After the individual's PII is redacted, it is permanently deleted and cannot be restored. However, the record of the inquiry itself (without any PII) will remain.

### How can Persona help me process data subject access requests?[](#how-can-persona-help-me-process-data-subject-access-requests)

Data subject access requests (DSARs) give individuals the right to ask what data an organization is holding about them, why the organization is holding that data, and who else their information is being disclosed to. DSAR is a term introduced by GDPR and is often used interchangeably with subject access requests (SARs). If an individual submits a data subject access request, you can use Persona to collect all the information related to the individual in our systems via Persona's API endpoints. Please [contact our support team](https://app.withpersona.com/dashboard/contact-us) to help you securely process the DSAR.

### Can I set up SSO (single sign-on) for my organization for access to the Persona Dashboard?[](#can-i-set-up-sso-single-sign-on-for-my-organization-for-access-to-the-persona-dashboard)

You can set up SSO for your organization on the [Organization page in the Dashboard](../../landing/dashboard/organization.md).

### Can I enable SAML-based SSO (single sign-on) through Google?[](#can-i-enable-saml-based-sso-single-sign-on-through-google)

Yes, we support SAML-based single sign-on through Google. Please see [Persona Dashboard: SAML-based single sign-on (SSO) with Google](./2sRyMDPo1J0YUPPjNA1TMI.md) for instructions.

### Can I enable SAML-based SSO (single sign-on) through Azure?[](#can-i-enable-saml-based-sso-single-sign-on-through-azure)

Yes, we support SAML-based single sign-on through Azure. Please see [Persona Dashboard: SAML-based single sign-on (SSO) with Azure](./4bZfZnzyyNuEINobo4VJWj.md) for instructions.

### Can I enable SAML-based SSO (single sign-on) through Okta?[](#can-i-enable-saml-based-sso-single-sign-on-through-okta)

Yes, we support SAML-based single sign-on through Okta. Please see [Persona Dashboard: SAML-based single sign-on (SSO) with Okta](./3A0ZoW5ozu1k17n7bOrVuE.md) for instructions.
