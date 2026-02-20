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
  IncludeTimestamps = "includeTimestamps",
}

const urlParseOptions: ParseOptions = {
  arrayFormat: "comma",
  parseBooleans: true,
  parseNumbers: false,
  types: {
    [QueryParams.Highlights]: "string[]",
    [QueryParams.Bookmarks]: "number",
    [QueryParams.Filters]: "string[]",
    [QueryParams.ShareLine]: "number",
    [QueryParams.FilterLogic]: "string",
    [QueryParams.LowerRange]: "number",
    [QueryParams.UpperRange]: "number",
    [QueryParams.SelectedLineRange]: "string",
  },
};

export { QueryParams };
export { urlParseOptions };
