# Retrieve a Document Verification

[API Reference](../../accounts/list-all-accounts.md)[Verifications](../../verifications.md)[Document Verifications](../document-verifications.md)

# Retrieve a Document Verification

GET

https://api.withpersona.com/api/v1/verification/documents/:verification-id

```
{
  "data": {
    "id": "ver_ABC123",
    "attributes": {
      "checks": [],
      "completed-at": null,
      "completed-at-ts": null,
      "country-code": null,
      "created-at": "2023-11-15T16:21:09.000Z",
      "created-at-ts": 1700065269,
      "extraction-responses": [],
      "fields": {},
      "files": [
        {
          "filename": "multipage_example.pdf",
          "url": "https://files.withpersona.com/multipage_example.pdf?access_token=ACCESS_ABC123",
          "byte-size": 123456
        }
      ],
      "files-normalized": [
        {
          "filename": "multipage_example.pdf",
          "url": "https://files.withpersona.com/multipage_example.pdf?access_token=ACCESS_ABC123",
          "byte-size": 123456
        }
      ],
      "status": "initiated",
      "submitted-at": null,
      "submitted-at-ts": null
    },
    "relationships": {
      "document": {
        "data": {
          "id": "doc_BDxMaFYynbVrKPiGdfv4aJyC",
          "type": "document/generic"
        }
      },
      "inquiry": {
        "data": {
          "id": "inq_ABC123",
          "type": "inquiry"
        }
      },
      "inquiry-template": {
        "data": null
      },
      "inquiry-template-version": {
        "data": null
      },
      "template": {
        "data": {
          "type": "template",
          "id": "tmpl_ABC123"
        }
      },
      "transaction": {
        "data": null
      },
      "verification-template": {
        "data": {
          "type": "verification-template/document",
          "id": "vtmpl_ABC123"
        }
      },
      "verification-template-version": {
        "data": {
          "type": "verification-template-version/document",
          "id": "vtmplv_ABC123"
        }
      }
    },
    "type": "verification/document"
  }
}
```
