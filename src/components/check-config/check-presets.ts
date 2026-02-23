import type { AttributeMatchRequirement } from "@/lib/types";

export interface CheckPreset {
  label: string;
  description: string;
  requirements: AttributeMatchRequirement[];
}

export const CHECK_PRESETS: CheckPreset[] = [
  {
    label: "Standard KYC",
    description: "Name (85% similarity + nickname), birthdate (2 date components)",
    requirements: [
      {
        attribute: "name_first",
        normalization: [
          { step: "apply", method: "remove_prefixes" },
          { step: "then", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [
            { method: "string_similarity", matchLevel: "full", threshold: 85 },
            { method: "nickname", matchLevel: "full" },
          ],
        },
      },
      {
        attribute: "name_last",
        normalization: [
          { step: "apply", method: "remove_prefixes" },
          { step: "then", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [
            { method: "string_similarity", matchLevel: "full", threshold: 85 },
          ],
        },
      },
      {
        attribute: "birthdate",
        normalization: [],
        comparison: {
          type: "complex",
          conditions: [
            { method: "date_similarity", matchLevel: "full", threshold: 2 },
          ],
        },
      },
    ],
  },
  {
    label: "Strict Identity",
    description: "Exact match on name, birthdate, and ID number",
    requirements: [
      {
        attribute: "name_first",
        normalization: [],
        comparison: { type: "simple", matchLevel: "full" },
      },
      {
        attribute: "name_last",
        normalization: [],
        comparison: { type: "simple", matchLevel: "full" },
      },
      {
        attribute: "birthdate",
        normalization: [],
        comparison: { type: "simple", matchLevel: "full" },
      },
      {
        attribute: "identification_number",
        normalization: [],
        comparison: { type: "simple", matchLevel: "full" },
      },
    ],
  },
  {
    label: "Address Match",
    description: "Street, city, subdivision, postal code with normalization",
    requirements: [
      {
        attribute: "address_street",
        normalization: [
          { step: "apply", method: "expand_street_suffix" },
          { step: "then", method: "expand_street_unit" },
          { step: "then", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [
            { method: "string_similarity", matchLevel: "full", threshold: 80 },
          ],
        },
      },
      {
        attribute: "address_city",
        normalization: [
          { step: "apply", method: "expand_city_abbreviation" },
          { step: "then", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [
            { method: "string_similarity", matchLevel: "full", threshold: 90 },
          ],
        },
      },
      {
        attribute: "address_subdivision",
        normalization: [
          { step: "apply", method: "abbreviate_subdivision" },
        ],
        comparison: { type: "simple", matchLevel: "full" },
      },
      {
        attribute: "address_postal_code",
        normalization: [],
        comparison: { type: "simple", matchLevel: "full" },
      },
    ],
  },
  {
    label: "Name + DOB",
    description: "Name similarity with fold + birthdate date similarity",
    requirements: [
      {
        attribute: "name_first",
        normalization: [
          { step: "apply", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [
            { method: "string_similarity", matchLevel: "full", threshold: 85 },
          ],
        },
      },
      {
        attribute: "name_last",
        normalization: [
          { step: "apply", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [
            { method: "string_similarity", matchLevel: "full", threshold: 85 },
          ],
        },
      },
      {
        attribute: "birthdate",
        normalization: [],
        comparison: {
          type: "complex",
          conditions: [
            { method: "date_similarity", matchLevel: "full", threshold: 2 },
          ],
        },
      },
    ],
  },
];
