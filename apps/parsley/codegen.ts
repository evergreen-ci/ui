import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "sdlschema/**/*.graphql",
  documents: ["./src/**/*.graphql"],
  generates: {
    "./src/gql/generated/types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        arrayInputCoercion: false,
        scalars: {
          Time: "Date",
          Duration: "number",
          StringMap: "{ [key: string]: any }",
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
