import { buildAndPush } from "./build-and-push";
import { prepareProdDeploy } from "./prepare-prod-deploy";
import { isRunningOnCI } from "./utils/environment";
import { Target } from "./utils/types";

// Properly route a `yarn deploy:<target>` command
export const deploy = (target: Target) => {
  if (isRunningOnCI()) {
    throw Error("yarn deploy:<target> scripts are for local use only!");
  }

  if (target === "production") {
    prepareProdDeploy();
  } else if (process.argv.includes("--force")) {
    buildAndPush(target);
  } else {
    console.error(
      "Please use Evergreen to deploy. If you need to force a local deploy, use the --force flag.",
    );
  }
};
