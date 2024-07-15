import { relative } from "path";
import { getGitRoot } from "./git";
import { DeployableApp, isDeployableApp } from "./types";

export const isRunningOnCI = () => process.env.CI === "true";

export const isTest = process.env.VITEST === "true";

/**
 * getAppToDeploy returns the name of the app being deployed. Deploy scripts must be invoked from the root of an app directory, which is validated here.
 * @throws {Error} - errors if not being run from root of app dir
 * @returns - name of app being deployed
 */
export const getAppToDeploy = (): DeployableApp => {
  const gitRoot = getGitRoot();
  const cwd = process.cwd();

  const rel = relative(gitRoot, cwd).split("/");
  const [appDir, appName] = rel;
  if (rel.length !== 2 || appDir !== "apps" || !isDeployableApp(appName)) {
    throw Error("Must deploy from an app's root directory");
  }
  return appName;
};
