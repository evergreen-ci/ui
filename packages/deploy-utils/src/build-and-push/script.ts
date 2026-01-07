#!/usr/bin/env vite-node --script

import { isTargetEnvironment } from "../utils/types";
import { buildAndPush } from ".";

process.env.VITE_SCRIPT_MODE = "1";

const target = process.env.REACT_APP_RELEASE_STAGE;
if (!isTargetEnvironment(target)) {
  throw Error(
    "Must provide valid REACT_APP_RELEASE_STAGE as environment variable",
  );
}

if (!process.env.BUCKET) {
  throw Error("Must specify BUCKET as environment variable");
}

buildAndPush(process.env.BUCKET);
