/**
 * Given a string, converts it to sentence case.
 * @param string - string to convert to sentence case
 * @returns string in sentence case
 * @example
 * toSentenceCase("hello world") => "Hello world"
 * toSentenceCase("HELLO WORLD") => "Hello world"
 */
export const toSentenceCase = (string: string) => {
  if (string === undefined || string.length === 0) {
    return "";
  }
  return string[0].toUpperCase() + string.substring(1).toLowerCase();
};

/**
 * `toEscapedRegex` takes a string and returns an escaped version of it that can be used in a regex.
 * @param str - The string to escape.
 * @returns - The escaped string.
 */
export const toEscapedRegex = (str: string): string =>
  str.replace(/[-\\/\\^$*+?.()|[\]{}]/g, "\\$&");
