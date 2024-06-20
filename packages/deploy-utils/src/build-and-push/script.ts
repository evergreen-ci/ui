#!/usr/bin/env ts-node
import { buildAndPush } from ".";
import { isTarget } from "../utils/types";

const target = process.env.REACT_APP_RELEASE_STAGE ?? "";
if (!isTarget(target)) {
  throw Error(
    "Must provide valid REACT_APP_RELEASE_STAGE as environment variable",
  );
}

if (!process.env.BUCKET) {
  throw Error("Must specify BUCKET as environment variable");
}

buildAndPush(process.env.BUCKET);
