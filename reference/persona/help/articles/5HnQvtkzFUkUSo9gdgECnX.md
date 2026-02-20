# Using Conditional step Operators[](#using-conditional-step-operators)

When configuring conditions in a [**Conditional Step**](./36BS5SiFg4jDAPSTC6arD7.md), you can apply **Operators** to build more advanced logic. Operators allow you to manipulate or evaluate data values before your condition is evaluated. This enables more flexible comparisons, such as counting items in an array, checking if a string includes certain characters, extracting email domains, filtering related objects, and more.

You can combine Operators into **method chains**, where one function operates on the output of the previous one. This allows you to work with complex data structures when defining route logic inside a Conditional Step.

# Method Chains[](#method-chains)

| Function | Description | Argument Types | Returns | Example |
| --- | --- | --- | --- | --- |
| `.count` | Returns the number of items in an array. Must follow a method chain that produces an array. | — | Number | — |
| `.first` | Returns the first item of an array. Must follow a method chain that produces an array. | — | Item from Array | — |
| `includes()` | Returns TRUE if a specified item is inside the array. Must follow a method chain that produces an array. | — | Boolean | — |
| `.last` | Returns the last item of an array. Must follow a method chain that produces an array. | — | Item from Array | — |
| `domain(email_string)` | Returns the domain of an email address. | Email string | String | — |
| `username(email_string)` | Returns the username of an email address. | Email string | String | — |
| `length(string)` | Returns the character count of a string. | String | Number | — |
| `replace-all` | Replaces all instances of a specified string (string1) with a different string (string2). | String | String | — |
| `replace-chars` | Replaces individual characters in a string based on specified mapping. | String, Mapping | String | — |
| `replacement` | Specifies the replacement value in a `replace-chars` operation. | String | String | — |
| `to-be-replaced` | Specifies the string to be replaced in a `replace-chars` operation. | String | String | — |
| `characters-to-be-replaced` | Characters in the input string to be replaced. | String | String | — |
| `split` | Splits a string into an array using a delimiter. | String, Delimiter | Array | — |
| `delimiter` | The character used to split a string. | String | String | — |
| `trim(string)` | Removes leading and trailing spaces in a string. | String | String | — |
| `collect_from_each(object)` | Returns array of related objects, including traversing multi-hop relations. | Object | Array | `current_case.accounts.collect_from_each(inquiries)`  
Returns inquiries related to accounts related to current case |
| `filter('key', 'operator', 'value')` | Returns only items in array that meet the criteria specified. Must follow a method chain that produces an array. | String, Operator, Value | Array | `current_case.accounts.collect_from_each(inquiries).filter(foo=bar)`  
Returns inquiries where `foo = bar` |
| `sort_asc(key)` | Sorts array by key in ascending order. Must follow a method chain that produces an array. | String | Array | `current_case.accounts.collect_from_each(inquiries).sort_asc(created_at)`  
Sorts inquiries ascending by `created_at` |
| `sort_desc(key)` | Sorts array by key in descending order. Must follow a method chain that produces an array. | String | Array | `current_case.accounts.collect_from_each(inquiries).sort_desc(created_at)`  
Sorts inquiries descending by `created_at` |
| `page_size(number)` | Sets array page size. If not set, default is 100. Max supported size is 200. | Number | Array | `current_case.accounts.collect_from_each(transactions).page_size(200)` |
| `page_number(number)` | Sets which page of results to display when array items > 200. Max supported page number is 100. | Number | Array | `current_case.accounts.collect_from_each(transactions).sort_desc(created_at).page_number(2)` |
