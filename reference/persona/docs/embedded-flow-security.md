# Security

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)

# Security

## Embedding the Persona iframe

The [Embedded Flow](./embedded-flow.md) boots an iframe that loads Persona. If you’d like to restrict the allowed domains or URI schemes that are allowed to boot the Embedded Flow, you can configure a domain allowlist per template, or globally in the [Domain Manager](https://app.withpersona.com/dashboard/manage-domain) page within the Persona Dashboard.

The Persona iframe has several limitations around when embedding is allowed.

1.  Only inquiry templates with published versions can be embedded. Draft inquiry template versions cannot be embedded.
2.  Embedding in `localhost` is only allowed for Sandbox environments.
3.  If a domain allowlist is configured, the iframe can only be embedded on pages on these domains. Note that subdomains need to be configured separately.

## iframe permissions

The Persona flow requires access to the end user’s camera for Government ID and Selfie collection. If your integration uses these features, you will need to ensure that the Persona iframe has permissions to request camera access.

There are three types of permissions restrictions: the `Permissions-Policy` HTTP header, the iframe `allow` attribute, and the iframe `sandbox` attribute.

`Permissions-Policy` controls permissions for all elements on the page which loads the Persona iframe, while the iframe `sandbox` attribute controls permissions specifically for the Persona iframe.

### `Permissions-Policy` header

The `Permissions-Policy` HTTP header controls [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy) for the entire document. This header is specified by your server, and is not controlled by Persona.

If you use this header, you must ensure that the `camera` directive allows Persona’s domain. The required configuration may vary based on your exact integration (for example, if you use a custom domain / subdomain).

```
Permissions-Policy: camera=("https://*.withpersona.com/")
```

For more information, see the [MDN `Permissions-Policy` documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy).

### iframe `allow` attribute

The `allow` attribute controls [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy) on a per-iframe level.

The iframe created by the Embedded flow specifies `camera;microphone`. This is not configurable.

For more information, see the [MDN iframe documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#allow).

### iframe `sandbox` attribute

The `sandbox` attribute controls what browser behavior is controllable from within the iframe.

The iframe created by the Embedded Flow specifies several `sandbox` attributes. No configuration is needed on your part, as these attributes are automatically set by the Persona JavaScript SDK; however, attributes can be overridden with the `sandboxAttributes` [parameter](./embedded-flow-parameters.md). Note that changing these attributes may affect the functionality of the Inquiry Flow.

Required attributes (cannot be removed):

-   `allow-same-origin`: needed to run the Inquiry Flow at all, which is a React single-page app.
-   `allow-scripts`: allows the iframed content to retain its origin (withpersona.com), allowing communication with the Persona Inquiry Flow, usage of LocalStorage and cookies, etc.
-   `allow-popups`: allows opening new windows via links. Needed to allow access to Terms of Services and other consent policies.

Default attributes (can be removed):

-   `allow-forms`: needed for form submission. Only needed for flows including form inputs.
-   `allow-modals`: needed for the `beforeunload` event, which is used for error reporting.
-   `allow-top-navigation-by-user-activation`: allows redirect on completion of the flow. Only needed for flows that want to do a top-level redirect of the parent page upon completion.

Other attributes (not provided by default):

-   `allow-popups-to-escape-sandbox`: allows opening PDFs in new windows via links. Needed if you are linking to an external PDF in your flow. **Note that this attribute should be used with caution, as it allows popup content to avoid iframe sandbox restrictions. Ensure that popups only ever route to content you control.**
-   `geolocation`: allows collection of GPS location. Only needed for flows enabling this feature.

For more information, see the [MDN iframe documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox) and the [WHATWG HTML standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html).
