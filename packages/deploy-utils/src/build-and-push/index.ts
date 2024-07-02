import { execSync } from "child_process";
import { pushToS3 } from "../utils/s3";

/**
 * buildAndPush builds the specified target and pushes to S3.
 * @param bucket - bucket to push to
 */
export const buildAndPush = (bucket: string) => {
  execSync(`yarn build`, { stdio: "inherit" });

  pushToS3(bucket);
};
