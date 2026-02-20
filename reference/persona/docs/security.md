# Security

Security is at the core of our culture and we have operated from a security-first mentality from day one.

Persona’s security philosophy follows three principles:

-   Building defense-in-depth against external threats
-   Protecting against human error
-   Guarding against misuse of insider access

For more information about our security measures, see our [Security Statement](https://withpersona.com/security) or [contact us](https://app.withpersona.com/dashboard/contact-us).

## Domains and IP addresses

### API access IP restrictions

If you are calling our external API with static IP addresses and want an additional layer of security beyond API key based authorization, you can restrict the IPs that Persona accepts requests from. To add IP addresses to the allowlist, visit the [API Key Configuration](https://app.withpersona.com/dashboard/api-keys) section within the Persona dashboard.

### Webhook and Workflow requests

The full list of IP addresses that webhook and workflow requests may come from is:

##### Germany

```
.246.155.45
.89.193.61
.89.158.43
.198.149.197
.159.83.62
.159.68.157
```

##### India

```
.93.21.229
.244.13.71
.93.90.104
.93.222.99
```

##### United States

```
.232.44.140
.69.131.123
.67.4.225
.66.30.174
.123.74.158
.41.116.165
.145.62.98
.105.116.226
.168.249.74
.199.156.187
.105.58.25
.230.80.200
```

### Standard domains for allowlisting

If your organization has network security policies that require allowlisting external domains, you should include the following Persona domains to ensure proper functionality:

```
withpersona.com
app.withpersona.com
cdn.withpersona.com
docs.withpersona.com
inquiry.withpersona.com
miniapp.withpersona.com
sdk.withpersona.com
status.withpersona.com
t.withpersona.com
webrtc-consumer.withpersona.com
webrtc-stun.withpersona.com
```

If you have configured a custom subdomain for your organization, you should also allowlist:

```
<custom-subdomain>.withpersona.com
```

For information on how to set up a custom subdomain, see our [Subdomains documentation](./hosted-flow-subdomains.md).
