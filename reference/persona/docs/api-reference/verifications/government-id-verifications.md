# Government ID Verifications

[API Reference](../accounts/list-all-accounts.md)[Verifications](../verifications.md)

# Government ID Verifications

A Government Id Verification answers the question “Does the individual possess a genuine Government Issued Identity that supports their claim to a physical identity?”

## Government Id Types

Government ID verifications have an `id-class` attribute. This is the type of ID associated with the verification. The following are the Persona ID class identifiers. Please note that some of these ID types are only relevant to certain locales, and so may not be relevant to all use cases.

| Persona Identifier | ID Class Name |
| --- | --- |
| `cct` | Certificate of Citizenship |
| `cid` | Consular ID |
| `dl` | Drivers License |
| `foid` | Colombia Foreigner ID |
| `hic` | Canada Health Insurance Card |
| `id` | Identification Card |
| `ipp` | Russia Internal Passport |
| `keyp` | Australia Keypass ID |
| `ltpass` | Singapore Long Term Visit Pass |
| `munid` | Municipal ID |
| `myn` | Japan MyNumber Card |
| `nbi` | Philippines National Bureau of Investigation Certificate |
| `nric` | Singapore National Residency ID |
| `ofw` | Philippines Overseas Foreign Worker Card |
| `rp` | Residence Permit |
| `pan` | India Permanent Account Number Card |
| `pid` | Philippines Postal Identification Card |
| `pp` | Passport |
| `ppc` | Passport Card |
| `pr` | Permanent Residence Card |
| `sss` | Philippines Social Security System Card |
| `td` | US Refugee Travel Document |
| `tribalid` | Canada Tribal ID |
| `umid` | Philippines United Multi Purpose ID |
| `vid` | Voter Id |
| `visa` | Immigration Visa |
| `wp` | Work Permit |

## Verification Checks

See the full set of Government ID Verification checks in the [Verification Checks table](https://app.withpersona.com/dashboard/resources/verification-checks/) in your Dashboard.

## Product Versions

| Component | Version | Notes |
| --- | --- | --- |
| Government ID | 5.10.4 | 1\. Refactor for interoperability with Persona Transactions and workflows 2. Miscellaneous extraction improvements |
| Government ID | 5.10.3 | 1\. Improve archiving of ID registries |
| Government ID | 5.10.2 | 1\. fix gov-id image reference and error handling 2. Redact govID verifications synchronously 3. Add redaction for birthplace from govID documents |
| Government ID | 5.10.1 | 1\. fully roll out enable-govid-corner-hints 2. improve id corner detection 3. Add Permanent Resident and Commercial GovID designation |
| Government ID | 5.10.0 | 1\. Better handle mis-aligned IDs from SEA and SA 2. fully roll out enable-govid-corner-hints 3. Integrate segmentation model v3 to improve auto-classification of all IDs |
