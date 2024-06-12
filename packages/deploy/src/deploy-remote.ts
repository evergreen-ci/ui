import { execSync } from "child_process";
import { pushToS3 } from "./utils/s3";

// Run with env-cmd -e from evergreen.yml
export const deployRemote = () => {
  execSync(`yarn build`, { stdio: "inherit" });

  if (process.env.BUCKET) {
    pushToS3(process.env.BUCKET);
  }
};
