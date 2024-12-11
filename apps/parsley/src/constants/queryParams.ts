import { ParseOptions } from "query-string";

enum QueryParams {
  Highlights = "highlights",
  Bookmarks = "bookmarks",
  Filters = "filters",
  ShareLine = "shareLine",
  Wrap = "wrap",
  Expandable = "expandable",
  FilterLogic = "filterLogic",
  LowerRange = "lower",
  UpperRange = "upper",
  SelectedLineRange = "selectedLineRange",
}

const urlParseOptions: ParseOptions = {
  arrayFormat: "comma",
  parseBooleans: true,
  parseNumbers: false,
  types: {
    bookmarks: "number",
    filterLogic: "string",
    filters: "string[]",
    highlights: "string[]",
    lower: "number",
    selectedLineRange: "string",
    shareLine: "number",
    upper: "number",
  },
};

export { QueryParams };
export { urlParseOptions };
