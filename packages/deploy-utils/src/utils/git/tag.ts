import { execSync } from "child_process";
import { execTrim, green, underline } from "../shell";
import { DeployableApp } from "../types";

/**
 * `createTagAndPush` is a helper function that creates a new tag.
 * Pushing occurs in the postversion hook triggered by "yarn version"
 * @param version - version indicates the type of upgrade of the new tag.
 */
const createTagAndPush = (version: "patch" | "minor" | "major") => {
  console.log("Creating new tag...");
  try {
    execSync(`yarn version --new-version ${version}`, {
      encoding: "utf-8",
      stdio: "inherit",
    });
  } catch (err) {
    throw Error("Creating new tag failed.", { cause: err });
  }
  // The postversion hook in package.json handles pushing to upstream
  console.log("Pushed to remote. Should be deploying soon...");
  console.log(
    green(
      `Track deploy progress at ${underline(
        "https://spruce.mongodb.com/commits/evergreen-ui?requester=git_tag_request",
      )}`,
    ),
  );
};

/**
 * `getLatestTag` is a helper function that returns the latest tag.
 * @param app - name of the app to be deployed
 * @returns - the latest tag
 */
const getLatestTag = (app: DeployableApp) => {
  try {
    const latestTag = execTrim(
      `git describe --tags --abbrev=0 --match="${app}/*"`,
    );
    return latestTag;
  } catch (err) {
    throw Error("Getting latest tag failed.", { cause: err });
  }
};

/**
 * getTagFromCommit returns a tag name given its associated commit
 * @param commit - commit hash for desired tag
 * @throws {Error} if executing git commit fails
 * @returns - git tag
 */
const getTagFromCommit = (commit: string) => {
  try {
    return execTrim(`git describe --abbrev=0 ${commit}`);
  } catch (e) {
    throw Error(`Getting tag from commit ${commit}`, { cause: e });
  }
};

/**
 * `deleteTag` is a helper function that deletes a tag.
 * @param tag - the tag to delete
 */
const deleteTag = (tag: string) => {
  console.log(`Deleting tag (${tag}) from remote...`);
  const deleteCommand = `git push --delete upstream ${tag}`;
  try {
    execSync(deleteCommand, { stdio: "inherit", encoding: "utf-8" });
  } catch (err) {
    throw Error("Deleting tag failed.", { cause: err });
  }
};

/**
 * `pushTags` is a helper function that pushes tags to the remote.
 */
const pushTags = () => {
  console.log("Pushing tags...");
  try {
    execSync(`git push --tags upstream`, {
      stdio: "inherit",
      encoding: "utf-8",
    });
  } catch (err) {
    throw Error("Pushing tags failed.", { cause: err });
  }
};

/**
 * tagIsValid asserts whether a given string matches a tag for a specified app
 * @param app - app with which tag is associated
 * @param matchString - string to test against
 * @returns - boolean indicating whether matchString is a valid tag
 */
const tagIsValid = (app: DeployableApp, matchString: string) =>
  new RegExp(`${app}/v\\d+.\\d+.\\d+`).test(matchString);

export {
  createTagAndPush,
  deleteTag,
  getLatestTag,
  getTagFromCommit,
  pushTags,
  tagIsValid,
};
