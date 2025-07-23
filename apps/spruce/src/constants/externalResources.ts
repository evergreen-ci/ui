import { getUnixTime } from "date-fns";
import { LogTypes } from "types/task";
import {
  getHoneycombBaseURL,
  getParsleyUrl,
  getEvergreenUrl,
} from "utils/environmentVariables";

export const wikiBaseUrl =
  "https://docs.devprod.prod.corp.mongodb.com/evergreen";

export const wikiUrl = `${wikiBaseUrl}/Home`;

const projectSettingsDocumentationUrl = `${wikiBaseUrl}/Project-Configuration`;
const hostsDocumentationUrl = `${wikiBaseUrl}/Hosts`;

export const amazonEC2InstanceTypeDocumentationUrl =
  "https://aws.amazon.com/ec2/instance-types/";

export const hostUptimeDocumentationUrl = `${hostsDocumentationUrl}/Spawn-Hosts#unexpirable-host-sleep-schedules`;

export const projectDistroSettingsDocumentationUrl = `${projectSettingsDocumentationUrl}/Project-and-Distro-Settings`;

export const projectSettingsRepoSettingsDocumentationUrl = `${projectSettingsDocumentationUrl}/Repo-Level-Settings`;

export const versionControlDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#version-control`;

export const patchAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#patch-aliases`;

export const pullRequestAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#pr-aliases`;

export const mergeQueueAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#merge-queue-aliases`;

export const gitTagAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#git-tag-aliases`;

export const githubChecksAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#github-checks-aliases`;

export const githubPermissionsDocumentationUrl =
  "https://docs.github.com/en/rest/apps/apps#create-an-installation-access-token-for-an-app";

export const githubTokenPermissionRestrictionsUrl =
  "https://docs.devprod.prod.corp.mongodb.com/evergreen/Project-Configuration/Project-Commands#githubgenerate_token";

export const githubAppCredentialsDocumentationUrl =
  "https://wiki.corp.mongodb.com/x/tavkC";

export const ignoredFilesDocumentationUrl = `${wikiBaseUrl}/Project-Configuration/Project-Configuration-Files#ignoring-changes-to-certain-files`;

export const redactedVarsDocumentationUrl = `${wikiBaseUrl}/Project-Configuration/Project-Configuration-Files#expansions`;

export const cliDocumentationUrl = `${wikiBaseUrl}/CLI`;

export const containersOnboardingDocumentationUrl = `${wikiBaseUrl}/Containers/Container-Tasks`;

export const taskSchedulingLimitsDocumentationUrl = `${wikiBaseUrl}/Reference/Limits#task-scheduling-limits`;

export const windowsPasswordRulesURL =
  "https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc786468(v=ws.10)?redirectedfrom=MSDN";

export const getJiraBugUrl = (jiraHost: string) =>
  `https://${jiraHost}/secure/CreateIssueDetails!init.jspa?pid=22786&issuetype=1&priority=4&labels=user-feedback&description=Please%20note%20browser%20and%20OS%20when%20describing%20your%20issue.`;

export const getJiraImprovementUrl = (jiraHost: string) =>
  `https://${jiraHost}/secure/CreateIssueDetails!init.jspa?pid=22786&issuetype=4&priority=4&labels=user-feedback`;

export const getIdeUrl = (hostId: string) =>
  `${getEvergreenUrl()}/host/${hostId}/ide`;

export const getJiraSearchUrl = (jiraHost: string, jqlEscaped: string) =>
  `https://${jiraHost}/secure/IssueNavigator.jspa?jql=${jqlEscaped}`;

export const getJiraTicketUrl = (jiraHost: string, jiraKey: string) =>
  `https://${jiraHost}/browse/${jiraKey}`;

export const getGithubPullRequestUrl = (
  owner: string,
  repo: string,
  issue: number | string,
) => `https://github.com/${owner}/${repo}/pull/${issue}`;

export const getGithubCommitUrl = (
  owner: string,
  repo: string,
  githash: string,
) => `https://github.com/${owner}/${repo}/commit/${githash}`;

export const getGithubPRUrl = (
  owner: string,
  repo: string,
  prNumber: number,
  headHash: string,
) => `https://github.com/${owner}/${repo}/pull/${prNumber}/commits/${headHash}`;

export const getGithubMergeQueueUrl = (
  owner: string,
  repo: string,
  branch: string,
) => `https://github.com/${owner}/${repo}/queue/${branch}`;

export const getParsleyTaskLogLink = (
  logType: LogTypes,
  taskId: string,
  execution: number,
) => `${getParsleyUrl()}/evergreen/${taskId}/${execution}/${logType}`;

export const getParsleyLogkeeperTestLogURL = (
  buildId: string,
  testId: string,
) => `${getParsleyUrl()}/resmoke/${buildId}/test/${testId}`;

export const getParsleyBuildLogURL = (buildId: string) =>
  `${getParsleyUrl()}/resmoke/${buildId}/all`;

export const getParsleyCompleteLogsURL = (
  taskID: string,
  execution: number | string,
  groupID: string,
) => `${getParsleyUrl()}/resmoke/${taskID}/${execution}/${groupID}/all`;

/**
 * Generates a URL for accessing a trace in the Honeycomb dashboard.
 * @param traceId - The ID of the trace.
 * @param startTs - The start timestamp of the trace. Note that this timestamp is truncated to the nearest second.
 * @param endTs - The end timestamp of the trace. Note that this timestamp is rounded up to the nearest second.
 * @returns The URL for accessing the trace in the Honeycomb dashboard.
 */
export const getHoneycombTraceUrl = (
  traceId: string,
  startTs: Date,
  endTs: Date,
): string =>
  `${getHoneycombBaseURL()}/datasets/evergreen-agent/trace?trace_id=${traceId}&trace_start_ts=${getUnixTime(
    new Date(startTs),
  )}&trace_end_ts=${getUnixTime(new Date(endTs)) + 1}`;

export const getHoneycombSystemMetricsUrl = (
  taskId: string,
  diskDevices: string[],
  startTs: Date,
  endTs: Date,
): string => {
  const query = {
    calculations: [
      { op: "AVG", column: "system.memory.usage.used" },
      { op: "AVG", column: "system.cpu.utilization" },
      { op: "RATE_AVG", column: "system.network.io.transmit" },
      { op: "RATE_AVG", column: "system.network.io.receive" },
    ].concat(
      diskDevices.flatMap((device) => [
        { op: "RATE_AVG", column: `system.disk.io.${device}.read` },
        { op: "RATE_AVG", column: `system.disk.io.${device}.write` },
        { op: "RATE_AVG", column: `system.disk.operations.${device}.read` },
        {
          op: "RATE_AVG",
          column: `system.disk.operations.${device}.write`,
        },
        { op: "RATE_AVG", column: `system.disk.io_time.${device}` },
      ]),
    ),
    filters: [{ op: "=", column: "evergreen.task.id", value: taskId }],
    start_time: getUnixTime(new Date(startTs)),
    end_time: getUnixTime(new Date(endTs)),
  };

  return `${getHoneycombBaseURL()}/datasets/evergreen?query=${JSON.stringify(
    query,
  )}&omitMissingValues`;
};

export const adminSettingsURL = `${getEvergreenUrl()}/admin`;

export const buildHostConfigurationRepoURL =
  "https://github.com/10gen/buildhost-configuration";
export const buildHostPostConfigRepoURL =
  "https://github.com/10gen/buildhost-post-config";
