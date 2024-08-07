import { execSync } from "child_process";
import {
  getLatestTag,
  getRemotePreviousCommit,
  getTagByCommit,
  tagIsGreater,
} from "../utils/git";

export const shouldDeploy = async (user?: string) => {
  // const baseUrl = `https://spruce.${user}.evergreen-staging.devprod.prod.corp.mongodb.com`;
  const baseUrl = "https://spruce-staging.corp.mongodb.com";

  let commit = "";
  try {
    commit = await getRemotePreviousCommit(baseUrl);
    commit = commit?.trim();
  } catch (e) {
    console.error("Fetching commit failed", e);
  }

  const latestTag = getLatestTag("spruce");
  const deployedTag = getTagByCommit(commit);
  if (deployedTag === "") {
    console.log(
      "Deployed commit did not match any tag. Continuing deploy with latest tag...",
    );
    execSync(`git checkout ${latestTag} --force`);
    return true;
  }

  if (latestTag === deployedTag) {
    console.log("Latest tag is already deployed.");
    return false;
  }

  const shouldDeployTag = tagIsGreater(latestTag, deployedTag);
  if (shouldDeployTag) {
    console.log(
      `Continuing with deploy from ${deployedTag} to ${latestTag}...`,
    );
    execSync(`git checkout ${latestTag} --force`);
  }
  return shouldDeployTag;
};
