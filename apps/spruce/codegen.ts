import type { CodegenConfig } from "@graphql-codegen/cli";
import { resolve } from "path";

export const getConfig = ({
  generatedFileName,
  silent,
}: {
  generatedFileName: string;
} & Pick<CodegenConfig, "silent">): CodegenConfig => ({
  documents: ["./src/**/*.ts", "./src/**/*.graphql", "./src/**/*.gql"].map(
    (d) => resolve(__dirname, d),
  ),
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
      `${resolve(__dirname, "./node_modules/.bin/prettier")} --write`,
    ],
  },
  overwrite: true,
  schema: "sdlschema/**/*.graphql",
  silent,
});

export const generatedFileName = resolve(
  __dirname,
  "./src/gql/generated/types.ts",
);

export default getConfig({
  generatedFileName,
});
