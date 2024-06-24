import { execSync } from "child_process";

export const pushToS3 = (bucket: string) => {
  console.log("Attempting to deploy to S3");
  try {
    execSync(
      `aws s3 sync dist/ s3://"${bucket}"/ --acl public-read --follow-symlinks --delete --exclude .env-cmdrc.json`,
      { stdio: "inherit" },
    );
    console.log("Successfully deployed to S3");
  } catch (e) {
    throw Error("Deployment to S3 failed", { cause: e });
  }
};
