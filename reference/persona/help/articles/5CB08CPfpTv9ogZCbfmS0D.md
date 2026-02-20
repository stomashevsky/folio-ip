# Fraud Best Practices for KYC Verifications

## TL;DR: Recommended Fraud Settings[](#tldr-recommended-fraud-settings)

If you want a strong baseline configuration for fraud prevention, start with the following:

### Government ID[](#government-id)

-   Disable file uploads (require real-time capture)
-   Pre-fill inquiries with known user data
-   Require capture of both the front and back of the ID

### Selfie[](#selfie)

-   Enable all fraud-related checks
-   Require Selfie Liveness
-   Require a three-point pose: center, left, right

### Workflows[](#workflows)

-   Create a Case for review when:
    -   Network threat level is **high**
    -   Virtual camera risk is **medium** or **high**
    -   Selfie liveness risk is **medium** or **high**
    -   Impossible travel detection is **high**
    -   Residency country does not match IP country or region
    -   Large geolocation changes occur between sessions

These settings provide a strong default and can be adjusted based on your risk tolerance and user experience goals.

## Fraud Best Practices in detail[](#fraud-best-practices-in-detail)

### Government ID Verification[](#government-id-verification)

The following configuration options help increase the accuracy and fraud resistance of Government ID verifications.

#### Disable uploads[](#disable-uploads)

Disable file uploads to require users to capture their ID in real time using their device camera. Real-time capture enables additional fraud signals—such as liveness checks, camera metadata, and device-level indicators—that are significantly harder to manipulate than uploaded images.

Learn more: [Disable upload](./3bU3AKdWw5gSN8DxWQVv8p.md)

**Why this matters**

Uploaded images are easier to reuse, edit, or generate. Requiring real-time capture helps ensure the ID is physically present and tied to the user’s device at the time of verification.

#### Pre-fill inquiries[](#pre-fill-inquiries)

Pre-fill inquiries when you already have user information (for example, name or date of birth). This allows you to use the [Inquiry comparison check](./2zXa85BILxtncnwdIj8jge.md) to confirm that data extracted from the Government ID matches information you already have on file.

Learn more: [Pre-fill inquiries](./79Y8gi2c0QnOzDax63LfDF.md)

**Why this matters**

Comparing ID data against known user information helps detect synthetic identities, altered documents, and mismatched credentials earlier in the verification flow.

#### Require both sides of the ID[](#require-both-sides-of-the-id)

Require users to capture both the front and back of their Government ID. Several fraud and consistency checks rely on information found on the back of the ID to validate data on the front, including:

-   Barcode
-   Barcode inconsistency
-   Extraction inconsistency
-   Double-sided checks

Requiring both sides increases confidence in the authenticity of the document.

Learn more: [Require both sides of an ID](./6RqFh33a2D2W9OBsTefqQt.md)

**Why this matters**

Fraudulent IDs may pass basic visual inspection but fail consistency checks when back-of-ID data is analyzed. Capturing both sides enables deeper validation.

### Selfie verification[](#selfie-verification)

For Selfie verifications, Persona recommends enabling **all fraud-related checks**, especially **Selfie Liveness**, and requiring users to complete a **three-point pose**.

#### Require a three-point pose[](#require-a-three-point-pose)

Require users to capture selfies in three poses:

-   Center (facing forward)
-   Left (turning head to the left)
-   Right (turning head to the right)

These poses are captured as part of the same verification flow and are evaluated together.

**Why this matters**

Requiring multiple poses helps confirm that a real, live person is present during verification. Head movement makes it significantly harder to pass liveness checks using static images, pre-recorded videos, deepfakes, or virtual cameras, and improves confidence that the selfie belongs to the same person throughout the session.

#### Enable Selfie Liveness and fraud checks[](#enable-selfie-liveness-and-fraud-checks)

Enable all available fraud-related checks for Selfie verifications, with particular emphasis on **Selfie Liveness**, which detects spoofing and presentation attacks.

**Why this matters**

Selfie Liveness evaluates signals such as motion, depth, and timing to distinguish real users from fraudulent attempts. Combined with multi-pose capture, it provides stronger protection against replay attacks and synthetic media.

## Fraud and Friction: Finding the Right Balance[](#fraud-and-friction-finding-the-right-balance)

Increasing fraud controls can reduce risk—but it may also add friction for legitimate users. Persona is designed to help you tune this balance.

-   Use **real-time capture, liveness, and consistency checks** when trust and compliance are critical.
-   Relax requirements (such as uploads or fewer review cases) when speed and conversion are higher priorities.
-   Route only **high-confidence risk signals** to manual review to minimize unnecessary intervention.

Start with the recommended best practices, then adjust as you learn more about your users and threat patterns.

## **Next steps**[](#next-steps)

Learn how Persona’s [Fraud Risk Solution](./7re03dJ4NohXA7c9x2hIw5.md) helps you centralize and act on fraud signals across verifications.

## Related articles

[Fraud Signals Solution](./7re03dJ4NohXA7c9x2hIw5.md)
