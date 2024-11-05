import {
  getCurrentCommit,
  getRemotePreviousCommit,
  getCommitMessages,
} from "../utils/git";

export const shouldDeploy = async (userBucket: string) => {
  const baseUrl = `https://spruce.${userBucket}.evergreen-staging.devprod.mongodb.com`;

  let deployedCommit = "";
  try {
    deployedCommit = await getRemotePreviousCommit(baseUrl);
    deployedCommit = deployedCommit?.trim();
  } catch (e) {
    console.error("Fetching commit failed", e);
  }

  if (deployedCommit === "") {
    console.log("Deployed commit not found. Continuing deploy with HEAD...");
    return true;
  }

  const currentCommit = getCurrentCommit();
  if (deployedCommit === currentCommit) {
    console.log("Latest tag is already deployed.");
    return false;
  }

  // Even if the exact HEAD commit isn't deployed, there may have only been changes to the other app in which case we don't need to deploy.
  const commitDiff = getCommitMessages("spruce", deployedCommit, currentCommit);
  if (commitDiff !== "") {
    console.log(
      `Continuing with deploy from ${deployedCommit} to HEAD (${currentCommit})...`,
    );
    return true;
  }
  return false;
};
