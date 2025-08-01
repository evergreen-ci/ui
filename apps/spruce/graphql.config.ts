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
    afterAllFileWrite: [
      `${resolve(process.cwd(), "./node_modules/.bin/prettier")} --write`,
    ],
  },
  overwrite: true,
  schema: ["sdlschema/**/*.graphql", "src/gql/client/schema.graphql"],
  silent,
});

export const generatedFileName = resolve(
  process.cwd(),
  "./src/gql/generated/types.ts",
);

export default getConfig({
  generatedFileName,
});
