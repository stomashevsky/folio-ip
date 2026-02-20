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

export const WORKFLOW_FLOW_TEMPLATES: Record<string, string> = {
  "wfl_a1b2c3d4e5f6g7h8i9j0k1l2": `trigger:
  event: inquiry.completed
  where:
    risk_score: "< 30"

start: check_risk

steps:
  check_risk:
    type: conditional
    label: "Low risk score?"
    routes:
      - label: "Low Risk"
        when: "trigger.risk_score < 30"
        goto: approve_action
    else: notify_partner

  approve_action:
    type: action
    action: approve_inquiry
    label: "Approve Inquiry"
    next: notify_partner

  notify_partner:
    type: action
    action: make_http_request
    label: "Notify Partner"
    config:
      url: "https://api.partner.com/webhook"
    next: send_email

  send_email:
    type: action
    action: send_email
    label: "Send Approval Email"
    config:
      template: "approval_notice"

output: {}`,

  "wfl_m2n3o4p5q6r7s8t9u0v1w2x3": `trigger:
  event: verification.failed

start: check_attempts

steps:
  check_attempts:
    type: conditional
    label: "Max retries exceeded?"
    routes:
      - label: "Retries Exceeded"
        when: "trigger.retry_count >= 3"
        goto: escalate
    else: create_review_case

  escalate:
    type: action
    action: tag_object
    label: "Tag as Escalated"
    config:
      tag: "VERIFICATION_ESCALATED"
    next: create_review_case

  create_review_case:
    type: action
    action: create_case
    label: "Create Review Case"
    next: wait_resolution

  wait_resolution:
    type: wait
    label: "Wait for Case resolved"
    wait_for: object
    target_object: create_review_case
    events:
      - case.resolved
    timeout_seconds: 604800
    error_on_expiration: false
    next: resolution_check

  resolution_check:
    type: conditional
    label: "Case Resolution"
    routes:
      - label: "Approved"
        when: "case.resolution == approved"
        goto: approve_action
      - label: "Declined"
        when: "case.resolution == declined"
        goto: decline_action

  approve_action:
    type: action
    action: approve_inquiry
    label: "Approve Inquiry"

  decline_action:
    type: action
    action: decline_inquiry
    label: "Decline Inquiry"

output: {}`,

  "wfl_y4z5a6b7c8d9e0f1g2h3i4j5": `trigger:
  event: inquiry.completed

start: run_watchlist

steps:
  run_watchlist:
    type: action
    action: run_report
    label: "Run Watchlist Report"
    next: run_pep

  run_pep:
    type: action
    action: run_report
    label: "Run PEP Report"
    next: check_matches

  check_matches:
    type: conditional
    label: "Any matches found?"
    routes:
      - label: "Matches Found"
        when: "report.total_matches > 0"
        goto: tag_match
    else: approve_action

  tag_match:
    type: action
    action: tag_object
    label: "Tag as AML Match"
    config:
      tag: "AML_MATCH"
    next: review_action

  review_action:
    type: action
    action: review_inquiry
    label: "Send to Manual Review"

  approve_action:
    type: action
    action: approve_inquiry
    label: "Approve Inquiry"

output: {}`,

  "wfl_k6l7m8n9o0p1q2r3s4t5u6v7": `trigger:
  event: inquiry.completed

start: tag_signals

steps:
  tag_signals:
    type: parallel
    label: "Tag on Inquiry signals"
    branches:
      - check_tor
      - check_selfie
    next: run_reports

  check_tor:
    type: conditional
    label: "Using Tor?"
    routes:
      - label: "Tor Detected"
        when: "trigger.tor_detected == true"
        goto: tag_tor

  tag_tor:
    type: action
    action: tag_object
    label: "(tag) TOR DETECTED"
    config:
      tag: "TOR DETECTED"

  check_selfie:
    type: conditional
    label: "High-risk selfie?"
    routes:
      - label: "High Risk"
        when: "trigger.selfie_risk == high"
        goto: tag_selfie

  tag_selfie:
    type: action
    action: tag_object
    label: "(tag) HIGH RISK SELFIE"
    config:
      tag: "HIGH RISK SELFIE"

  run_reports:
    type: action
    action: run_report
    label: "Run Watchlist Report"
    next: review_decision

  review_decision:
    type: conditional
    label: "Match found?"
    routes:
      - label: "Match Found"
        when: "report.matches > 0"
        goto: mark_review
    else: approve_action

  mark_review:
    type: action
    action: review_inquiry
    label: "Mark for Review"
    next: create_case

  create_case:
    type: action
    action: create_case
    label: "Create Case"
    next: wait_resolution

  wait_resolution:
    type: wait
    label: "Wait for Case resolved"
    wait_for: object
    target_object: create_case
    events:
      - case.resolved
    timeout_seconds: 2592000
    error_on_expiration: false
    next: case_decision

  case_decision:
    type: conditional
    label: "Case Resolution"
    routes:
      - label: "Approved"
        when: "case.resolution == approved"
        goto: approve_action
      - label: "Declined"
        when: "case.resolution == declined"
        goto: decline_action

  approve_action:
    type: action
    action: approve_inquiry
    label: "Approve Inquiry"

  decline_action:
    type: action
    action: decline_inquiry
    label: "Decline Inquiry"

output: {}`,

  "wfl_w8x9y0z1a2b3c4d5e6f7g8h9": `trigger:
  event: report.ready

start: check_report

steps:
  check_report:
    type: conditional
    label: "Report has matches?"
    routes:
      - label: "Has Matches"
        when: "report.match_count > 0"
        goto: send_alert
    else: log_clean

  send_alert:
    type: action
    action: send_slack
    label: "Alert Compliance Team"
    config:
      channel: "#compliance-alerts"
    next: tag_report

  tag_report:
    type: action
    action: tag_object
    label: "Tag Report"
    config:
      tag: "REQUIRES_REVIEW"

  log_clean:
    type: action
    action: tag_object
    label: "Mark as Clean"
    config:
      tag: "CLEAN"

output: {}`,

  "wfl_i0j1k2l3m4n5o6p7q8r9s0t1": `trigger:
  event: account.created

start: check_jurisdiction

steps:
  check_jurisdiction:
    type: conditional
    label: "High-risk jurisdiction?"
    routes:
      - label: "High Risk"
        when: "account.country in [RU, IR, KP, CU]"
        goto: enhanced_check
    else: standard_check

  enhanced_check:
    type: action
    action: run_report
    label: "Run Enhanced Due Diligence"
    next: create_case

  create_case:
    type: action
    action: create_case
    label: "Create Compliance Case"

  standard_check:
    type: action
    action: run_report
    label: "Run Standard Check"
    next: auto_approve

  auto_approve:
    type: action
    action: tag_object
    label: "Tag as Onboarded"
    config:
      tag: "ONBOARDED"

output: {}`,
};

export const DEFAULT_WORKFLOW_YAML = `trigger:
  event: inquiry.completed

start: check_risk

steps:
  check_risk:
    type: conditional
    label: "Risk Level?"
    routes:
      - label: "High Risk"
        when: "trigger.risk_score > 70"
        goto: decline_action
    else: approve_action

  approve_action:
    type: action
    action: approve_inquiry
    label: "Approve Inquiry"

  decline_action:
    type: action
    action: decline_inquiry
    label: "Decline Inquiry"

output: {}`;

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
