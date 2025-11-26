import queryString, { ParseOptions, StringifyOptions } from "query-string";

/**
 * `parseQueryString` is a function that parses a query-string string into an object
 * @param search - The search string to parse
 * @param options - The options to use when parsing the query-string these are the same options as the query-string library
 * @returns - The parsed object
 */
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

/**
 * `stringifyQuery` is a function that stringifies an object into a query-string string
 * @param object - The object to stringify into a query-string
 * @param options - The options to use when stringifying the object these are the same options as the query-string library
 * @returns - The query-string string
 */
export const stringifyQuery = (
  object: { [key: string]: unknown },
  options: StringifyOptions = {},
) =>
  queryString.stringify(object, {
    arrayFormat: "comma",
    skipEmptyString: true,
    skipNull: true,
    ...options,
  });
