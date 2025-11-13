import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  documents: ["./src/**/*.graphql"],
  generates: {
    "./src/gql/generated/types.ts": {
      config: {
        arrayInputCoercion: false,
        scalars: {
          BooleanMap: "{ [key: string]: unknown }",
          Duration: "number",
          Map: "{ [key: string]: unknown }",
          StringMap: "{ [key: string]: unknown }",
          Time: "Date",
        },
      },
      plugins: ["typescript", "typescript-operations"],
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
  schema: "sdlschema/**/*.graphql",
};

export default config;
