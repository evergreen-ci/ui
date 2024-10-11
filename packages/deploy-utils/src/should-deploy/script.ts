#!/usr/bin/env -S vite-node --script

import { shouldDeploy } from ".";

if (!process.env.USER_BUCKET) {
  throw Error("Bucket name is required");
}

if (!(await shouldDeploy(process.env.USER_BUCKET))) {
  throw Error("Staging is already up to date; terminating.");
}
