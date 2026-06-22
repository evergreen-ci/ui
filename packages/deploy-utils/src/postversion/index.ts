import { execSync } from "child_process";
import { getAppToDeploy } from "../utils/environment";
import { push, pushTags } from "../utils/git";
import { countdownTimer } from "../utils/shell";

/**
 * `postversion` creates the version commit and tag, then pushes them to the remote.
 * It runs as the postversion hook triggered by "npm version".
 *
 * npm version doesn't create commits/tags when run from a monorepo subdirectory
 * because it can't find the .git directory, so we manually create them here.
 *
 * The version commit is machine-generated and only bumps package.json, so it is
 * created with --no-verify to skip the pre-commit hook. Otherwise the repo-wide
 * type check run by lint-staged can fail on changes unrelated to the deploy and
 * abort the deploy with a confusing wall of errors.
 */
export const postversion = async () => {
  const app = getAppToDeploy();
  const newVersion = process.env.npm_package_version;
  const tagName = `${app}/v${newVersion}`;

  console.log(`Creating commit and tag for ${tagName}...`);

  execSync("git add package.json", { stdio: "inherit", encoding: "utf-8" });

  execSync(`git commit --no-verify -m "${tagName}"`, {
    stdio: "inherit",
    encoding: "utf-8",
  });

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
};
