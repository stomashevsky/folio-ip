# Reports Status

## Overview[](#overview)

This guide explains the meaning of each Report Status.

Please note that a Report Status is unrelated to the content of the Report itself. (For example, the status of a Watchlist Report is unrelated to whether the Watchlist Report returned a match or not.)

## Statuses[](#statuses)

-   **Pending**: The Report is in the process of fetching information from a data source.
-   **Ready**: Persona has received a response from the data source. The Report is ready to view.
    -   “Matched” = you have matches - it can be that you dismissed some but not all, or you dismissed all but got new matches
    -   “No Match” = you have no matches - it can be that you never matched or you dismissed all matches
    -   Once a Report is Ready, it will never go back to Pending.
    -   If a Report is being run on a continuous interval, its status will either go from Ready → Ready, or Ready → Errored.
-   **Errored**: There was an error when fetching the information.
    -   This can happen because insufficient inputs were passed to the Report, or because the underlying data source had an error.
