# OpenAI uses Persona to screen millions of users each month with zero friction

![OpenAI-customer-logo-full-color](../images/OpenAI-customer-logo-full-color_81e65de36663.png)

# OpenAI uses Persona to screen millions of users each month with zero friction

Learn how Persona helps OpenAI automatically screen 99% of users to fulfill its mission of offering safe AGI that benefits all of humanity.

99%

automated screenings

225

countries and territories where Persona screens OpenAI users

18ms

screening latency

OpenAI is an AI research and deployment company that develops artificial intelligence models and generative AI technologies such as ChatGPT, DALL-E, and Sora. Its mission is to develop safe artificial general intelligence (AGI) that benefits all of humanity.

## Problem: OpenAI wanted to keep risky users away to prevent scaled abuse while making signup as easy as possible

As a leader in the artificial intelligence space, OpenAI is deeply committed to ensuring that the models and technologies it releases are safe. As it likes to say, “AI is an extremely powerful tool that must be created with safety and human needs at its core.”

This care is not only evident on its website but also in its personnel — the company has an entire team dedicated to integrity that’s responsible for detecting and preventing scaled abuse (think [account takeovers](../blog/account-takeover-fraud.md), API policy violations, and other scaled attack vectors), building products and systems to help people create, manage, verify, and control their identity across its services, and more.

Jake Brill leads product for the integrity team and explains that in order to fulfill OpenAI’s mission, his team needs to take a nuanced approach to identity.

“Our mission is to build safe AGI that benefits all of humanity,” Jake explains. “To offer safe AGI, we need to make sure bad people aren’t using our services. But we don’t necessarily believe we need to know all aspects of an individual’s identity to feel comfortable with them using our services. We also want the benefit of our products to reach as many people as possible, and it’s extremely difficult to accomplish that mission if we make it really hard to sign up for our services.”

In other words, OpenAI needed a way to balance two goals: onboard as many people as possible while ensuring its users and platform are safe. To do this, OpenAI knew it wanted to introduce as little verification-related friction into the signup process as possible.

Asking everyone to submit their government ID seemed excessive, so OpenAI began looking into another form of verification: [sanctions screening](../blog/how-to-protect-your-business-with-automated-sanctions-screening.md). “One of the ways we can confirm bad people aren’t using our services is to make sure people or entities that are sanctioned are not using our services,” says Jake.

With this plan in mind, the team began looking for a solution.

## Solution: OpenAI works with Persona to customize its screening logic so it can minimize false positives while onboarding as many users as possible

As an experienced trust and safety leader, Jake has used other identity verification solutions in the past. However, identity is nuanced, so he didn’t want to assume what worked at other companies would work for OpenAI. As such, he made sure to evaluate a number of providers and perform a [bake-off](../blog/buyers-guide-identity-verification-solutions.md#toc-1) to ensure the solution his team went with would be the best for OpenAI specifically.

After an in-depth evaluation process, OpenAI ultimately chose Persona for the following reasons:

### Fast global screening options and flexible matching logic

One of the reasons Jake’s team decided to work with Persona is our sanctions screening solution fit OpenAI’s list of key criteria:

-   Global coverage
    
-   The ability to customize match list criteria
    
-   Low latency
    

At the time, OpenAI had 100M active users around the world, so it “needed breadth of international coverage and comprehensiveness of sanctions to screen against,” shares Jake. Fortunately, Persona allows businesses to screen against 100+ global sanctions and warning lists and offers coverage around the world, so this was an easy request to fulfill. Today, OpenAI uses Persona to screen users across 225 countries and territories.

The second criterion was the ability to [configure match list criteria](../blog/how-match-requirements-allow-you-to-fine-tune-your-idv-processes.md) — in other words, customize what triggers a “match” on a report. “It’s really critical for us to figure out all the different ways we can configure exact name matches versus partial name matches,” says Jake. “For date of birth information, do we want to match only a month, day, year, or some combination thereof? How do we handle situations in which there’s a match for name and geography but no date of birth included?”

This is especially important when you consider the size of OpenAI’s user base. If even 1% of its millions of users were flagged as potentially being on an international sanctions list, that’s a lot of users that’d have to go through a more difficult flow and/or be reviewed manually.

At Persona, we strive to make all of our products as configurable as possible in order to solve each customer’s specific needs — and match requirements are no exception. During the evaluation period, Persona was able to help OpenAI tweak its match settings to reduce its hit rate by over 40% — allowing it to confidently flag risky users while ensuring most users had a seamless experience. “It was really critical to us that we minimized our false positive rate, and we were very encouraged by how quickly the Persona team updated the logic and how much configurability there was with the logic. Persona’s matching capabilities were the best from our testing,” Jake explains.

Finally, Jake’s team knew that whatever solution they ended up implementing would need to be able to perform a large amount of screenings with extremely low latency. “Because we were integrating this at the point of sign-up, which is a really critical place where someone might fall off, we wanted to make sure we were minimizing any sort of disruption to people signing up for our service.”

To accomplish this, Persona spun up a dedicated cluster within the same region as OpenAI's infrastructure. This enabled us to reduce latency to just 18ms — over 5x faster than the 100ms latency OpenAI had requested.

> It was really critical to us that we minimized our false positive rate, and we were very encouraged by how quickly the Persona team updated the logic and how much configurability there was with the logic. Persona’s matching capabilities were the best from our testing.

Jake Brill

Product Lead at OpenAI

### Different flows for different use cases and risk levels

While OpenAI doesn’t want to impose too much friction on users during the signup process, it does want to be able to perform additional verifications if needed. As Jake explains, "We use Persona to screen new signups for OpenAI against international sanctions watchlists, with the option to prompt other verifications and manual reviews as needed."

This process is powered by Persona’s [Workflows](../product/workflows.md) solution, which allows businesses to segment users based on risk and automatically kick off follow-up actions so individuals only have to submit the minimum needed for their specific situation. As a result, “Persona is really effective at optimizing the good user experience and creating friction for bad users to prevent them from getting through,” Jake says.

### Thought partnership

While global screening was the reason OpenAI began looking for an identity solution in the first place, having a thought partner was also table stakes. “We move really fast at OpenAI, so we value partners who are responsible and able to move fast as well,” explains Jake.

OpenAI had a good first impression of Persona after working with the team to address and exceed its latency expectations. “We appreciate it when partners are willing to find creative solutions to novel problems because we are often running into novel problems by virtue of how fast we’re scaling. Persona’s solution made it clear that the team was willing to think outside of the box and come up with a non-traditional solution for us.”

However, you can never be sure what your experience will be like after a vendor is done vying for your business. As Jake puts it, “Sometimes you worry that you’re getting the A+ version of the experience during the sales cycle, and then you’ll get something less than A+ after you’ve entered a contract.”

Fortunately, with Persona, this was not the case. “Part of the reason we’re giving this testimonial is we’ve felt A+ support from Persona the whole time,” Jake continues. “I’m deeply impressed by the around-the-clock engagement we get from the team. They’re messaging at all hours of the night and while flying cross-country. It’s very clear how hungry and engaged the team is.”

> Sometimes you worry that you’re getting the A+ version of the experience during the sales cycle, and then you’ll get something less than A+ after you’ve entered a contract. Part of the reason we’re giving this testimonial is we’ve felt A+ support from Persona the whole time.

Jake Brill

Product Lead at OpenAI

## Results: OpenAI automatically screens 99% of users to fulfill its mission of offering safe AGI that benefits all of humanity

With Persona, OpenAI automatically screens over 99% of users behind the scenes in seconds, allowing it to onboard as many people as possible while ensuring its users and platform are safe — essentially fulfilling its mission of offering safe AGI that benefits all of humanity. But it’s not stopping there.

When OpenAI was evaluating identity solutions, it knew it didn’t want to just solve for its current needs — “we wanted to future-proof engagement with an identity provider because we knew we really cared about sanction screenings, but we also had ambient ideas over the future of other identity verification flows we wanted to do,” Jake says.

With OpenAI’s sanctions screening program in a good place, it’s excited to work with Persona to explore some of those other use cases, such as screening businesses and developers who want to use its platform. “This would involve verifying a developer is who they say they are and then providing business information that can be verified through a business registry verification flow,” he continues.

Whether OpenAI decides to go after these use cases or explore something else entirely, it’s glad that Persona is by its side. “Sometimes we ourselves are trying to figure out what we want to do next among our 18 billion competing priorities. Our contacts at Persona are flexible and feel like real thought partners — we can go back and forth and come up with solutions for the problems we’re trying to solve. They’re always trying to understand what’s a priority for us to figure out what they can focus on building to meet our business needs.”

Want to learn more?

Talk to us about your use case and goals

[

Get in touch

](../contact.md)

‍

Industry

Artificial intelligence

Use cases

[

Fraud prevention

](../use-case/fraud.md)

[

Trust & safety

](../use-case/trust.md)

Operational efficiency

Products used

[

Dynamic Flow

](../product/dynamic-flow.md)

[

Workflows

](../product/workflows.md)

[

Cases

](../product/cases.md)

Verifications

### Table of contents
