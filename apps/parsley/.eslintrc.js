const ERROR = "error";
const WARN = "warn";

const errorIfStrict = process.env.STRICT ? ERROR : WARN;

module.exports = {
  extends: ["evg"],
  plugins: ["sort-keys-plus"],
  root: true,
  rules: {
    "react/jsx-sort-props": WARN, // Sort props alphabetically
    "sort-imports": [
      ERROR,
      {
        ignoreDeclarationSort: true,
      },
    ],
    "sort-keys-plus/sort-keys": [
      errorIfStrict,
      "asc",
      { allowLineSeparatedGroups: true, natural: true },
    ],
  },
};
