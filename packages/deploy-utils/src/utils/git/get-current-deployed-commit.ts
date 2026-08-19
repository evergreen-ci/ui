import { get } from "https";
import { DeployableApp } from "../types";
import { COMMIT_LENGTH, getLatestTag, tagIsValid } from ".";

const appToDomain: Record<DeployableApp, string> = {
  parsley: "parsley.corp.mongodb.com",
  spruce: "spruce.corp.mongodb.com",
};

/**
 * getRemotePreviousCommit fetches the commit hash currently deployed to the given app
 * @param app - name of app to query
 * @returns  - promise resolving to commit hash
 */
export const getRemotePreviousCommit = (
  app: DeployableApp,
): Promise<string> => {
  const commitUrl = `https://${appToDomain[app]}/commit.txt`;
  return new Promise((resolve, reject) => {
    get(commitUrl, (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        resolve(data);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
};

/**
 * getCurrentlyDeployedCommit returns the commit hash currently deployed. It first attempts to fetch the remote value and falls back to querying the latest local git tag associated with the given app.
 * @param app - name of app to query
 * @throws {Error} - errors if commit hash is not found remotely or locally
 * @returns - currently deployed commit hash
 */
export const getCurrentlyDeployedCommit = async (app: DeployableApp) => {
  let commit = "";
  try {
    commit = await getRemotePreviousCommit(app);
    commit = commit?.trim();
  } catch (e) {
    console.error("Fetching commit failed");
  }

  if (commit?.length !== COMMIT_LENGTH) {
    console.log(`Using ${app}'s previous tag from git`);
    try {
      commit = getLatestTag(app);
      commit = commit?.trim();
      console.log(commit);
    } catch {
      console.error("Getting local commit failed");
    }
  }

  const commitIsValid =
    commit?.length === COMMIT_LENGTH || tagIsValid(app, commit);

  if (commitIsValid) {
    return commit;
  }
  throw new Error("No valid commit found");
};
