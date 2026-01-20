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
      taskReliabilityDisabled: boolean;
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
      releaseModeDisabled: boolean;
      elasticIPsDisabled: boolean;
      staticAPIKeysDisabled: boolean;
      backgroundReauthDisabled: boolean;
      debugSpawnHostDisabled: boolean;
      useGitForGitHubFilesDisabled: boolean;
    };

    batchJobs: {
      backgroundStatsDisabled: boolean;
      cacheStatsJobDisabled: boolean;
      cacheStatsEndpointDisabled: boolean;
    };
  };
}
export type TabProps = {
  featureFlagsData: FeatureFlagsFormState;
};
