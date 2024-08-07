#!/usr/bin/env -S vite-node --script

import { shouldDeploy } from ".";

if (!(await shouldDeploy())) {
  throw Error("Staging is already up to date; terminating.");
}
