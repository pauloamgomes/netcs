import "dotenv/config";

import type { CodegenConfig } from "@graphql-codegen/cli";

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT_ID,
  CONTENTFUL_ACCESS_TOKEN,
} = process.env;

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [`https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT_ID}`]:
        {
          headers: {
            Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
          },
        },
    },
  ],
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  generates: {
    "generated/": {
      preset: "client",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
        {
          add: {
            content: "// @ts-nocheck",
          },
        },
      ],
    },
  },
};

export default config;
