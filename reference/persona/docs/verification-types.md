# Verification Types

The information that an individual is required to submit to verify their identity depends on your desired balance of friction and risk. Verification types that are more effective for proving identity typically require more friction. These can be mix-and-matched based on the use case. The recommended solution for fraud prevention is to require the individual to submit a government ID and selfie.

For a free consultation about which verification types are best for your use case, please [contact us](https://app.withpersona.com/dashboard/contact-us).

| Verification Type | API Type | Description |
| --- | --- | --- |
| Government ID | verification/government-id | The individual is asked to submit a government ID such as a driver license, national ID, or passport. Persona inspects the ID for authenticity and extracts the relevant information off of it for additional consumption. |
| Phone Number | verification/phone-number | The individual is asked to provide a phone number. Persona sends a confirmation PIN code and then checks the number against public and private databases to confirm that the information provided is valid. |
| Selfie | verification/selfie | The individual is asked to take a video of their face in real-time, and Persona checks that the individual is live and real. If a government ID was also submitted, the face captured in the selfie is compared against the face in the government ID. |
| Document | verification/document | The individual is asked to submit a document such as a utility bill, bank statement, or proof of address. Persona inspects the document for authenticity. |

## Database Verifications

A Database Verification answers the question “Do authoritative or issuing databases corroborate provided user data?”.

For a list of supported information fields and what countries and coverage we have, visit our database [coverage map](https://app.withpersona.com/dashboard/resources/coverage-map/database)

| Verification Type | API Type | Description |
| --- | --- | --- |
| Database | verification/database | The individual is asked to provide personal information like name, birthdate, address, and/or identification number. Persona uses the information to check against trusted public and private source databases, confirming that there is an associated identity record and that the provided information matches against the record. |
| AAMVA Database | verification/aamva | The individual is asked to provide personal information like name, birthdate, address, and/or identification number. Persona uses the information to check against US AAMVA databases, confirming that there is an associated identity record and that the provided information matches against the record. |
| eCBSV Database | verification/database-ecbsv | The individual is asked to provide personal information like name, birthdate, address, and/or identification number. Persona uses the information to check against US eCBSV databases, confirming that there is an associated identity record and that the provided information matches against the record. |
| Phone Carrier Database | verification/database-phone-carrier | The individual is asked to provide personal information like name, birthdate, address, and/or identification number. Persona uses the information to check against phone carriers (ATT, T-Mobile, Verizon) databases, confirming that there is an associated identity record and that the provided information matches against the record. |
| Serpro Database | verification/database-phone-serpro | The individual is asked to provide personal information like name, birthdate, selfie, and/or identification number. Persona uses the information to check against Brazil Serpro databases, confirming that there is an associated identity record and that the provided information matches against the record. |
| TIN Database | verification/database-tin | The individual is asked to provide personal information like name, business name, and/or identification number. Persona uses the information to check against US IRS databases, confirming that there is an associated identity record and that the provided information matches against the record. |

#### Legacy government ID types

If you are using our older verification types, then you will see the following types instead:

-   verification/driver-license
-   verification/national-identity-card
-   verification/passport
-   verification/other-identity-card
