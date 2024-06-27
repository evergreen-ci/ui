#!/usr/bin/env -S vite-node --script

import { setupCredentials } from ".";
import { isTarget } from "../utils/types";

const target = process.argv[2];
if (!isTarget(target)) {
  throw Error("Must provide valid target");
}

setupCredentials(target);
