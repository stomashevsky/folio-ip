# Webhook Best Practices

## Handling duplicate events

Your webhook endpoints may occasionally receive the same event more than once. This is due to the nature of network connectivity. We recommend making your event processing idempotent to handle duplicate events. One way of doing this is to log events that you’ve processed and to skip processing for already-logged events.

## Webhook event ordering

You are not guaranteed to receive webhook events in the order they were created. For example, a network blip may cause an event to be retried and received after a newer event. Please utilize the `data.attributes.created-at` field to determine creation ordering.

## Checking signatures

Requests from webhooks will contain a `Persona-Signature` header with a hexadecimal-encoded HMAC. You should check that any request is authentic and safe to process by comparing this value with your own digest, computed from the request body and your webhook secret. Your webhook secret can be found in the [Webhooks section](https://withpersona.com/dashboard/webhooks) of the Dashboard.

The `Persona-Signature` header contains two comma-separated key-value pairs encoding information about the request. The first key-value pair will be in the form `t=<unix_timestamp>` and represents the unix time that the request was sent. The second key-value pair will be in the form `v1=<signature>`, where the signature is computed from your webhook secret and a dot-separated string composed of the unix timestamp joined with the request body.

It’s possible to have more than one valid signature for a webhook if its secrets are in the process of rotating. You can rotate your webhook secrets either via the Dashboard or the [rotate secret API](./api-reference/webhooks/rotate-a-webhook-secret.md). In this case, the `Persona-Signature` header will contain two space-separated sets of the key-value pairs described above.

Sample code for checking signatures:

```
# Basic signature verification on a newly created webhook
t, v1 = request.headers['Persona-Signature'].split(',').map { |value| value.split('=').second }
computed_digest = OpenSSL::HMAC.hexdigest('SHA256', <YOUR_WEBHOOK_SECRET>, "#{t}.#{request.body.read}")

if v1 == computed_digest
  # Handle verified webhook event
end

# Signature verification for multiple signatures if secrets are in the process of rotation
t = request.headers['Persona-Signature'].split(',').first.split('=').second
v1_new, v1_old = request.headers['Persona-Signature'].split(' ').map{ |value| value.split('v1=').second}
computed_digest = OpenSSL::HMAC.hexdigest('SHA256', <YOUR_WEBHOOK_SECRET>, "#{t}.#{request.body.read}")

if v1_new == computed_digest || v1_old == computed_digest
  # Handle verified webhook event
end
```

#### Parsing JSON when computing HMACs

In some languages, parsing the JSON may result in something that’s not equivalent to the request body. For example, JavaScript may round floats and reduce precision. We recommend using the raw request body when computing the HMAC.

## CSRF protection

If you’re using Rails, Django, or another web framework, your site might automatically check that every POST request contains a CSRF token. This is an important security feature that helps protect you and your users from cross-site request forgery attempts. However, this security measure might also prevent your site from processing legitimate events. If so, you might need to exempt the webhooks route from CSRF protection.

```
class PersonaController < ApplicationController
  # If your controller accepts requests other than Persona webhooks,
  # you'll probably want to use `protect_from_forgery` to add CSRF
  # protection for your application. But don't forget to exempt
  # your webhook route!
  protect_from_forgery except: :webhook

  def webhook
    # Process webhook data in `params`
  end
end
```
