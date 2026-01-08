#!/usr/bin/env vite-node --script

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { getAppToDeploy } from "../utils/environment";
import { getCurrentlyDeployedCommit } from "../utils/git";

process.env.VITE_SCRIPT_MODE = "1";

const dirName = "bin";
const app = getAppToDeploy();
const currentlyDeployedCommit = await getCurrentlyDeployedCommit(app);

if (!existsSync(dirName)) {
  mkdirSync(dirName);
}

writeFileSync(`${dirName}/previous_deploy.txt`, currentlyDeployedCommit);
