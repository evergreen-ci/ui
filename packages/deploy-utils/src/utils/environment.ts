import { relative } from "path";
import { getGitRoot } from "./git";
import { DeployableApp } from "./types";

const isRunningOnCI = () => process.env.CI === "true";

const isDryRun = process.argv.includes("--dry-run");

const getAppToDeploy = (): DeployableApp => {
  const gitRoot = getGitRoot();
  const cwd = process.cwd();

  const rel = relative(gitRoot, cwd).split("/");
  const [appDir, appName] = rel;
  if (
    rel.length !== 2 ||
    appDir !== "apps" ||
    !(appName === "spruce" || appName === "parsley")
  ) {
    throw Error("Must deploy from an app's root directory");
  }
  return appName;
};

export { getAppToDeploy, isRunningOnCI, isDryRun };
