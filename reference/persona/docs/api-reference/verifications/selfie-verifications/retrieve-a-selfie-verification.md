# Retrieve a Selfie Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Selfie Verifications](../selfie-verifications.md)

# Retrieve a Selfie Verification

GET

https://api.withpersona.com/api/v1/verification/selfies/:verification-id

```
{
  "data": {
    "id": "ver_dCvHHPUHxvb5j2iYKfjwafBU",
    "attributes": {
      "capture-method": "photo",
      "center-photo-face-coordinates": {
        "top-left": [
          0.2,
          0.5
        ],
        "top-right": [
          0.5,
          0.5
        ],
        "bottom-left": [
          0.2,
          0.7
        ],
        "bottom-right": [
          0.5,
          0.7
        ]
      },
      "center-photo-url": "https://files.withpersona.com/...",
      "checks": [
        {
          "name": "selfie_id_comparison",
          "status": "not_applicable",
          "reasons": [
            "no_government_id"
          ],
          "metadata": {}
        },
        {
          "name": "selfie_pose_detection",
          "status": "passed",
          "reasons": [],
          "metadata": {}
        },
        {
          "name": "selfie_multiple_faces_detection",
          "status": "passed",
          "reasons": [],
          "metadata": {}
        },
        {
          "name": "selfie_pose_repeat_detection",
          "status": "passed",
          "reasons": [],
          "metadata": {}
        },
        {
          "name": "selfie_account_comparison",
          "status": "not_applicable",
          "reasons": [
            "no_account_selfie_present"
          ],
          "metadata": {}
        },
        {
          "name": "selfie_suspicious_entity_detection",
          "status": "passed",
          "reasons": [],
          "metadata": {}
        },
        {
          "name": "selfie_liveness_detection",
          "status": "passed",
          "reasons": [],
          "metadata": {}
        },
        {
          "name": "selfie_glasses_detection",
          "status": "passed",
          "reasons": [],
          "metadata": {}
        },
        {
          "name": "selfie_glare_detection",
          "status": "failed",
          "reasons": [
            "too_much_glare"
          ],
          "metadata": {}
        },
        {
          "name": "selfie_public_figure_detection",
          "status": "passed",
          "reasons": [],
          "metadata": {}
        },
        {
          "name": "selfie_age_comparison",
          "status": "not_applicable",
          "reasons": [
            "no_reference_birthdate"
          ],
          "metadata": {}
        },
        {
          "name": "selfie_face_covering_detection",
          "status": "passed",
          "reasons": [],
          "metadata": {}
        }
      ],
      "completed-at": "2022-07-28T21:54:33.000Z",
      "completed-at-ts": 1659045273,
      "country-code": null,
      "created-at": "2022-07-28T21:54:23.000Z",
      "created-at-ts": 1659045263,
      "document-similarity-score": null,
      "left-photo-url": "https://files.withpersona.com/...",
      "photo-urls": [
        {
          "byte-size": 316802,
          "page": "left_photo",
          "url": "https://files.withpersona.com/..."
        }
      ],
      "right-photo-url": "https://files.withpersona.com/...",
      "selfie-similarity-score-left": 100,
      "selfie-similarity-score-right": 100,
      "status": "passed",
      "submitted-at": "2022-07-28T21:54:29.000Z",
      "submitted-at-ts": 1659045269,
      "video-url": "https://files.withpersona.com/..."
    },
    "relationships": {
      "inquiry": {}
    },
    "type": "verification/selfie"
  }
}
```
