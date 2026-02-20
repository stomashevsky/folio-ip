# Lists Tutorials

Learn more in the [Lists API documentation](./api-reference/lists.md)

## Importing email address lists

If you would like to import many list items at once into an email address list in Persona, first create the list in the [Persona dashboard](https://withpersona.com/dashboard/lists) by selecting “Email address” for the list type. Next, you can upload a CSV of your email address data.

```curl
API_KEY=YOUR_API_KEY_HERE
LIST_ID=YOUR_LIST_ID_HERE
FILE_PATH=CSV_FILE_PATH

curl -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "type": "importer",
    "attributes": {
      "list-id": "'"$LIST_ID"'",
      "file": { "data": "'"$(base64 $FILE_PATH)"'", "filename": "$FILE_PATH" }
    }
  }
}' https://api.withpersona.com/api/v1/importer/list-item/email-addresses
```

The information we support during bulk import for email address lists are:

-   value
-   match\_type (either ‘email\_address’ or ‘domain’)

A match\_type of ‘email\_address’ will need to match the entire email address of an individual, while a match\_type of ‘domain’ will match on the email address domain of an individual (i.e. all email addresses with domain ‘gmail.com’).

#### Example CSV

value,match\_type

[alexander@sample.com](mailto:alexander@sample.com),email\_address

some-domain.com,domain

## Importing geolocation lists

If you would like to import many list items at once into a geolocation list in Persona, first create the list in the [Persona dashboard](https://withpersona.com/dashboard/lists) by selecting “Geolocation” for the list type. Next, you can upload a CSV of your geolocation data.

```curl
API_KEY=YOUR_API_KEY_HERE
LIST_ID=YOUR_LIST_ID_HERE
FILE_PATH=CSV_FILE_PATH

curl -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "type": "importer",
    "attributes": {
      "list-id": "'"$LIST_ID"'",
      "file": { "data": "'"$(base64 $FILE_PATH)"'", "filename": "$FILE_PATH" }
    }
  }
}' https://api.withpersona.com/api/v1/importer/list-item/geolocations
```

The information we support during bulk import for geolocation lists are:

-   latitude
-   longitude
-   radius\_meters

#### Example CSV

latitude, longitude, radius\_meters

40.7128, 74.0060, 200

## Importing government ID number lists

If you would like to import many list items at once into a government ID number list in Persona, first create the list in the [Persona dashboard](https://withpersona.com/dashboard/lists) by selecting “Government ID number” for the list type. Next, you can upload a CSV of your government ID number data.

```curl
API_KEY=YOUR_API_KEY_HERE
LIST_ID=YOUR_LIST_ID_HERE
FILE_PATH=CSV_FILE_PATH

curl -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "type": "importer",
    "attributes": {
      "list-id": "'"$LIST_ID"'",
      "file": { "data": "'"$(base64 $FILE_PATH)"'", "filename": "$FILE_PATH" }
    }
  }
}' https://api.withpersona.com/api/v1/importer/list-item/government-id-numbers
```

The information we support during bulk import for government ID number lists are:

-   id\_number
-   id\_class

#### Example CSV

id\_number, id\_class

200112, dl

Common values for id\_class include ‘pp’ for passport and ‘dl’ for driver license. Please [contact us](https://app.withpersona.com/dashboard/contact-us) if you need help getting id\_class values!

## Importing IP address lists

If you would like to import many list items at once into an IP address list in Persona, first create the list in the [Persona dashboard](https://withpersona.com/dashboard/lists) by selecting “IP address” for the list type. Next, you can upload a CSV of your IP address data.

```curl
API_KEY=YOUR_API_KEY_HERE
LIST_ID=YOUR_LIST_ID_HERE
FILE_PATH=CSV_FILE_PATH

curl -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "type": "importer",
    "attributes": {
      "list-id": "'"$LIST_ID"'",
      "file": { "data": "'"$(base64 $FILE_PATH)"'", "filename": "$FILE_PATH" }
    }
  }
}' https://api.withpersona.com/api/v1/importer/list-item/ip-addresses
```

The information we support during bulk import for IP address lists are:

-   value

#### Example CSV

value

192.168.1.1

Both IPv4 and IPv6 are supported.

## Importing name lists

If you would like to import many list items at once into a name list in Persona, first create the list in the [Persona dashboard](https://withpersona.com/dashboard/lists) by selecting “Name” for the list type. Next, you can upload a CSV of your name data.

```curl
API_KEY=YOUR_API_KEY_HERE
LIST_ID=YOUR_LIST_ID_HERE
FILE_PATH=CSV_FILE_PATH

curl -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "type": "importer",
    "attributes": {
      "list-id": "'"$LIST_ID"'",
      "file": { "data": "'"$(base64 $FILE_PATH)"'", "filename": "$FILE_PATH" }
    }
  }
}' https://api.withpersona.com/api/v1/importer/list-item/names
```

The information we support during bulk import for name lists are:

-   name\_first
-   name\_last

#### Example CSV

name\_first, name\_last

John, Doe

## Importing phone number lists

If you would like to import many list items at once into a phone number list in Persona, first create the list in the [Persona dashboard](https://withpersona.com/dashboard/lists) by selecting “Phone number” for the list type. Next, you can upload a CSV of your phone number data.

```curl
API_KEY=YOUR_API_KEY_HERE
LIST_ID=YOUR_LIST_ID_HERE
FILE_PATH=CSV_FILE_PATH

curl -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $API_KEY" -d'{
  "data": {
    "type": "importer",
    "attributes": {
      "list-id": "'"$LIST_ID"'",
      "file": { "data": "'"$(base64 $FILE_PATH)"'", "filename": "$FILE_PATH" }
    }
  }
}' https://api.withpersona.com/api/v1/importer/list-item/phone-numbers
```

The information we support during bulk import for phone number lists are:

-   value

#### Example CSV

value

+1234567890
