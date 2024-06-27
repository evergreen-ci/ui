#!/usr/bin/env -S vite-node --script

import { writeFileSync } from "fs";
import { getAppToDeploy } from "../utils/environment";
import { getCurrentlyDeployedCommit } from "../utils/git";

const app = getAppToDeploy();
const currentlyDeployedCommit = await getCurrentlyDeployedCommit(app);

writeFileSync("bin/previous_deploy.txt", currentlyDeployedCommit);
