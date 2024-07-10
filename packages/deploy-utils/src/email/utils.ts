import { execSync } from "child_process";
import { accessSync, constants } from "fs";

const pad = (dateOrMonth: number) => dateOrMonth.toString().padStart(2, "0");

/**
 * formatDate creates a readable string from a given date
 * @param d - date
 * @returns - date string in format "year-month-day"
 */
export const formatDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth())}-${pad(d.getDate())}`;

const fileExists = (commandName: string) => {
  try {
    accessSync(commandName, constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
};

const localExecutableSync = (commandName: string) => {
  try {
    // eslint-disable-next-line no-bitwise
    accessSync(commandName, constants.F_OK | constants.X_OK);
    return true;
  } catch (e) {
    return false;
  }
};

const commandExistsUnixSync = (commandName: string) => {
  if (!fileExists(commandName)) {
    console.log("hi");
    try {
      const stdout = execSync(
        `command -v ${commandName} 2>/dev/null  && { echo >&1 ${commandName}; exit 0; }`,
      );
      return !!stdout;
    } catch (error) {
      return false;
    }
  }
  return localExecutableSync(commandName);
};

export const findEvergreen = () => {
  if (commandExistsUnixSync("evergreen")) {
    return { evgExecutable: "evergreen", credentials: "" };
  }
  if (commandExistsUnixSync("~/evergreen")) {
    return { evgExecutable: "evergreen", credentials: "~/.evergreen.yml" };
  }
  return null;
};
