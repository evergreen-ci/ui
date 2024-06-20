import { get } from "https";
import { getLatestTag } from ".";
import { DeployableApp } from "../types";

const commitIsCorrectLength = (commit: string) => commit.length === 40;

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

  if (commit && commitIsCorrectLength(commit.trim())) {
    return commit;
  }
  throw new Error("No valid commit found");
};
