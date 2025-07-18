import {
  AdminSettings,
  BannerTheme,
  FeedbackRule,
  FinderVersion,
  HostAllocatorVersion,
  OverallocatedRule,
  RoundingRule,
} from "gql/generated/types";

export const adminSettings: AdminSettings = {
  banner: "Hello",
  bannerTheme: BannerTheme.Information,
  disabledGQLQueries: [],
  hostInit: {
    cloudStatusBatchSize: 1,
    hostThrottle: 1,
    maxTotalDynamicHosts: 1,
    provisioningThrottle: 1,
  },
  notify: {
    ses: {
      senderAddress: "evg-sender",
    },
  },
  podLifecycle: {
    maxParallelPodRequests: 1,
    maxPodDefinitionCleanupRate: 1,
    maxSecretCleanupRate: 1,
  },
  repotracker: {
    maxConcurrentRequests: 1,
    maxRepoRevisionsToSearch: 1,
    numNewRepoRevisionsToFetch: 1,
  },
  scheduler: {
    acceptableHostIdleTimeSeconds: 1,
    cacheDurationSeconds: 1,
    commitQueueFactor: 1,
    expectedRuntimeFactor: 1,
    futureHostFraction: 1,
    generateTaskFactor: 1,
    groupVersions: false,
    hostAllocator: HostAllocatorVersion.Utilization,
    hostAllocatorFeedbackRule: FeedbackRule.NoFeedback,
    hostAllocatorRoundingRule: RoundingRule.Up,
    hostsOverallocatedRule: OverallocatedRule.Ignore,
    mainlineTimeInQueueFactor: 1,
    numDependentsFactor: 1,
    patchFactor: 1,
    patchTimeInQueueFactor: 1,
    stepbackTaskFactor: 1,
    targetTimeSeconds: 1,
    taskFinder: FinderVersion.Parallel,
  },
  serviceFlags: {
    adminParameterStoreDisabled: true,
    agentStartDisabled: true,
    alertsDisabled: true,
    backgroundReauthDisabled: true,
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
  taskLimits: {
    maxConcurrentLargeParserProjectTasks: 1,
    maxDailyAutomaticRestarts: 1,
    maxDegradedModeConcurrentLargeParserProjectTasks: 1,
    maxDegradedModeParserProjectSize: 1,
    maxExecTimeoutSecs: 1,
    maxGenerateTaskJSONSize: 1,
    maxHourlyPatchTasks: 1,
    maxIncludesPerVersion: 1,
    maxParserProjectSize: 1,
    maxPendingGeneratedTasks: 1,
    maxTaskExecution: 1,
    maxTasksPerVersion: 1,
  },
};
