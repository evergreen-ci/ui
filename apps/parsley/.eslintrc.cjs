const ERROR = "error";
const WARN = "warn";

const errorIfStrict = process.env.STRICT ? ERROR : WARN;

module.exports = {
  extends: ["@evg-ui"],
  plugins: ["sort-keys-plus"],
  root: true,
  rules: {
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
