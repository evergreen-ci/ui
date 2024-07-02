#!/usr/bin/env -S vite-node --script

import { buildAndPush } from ".";
import { isTargetEnvironment } from "../utils/types";

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
