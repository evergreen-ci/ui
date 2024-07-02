#!/usr/bin/env -S vite-node --script

import { setupCredentials } from ".";
import { isTargetEnvironment } from "../utils/types";

const target = process.argv[2];
if (!isTargetEnvironment(target)) {
  throw Error("Must provide valid target");
}

setupCredentials(target);
