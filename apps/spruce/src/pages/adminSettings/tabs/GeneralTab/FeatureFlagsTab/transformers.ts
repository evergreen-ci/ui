import { AdminSettingsGeneralSection } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";

type Tab = AdminSettingsGeneralSection.FeatureFlags;

export const gqlToForm = ((data) => ({
  featureFlags: {
    services: {
      taskDispatchDisabled: data.serviceFlags?.taskDispatchDisabled ?? false,
      largeParserProjectsDisabled:
        data.serviceFlags?.largeParserProjectsDisabled ?? false,
      hostInitDisabled: data.serviceFlags?.hostInitDisabled ?? false,
      podInitDisabled: data.serviceFlags?.podInitDisabled ?? false,
      monitorDisabled: data.serviceFlags?.monitorDisabled ?? false,
      agentStartDisabled: data.serviceFlags?.agentStartDisabled ?? false,
      schedulerDisabled: data.serviceFlags?.schedulerDisabled ?? false,
      hostAllocatorDisabled: data.serviceFlags?.hostAllocatorDisabled ?? false,
      systemFailedTaskRestartDisabled:
        data.serviceFlags?.systemFailedTaskRestartDisabled ?? false,
      podAllocatorDisabled: data.serviceFlags?.podAllocatorDisabled ?? false,
      unrecognizedPodCleanupDisabled:
        data.serviceFlags?.unrecognizedPodCleanupDisabled ?? false,
      cloudCleanupDisabled: data.serviceFlags?.cloudCleanupDisabled ?? false,
      taskReliabilityDisabled:
        data.serviceFlags?.taskReliabilityDisabled ?? false,
      debugSpawnHostDisabled:
        data.serviceFlags?.debugSpawnHostDisabled ?? false,
    },
    notifications: {
      eventProcessingDisabled:
        data.serviceFlags?.eventProcessingDisabled ?? false,
      alertsDisabled: data.serviceFlags?.alertsDisabled ?? false,
      jiraNotificationsDisabled:
        data.serviceFlags?.jiraNotificationsDisabled ?? false,
      slackNotificationsDisabled:
        data.serviceFlags?.slackNotificationsDisabled ?? false,
      emailNotificationsDisabled:
        data.serviceFlags?.emailNotificationsDisabled ?? false,
      webhookNotificationsDisabled:
        data.serviceFlags?.webhookNotificationsDisabled ?? false,
      githubStatusAPIDisabled:
        data.serviceFlags?.githubStatusAPIDisabled ?? false,
    },

    features: {
      repotrackerDisabled: data.serviceFlags?.repotrackerDisabled ?? false,
      githubPRTestingDisabled:
        data.serviceFlags?.githubPRTestingDisabled ?? false,
      degradedModeDisabled: data.serviceFlags?.degradedModeDisabled ?? false,
      jwtTokenForCLIDisabled:
        data.serviceFlags?.jwtTokenForCLIDisabled ?? false,
      checkBlockedTasksDisabled:
        data.serviceFlags?.checkBlockedTasksDisabled ?? false,
      taskLoggingDisabled: data.serviceFlags?.taskLoggingDisabled ?? false,
      cliUpdatesDisabled: data.serviceFlags?.cliUpdatesDisabled ?? false,
      sleepScheduleDisabled: data.serviceFlags?.sleepScheduleDisabled ?? false,
      backgroundReauthDisabled:
        data.serviceFlags?.backgroundReauthDisabled ?? false,
      staticAPIKeysDisabled: data.serviceFlags?.staticAPIKeysDisabled ?? false,
      elasticIPsDisabled: data.serviceFlags?.elasticIPsDisabled ?? false,
      releaseModeDisabled: data.serviceFlags?.releaseModeDisabled ?? false,
      debugSpawnHostsDisabled:
        data.serviceFlags?.debugSpawnHostsDisabled ?? false,
    },

    batchJobs: {
      backgroundStatsDisabled:
        data.serviceFlags?.backgroundStatsDisabled ?? false,
      cacheStatsJobDisabled: data.serviceFlags?.cacheStatsJobDisabled ?? false,
      cacheStatsEndpointDisabled:
        data.serviceFlags?.cacheStatsEndpointDisabled ?? false,
    },
  },
})) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ featureFlags }) => {
  const { batchJobs, features, notifications, services } = featureFlags;

  return {
    serviceFlags: {
      ...services,
      ...notifications,
      ...features,
      ...batchJobs,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
