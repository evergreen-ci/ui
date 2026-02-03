import { trimSeverity } from "@evg-ui/lib/utils";

/**
 * `getRawLines` constructs a string with the lines provided.
 * @param indices  - array of numbers representing the line indices you want to copy
 * @param getLine - function that retrieves the log text associated with a log line number
 * @returns formatted string
 */
export const getRawLines = (
  indices: number[],
  getLine: (lineNumber: number) => string | undefined,
) => {
  if (indices.length === 0) {
    return "";
  }

  let logString = "";

  for (let i = 0; i < indices.length; i++) {
    const indexLine = indices[i];
    const logText = getLine(indexLine);

    // If indices are out of bounds, stop processing.
    if (logText === undefined) {
      break;
    }

    logString += `${trimSeverity(logText)}\n`;

    // If the current and next indices are not adjacent to each other, insert an
    // ellipsis in between them.
    if (i + 1 !== indices.length && indexLine + 1 !== indices[i + 1]) {
      logString += "...\n";
    }
  }
  return logString;
};

/**
 * `getJiraFormat` constructs a JIRA formatted string with the lines provided.
 * @param indices  - array of numbers representing the line indices you want to copy
 * @param getLine - function that retrieves the log text associated with a log line number
 * @returns formatted string that can be pasted into JIRA
 */
export const getJiraFormat = (
  indices: number[],
  getLine: (lineNumber: number) => string | undefined,
) => {
  if (indices.length === 0) {
    return "";
  }

  return `{noformat}\n${getRawLines(indices, getLine)}{noformat}`;
};

/**
 * `stringIntersection` returns a boolean indicating if two strings have a full overlap
 * @param string1 - First string to compare
 * @param string2 - Second string to compare
 * @returns - Boolean indicating if string1 or string2 fit into the other.
 */
export const stringIntersection = (string1: string, string2: string) =>
  string1.includes(string2) || string2.includes(string1);

// shortenGithash and trimStringFromMiddle are now imported from @evg-ui/lib/utils

/**
 * `getBytesAsString` returns a string representation of the bytes
 * @param bytes - the number of bytes
 * @param decimals - the number of decimals to round to
 * @returns - a string representation of the bytes
 * @example getBytesAsString(1024) // "1 KB"
 * @example getBytesAsString(1024*1024, 0) // "1 MB"
 * @example getBytesAsString(1024*1024*1024, 0) // "1 GB"
 */
export const getBytesAsString = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  if (bytes === 1) return "1 Byte";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Determines if a given log line is a failing log line.
 * @param line - log line to evaluate
 * @param failingCommand - failing command that originates from TaskEndDetails
 * @returns true if line is the failing log line, false otherwise
 */
export const isFailingLine = (line: string, failingCommand: string) => {
  const failedExpression = `${failingCommand} failed`;
  const timeoutExpression = `${failingCommand} stopped early`;
  // The "Finished" command is matched when the task status is set to fail by the user.
  const finishedExpression = `Finished command ${failingCommand}`;
  return (
    line.includes(failedExpression) ||
    line.includes(timeoutExpression) ||
    line.includes(finishedExpression)
  );
};
