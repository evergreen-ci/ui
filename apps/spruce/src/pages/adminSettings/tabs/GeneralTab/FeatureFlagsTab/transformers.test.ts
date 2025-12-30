import { AdminSettingsInput } from "gql/generated/types";
import { adminSettings } from "../../testData";
import { formToGql, gqlToForm } from "./transformers";
import { FeatureFlagsFormState } from "./types";

describe("feature flags section", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(adminSettings)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form)).toStrictEqual(gql);
  });
});

const form: FeatureFlagsFormState = {
  featureFlags: {
    services: {
      taskDispatchDisabled: true,
      largeParserProjectsDisabled: true,
      hostInitDisabled: true,
      podInitDisabled: true,
      monitorDisabled: true,
      agentStartDisabled: true,
      schedulerDisabled: true,
      hostAllocatorDisabled: true,
      systemFailedTaskRestartDisabled: true,
      podAllocatorDisabled: true,
      unrecognizedPodCleanupDisabled: true,
      cloudCleanupDisabled: true,
      taskReliabilityDisabled: true,
      debugSpawnHostsDisabled: true,
    },
    notifications: {
      eventProcessingDisabled: true,
      alertsDisabled: true,
      jiraNotificationsDisabled: true,
      slackNotificationsDisabled: true,
      emailNotificationsDisabled: true,
      webhookNotificationsDisabled: true,
      githubStatusAPIDisabled: true,
    },
    features: {
      repotrackerDisabled: true,
      githubPRTestingDisabled: true,
      degradedModeDisabled: true,
      jwtTokenForCLIDisabled: true,
      checkBlockedTasksDisabled: true,
      taskLoggingDisabled: true,
      cliUpdatesDisabled: true,
      sleepScheduleDisabled: true,
      backgroundReauthDisabled: true,
      staticAPIKeysDisabled: true,
      elasticIPsDisabled: true,
      releaseModeDisabled: true,
      debugSpawnHostsDisabled: true,
    },
    batchJobs: {
      backgroundStatsDisabled: true,
      cacheStatsJobDisabled: true,
      cacheStatsEndpointDisabled: true,
    },
  },
};

const gql: AdminSettingsInput = {
  serviceFlags: {
    agentStartDisabled: true,
    alertsDisabled: true,
    backgroundReauthDisabled: true,
    debugSpawnHostsDisabled: true,
    backgroundStatsDisabled: true,
    cacheStatsEndpointDisabled: true,
    cacheStatsJobDisabled: true,
    checkBlockedTasksDisabled: true,
    cliUpdatesDisabled: true,
    cloudCleanupDisabled: true,
    degradedModeDisabled: true,
    elasticIPsDisabled: true,
    emailNotificationsDisabled: true,
    eventProcessingDisabled: true,
    githubPRTestingDisabled: true,
    githubStatusAPIDisabled: true,
    hostAllocatorDisabled: true,
    hostInitDisabled: true,
    jiraNotificationsDisabled: true,
    jwtTokenForCLIDisabled: true,
    largeParserProjectsDisabled: true,
    monitorDisabled: true,
    podAllocatorDisabled: true,
    podInitDisabled: true,
    releaseModeDisabled: true,
    repotrackerDisabled: true,
    schedulerDisabled: true,
    slackNotificationsDisabled: true,
    sleepScheduleDisabled: true,
    staticAPIKeysDisabled: true,
    systemFailedTaskRestartDisabled: true,
    taskDispatchDisabled: true,
    taskLoggingDisabled: true,
    taskReliabilityDisabled: true,
    unrecognizedPodCleanupDisabled: true,
    webhookNotificationsDisabled: true,
  },
};
