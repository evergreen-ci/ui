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
} from "../utils/git";

/**
 * getAppIfValidEnv ensures that the environment is valid and gets the app being committed.
 * @throws - Will throw an error if not on main branch or uncommitted changes
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
      type: "confirm",
      name: "value",
      message: "No new commits. Do you want to cancel the deploy?",
      initial: true,
    });

    if (cancelDeploy) {
      console.log("Deploy cancelled.");
      return;
    }

    const { value: shouldForceDeploy } = await prompts({
      type: "confirm",
      name: "value",
      message: `Do you want to trigger a deploy on the most recent existing tag? (${latestTag})`,
      initial: false,
    });

    if (shouldForceDeploy) {
      deleteTag(latestTag);
      pushTags();
      console.log("Check Evergreen for deploy progress.");
    } else {
      console.log(
        "Deploy cancelled. If systems are experiencing an outage and you'd like to push the deploy directly to S3, run yarn deploy:prod --force.",
      );
    }
    return;
  }

  console.log(`Commit messages:\n${commitMessages}`);

  const { value: version } = await prompts({
    type: "select",
    name: "value",
    message: "How should this deploy be versioned?",
    choices: [
      { title: "Patch", value: "patch" },
      { title: "Minor", value: "minor" },
      { title: "Major", value: "major" },
    ],
    initial: 0,
  });

  if (version) {
    createTagAndPush(version);
  }
};
