import { execSync } from "child_process";

/**
 * execTrim converts the result of execSync to a string and trims it to avoid the included newlines.
 * @param args - matches args of Node's child_process.execSync
 * @returns - plain string representing the execSync command's output.
 */
export const execTrim = (...args: Parameters<typeof execSync>) => {
  const [command, options = {}] = args;
  return execSync(command, { encoding: "utf8", ...options })
    .toString()
    .trim();
};

export const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
export const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
export const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
export const underline = (text: string) => `\x1b[4m${text}\x1b[0m`;
