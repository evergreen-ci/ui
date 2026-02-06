import { get } from "https";
import { DeployableApp } from "../types";
import { COMMIT_LENGTH, getLatestTag, tagIsValid } from ".";

const MAX_REDIRECTS = 5;

/**
 * fetchUrl fetches a URL over HTTPS and follows redirects up to MAX_REDIRECTS.
 * @param url - URL to fetch
 * @param remainingRedirects - number of remaining redirects to follow
 * @returns - promise resolving to the response body
 */
const fetchUrl = (
  url: string,
  remainingRedirects = MAX_REDIRECTS,
): Promise<string> =>
  new Promise((resolve, reject) => {
    get(url, (resp) => {
      const { statusCode } = resp;
      if (
        statusCode &&
        statusCode >= 300 &&
        statusCode < 400 &&
        resp.headers.location
      ) {
        if (remainingRedirects <= 0) {
          reject(new Error("Too many redirects"));
          return;
        }
        resolve(fetchUrl(resp.headers.location, remainingRedirects - 1));
        return;
      }
      if (statusCode && statusCode >= 400) {
        reject(new Error(`HTTP error: ${statusCode}`));
        return;
      }
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        resolve(data);
      });
      resp.on("error", (err) => {
        reject(err);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });

/**
 * getRemotePreviousCommit fetches the commit hash currently deployed to the given app
 * @param app - name of app to query
 * @returns  - promise resolving to commit hash
 */
export const getRemotePreviousCommit = (
  app: DeployableApp,
): Promise<string> => {
  const commitUrl = `https://${app}.mongodb.com/commit.txt`;
  return fetchUrl(commitUrl);
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
