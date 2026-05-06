import { execSync } from "child_process";

export const pushToS3 = (bucket: string) => {
  console.log("Attempting to deploy to S3");
  const buildDir = "dist";
  try {
    execSync(
      `aws s3 sync ${buildDir}/ s3://"${bucket}"/ --follow-symlinks --delete --exclude .env-cmdrc.json`,
      { stdio: "inherit" },
    );
    // Specifically upload index.html and commit.txt with very low max age to prevent Cloudfront from
    // caching them.
    // The rest of our assets are hashed, so they can be cached safely as they are unique per-deploy.
    for (const file of ["index.html", "commit.txt"]) {
      execSync(
        `aws s3 cp ${buildDir}/${file} s3://"${bucket}"/ --cache-control 'max-age=60, public'`,
        { stdio: "inherit" },
      );
    }
    console.log("Successfully deployed to S3");
  } catch (e) {
    throw Error("Deployment to S3 failed", { cause: e });
  }
};
