import { execSync } from "child_process";
import { resolve } from "path";
import { DeployableApp } from "../types";

const getGitRoot = () =>
  execSync(`git rev-parse --show-toplevel`, {
    encoding: "utf-8",
  })
    .toString()
    .trim();

/**
 * `getCommitMessages` returns a string of all commit messages between the currently deployed commit and HEAD.
 * @param currentlyDeployedCommit - the currently deployed commit for this app
 * @param app - the app being deployed
 * @returns - a string of all commit messages between the currently deployed commit and HEAD. Commits are limited to those in the app's directory and all shared directories, as well as the root (the other app is excluded).
 */
const getCommitMessages = (
  currentlyDeployedCommit: string,
  app: DeployableApp,
) => {
  const gitRoot = getGitRoot();
  const appDir = resolve(gitRoot, "apps", app);
  const excludeDir = resolve(
    gitRoot,
    "apps",
    app === "spruce" ? "parsley" : "spruce",
  );
  const commitMessages = execSync(
    `git log ${currentlyDeployedCommit}..HEAD --oneline -- ${appDir} '!${excludeDir}'`,
    { encoding: "utf-8" },
  )
    .toString()
    .trim();
  return commitMessages;
};

/**
 * `getCurrentCommit` is a helper function that returns the current commit.
 * This is different from the currently deployed commit. The currently deployed commit is the commit that is currently deployed to production.
 * The current commit is the commit that is currently checked out on your local machine and will be deployed to production.
 * @returns - the current commit
 */
const getCurrentCommit = () => {
  const currentCommit = execSync("git rev-parse HEAD", {
    encoding: "utf-8",
  })
    .toString()
    .trim();
  return currentCommit;
};

/**
 * `assertMainBranch` is a helper function that checks if the current branch is the main branch.
 * @throws - Will throw an error if current branch is not "main"
 */
const assertMainBranch = () => {
  const branchName = execSync("git branch --show-current", {
    encoding: "utf-8",
  })
    .toString()
    .trim();
  const isOnMain = branchName === "main";
  if (!isOnMain) {
    throw Error(`Currently on branch "${branchName}"`);
  }
};

/**
 * `isWorkingDirectoryClean` is a helper function that checks if the working directory is clean (i.e. no uncommitted changes).
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
  getCommitMessages,
  getCurrentCommit,
  getGitRoot,
};
export * from "./tag";
