import queryString, { ParseOptions, StringifyOptions } from "query-string";

export const parseQueryString = (
  search: string,
  options: ParseOptions = {},
) => {
  const parseOptions: ParseOptions = {
    arrayFormat: "comma",
    parseBooleans: true,
    parseNumbers: true,
    ...options,
  };
  return queryString.parse(search, parseOptions);
};

export const stringifyQuery = (
  object: { [key: string]: any },
  options: StringifyOptions = {},
) =>
  queryString.stringify(object, {
    arrayFormat: "comma",
    skipEmptyString: true,
    skipNull: true,
    ...options,
  });
