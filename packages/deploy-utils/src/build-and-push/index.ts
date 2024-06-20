import { execSync } from "child_process";
import { pushToS3 } from "../utils/s3";
import { Target } from "../utils/types";

/**
 * buildAndPush builds the specified target and pushes to S3.
 * @param target - Name of environment being targeted
 */
export const buildAndPush = (target: Target) => {
  execSync(`yarn env-cmd -e ${target} yarn build`, { stdio: "inherit" });

  if (process.env.BUCKET) {
    pushToS3(process.env.BUCKET);
  } else {
    throw Error("No bucket specified.");
  }
};
