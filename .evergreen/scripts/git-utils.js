import { execSync } from "child_process";

/**
 * Gets the merge base between the current branch and main
 * @returns {string} The merge base commit hash
 */
export const getMergeBase = () => {
  try {
    const mergeBaseCmd = execSync("git merge-base main@{upstream} HEAD")
      .toString()
      .trim();
    return mergeBaseCmd;
  } catch (e) {
    throw new Error("getting merge-base", { cause: e });
  }
};

/**
 * whatChanged returns a list of files modified in this patch or PR.
 * Prior art from Evergreen:
 * https://github.com/evergreen-ci/evergreen/blob/ab7d4112b352b759acd54c685524177018467c30/cmd/generate-lint/generate-lint.go#L30
 * @returns {string[]} a string array of modified file names relative to the git root directory
 */
export const whatChanged = () => {
  const mergeBase = getMergeBase();
  try {
    const diffFiles = execSync(`git diff ${mergeBase} --name-only`)
      .toString()
      .trim();

    // If there is no diff, this is not a patch build.
    if (!diffFiles) {
      return [];
    }
    return diffFiles.split("\n").map((file) => file.trim());
  } catch (e) {
    throw new Error("getting diff", { cause: e });
  }
};

/**
 * Checks if there are any changes in a specific directory
 * @param {string} directory - The directory to check for changes
 * @returns {boolean} True if there are changes in the specified directory
 */
export const hasChangesInDirectoryOrFile = (directoryOrFile) => {
  const changes = whatChanged();
  return changes.some(file => file.startsWith(directoryOrFile));
}; 
