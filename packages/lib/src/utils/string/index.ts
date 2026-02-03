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

/**
 * @param str - A string that represents a githash
 * @returns A shortenend version of the input string.
 */
export const shortenGithash = (str?: string): string =>
  str?.substring(0, 7) || "";

/**
 * Function that trims the middle portion of a string. ex: "EvergreenUI" -> "Ev...UI"
 * The resulting length, if trimmed, is maxLength + 1 (due to ellipsis length).
 * @param str - Text to trim
 * @param maxLength - Max length before trimming text
 * @returns The original or trimmed text.
 */
export const trimStringFromMiddle = (str: string, maxLength: number) => {
  const ellipsis = "…";
  const numCharsToRemove = str.length - maxLength;

  if (numCharsToRemove <= ellipsis.length) {
    return str;
  }

  const midpoint = Math.floor(str.length / 2);
  const frontOffset = Math.floor(numCharsToRemove / 2);
  const backOffset = Math.ceil(numCharsToRemove / 2);
  return (
    str.substring(0, midpoint - frontOffset) +
    ellipsis +
    str.substring(midpoint + backOffset)
  );
};

/**
 * `copyToClipboard` copies a string to the clipboard
 * @param textToCopy - the string to copy to the clipboard
 */
export const copyToClipboard = async (textToCopy: string) => {
  await navigator.clipboard.writeText(textToCopy);
};

/**
 * `trimLogLineToMaxSize` trims a line to the max size limit
 * @param line - the line to trim
 * @param maxSize - the max line size limit
 * @returns the trimmed line
 */
export const trimLogLineToMaxSize = (line: string, maxSize: number) => {
  if (line.length > maxSize) {
    return `${line.substring(0, maxSize)}…`;
  }
  return line;
};

export { trimSeverity, getSeverityMapping, mapLogLevelToColor } from "./logs";
