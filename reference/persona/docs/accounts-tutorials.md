# Accounts Tutorials

## Account creation

Accounts can also be created without an Inquiry, either manually in your Persona dashboard or via the API.

Reference IDs are unique across accounts in Persona as they should map back to your users. We recommend using your internal user ID as the reference ID.

```curl
API_KEY=YOUR_API_KEY_HERE
curl -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "type": "account",
    "attributes": {
      "reference-id": REFERENCE_ID
    }
  }
}' https://api.withpersona.com/api/v1/accounts
```

## Creating an Account via Inquiry creation

To create a new inquiry. associated with an account you can use either that account ID or the reference ID associated with that account combined with the template you’d like to use.

```curl
API_KEY=YOUR_API_KEY_HERE
curl -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "type": "inquiry",
    "attributes": {
      "inquiry-template-id": YOUR_TEMPLATE_ID,
      "account-id": ACCOUNT_ID
    }
  }
}' https://api.withpersona.com/api/v1/inquiries
```

## Importing Accounts

If you would like to import many accounts at once into Persona, you can upload a CSV of your account data. Note: this type of upload does not support images at this time.

The information we support during bulk import are:

-   reference\_id
-   name\_first
-   name\_middle
-   name\_last
-   birthdate
-   social\_security\_number
-   tags

```curl
API_KEY=YOUR_API_KEY_HERE
FILE_PATH=CSV_FILE_PATH
curl -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "type": "importer",
    "attributes": {
      "file": { "data": "'"$(base64 $FILE_PATH)"'", "filename": "$FILE_PATH" }
    }
  }
}' https://api.withpersona.com/api/v1/importer/accounts
```
