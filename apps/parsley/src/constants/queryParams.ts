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
    [QueryParams.Bookmarks]: "number",
    [QueryParams.FilterLogic]: "string",
    [QueryParams.Filters]: "string[]",
    [QueryParams.Highlights]: "string[]",
    [QueryParams.LowerRange]: "number",
    [QueryParams.SelectedLineRange]: "string",
    [QueryParams.ShareLine]: "number",
    [QueryParams.UpperRange]: "number",
  },
};

export { QueryParams };
export { urlParseOptions };
