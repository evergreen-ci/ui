import type { CodegenConfig } from "@graphql-codegen/cli";
import { resolve } from "path";

export const getConfig = ({
  generatedFileName,
  silent,
}: {
  generatedFileName: string;
} & Pick<CodegenConfig, "silent">): CodegenConfig => ({
  documents: [
    "./src/**/!(*.test).ts",
    "./src/**/*.graphql",
    "./src/**/*.gql",
  ].map((d) => resolve(process.cwd(), d)),
  generates: {
    [generatedFileName]: {
      config: {
        arrayInputCoercion: false,
        preResolveTypes: true,
        scalars: {
          Duration: "number",
          StringMap: "{ [key: string]: any }",
          Time: "Date",
        },
      },
      plugins: ["typescript", "typescript-operations"],
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
  overwrite: true,
  // Use absolute paths for schema pointers; relative variant was not being resolved in some yarn workspace invocations.
  schema: [
    resolve(process.cwd(), "sdlschema/**/*.graphql"),
    resolve(process.cwd(), "src/gql/client/schema.graphql"),
  ],
  silent,
});

export const generatedFileName = resolve(
  process.cwd(),
  "./src/gql/generated/types.ts",
);

export default getConfig({
  generatedFileName,
});
