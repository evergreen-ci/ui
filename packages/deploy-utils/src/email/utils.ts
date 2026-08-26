import { execSync } from "child_process";
import { homedir } from "os";
import { resolve } from "path";

/**
 * formatDate creates a readable string from a given date.
 * @param d - date
 * @returns - date string in format "YYYY-MM-DD"
 */
export const formatDate = (d: Date) => d.toISOString().split("T")[0];

/**
 * escapeHtml escapes special characters before text is inserted into an HTML email.
 * @param text - text to escape
 * @returns escaped text
 */
export const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const commandExists = (commandName: string) => {
  try {
    // Prior art from command-exists package
    // https://github.com/mathisonian/command-exists/blob/742a73d75e6ff737c35aa7c88d0828cbb0455811/lib/command-exists.js#L84-L87
    const stdout = execSync(
      `command -v ${commandName} 2>/dev/null && { echo >&1 ${commandName}; exit 0; }`,
    );
    return !!stdout;
  } catch (error) {
    return false;
  }
};

/**
 * findEvergreen finds the path and config file of the Evergreen executable
 * @returns - object with the Evergreen executable and credential arguments, or null if Evergreen could not be found.
 */
export const findEvergreen = () => {
  if (commandExists("evergreen")) {
    return { evgExecutable: "evergreen", credentials: [] };
  }
  if (commandExists("~/evergreen")) {
    return {
      evgExecutable: resolve(homedir(), "evergreen"),
      credentials: ["-c", ".evergreen.yml"],
    };
  }
  return null;
};
