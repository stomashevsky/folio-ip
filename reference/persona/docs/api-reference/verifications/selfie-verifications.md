# Selfie Verifications

[API Reference](../accounts/list-all-accounts.md)[Verifications](../verifications.md)

# Selfie Verifications

A Selfie Verification answers the question “Is the individual present during the transaction?”. This is especially useful when combined with a [Government ID Verification](./government-id-verifications.md) to associate the face of the government issued id to the individual present.

The main goals of Selfie Verifications are to ascertain the following:

1.  Face Image Quality
    
    1.  Poses - Determine whether an individual is properly facing towards the camera
    2.  Quality - Determine whether the image’s resolution, lighting, and blur is sufficient for accuracy
    3.  Obfuscation - Determine that an individual’s portrait is not obfuscated by glasses, hair, or other items
2.  Face Comparison
    
    1.  Determine whether the individual matches a claimed individual
3.  Face Liveness
    
    1.  Determine whether the submission contains features that are indicative of a spoof

## Selfie Capture Types

1.  Center only - Only one portrait of the individual facing the camera is captured
    
2.  Center and profile - Three portraits are required captured the individual facing left, center and right of the camera
    

## Verification Checks

See the full set of Selfie Verification checks in the [Verification Checks table](https://app.withpersona.com/dashboard/resources/verification-checks/) in your Dashboard.

## Product Versions

### Match

| Version | Notes |
| --- | --- |
| 3.2.0 | Add support for Digital ID matching |
| 3.1.2 | Reduce false rejections caused by low quality ID portraits |
| 3.1.1 | Bug fix for cross product interoperability |
| 3.1.0 | Improve support for NFC match |
| 3.0.0 | Major version update of face comparison ensemble model |

### Liveness

| Version | Notes |
| --- | --- |
| 3.3.0 | Significant improvements for injection attacks |
| 3.2.0 | Significant false positive rate improvements. Adjust risk levels to account for new ensemble model score shifts. |
| 3.1.0 | Significant false positive rate improvements. Adjust risk levels to account for new ensemble model score shifts. |
| 3.0.1 | Significant false positive rate improvements. Adjust risk levels to account for new ensemble model score shifts. |
| 3.0.0 | Major version update that includes improved deepfake and generative AI recall |
| 2.2.0 | Significant false positive rate improvements. Adjust risk levels to account for new ensemble model score shifts. |
| 2.1.0 | Improve auto-capture experience |
| 2.0.0 | Major version update of face Presentation Attack Detection ensemble model |

### Age

| Version | Notes |
| --- | --- |
| 2.2.1 | Enforce stricter face quality. Exclude adverse face positioning and illuminations by default |
| 2.2.0 | Minor version update of Age estimation ensemble model |
| 2.1.2 | Expose additional risk configuration settings |
| 2.1.1 | Improve low image quality handling |
| 2.1.0 | Broader rollout of new checks: selfie\_age\_threshold\_comparison id\_age\_inconsistency\_detection |
| 2.0.0 | Launch new Selfie age estimation model |
