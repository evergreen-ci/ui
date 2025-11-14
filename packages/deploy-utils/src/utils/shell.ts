import { execSync } from "child_process";
import * as readline from "readline";

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

/**
 * countdownTimer counts down a given number of seconds and writes a message to the shell in 1 second increments. The messages overwrite each other
 * @param seconds - Total length of countdown
 * @param logger - Function that returns a message to display. It receives the number of remaining seconds as input.
 */
export const countdownTimer = async (
  seconds: number,
  logger: (n: number) => string,
) => {
  const sleep = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  let i = seconds;
  while (i > 0) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(logger(i));
    await sleep(1000); // eslint-disable-line no-await-in-loop
    i -= 1;
  }
  process.stdout.write("\n");
};

export const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
export const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
export const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
export const underline = (text: string) => `\x1b[4m${text}\x1b[0m`;
