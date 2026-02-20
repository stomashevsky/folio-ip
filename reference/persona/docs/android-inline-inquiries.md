# Android Inline Inquiries Guide

[Sending data to Persona](./choosing-an-integration-method.md)[Inquiries (Client-side integrations)](./inquiries.md)[Integration Methods](./hosted-flow.md)[Mobile](./mobile-sdks.md)[Android](./android-sdk-v2-integration-guide.md)[Android Integration Guide](./android-sdk-v2-integration-guide.md)

# Android Inline Inquiries Guide

A guide on how to launch Inquiries inline.

Persona inquiries are usually launched as fullscreen experiences on Android, but it is possible to launch inquiries inline using the SDK. [Android Fragments](https://developer.android.com/guide/fragments) are used when launching inquires inline.

[A sample project can be found here.](https://github.com/persona-id/persona-android-sdk/tree/main/InlineInquirySample) This sample project demonstrates one method of launching an Inquiry inline.

### Building an Inline Inquiry

An Inquiry fragment is necessary to launch an Inquiry inline. To build an Inquiry fragment, create a regular inquiry builder and configure it to your needs. Then call `toInlineInquiryBuilder()` on the builder to turn the it into an `InlineInquiryBuilder`. The `InlineInquiryBuilder` offers additional configuration options specific to the inline experience.

Call `createFragment()` on the `InlineInquiryBuilder` to get an Inquiry fragment.

```kotlin
val inlineInquiryFragment = Inquiry
    .fromTemplate(TEMPLATE_ID)
    .environment(Environment.SANDBOX)
    .toInlineInquiryBuilder()
    .createFragment()
```

### Attaching the fragment

The Inquiry fragment can be attached like any other Android fragment. You can choose to attach the fragment to an Activity or Fragment. An example of how to attach the fragment is shown below.

```kotlin
// Inside an Activity
override fun onCreate(savedInstanceState: Bundle?) {
    // Guard against attaching the fragment multiple times.
    if (savedInstanceState == null) {
        supportFragmentManager.commit {
            replace(
                R.layout.inquiry_fragment_container,
                requireNotNull(inlineInquiryFragment),
            )
        }
    }
}

// Inside a Fragment
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    // Guard against attaching the fragment multiple times.
    if (savedInstanceState == null) {
        childFragmentManager.commit {
            replace(
                R.layout.inquiry_fragment_container,
                requireNotNull(inlineInquiryFragment),
            )
        }
    }
}
```

### Getting results from an inquiry fragment

The Inquiry fragment uses the [Android Fragment Result API](https://developer.android.com/guide/fragments/communicate#fragment-result) to return results back to the host Activity/Fragment. The results are returned inside the result Bundle. You will need to call `Inquiry.extractInquiryResponseFromBundle()` to get the Inquiry result.

```kotlin
// Inside an Activity
override fun onCreate(savedInstanceState: Bundle?) {
    // Listen for results from the Persona inquiry. By default the inquiry fragment uses
    // com.withpersona.sdk2.inquiry.types.DEFAULT_REQUEST_KEY as the request key to return
    // results to. This can be changed in the InlineInquiryBuilder.
    supportFragmentManager
        .setFragmentResultListener(DEFAULT_REQUEST_KEY, this) { _, bundle ->
            val result = Inquiry.extractInquiryResponseFromBundle(bundle, this)

            when (result) {
                is InquiryResponse.Cancel -> {
                    // User cancelled the flow.
                }
                is InquiryResponse.Complete -> {
                    // User completed the flow. Note that this doesn't mean the user
                    // verified successfully. It just means the user got to the end.
                }
                is InquiryResponse.Error -> {
                    // An error prevented the user from completing the flow.
                }
            }
        }
}

// Inside a Fragment
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    // Listen for results from the Persona inquiry. By default the inquiry fragment uses
    // com.withpersona.sdk2.inquiry.types.DEFAULT_REQUEST_KEY as the request key to return
    // results to. This can be changed in the InlineInquiryBuilder.
    childFragmentManager
        .setFragmentResultListener(DEFAULT_REQUEST_KEY, viewLifecycleOwner) { _, bundle ->
            val result = Inquiry.extractInquiryResponseFromBundle(bundle, requireContext())

            when (result) {
                is InquiryResponse.Cancel -> {
                    // User cancelled the flow.
                }
                is InquiryResponse.Complete -> {
                    // User completed the flow. Note that this doesn't mean the user
                    // verified successfully. It just means the user got to the end.
                }
                is InquiryResponse.Error -> {
                    // An error prevented the user from completing the flow.
                }
            }
        }
}
```

### Using custom navigation UI

The `InlineInquiryBuilder` offers several additional customization options such as hiding the built-in navigation UI. If you wish to provide your own navigation UI you can control the Inquiry fragment using the `InlineInquiryScreen` object.

You can see how to obtain the `InlineInquiryScreen` object below.

```kotlin
// If using an Activity
// Have the hosting Activity implement InlineInquiryController
@OptIn(ExperimentalInlineApi::class)
class MyActivity : AppCompatActivity(), InlineInquiryController {
    private var inlineInquiryScreen: InlineInquiryScreen? = null
    
    @ExperimentalInlineApi
    override fun onAttached(inlineInquiryScreen: InlineInquiryScreen) {
        this.inlineInquiryScreen = inlineInquiryScreen
    }

    @ExperimentalInlineApi
    override fun onDetached() {
        this.inlineInquiryScreen = null
    }
}

// If using a Fragment
// Have the hosting Fragment implement InlineInquiryController
@OptIn(ExperimentalInlineApi::class)
class MyFragment : Fragment(), InlineInquiryController {
    private var inlineInquiryScreen: InlineInquiryScreen? = null
    
    @ExperimentalInlineApi
    override fun onAttached(inlineInquiryScreen: InlineInquiryScreen) {
        this.inlineInquiryScreen = inlineInquiryScreen
    }

    @ExperimentalInlineApi
    override fun onDetached() {
        this.inlineInquiryScreen = null
    }
}
```

Once you have an instance of `InlineInquiryScreen`, you can use it to control the inquiry.

```kotlin
backButton.setOnClickListener {
  inlineInquiryScreen?.goBack()
}
closeButton.setOnClickListener {
  inlineInquiryScreen?.cancelInquiry(force = false)
}
```

Inquiries can have complex states where the back and/or the close actions are not available. It is recommended that you handle these state changes when providing custom navigation UI.

Observe state changes by collecting `InlineInquiryScreen.screenStateFlow`. Then update the navigation UI according to the current state.

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    inlineInquiryScreen.screenStateFlow.collect {
        if (!it.isNavigationEnabled) {
          closeButton.isEnabled = false
          closeButton.alpha = 0.5f
          
          backButton.isEnabled = false
          backButton.alpha = 0.5f
        } else {
          closeButton.isEnabled = true
          closeButton.alpha = 1f
          
          backButton.isEnabled = true
          backButton.alpha = 1f
        }
        
        if (it.shouldShowBackButton) {
          backButton.visibility = View.VISIBLE
        } else {
          backButton.visibility = View.GONE
        }

        if (it.shouldShowCancelButton) {
          closeButton.visibility = View.VISIBLE
        } else {
          closeButton.visibility = View.GONE
        }
    }
}
```
