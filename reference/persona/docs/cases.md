# Cases

Investigate and decision on individuals

A Case represents a collection of data about an end-user that needs to be investigated and decisioned on. For example, if your organization is a ride-sharing marketplace, a Case might represent all of the inquiry(s), account(s), and report(s) you’ve collected about an individual driver within Persona. Your organization may need to investigate this user for a variety of reasons:

-   **Onboarding**: Should this user be allowed to onboard to the platform?
-   **Account takeover investigation**: If a user is claiming that their account has been taken over, is there enough information to validate their claim?
-   **Fraudulent activity**: Are there suspicious signals associated with this user that require further action (e.g. account freezing, sending a follow-up inquiry for verification, etc.)?
-   **Transaction monitoring review**: Are there suspicious transactions associated with this user that require further investigation?

Once this data lives in a Case, it can be assigned to a member of your team to investigate and decision on. Assigning a Case can be done through the Persona Dashboard or through the [Assign a Case](./api-reference/cases/assign-a-case.md) endpoint.

Typically, the data within a Case is visualized in the Persona Dashboard using a case template configuration.

## Adding data to a Case

Data from both within and outside of Persona can be added to a Case to aid your organization’s investigation process.

For data within Persona, Persona objects such as inquiry(s), account(s), and report(s) can be attached to a Case using the [Add Persona objects](./api-reference/cases/add-persona-objects.md) endpoint.

Data from outside Persona can also be attached to a Case using the endpoint. Typically, this endpoint is used to enrich a case with data from internal sources or other vendors. As long as this data can be represented in JSON, it can be attached to a case using the [Update a Case](./api-reference/cases/update-a-case.md) endpoint.

## Case statuses

The lifecycle of your investigation may have multiple stages. These stages are represented with the concept of [Case Statuses](https://help.withpersona.com/articles/2P8swNyjlHKiZPDCy5gnAu).

Cases come with a set of default statuses: Open, Pending, Approved, Declined. This set of statuses is typically sufficient for many case management processes.

However, for more complex case management processes, your organization might find it useful to customize the statuses. Case statuses can be customized in the case template settings view on the Persona Dashboard. Some common use cases for custom statuses include:

-   Tracking stages within your operational process
    
    -   New request → Transfer initiated → Ready to order → Ordered
-   Coordinating review between 2 teams
    
    -   Open → Approved by Team 1 → Declined by Team 1
    -   Open → Approved by Team 1 → Approved by Team 2 / Declined by Team 2
-   Reflecting steps in your team’s review process
    
    -   Open → Review in progress → Awaiting documentation → Approved / Declined

While Cases are typically transitioned between statuses manually in the Persona Dashboard, a Case can also be transitioned using the [Set status for a case](./api-reference/cases/set-status-for-a-case.md) endpoint.
