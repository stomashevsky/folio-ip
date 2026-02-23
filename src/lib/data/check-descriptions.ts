/** Descriptions for verification checks — keyed by exact check name from AVAILABLE_CHECKS. */
export const checkDescriptions: Record<string, string> = {
  /* ── Government ID ── */
  "Account comparison":
    "Compare if government ID details (e.g. name, birthdate) are consistent with account details.",
  "Age comparison":
    "Detect if the age listed on the ID meets the age restriction.",
  "Allowed country":
    "Detect if the country of the ID is not allowed based on template requirements.",
  "Allowed ID type":
    "Detect if the ID type (e.g. driver license) submitted does not match the ID type the user selected.",
  "Attribute comparison":
    "Compare if government ID details (e.g. name, birthdate) are consistent with provided values. Generally used for verifications created outside an inquiry.",
  "Barcode": "Detect if there is a barcode on the ID.",
  "Barcode inconsistency":
    "Detect inconsistencies in the barcode on the ID.",
  "Blur": "Detect if the submission is blurry.",
  "Color":
    "Detect if the colors on the ID are different than the expected colors.",
  "Compromised submission":
    "Detect if the submission can be found from a publicly available source (e.g. Google Images).",
  "Damaged detection":
    "Detect physical damages on the ID that render it invalid for verification.",
  "Double side":
    "Detect if one side of the ID is submitted as both front and back.",
  "Electronic replica":
    "Detect if the submission is a replica of an image presented on another electronic device or screen.",
  "Expiration": "Detect if the ID is expired.",
  "Extracted properties":
    "Detect if template-required ID details are extracted.",
  "Extraction inconsistency":
    "Detect if the details extracted from the front of the ID are different than the details extracted from the barcode.",
  "Fabrication":
    "Detect if the ID is likely to be fabricated, based on its format and issuing entity.",
  "Glare": "Detect if the submission has glare.",
  "Government ID":
    "Detect if there is a government ID in the submission.",
  "Handwriting":
    "Detect handwritten text on the document, which may indicate tampering.",
  "ID image tampering":
    "Detect if the submission is tampered by a photo editor.",
  "ID number format inconsistency":
    "Detect if the ID number format is well-formed based on issuing authority rules for certain countries.",
  "ID physical tampering":
    "Detect if the submission is physically tampered.",
  "ID-to-Selfie comparison":
    "Compare if the face portrait on the ID and the selfie are different faces.",
  "Inconsistent repeat":
    "Detect if either the ID details or face portrait match that of a previously submitted ID within the last year.",
  "Inquiry comparison":
    "Compare if ID details like name or birthdate are inconsistent between different submission attempts.",
  "MRZ detected":
    "Detect if there is encoded, machine-readable text on the ID.",
  "MRZ inconsistency":
    "Detect if the encoded, machine-readable text on the ID is well-formed.",
  "Paper detection": "Detect if the ID is a paper copy",
  "PO box":
    "Detect if the address is a PO box. Note that address parts may be extracted both visually and from the barcode / MRZ.",
  "Portrait": "Detect if there is a face portrait in the submission.",
  "Portrait age":
    "Detect if the age listed on the ID is different than the age estimated from the face portrait.",
  "Portrait clarity":
    "Detect if the face portrait is clear and in focus.",
  "Processable submission":
    "Detect if the submission is unprocessable.",
  "Public figure":
    "Detect if the face portrait matches that of a known public figure.",
  "REAL ID": "Detect if a U.S. REAL ID.",
  "Repeat":
    "Detect if the ID details and face portrait match that of a previously submitted ID on a different account within the last year.",
  "Valid dates":
    "Detect if the dates on the ID are in violation of issuing authority rules. The check applies to US DLs and IDs, and CN IDs.",

  /* ── Selfie ── */
  "Face covering": "Detect if face was covered in the selfie.",
  "Glasses": "Detect if glasses are present.",
  "Image quality":
    "Detect if the submission has low image quality.",
  "Multiple faces":
    "Detect if the selfies are different faces across poses.",
  "Portrait quality":
    "Detect if the face portrait is clear and in focus.",
  "Pose position":
    "Detect if the face in the selfies are correctly positioned across all poses.",
  "Pose repeat":
    "Detect if the selfies are exact repeats across poses.",
  "Selfie liveness":
    "Detect if the selfie contains a live individual, not a recording, picture, or another spoof.",
  "Selfie-to-ID comparison":
    "Compare if the selfie and the face portrait in the ID are different faces.",
  "Suspicious entity":
    "Detect if the selfie submission is that of a government ID.",

  /* ── Database ── */
  "Alive Detection": "Detect if person is living.",
  "Deliverable address": "Detect if the address is deliverable.",
  "Identity Comparison":
    "Detect if the identity matches a record in the authoritative or issuing databases.",
  "P.O. Box Detection": "Detect if the address is a PO box.",
  "Residential address": "Detect if the address is residential.",
  "2+2 Detection":
    "Detect if claimed attributes passes 2+2 requirements.",

  /* ── Document ── */
  "Expired detection": "Ensure the document is not expired",
  "JPEG original image detection":
    "Detect inconsistencies in JPEG image compression to detect if image has been modified; does not apply to screenshots or scanned images.",
  "Recency / Effective detection":
    "Detect if the document is recent.",
  "Extracted properties detection":
    "Ensure document contains required extractions.",
  "Copy move detection":
    "This check identifies any evidence of copy-move forgery in the submitted document image.",
  "Document image tampering":
    "Detect if the submission shows evidence of being edited by a photo editor.",
  "Image inconsistent timestamp detection":
    "Detect if the image has inconsistent timestamps.",
  "Image suspicious metadata detection":
    "This check identifies any irregular or modification timestamps on an image.",
  "PDF abnormal font detection":
    "Detects if the PDF contains font(s) that are considered an outlier relative to other fonts in the document. Font outliers in PDF metadata are common signs of an editor being used.",
  "PDF annotation detection":
    "Detect if the PDF contains disallowed annotation subtypes.",
  "PDF content type detection":
    "Detect whether or not the PDF contains strictly typical content pages, image based pages, or a mix of both.",
  "PDF editor detection":
    "Detect if the PDF has signs of a document editor.",
  "PDF inconsistent timestamp detection":
    "Detect if the PDF has inconsistent timestamps.",

  /* ── AAMVA ── */
  "AAMVA address match":
    "Verify the address matches the AAMVA motor vehicle database.",
  "AAMVA date of birth match":
    "Verify the date of birth matches the AAMVA motor vehicle database.",
  "AAMVA expiration check":
    "Verify the license has not expired according to AAMVA records.",
  "AAMVA issuing authority match":
    "Verify the issuing authority matches AAMVA records.",
  "AAMVA license number match":
    "Verify the license number matches the AAMVA motor vehicle database.",
  "AAMVA name match":
    "Verify the name matches the AAMVA motor vehicle database.",

  /* ── Phone Carrier ── */
  "Phone number active":
    "Verify the phone number is currently active with a carrier.",
  "Carrier match":
    "Verify the carrier information matches expected records.",
  "Carrier risk score":
    "Evaluate the risk level associated with the phone carrier.",
  "Name match": "Verify the name matches carrier or database records.",
  "Address match":
    "Verify the address matches carrier or database records.",

  /* ── SSN ── */
  "SSN match": "Verify the SSN matches authoritative records.",
  "SSN issuance check":
    "Verify the SSN was validly issued and is not flagged.",
  "Date of birth match":
    "Verify the date of birth matches authoritative records.",

  /* ── Email ── */
  "Email deliverable":
    "Verify the email address is deliverable and the mailbox exists.",
  "Email domain valid":
    "Verify the email domain is valid and has proper DNS records.",
  "Email not disposable":
    "Detect if the email is from a disposable or temporary email provider.",
  "Email age check":
    "Evaluate how long the email address has been in use.",
  "Email breach database":
    "Check if the email has appeared in known data breaches.",

  /* ── Phone Number ── */
  "Phone number valid":
    "Verify the phone number is properly formatted and valid.",
  "OTP verified":
    "Verify the user completed one-time password verification.",
  "Phone not VoIP":
    "Detect if the phone number is a VoIP or virtual number.",
  "Carrier lookup":
    "Look up the carrier associated with the phone number.",
  "Phone country match":
    "Verify the phone number's country matches the expected country.",

  /* ── Health Insurance ── */
  "Card readable":
    "Verify the card image is readable and data can be extracted.",
  "Card not expired": "Verify the card has not expired.",
  "Issuer recognized":
    "Verify the card issuer is in the list of recognized insurers.",
  "Member ID extraction": "Extract the member ID from the card.",
  "Card tampering detection":
    "Detect signs of physical or digital tampering on the card.",

  /* ── Vehicle Insurance ── */
  "Policy not expired":
    "Verify the insurance policy has not expired.",
  "Insurer recognized":
    "Verify the insurer is recognized and valid.",
  "VIN extraction":
    "Extract the Vehicle Identification Number from the insurance card.",
  "Policy number extraction":
    "Extract the policy number from the insurance card.",
};

/** Tooltip descriptions for behavioral risk signals. */
export const behavioralRiskDescriptions: Record<string, string> = {
  "Behavior threat level":
    "Predicted risk level based on combined behavioral signals",
  "Bot score": "Likelihood score that the session was automated",
  "Request spoof attempts":
    "Number of requests that were likely spoofed",
  "User agent spoof attempts":
    "Number of user agent headers that were likely spoofed",
  "Restricted mobile SDK requests":
    "Requests from restricted mobile SDK versions",
  "Restricted API version requests":
    "Requests from restricted API versions",
  "User completion time": "Time from start to finish of flow",
  "Distraction events": "Number of times user left the flow",
  "Hesitation percentage": "Percentage of time with no user inputs",
  "Shortcut usage (copies)":
    "Times user used keyboard shortcut to copy",
  "Shortcut usage (pastes)":
    "Times user used keyboard shortcut to paste",
  "Autofill starts": "Times user autofilled a form field",
};
