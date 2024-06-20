import { execSync } from "child_process";

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
