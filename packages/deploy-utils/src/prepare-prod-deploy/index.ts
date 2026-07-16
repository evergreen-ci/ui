import prompts from "prompts";
import { getAppToDeploy } from "../utils/environment";
import {
  assertMainBranch,
  assertWorkingDirectoryClean,
  getCommitMessages,
  getCurrentlyDeployedCommit,
  createTagAndPush,
  deleteTag,
  getLatestTag,
  pushTags,
  getReleaseVersion,
} from "../utils/git";

/**
 * getAppIfValidEnv ensures that the environment is valid and gets the app being committed.
 * @throws {Error} - Will throw an error if not on main branch or uncommitted changes
 * @returns - Name of deployable app
 */
const getAppIfValidEnv = () => {
  assertMainBranch();
  assertWorkingDirectoryClean();
  return getAppToDeploy();
};

export const prepareProdDeploy = async () => {
  const app = getAppIfValidEnv();

  const currentlyDeployedCommit = await getCurrentlyDeployedCommit(app);
  console.log(`Currently Deployed Commit: ${currentlyDeployedCommit}`);

  const commitMessages = getCommitMessages(app, currentlyDeployedCommit);

  // If there are no commit messages, ask the user if they want to delete and re-push the latest tag, thereby forcing a deploy with no new commits.
  if (commitMessages.length === 0) {
    const latestTag = getLatestTag(app);
    const { value: cancelDeploy } = await prompts({
      initial: true,
      message: "No new commits. Do you want to cancel the deploy?",
      name: "value",
      type: "confirm",
    });

    if (cancelDeploy) {
      console.log("Deploy cancelled.");
      return;
    }

    const { value: shouldForceDeploy } = await prompts({
      initial: false,
      message: `Do you want to trigger a deploy on the most recent existing tag? (${latestTag})`,
      name: "value",
      type: "confirm",
    });

    if (shouldForceDeploy) {
      deleteTag(latestTag);
      pushTags();
      console.log("Check Evergreen for deploy progress.");
    } else {
      console.log(
        "Deploy cancelled. If systems are experiencing an outage and you'd like to push the deploy directly to S3, run pnpm deploy:prod --force.",
      );
    }
    return;
  }

  console.log(`Commit messages:\n${commitMessages}`);

  const version = getReleaseVersion(commitMessages);
  console.log(`This deploy is a ${version} release.`);

  const { value: shouldDeploy } = await prompts({
    initial: true,
    message: "Do you want to deploy?",
    name: "value",
    type: "confirm",
  });
  if (!shouldDeploy) {
    console.log("Deploy cancelled.");
    return;
  }

  createTagAndPush(version);
};
