export interface FeatureFlagsFormState {
  featureFlags: {
    services: {
      taskDispatchDisabled: boolean;
      largeParserProjectsDisabled: boolean;
      hostInitDisabled: boolean;
      podInitDisabled: boolean;
      monitorDisabled: boolean;
      agentStartDisabled: boolean;
      schedulerDisabled: boolean;
      hostAllocatorDisabled: boolean;
      systemFailedTaskRestartDisabled: boolean;
      podAllocatorDisabled: boolean;
      unrecognizedPodCleanupDisabled: boolean;
      cloudCleanupDisabled: boolean;
    };

    notifications: {
      eventProcessingDisabled: boolean;
      alertsDisabled: boolean;
      jiraNotificationsDisabled: boolean;
      slackNotificationsDisabled: boolean;
      emailNotificationsDisabled: boolean;
      webhookNotificationsDisabled: boolean;
      githubStatusAPIDisabled: boolean;
    };

    features: {
      repotrackerDisabled: boolean;
      githubPRTestingDisabled: boolean;
      degradedModeDisabled: boolean;
      jwtTokenForCLIDisabled: boolean;
      checkBlockedTasksDisabled: boolean;
      taskLoggingDisabled: boolean;
      cliUpdatesDisabled: boolean;
      sleepScheduleDisabled: boolean;
    };

    batchJobs: {
      backgroundStatsDisabled: boolean;
      cacheStatsJobDisabled: boolean;
      cacheStatsEndpointDisabled: boolean;
      backgroundCleanupDisabled: boolean;
    };
  };
}
export type TabProps = {
  featureFlagsData: FeatureFlagsFormState;
};
