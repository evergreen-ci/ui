import { get } from "https";
import { getLatestTag } from ".";
import { DeployableApp } from "../types";

/**
 * getRemotePreviousCommit fetches the commit hash currently deployed to the given app
 * @param app - name of app to query
 * @returns  - promise resolving to commit hash
 */
export const getRemotePreviousCommit = (
  app: DeployableApp,
): Promise<string> => {
  const commitUrl = `https://${app}.mongodb.com/commit.txt`;
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
  } catch (e) {
    console.error(
      `Fetching commit failed, using ${app}'s previous tag from git`,
    );
    try {
      commit = getLatestTag(app);
    } catch {
      console.error("Getting local commit failed");
    }
  }

  const commitIsCorrectLength = commit?.length === 40;

  if (commitIsCorrectLength) {
    return commit;
  }
  throw new Error("No valid commit found");
};
