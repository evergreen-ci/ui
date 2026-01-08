import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { getCurrentCommit } from "../utils/git";
import { pushToS3 } from "../utils/s3";

/**
 * buildAndPush builds the specified target and pushes to S3.
 * @param bucket - bucket to push to
 */
export const buildAndPush = (bucket: string) => {
  // Disable script mode to let vite build the project
  execSync("VITE_SCRIPT_MODE=0 pnpm build", { stdio: "inherit" });

  const currentCommit = getCurrentCommit();
  writeFileSync("dist/commit.txt", currentCommit);

  pushToS3(bucket);
};
