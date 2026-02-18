export const FLOW_TEMPLATES: Record<string, string> = {
  "itmpl_kkVEMjLsjv5g3YhSDjzqb44Ac5Fe": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: selfie
    on_fail: decline
    retry:
      max: 3

  selfie:
    type: verification
    verification: selfie
    required: true
    on_pass: database_check
    on_fail: needs_review
    retry:
      max: 2

  database_check:
    type: verification
    verification: database
    required: false
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 1

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_9xRnPkWq2fT4mBhY7cDvEaJ3LsNz": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: approve
    on_fail: decline
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined`,

  "itmpl_3dFgH8jKlMn5oPqRsTuVwXyZ1a2B": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: document_check
    on_fail: decline
    retry:
      max: 2

  document_check:
    type: verification
    verification: document
    required: true
    on_pass: selfie
    on_fail: needs_review
    retry:
      max: 1

  selfie:
    type: verification
    verification: selfie
    required: true
    on_pass: database_check
    on_fail: needs_review
    retry:
      max: 2

  database_check:
    type: verification
    verification: database
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 1

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_BcDeFgHiJkLm4NoPqRsTuVw8XyZa": `start: document_check

steps:
  document_check:
    type: verification
    verification: document
    required: true
    on_pass: selfie
    on_fail: needs_review
    retry:
      max: 2

  selfie:
    type: verification
    verification: selfie
    required: false
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  needs_review:
    status: needs_review`,

  "itmpl_QrStUvWxYz1a2B3cDeFgHiJk4LmNo": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: document_check
    on_fail: decline
    retry:
      max: 3

  document_check:
    type: verification
    verification: document
    required: true
    on_pass:
      branch:
        - when: "country in [US, CA, GB]"
          goto: database_check
        - default: manual_review
    on_fail: needs_review
    retry:
      max: 2

  database_check:
    type: verification
    verification: database
    required: false
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 1

  manual_review:
    type: review
    label: "International Document Review"
    outcomes:
      approved: approve
      rejected: decline

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_LmNoPqRsTuVw2XyZaBcDeFgHiJk3Lm": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: selfie
    on_fail: decline
    retry:
      max: 2

  selfie:
    type: verification
    verification: selfie
    required: true
    on_pass:
      branch:
        - when: "face_match_score < 70"
          goto: manual_review
        - default: database_check
    on_fail: needs_review
    retry:
      max: 2

  database_check:
    type: verification
    verification: database
    required: true
    on_pass: document_check
    on_fail: needs_review
    retry:
      max: 1

  document_check:
    type: verification
    verification: document
    required: false
    on_pass: approve
    on_fail:
      branch:
        - when: "risk_level == high"
          goto: decline
        - default: needs_review

  manual_review:
    type: review
    label: "Fraud Review"
    outcomes:
      approved: database_check
      rejected: decline

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_aAmVbBnWcCxDdYeEfFgGhHiIjJkKlM": `start: aamva_check

steps:
  aamva_check:
    type: verification
    verification: aamva
    required: true
    on_pass: approve
    on_fail: decline
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined`,

  "itmpl_nNoOpPqQrRsStTuUvVwWxXyYzZaAbB": `start: database_check

steps:
  database_check:
    type: verification
    verification: database
    required: false
    on_pass: approve
    on_fail: government_id

  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: approve
    on_fail: decline
    retry:
      max: 3

terminals:
  approve:
    status: approved
  decline:
    status: declined`,

  "itmpl_cCdDeEfFgGhHiIjJkKlLmMnNoOpPqQ": `start: database_check

steps:
  database_check:
    type: verification
    verification: database
    required: false
    on_pass: selfie
    on_fail: government_id

  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: selfie
    on_fail: decline
    retry:
      max: 3

  selfie:
    type: verification
    verification: selfie
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_rRsStTuUvVwWxXyYzZaAbBcCdDeEfF": `start: phone_carrier_check

steps:
  phone_carrier_check:
    type: verification
    verification: database_phone_carrier
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 1

terminals:
  approve:
    status: approved
  needs_review:
    status: needs_review`,

  "itmpl_gGhHiIjJkKlLmMnNoOpPqQrRsStTuU": `start: database_ssn_check

steps:
  database_ssn_check:
    type: verification
    verification: database_ssn
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 1

terminals:
  approve:
    status: approved
  needs_review:
    status: needs_review`,

  "itmpl_vVwWxXyYzZaAbBcCdDeEfFgGhHiIjJ": `start: email_check

steps:
  email_check:
    type: verification
    verification: email_address
    required: true
    on_pass: approve
    on_fail: decline
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined`,

  "itmpl_kKlLmMnNoOpPqQrRsStTuUvVwWxXyY": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: database_check
    on_fail: decline
    retry:
      max: 3

  database_check:
    type: verification
    verification: database
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 1

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_zZaAbBcCdDeEfFgGhHiIjJkKlLmMnN": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: database_check
    on_fail: decline
    retry:
      max: 3

  database_check:
    type: verification
    verification: database
    required: true
    on_pass: selfie
    on_fail: needs_review
    retry:
      max: 1

  selfie:
    type: verification
    verification: selfie
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_oOpPqQrRsStTuUvVwWxXyYzZaAbBcC": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: document_check
    on_fail: decline
    retry:
      max: 3

  document_check:
    type: verification
    verification: document
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_dDeEfFgGhHiIjJkKlLmMnNoOpPqQrR": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: proof_of_address
    on_fail: decline
    retry:
      max: 3

  proof_of_address:
    type: verification
    verification: document
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_sStTuUvVwWxXyYzZaAbBcCdDeEfFgG": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: selfie
    on_fail: decline
    retry:
      max: 3

  selfie:
    type: verification
    verification: selfie
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_hHiIjJkKlLmMnNoOpPqQrRsStTuUvV": `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: selfie
    on_fail: decline
    retry:
      max: 3

  selfie:
    type: verification
    verification: selfie
    required: true
    on_pass: proof_of_address
    on_fail: needs_review
    retry:
      max: 2

  proof_of_address:
    type: verification
    verification: document
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_wWxXyYzZaAbBcCdDeEfFgGhHiIjJkK": `start: health_insurance_check

steps:
  health_insurance_check:
    type: verification
    verification: health_insurance_card
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  needs_review:
    status: needs_review`,

  "itmpl_lLmMnNoOpPqQrRsStTuUvVwWxXyYzZ": `start: phone_check

steps:
  phone_check:
    type: verification
    verification: phone_number
    required: true
    on_pass: approve
    on_fail: decline
    retry:
      max: 3

terminals:
  approve:
    status: approved
  decline:
    status: declined`,

  "itmpl_aAbBcCdDeEfFgGhHiIjJkKlLmMnNoO": `start: phone_check

steps:
  phone_check:
    type: verification
    verification: phone_number
    required: true
    on_pass: database_check
    on_fail: decline
    retry:
      max: 3

  database_check:
    type: verification
    verification: database
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 1

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_pPqQrRsStTuUvVwWxXyYzZaAbBcCdD": `start: phone_check

steps:
  phone_check:
    type: verification
    verification: phone_number
    required: true
    on_pass: government_id
    on_fail: decline
    retry:
      max: 3

  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: selfie
    on_fail: decline
    retry:
      max: 3

  selfie:
    type: verification
    verification: selfie
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`,

  "itmpl_eEfFgGhHiIjJkKlLmMnNoOpPqQrRsS": `start: vehicle_insurance_check

steps:
  vehicle_insurance_check:
    type: verification
    verification: vehicle_insurance
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  needs_review:
    status: needs_review`,
};

export const DEFAULT_FLOW_YAML = `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: approve
    on_fail: decline
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined`;
