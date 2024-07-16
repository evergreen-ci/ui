import { execSync } from "child_process";

const pad = (dateOrMonth: number) => dateOrMonth.toString().padStart(2, "0");

/**
 * formatDate creates a readable string from a given date
 * @param d - date
 * @returns - date string in format "year-month-day"
 */
export const formatDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth())}-${pad(d.getDate())}`;

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
 * @returns - object with evgExecutable and credentials paths, or null if Evergreen could not be found.
 */
export const findEvergreen = () => {
  if (commandExists("evergreen")) {
    return { evgExecutable: "evergreen", credentials: "" };
  }
  if (commandExists("~/evergreen")) {
    return { evgExecutable: "~/evergreen", credentials: "-c .evergreen.yml" };
  }
  return null;
};
