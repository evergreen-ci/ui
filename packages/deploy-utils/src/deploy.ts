#!/usr/bin/env vite-node --script

import { buildAndPush } from "./build-and-push";
import { prepareProdDeploy } from "./prepare-prod-deploy";
import { isRunningOnCI } from "./utils/environment";
import { red } from "./utils/shell";
import { isTargetEnvironment } from "./utils/types";

if (isRunningOnCI()) {
  throw Error("pnpm deploy:<target> scripts are for local use only!");
}

const target = process.env.REACT_APP_RELEASE_STAGE;
if (!isTargetEnvironment(target)) {
  throw Error("REACT_APP_RELEASE_STAGE must be specified");
}

if (process.argv.includes("--force")) {
  if (!process.env.BUCKET) {
    throw Error("Must specify BUCKET as environment variable");
  }

  buildAndPush(process.env.BUCKET);
} else if (target === "production") {
  prepareProdDeploy();
} else {
  console.error(
    red(
      `Please use Evergreen to deploy. If you need to force a local deploy, add --force.`,
    ),
  );
}
