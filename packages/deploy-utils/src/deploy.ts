#!/usr/bin/env -S vite-node --script

import { buildAndPush } from "./build-and-push";
import { prepareProdDeploy } from "./prepare-prod-deploy";
import { isRunningOnCI } from "./utils/environment";
import { red } from "./utils/shell";
import { isTarget } from "./utils/types";

if (isRunningOnCI()) {
  throw Error("yarn deploy:<target> scripts are for local use only!");
}

const target = process.env.REACT_APP_RELEASE_STAGE ?? "";
if (!isTarget(target)) {
  throw Error("REACT_APP_RELEASE_STAGE must be specified");
}

if (target === "production") {
  prepareProdDeploy();
} else if (process.argv.includes("--force")) {
  if (!process.env.BUCKET) {
    throw Error("Must specify BUCKET as environment variable");
  }

  buildAndPush(process.env.BUCKET);
} else {
  console.error(
    red(
      `Please use Evergreen to deploy. If you need to force a local deploy, add --force.`,
    ),
  );
}
