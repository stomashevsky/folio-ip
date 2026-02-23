/**
 * JSON Schema for AttributeMatchRequirement[] — used by the
 * CheckCodeEditor for in-editor validation and by the AI system prompt.
 */

import type { ComparisonAttribute, ComparisonMethod, MatchLevel, NormalizationMethodType } from "@/lib/types";

/* ── Enum constants (single source of truth for editor + schema) ── */

export const COMPARISON_ATTRIBUTES: ComparisonAttribute[] = [
  "name_first",
  "name_last",
  "name_middle",
  "name_full",
  "birthdate",
  "address_street",
  "address_street_1",
  "address_street_2",
  "address_city",
  "address_subdivision",
  "address_postal_code",
  "identification_number",
  "social_security_number",
  "expiration_date",
  "issue_date",
  "phone_number",
  "email_address",
];

export const COMPARISON_METHODS: ComparisonMethod[] = [
  "string_similarity",
  "string_difference",
  "string_missing",
  "nickname",
  "substring",
  "tokenization",
  "date_similarity",
  "date_difference_day",
  "date_difference_month",
  "date_difference_year",
  "person_full_name",
  "doing_business_as",
];

export const NORMALIZATION_METHODS: NormalizationMethodType[] = [
  "remove_prefixes",
  "remove_suffixes",
  "remove_special_characters",
  "fold_characters",
  "lowercase",
  "trim_whitespace",
  "normalize_whitespace",
  "abbreviate_street_suffix",
  "abbreviate_street_unit",
  "abbreviate_subdivision",
  "canonicalize_email_address",
  "expand_city_abbreviation",
  "expand_city_suffix",
  "expand_street_suffix",
  "expand_street_unit",
  "expand_subdivision",
];

export const MATCH_LEVELS: MatchLevel[] = ["full", "partial", "none"];

/* ── JSON Schema definition ── */

export const MATCH_REQUIREMENTS_JSON_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Match Requirements",
  description: "Array of attribute match requirements for a verification check comparison.",
  type: "array",
  items: {
    type: "object",
    required: ["attribute", "normalization", "comparison"],
    additionalProperties: false,
    properties: {
      attribute: {
        type: "string",
        enum: COMPARISON_ATTRIBUTES,
        description: "The attribute to compare (e.g. name_first, birthdate, address_street).",
      },
      normalization: {
        type: "array",
        description: "Ordered normalization steps applied before comparison.",
        items: {
          type: "object",
          required: ["step", "method"],
          additionalProperties: false,
          properties: {
            step: {
              type: "string",
              enum: ["apply", "then"],
              description: "First step is 'apply', subsequent steps are 'then'.",
            },
            method: {
              type: "string",
              enum: NORMALIZATION_METHODS,
              description: "Normalization method to apply.",
            },
          },
        },
      },
      comparison: {
        oneOf: [
          {
            type: "object",
            required: ["type", "matchLevel"],
            additionalProperties: false,
            properties: {
              type: { type: "string", const: "simple" },
              matchLevel: {
                type: "string",
                enum: MATCH_LEVELS,
                description: "Required match level: full (exact), partial, or none.",
              },
            },
          },
          {
            type: "object",
            required: ["type", "conditions"],
            additionalProperties: false,
            properties: {
              type: { type: "string", const: "complex" },
              conditions: {
                type: "array",
                minItems: 1,
                description: "OR-combined comparison conditions.",
                items: {
                  type: "object",
                  required: ["method", "matchLevel"],
                  additionalProperties: false,
                  properties: {
                    method: {
                      type: "string",
                      enum: COMPARISON_METHODS,
                      description: "Comparison method to use.",
                    },
                    matchLevel: {
                      type: "string",
                      enum: MATCH_LEVELS,
                    },
                    threshold: {
                      type: "number",
                      description: "Primary threshold (e.g. similarity % or date component count).",
                    },
                    partialMatchThreshold: {
                      type: "number",
                      description: "For string_similarity: partial match threshold %.",
                    },
                    maxDistance: {
                      type: "number",
                      description: "For string_difference: maximum Levenshtein distance.",
                    },
                    minLength: {
                      type: "number",
                      description: "For substring: minimum substring length.",
                    },
                    minTokenMatches: {
                      type: "number",
                      description: "For tokenization: minimum number of matching tokens.",
                    },
                    requiredMatches: {
                      type: "array",
                      items: { type: "string" },
                      description: "For date_similarity: date components to match, e.g. [\"year\",\"month\",\"day\"].",
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
} as const;

/** Compact schema string for AI system prompts (no descriptions, just structure). */
export const MATCH_REQUIREMENTS_SCHEMA_TEXT = `
# Match Requirements JSON Schema:
# Root: array of objects
# Each object:
#   attribute: ${COMPARISON_ATTRIBUTES.join(" | ")}
#   normalization: array of { step: "apply"|"then", method: ${NORMALIZATION_METHODS.join(" | ")} }
#   comparison: one of:
#     { type: "simple", matchLevel: "full"|"partial"|"none" }
#     { type: "complex", conditions: array of {
#         method: ${COMPARISON_METHODS.join(" | ")},
#         matchLevel: "full"|"partial"|"none",
#         threshold?: number,
#         partialMatchThreshold?: number,
#         maxDistance?: number,
#         minLength?: number,
#         minTokenMatches?: number,
#         requiredMatches?: string[]
#       }
#     }
`.trim();
