# Inlined React

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Embedded Flow](./embedded-flow.md)

# Inlined React

The Inlined React flow allows loading the Persona Inquiry flow directly within your page as a React component. It is intended for desktop flows that do not want a dropdown modal experience.

Verifying individuals with the [Inlined React Flow](./inlined-flow.md) can be easily achieved with a short code snippet. You’ll only need your template ID which can be found in the [Integration Section](https://withpersona.com/dashboard/integration) of your Dashboard.

The latest version of the SDK is: [![Persona React SDK latest](./images/persona-react_f5d5de051b71.png)](https://www.npmjs.com/package/persona-react)

## Inlining the flow

Persona can be integrated with the following code snippet. Remember to replace `templateId` with your organization’s template ID.

```typescript
import PersonaReact from 'persona-react';

const InlineInquiry = () => {
  return (
    <PersonaReact
      templateId='<your template ID starting with itmpl_>'
      environmentId='<your environment ID starting with env_>'
      onLoad={() => { console.log('Loaded inline'); }}
      onComplete={({ inquiryId, status, fields }) => {
        // Inquiry completed. Optionally tell your server about it.
        console.log('Sending finished inquiry ' + inquiryId + ' to backend');
      }}
    />
  );
};
```

To permit the Persona iframe to render on your domain, see [Security > Embedding the Persona iframe](./embedded-flow-security.md#embedding-the-persona-iframe).

## Styling

The inlined React component renders an `iframe` containing the Persona flow. For more granular or dynamic styling, the `iframe` can be targeted via CSS. We recommend targeting a selector provided by your app such as `.your-classname > iframe` instead of relying on Persona class names to avoid unexpected breakage.

**We recommend using a minimum height of `650px` and a minimum width of `400px` to ensure contents are properly displayed without excessive horizontal wrapping or scrolling.**

## Handling loading state

The Persona iframe starts loading when the Persona component is rendered. Thus, there will be a delay between when the component is rendered and when the Inquiry flow content is displayed. We recommend using the `onReady` [client callback](./embedded-flow-client-callbacks.md) to detect when loading is completed, and handling any loading UI outside of Persona.

Alternatively, if your use case allows it, you can pre-render the Persona component and visually hide it with CSS until it needs to be used.

Please reference this [sample implementation](https://8lkyf9.csb.app/) for an example of how to seamlessly swap between your app’s loading UI and the Persona component.

## Handling conditional visibility

The Inlined React flow does not support conditional visibility, and has no notion of canceling or closing the flow. If you want to replicate the modal experience of the Embedded Integration, you will need to implement the visibility toggling logic yourself.
