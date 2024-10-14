#!/usr/bin/env -S vite-node --script

import { shouldDeploy } from ".";

if (!process.env.USER_KEY) {
  throw Error("User key is required");
}

if (!(await shouldDeploy(process.env.USER_KEY))) {
  throw Error("Staging is already up to date; terminating.");
}
