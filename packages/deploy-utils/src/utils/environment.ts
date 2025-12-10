import { DeployableApp, isDeployableApp } from "./types";

export const isRunningOnCI = () => process.env.CI === "true";

export const isTest = process.env.VITEST === "true";

/**
 * getAppToDeploy returns the name of the app being deployed using pnpm's PNPM_PACKAGE_NAME environment variable.
 * @throws {Error} - errors if PNPM_PACKAGE_NAME is not set or is not a deployable app
 * @returns - name of app being deployed
 */
export const getAppToDeploy = (): DeployableApp => {
  const appName = process.env.PNPM_PACKAGE_NAME;
  if (!appName || !isDeployableApp(appName)) {
    throw Error(
      "Must deploy from an app's root directory using pnpm (PNPM_PACKAGE_NAME not set or invalid)",
    );
  }
  return appName;
};
