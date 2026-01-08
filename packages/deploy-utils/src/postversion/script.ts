#!/usr/bin/env vite-node --script

import { execSync } from "child_process";
import { getAppToDeploy } from "../utils/environment";
import { push, pushTags } from "../utils/git";
import { countdownTimer } from "../utils/shell";

process.env.VITE_SCRIPT_MODE = "1";

// npm version doesn't create commits/tags when run from a monorepo subdirectory
// because it can't find the .git directory. We manually create them here.
const app = getAppToDeploy();
const newVersion = process.env.npm_package_version;
const tagName = `${app}/v${newVersion}`;

console.log(`Creating commit and tag for ${tagName}...`);

// Stage the package.json change
execSync("git add package.json", { stdio: "inherit", encoding: "utf-8" });

// Create the version commit
execSync(`git commit -m "${tagName}"`, { stdio: "inherit", encoding: "utf-8" });

// Create the annotated tag
execSync(`git tag -a "${tagName}" -m "${tagName}"`, {
  stdio: "inherit",
  encoding: "utf-8",
});

push();

await countdownTimer(
  10,
  (n) => `Waiting ${n}s for Evergreen to pick up the version.`,
);

pushTags();
