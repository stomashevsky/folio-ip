/** Descriptions for verification checks — keyed by exact check name from AVAILABLE_CHECKS. */
export const checkDescriptions: Record<string, string> = {
  /* ── Government ID ── */
  "Account comparison": "Compare extracted data against the account's existing information on file.",
  "Age comparison": "Verify the age on the ID meets the configured minimum or maximum age restriction.",
  "Allowed country": "Verify the document's issuing country is in the allowed list.",
  "Allowed ID type": "Verify the document type is in the allowed list of accepted ID types.",
  "Attribute comparison": "Compare specific extracted attributes against expected values from the inquiry.",
  "Barcode": "Read and decode the barcode on the document to extract structured data.",
  "Barcode inconsistency": "Detect discrepancies between barcode data and the visual fields on the document.",
  "Blur": "Detect if the document image is too blurry to process reliably.",
  "Color": "Verify the document image is in color and not a grayscale copy.",
  "Compromised submission": "Check if this submission has been previously flagged as compromised or fraudulent.",
  "Damaged detection": "Detect physical damage to the document such as tears, stains, or wear.",
  "Double side": "Verify both the front and back of the document were captured.",
  "Electronic replica": "Detect if the document is a photo of a screen or an electronic copy.",
  "Expiration": "Check if the document has not expired, with an optional grace period.",
  "Extracted properties": "Verify that required properties were successfully extracted from the document.",
  "Extraction inconsistency": "Detect discrepancies between different extraction methods on the same document.",
  "Fabrication": "Detect if the document was digitally fabricated or generated.",
  "Glare": "Detect if glare is obscuring parts of the document.",
  "Government ID": "Verify the submitted document is a recognized government-issued ID.",
  "Handwriting": "Detect handwritten text on the document, which may indicate tampering.",
  "ID image tampering": "Detect signs of physical or digital tampering on the document image.",
  "ID number format inconsistency": "Verify the ID number format matches the expected pattern for the document type.",
  "ID physical tampering": "Detect signs of physical alteration such as re-lamination or overlays.",
  "ID-to-Selfie comparison": "Compare the selfie photo to the portrait on the government ID.",
  "Inconsistent repeat": "Detect if the same document has been submitted with inconsistent data across attempts.",
  "Inquiry comparison": "Compare extracted data against information provided in the inquiry.",
  "MRZ detected": "Verify the Machine Readable Zone was detected and could be parsed.",
  "MRZ inconsistency": "Detect discrepancies between MRZ data and the visual fields on the document.",
  "Paper detection": "Detect if the document is a paper printout rather than an original.",
  "PO box": "Detect if the address on the document is a PO box.",
  "Portrait": "Verify a portrait photo is present on the document.",
  "Portrait age": "Estimate the age of the person in the portrait photo.",
  "Portrait clarity": "Verify the portrait on the document is clear and legible.",
  "Processable submission": "Verify the submission is processable and the images are not corrupted.",
  "Public figure": "Detect if the document belongs to a known public figure or politically exposed person.",
  "REAL ID": "Verify the document meets REAL ID Act compliance standards.",
  "Repeat": "Detect if this document has been submitted in a previous verification.",
  "Valid dates": "Verify all dates on the document are valid and internally consistent.",

  /* ── Selfie ── */
  "Center present": "Verify the face is centered and fully visible in the selfie frame.",
  "Face comparison": "Compare the selfie against the portrait on the ID document.",
  "Liveness": "Verify the selfie is of a live person and not a photo, video, or mask.",
  "Pose repeat": "Detect if the same selfie image was submitted multiple times.",
  "Selfie account comparison": "Compare the selfie against photos already stored on the account.",
  "Selfie attribute comparison": "Compare selfie-derived attributes against the account's existing data.",
  "Selfie duplicate": "Detect if this exact selfie has been used in another verification.",
  "Selfie glasses": "Detect if the person is wearing glasses that may obstruct facial recognition.",
  "Selfie ID comparison": "Compare the selfie against the portrait photo on the ID document.",
  "Selfie pose": "Verify the selfie pose and angle meet capture requirements.",
  "Selfie suspicious": "Detect suspicious artifacts in the selfie such as masks or screen displays.",

  /* ── Database ── */
  "Database inquiry comparison": "Compare database results against information provided in the inquiry.",
  "Database address match": "Verify the address matches authoritative database records.",
  "Database date of birth match": "Verify the date of birth matches authoritative database records.",
  "Database name match": "Verify the name matches authoritative database records.",
  "Database phone match": "Verify the phone number matches authoritative database records.",
  "Database SSN match": "Verify the SSN matches authoritative database records.",

  /* ── Document ── */
  "Document attribute comparison": "Compare extracted document attributes against expected values.",
  "Document date of birth comparison": "Compare the date of birth on the document against expected values.",
  "Document disallowed country": "Reject documents from countries on the disallowed list.",
  "Document duplicate detection": "Detect if this document has been submitted in a previous verification.",
  "Document extraction": "Extract text and structured data from the uploaded document.",
  "Document inconsistency": "Detect discrepancies between different fields on the document.",
  "Document name comparison": "Compare the name on the document against expected values.",
  "Document tampering": "Detect signs of physical or digital tampering on the document.",
  "Document type detection": "Identify and classify the type of document that was uploaded.",
  "Document valid": "Verify the document is valid and meets acceptance criteria.",

  /* ── AAMVA ── */
  "AAMVA address match": "Verify the address matches the AAMVA motor vehicle database.",
  "AAMVA date of birth match": "Verify the date of birth matches the AAMVA motor vehicle database.",
  "AAMVA expiration check": "Verify the license has not expired according to AAMVA records.",
  "AAMVA issuing authority match": "Verify the issuing authority matches AAMVA records.",
  "AAMVA license number match": "Verify the license number matches the AAMVA motor vehicle database.",
  "AAMVA name match": "Verify the name matches the AAMVA motor vehicle database.",

  /* ── Phone Carrier ── */
  "Phone number active": "Verify the phone number is currently active with a carrier.",
  "Carrier match": "Verify the carrier information matches expected records.",
  "Carrier risk score": "Evaluate the risk level associated with the phone carrier.",
  "Name match": "Verify the name matches carrier or database records.",
  "Address match": "Verify the address matches carrier or database records.",

  /* ── SSN ── */
  "SSN match": "Verify the SSN matches authoritative records.",
  "SSN issuance check": "Verify the SSN was validly issued and is not flagged.",
  "Date of birth match": "Verify the date of birth matches authoritative records.",

  /* ── Email ── */
  "Email deliverable": "Verify the email address is deliverable and the mailbox exists.",
  "Email domain valid": "Verify the email domain is valid and has proper DNS records.",
  "Email not disposable": "Detect if the email is from a disposable or temporary email provider.",
  "Email age check": "Evaluate how long the email address has been in use.",
  "Email breach database": "Check if the email has appeared in known data breaches.",

  /* ── Phone Number ── */
  "Phone number valid": "Verify the phone number is properly formatted and valid.",
  "OTP verified": "Verify the user completed one-time password verification.",
  "Phone not VoIP": "Detect if the phone number is a VoIP or virtual number.",
  "Carrier lookup": "Look up the carrier associated with the phone number.",
  "Phone country match": "Verify the phone number's country matches the expected country.",

  /* ── Health Insurance ── */
  "Card readable": "Verify the card image is readable and data can be extracted.",
  "Card not expired": "Verify the card has not expired.",
  "Issuer recognized": "Verify the card issuer is in the list of recognized insurers.",
  "Member ID extraction": "Extract the member ID from the card.",
  "Card tampering detection": "Detect signs of physical or digital tampering on the card.",

  /* ── Vehicle Insurance ── */
  "Policy not expired": "Verify the insurance policy has not expired.",
  "Insurer recognized": "Verify the insurer is recognized and valid.",
  "VIN extraction": "Extract the Vehicle Identification Number from the insurance card.",
  "Policy number extraction": "Extract the policy number from the insurance card.",
};

/** Tooltip descriptions for behavioral risk signals. */
export const behavioralRiskDescriptions: Record<string, string> = {
  "Behavior threat level": "Predicted risk level based on combined behavioral signals",
  "Bot score": "Likelihood score that the session was automated",
  "Request spoof attempts": "Number of requests that were likely spoofed",
  "User agent spoof attempts": "Number of user agent headers that were likely spoofed",
  "Restricted mobile SDK requests": "Requests from restricted mobile SDK versions",
  "Restricted API version requests": "Requests from restricted API versions",
  "User completion time": "Time from start to finish of flow",
  "Distraction events": "Number of times user left the flow",
  "Hesitation percentage": "Percentage of time with no user inputs",
  "Shortcut usage (copies)": "Times user used keyboard shortcut to copy",
  "Shortcut usage (pastes)": "Times user used keyboard shortcut to paste",
  "Autofill starts": "Times user autofilled a form field",
};
