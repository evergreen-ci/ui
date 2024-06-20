#!/usr/bin/env ts-node
import { writeFileSync } from "fs";
import { getAppToDeploy } from "../utils/environment";
import { getCurrentlyDeployedCommit } from "../utils/git";

const writeCommit = async () => {
  const app = getAppToDeploy();
  // TODO: remove await when {type: module} is added
  const currentlyDeployedCommit = await getCurrentlyDeployedCommit(app);

  writeFileSync("bin/previous_deploy.txt", currentlyDeployedCommit);
};

writeCommit();
