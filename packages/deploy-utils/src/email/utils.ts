import { stat } from "fs/promises";
import { delimiter, join } from "path";

const pad = (dateOrMonth: number) => dateOrMonth.toString().padStart(2, "0");

/**
 * formatDate creates a readable string from a given date
 * @param d - date
 * @returns - date string in format "year-month-day"
 */
export const formatDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth())}-${pad(d.getDate())}`;

const checkFileExists = async (filePath: string) => {
  if ((await stat(filePath)).isFile()) {
    return filePath;
  }
  throw new Error("Not a file");
};

/**
 * findExecutable finds an executable by name on a user's path or in their home directory.
 * @param exe - name of executable to locate
 * @returns - path to executable
 */
export const findExecutable = async (exe: string) => {
  const envPath = process.env.PATH || "";
  const pathDirs = envPath
    .replace(/["]+/g, "")
    .split(delimiter)
    .filter(Boolean);
  const candidates = pathDirs.map((d) => join(d, exe));
  candidates.push(`~/${exe}`);
  try {
    return await Promise.any(candidates.map(checkFileExists));
  } catch (e) {
    return null;
  }
};
