import { execSync } from "child_process";
import { resolve } from "path";
import { execTrim } from "../shell";
import { DeployableApp } from "../types";

const COMMIT_LENGTH = 40;

/**
 * `push` is a helper function that pushes commits to the remote.
 */
const push = () => {
  console.log("Pushing to upstream...");
  try {
    execSync(`git push upstream`, {
      stdio: "inherit",
      encoding: "utf-8",
    });
    console.log("Successfully pushed to upstream.");
  } catch (err) {
    throw Error("Pushing upstream failed.", { cause: err });
  }
};

/**
 * getGitRoot yields the absolute path to the directory where the caller's .git directory is located.
 * @returns - path to .git
 */
const getGitRoot = () => execTrim(`git rev-parse --show-toplevel`);

/**
 * `getCommitMessages` returns a string of all commit messages between the currently deployed commit and HEAD.
 * @param app - the app being deployed
 * @param fromCommit - the oldest commit in range to return
 * @param toCommit - optional hash marking the end of the range of commits. Defaults to HEAD.
 * @returns - a string of all commit messages between the first specified commit and last specified commit or HEAD. Commits are limited to those in the app's directory and all shared directories, as well as the root (the other app is excluded).
 */
const getCommitMessages = (
  app: DeployableApp,
  fromCommit: string,
  toCommit: string = "HEAD",
) => {
  const gitRoot = getGitRoot();
  const appDir = resolve(gitRoot, "apps", app);
  const packageDir = resolve(gitRoot, "packages");
  const excludeDir = resolve(
    gitRoot,
    "apps",
    app === "spruce" ? "parsley" : "spruce",
  );
  const commitMessages = execTrim(
    `git log ${fromCommit}..${toCommit} --oneline -- ${appDir} ${packageDir} '!${excludeDir}'`,
  );
  return commitMessages;
};

/**
 * `getCurrentCommit` is a helper function that returns the current commit.
 * This is different from the currently deployed commit. The currently deployed commit is the commit that is currently deployed to production.
 * The current commit is the commit that is currently checked out on your local machine and will be deployed to production.
 * @returns - the current commit
 */
const getCurrentCommit = () => execTrim("git rev-parse HEAD");

/**
 * `assertMainBranch` is a helper function that checks if the current branch is the main branch.
 * @throws - Will throw an error if current branch is not "main"
 */
const assertMainBranch = () => {
  const branchName = execTrim("git branch --show-current");
  const isOnMain = branchName === "main";
  if (!isOnMain) {
    throw Error(`Currently on branch "${branchName}"`);
  }
};

/**
 * `assertWorkingDirectoryClean` is a helper function that checks if the working directory is clean (i.e. no uncommitted changes).
 * @throws - Will throw an error if uncommitted changes are present.
 */
const assertWorkingDirectoryClean = () => {
  const result = execSync("git status --porcelain", { encoding: "utf-8" });
  if (result.trim() !== "") {
    throw Error(`Uncommitted changes:\n${result}`);
  }
};

export { getCurrentlyDeployedCommit } from "./get-current-deployed-commit";
export {
  assertMainBranch,
  assertWorkingDirectoryClean,
  COMMIT_LENGTH,
  getCommitMessages,
  getCurrentCommit,
  getGitRoot,
  push,
};
export * from "./tag";
