# Retrieve a Document

GET

https://api.withpersona.com/api/v1/documents/:document-id

```
{
  "data": {
    "type": "document/generic",
    "attributes": {
      "created-at": "2023-12-20T00:47:09.000Z",
      "document-type": "other",
      "extraction-responses": [
        {
          "extraction-type": "unguided",
          "field-name": "dates",
          "results": [
            {
              "value": "Oct 14 2023",
              "page": 1,
              "match-level": "full",
              "metadata": {
                "day": 14,
                "month": 10,
                "year": 2023
              }
            }
          ]
        },
        {
          "extraction-type": "guided",
          "field-name": "address_street_1",
          "results": [
            {
              "value": "1234 Main St.",
              "page": 1,
              "match-level": "full"
            }
          ]
        },
        {
          "extraction-type": "guided",
          "field-name": "address_street_2",
          "results": []
        },
        {
          "extraction-type": "guided",
          "field-name": "address_city",
          "results": []
        },
        {
          "extraction-type": "guided",
          "field-name": "address_postal_code",
          "results": []
        },
        {
          "extraction-type": "guided",
          "field-name": "name",
          "results": []
        }
      ],
      "fields": {},
      "files": [
        {
          "filename": "abc123.JPEG",
          "url": "https://files.withpersona.com/abc123.JPEG?access_token=ACCESS_TOKEN",
          "byte-size": 124917
        }
      ],
      "files-normalized": [
        {
          "filename": "abc123.JPEG",
          "url": "https://files.withpersona.com/abc123.JPEG?access_token=ACCESS_TOKEN",
          "byte-size": 124917
        }
      ],
      "kind": "document",
      "processed-at": "2023-12-20T00:47:15.000Z",
      "processed-at-ts": 1703033235,
      "status": "processed"
    },
    "id": "doc_bzyijToBPnSHtbW2mMdpKM8W",
    "relationships": {
      "inquiry": {
        "data": {
          "id": "inq_5noeVrHSRUWeFMv5T6wLA8qt",
          "type": "inquiry"
        }
      },
      "template": {
        "data": {
          "id": "tmpl_jGTjQgGMyei68sdf8NyCeDMh",
          "type": "template"
        }
      },
      "inquiry-template-version": {},
      "inquiry-template": {},
      "document-files": {
        "data": []
      }
    }
  }
}
```
