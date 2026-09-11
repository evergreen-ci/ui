import { execFileSync } from "child_process";
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

/**
 * findEvergreen finds the path and config file of the Evergreen executable
 * @returns - object with the Evergreen executable and credential arguments, or null if Evergreen could not be found.
 */
export const findEvergreen = () => {
  try {
    execFileSync("evergreen", ["--version"], { stdio: "ignore" });
    return { evgExecutable: "evergreen", credentials: [] };
  } catch {}

  try {
    const homePath = resolve(homedir(), "evergreen");
    execFileSync(homePath, ["--version"], { stdio: "ignore" });
    return {
      evgExecutable: homePath,
      credentials: ["-c", ".evergreen.yml"],
    };
  } catch {}

  return null;
};
