import { execSync } from "child_process";
import { readFileSync } from "fs";
import { toSentenceCase } from "@evg-ui/lib/utils";
import { getAppToDeploy, isRunningOnCI, isTest } from "../utils/environment";
import {
  COMMIT_LENGTH,
  getCommitMessages,
  getCurrentCommit,
  getLatestTag,
} from "../utils/git";
import { execTrim } from "../utils/shell";
import { findEvergreen, formatDate } from "./utils";

const githubURL = "https://github.com/evergreen-ci/ui";

type EmailFields = {
  body: string;
  from: string;
  recipients: string;
  subject: string;
};

/**
 * sendEmail is responsible for creating and sending the app's deploy email. It identifies the commits included in the deploy and specifies which tag to re-deploy for a revert (unless the deploy is itself a revert).
 */
export const sendEmail = async () => {
  const isRevert =
    process.env.EXECUTION !== "" && process.env.EXECUTION !== "0";
  const app = getAppToDeploy();
  const currentCommit = getCurrentCommit();

  let previousDeployCommit = "";
  try {
    previousDeployCommit = readFileSync(
      "bin/previous_deploy.txt",
      "utf8",
    ).trim();
  } catch (e) {
    console.error("Could not read bin/previous_deploy.txt");
  }

  if (!previousDeployCommit) {
    previousDeployCommit = getLatestTag(app);
  }

  if (isRevert) {
    const emailFields = makeEmail({
      app,
      commitsString: execTrim(`git show --oneline -s ${previousDeployCommit}`),
      commitToDeploy: previousDeployCommit,
      isRevert,
    });

    await evergreenNotify(emailFields);
    return;
  }

  const previousDeployTag = getLatestTag(app, previousDeployCommit);
  const commitsString = getCommitMessages(
    app,
    previousDeployCommit,
    currentCommit,
  );

  const emailFields = makeEmail({
    app,
    commitsString,
    commitToDeploy: currentCommit,
    isRevert,
    previousTag: previousDeployTag,
  });

  await evergreenNotify(emailFields);
};

/**
 * makeEmail returns the fields required to send an email notification.
 * @param obj - input object
 * @param obj.app - name of app being deployed
 * @param obj.commitsString - string of commit messages associated with deploy
 * @param obj.commitToDeploy - the commit for the deploy associated with this email
 * @param obj.previousTag - the most recently tagged commit
 * @param obj.isRevert - the deploy in question reverts a previous deploy
 * @throws {Error} when missing DEPLOYS_EMAIL environment variable
 * @throws {Error} when missing author, either from AUTHOR_EMAIL environment variable or git config
 * @returns - object including email's body, from, receipients, and subject fields
 */
export const makeEmail = ({
  app,
  commitToDeploy,
  commitsString,
  isRevert,
  previousTag,
}: {
  app: string;
  commitsString: string;
  commitToDeploy: string;
  isRevert: boolean;
  previousTag?: string;
}): EmailFields => {
  const recipients = process.env.DEPLOYS_EMAIL;
  if (!recipients) {
    throw Error("DEPLOYS_EMAIL not configured");
  }

  const from = isRunningOnCI()
    ? process.env.AUTHOR_EMAIL
    : execTrim("git config user.email");
  if (!from) {
    throw Error("Author email not configured");
  }

  const commitsHTML = commitsString
    .trim()
    .replaceAll("'", "‘")
    .split("\n")
    .map((commit) => {
      const [hash] = commit.split(" ");

      const commitMessage =
        hash.length === 7
          ? `<a href="${githubURL}/commit/${hash}">${commit}</a>`
          : commit;

      return `<li>${commitMessage}</li>`;
    })
    .join("");

  const commitLabel =
    commitToDeploy.length === COMMIT_LENGTH
      ? commitToDeploy.substring(0, 7)
      : commitToDeploy;
  const subject = `${formatDate(new Date())} ${toSentenceCase(app)} Deploy to ${commitLabel}${isRevert ? " (Revert)" : ""}`;
  const body = `<ul>${commitsHTML}</ul>${previousTag ? `<p><b>To revert, rerun task from previous release tag (${previousTag})</b></p>` : ""}`;

  return { body, from, recipients, subject };
};

/**
 * Calls evergreen notify command using the installed CLI. If run in a test, logs the output of this command to avoid inadvertent emails.
 * @param emailFields - command arguments
 * @param emailFields.body - email contents
 * @param emailFields.from - sender's email address
 * @param emailFields.recipients - recipient email address
 * @param emailFields.subject - dated subject line
 * @throws {Error} if Evergreen CLI is not found
 */
const evergreenNotify = async (emailFields: EmailFields) => {
  const { body, from, recipients, subject } = emailFields;
  const evgConfig = findEvergreen();
  if (!evgConfig) {
    throw Error("Could not find Evergreen executable");
  }

  const { credentials, evgExecutable } = evgConfig;

  const emailCmd = `${evgExecutable} ${credentials} notify email -f ${from} -r ${recipients} -s '${subject}' -b '${body}'`;
  if (isTest) {
    console.log(emailCmd);
  } else {
    execSync(emailCmd);
  }
};
