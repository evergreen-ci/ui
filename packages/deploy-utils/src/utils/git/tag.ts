import { execSync } from "child_process";
import { getAppToDeploy } from "../environment";
import { execTrim, green, underline } from "../shell";
import { DeployableApp } from "../types";

enum ReleaseVersion {
  Patch = "patch",
  Minor = "minor",
  Major = "major",
}

/**
 * `createTagAndPush` is a helper function that creates a new tag.
 * Pushing occurs in the postversion hook triggered by "npm version"
 * @param version - version indicates the type of upgrade of the new tag.
 */
const createTagAndPush = (version: ReleaseVersion) => {
  console.log("Creating new tag...");
  const app = getAppToDeploy();
  try {
    execSync(`npm version ${version} --tag-version-prefix ${app}/v`, {
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
        "https://spruce.mongodb.com/project/evergreen-ui/waterfall?requesters=git_tag_request",
      )}`,
    ),
  );
};

/**
 * `getReleaseVersion` is a helper function that gets the release version from commit messages.
 * @param commitMessages - commit messages to parse
 * @returns - the release version
 */
const getReleaseVersion = (commitMessages: string): ReleaseVersion => {
  let version = ReleaseVersion.Patch;
  if (/\[major\]/i.test(commitMessages)) {
    version = ReleaseVersion.Major;
  } else if (/\[minor\]/i.test(commitMessages)) {
    version = ReleaseVersion.Minor;
  }
  return version;
};

/**
 * `getLatestTag` is a helper function that returns the latest tag.
 * @param app - name of the app to be deployed
 * @param baseCommit - optionally, get the latest tag relative to a specified commit
 * @returns - the latest tag
 */
const getLatestTag = (app: DeployableApp, baseCommit: string = "") => {
  try {
    const latestTag = execTrim(
      `git describe --tags --abbrev=0 --match="${app}/*" ${baseCommit}`,
    );
    return latestTag;
  } catch (err) {
    throw Error("Getting latest tag failed.", { cause: err });
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
    console.log("Successfully pushed tags.");
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
  getReleaseVersion,
  pushTags,
  tagIsValid,
  ReleaseVersion,
};
