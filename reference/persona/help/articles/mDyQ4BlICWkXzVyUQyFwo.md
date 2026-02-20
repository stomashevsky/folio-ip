# Graph glossary

## Overview[](#overview)

Learn terminology you may see when using Graph.

## Industry terms[](#industry-terms)

-   **Link analysis**: A data analysis technique used to identify and evaluate relationships between entities in a dataset, primarily through visualizations.

## Graph product[](#graph-product)

-   **Query**: A search request you make in Graph that defines which Accounts you want to surface. In a Query, you specify at least one property (like IP Address or device fingerprint), and the value of that property. The Query result includes all Accounts with a matching value for that property.
-   **Graph Explorer**: The visual interface in Persona where you can make a Query and explore results.
-   **Query Template**: A preconfigured Query that you can save and reuse.

## Graph Explorer[](#graph-explorer)

-   **Canvas**: The main area of Graph Explorer where Query results appear.
-   **Node**: The items that appear on the Graph Explorer Canvas as a result of a Query. Each node represents either an Account in Persona, or a property of that Account.
    -   **Account node**: A node that represents an Account.
    -   **Property node**: A node that represents a property of an Account.
-   **Account property (or, Property)**: Characteristics of an Account, such as email, phone number, device fingerprint, etc.
    -   For a list of Account properties you can use in Graph, see [Graph Query reference](./2dlG9Q9liRn43wUIxHntRT.md).
-   **Link**: A connection between two nodes.
    -   An Account node can be _linked to_ a property node. This means the Account has that property.
    -   Two Account nodes can be _linked via_ a property. This means both Accounts share that property.
-   **Cluster**: A group of Account nodes that are all linked to the same property node.
-   **Cluster size**: The number of nodes in a cluster.
-   **Starting nodes**: The initial set of Accounts of interest to you, in a Query. (In Graph theory terms, this is the seed set.)
-   **Connected nodes**: The set of Accounts that are linked to the starting nodes by shared Account properties.
-   **Hops**: The distance between a connected node and a starting node, measured by the number of edges between them.
