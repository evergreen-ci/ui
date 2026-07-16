import { AdminSettingsGeneralSection } from "constants/routes";
import {
  FeedbackRule,
  FinderVersion,
  HostAllocatorVersion,
  OverallocatedRule,
  RoundingRule,
} from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";

type Tab = AdminSettingsGeneralSection.Runners;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { hostInit, notify, repotracker, scheduler, taskLimits } = data;

  const {
    maxConcurrentLargeParserProjectTasks,
    maxDailyAutomaticRestarts,
    maxDegradedModeConcurrentLargeParserProjectTasks,
    maxDegradedModeParserProjectSize,
    maxExecTimeoutSecs,
    maxGenerateTaskJSONSize,
    maxHourlyPatchTasks,
    maxIncludesPerVersion,
    maxParserProjectSize,
    maxPendingGeneratedTasks,
    maxScheduledTasksPerDistro,
    maxTaskExecution,
    maxTasksPerVersion,
  } = taskLimits ?? {};

  const {
    cloudStatusBatchSize,
    hostThrottle,
    maxTotalDynamicHosts,
    provisioningThrottle,
  } = hostInit ?? {};

  const {
    acceptableHostIdleTimeSeconds,
    cacheDurationSeconds,
    commitQueueFactor,
    expectedRuntimeFactor,
    futureHostFraction,
    generateTaskFactor,
    groupVersions,
    hostAllocator,
    hostAllocatorFeedbackRule,
    hostAllocatorRoundingRule,
    hostsOverallocatedRule,
    mainlineTimeInQueueFactor,
    numDependentsFactor,
    patchFactor,
    patchTimeInQueueFactor,
    stepbackTaskFactor,
    targetTimeSeconds,
    taskFinder,
    translateProjectCacheBytesLimit,
    translateProjectCacheTTLSeconds,
    translateProjectConcurrencyLimit,
  } = scheduler ?? {};

  const {
    maxConcurrentRequests,
    maxRepoRevisionsToSearch,
    numNewRepoRevisionsToFetch,
  } = repotracker ?? {};

  return {
    runners: {
      hostInit: {
        cloudStatusBatchSize: cloudStatusBatchSize ?? 0,
        hostThrottle: hostThrottle ?? 0,
        maxTotalDynamicHosts: maxTotalDynamicHosts ?? 0,
        provisioningThrottle: provisioningThrottle ?? 0,
      },
      notify: {
        sesEmail: notify?.ses?.senderAddress ?? "",
      },
      repotracker: {
        maxConcurrentRequests: maxConcurrentRequests ?? 0,
        maxRepoRevisionsToSearch: maxRepoRevisionsToSearch ?? 0,
        numNewRepoRevisionsToFetch: numNewRepoRevisionsToFetch ?? 0,
      },
      scheduler: {
        acceptableHostIdleTimeSeconds: acceptableHostIdleTimeSeconds ?? 0,
        cacheDurationSeconds: cacheDurationSeconds ?? 0,
        commitQueueFactor: commitQueueFactor ?? 0,
        expectedRuntimeFactor: expectedRuntimeFactor ?? 0,
        futureHostFraction: futureHostFraction ?? 0,
        generateTaskFactor: generateTaskFactor ?? 0,
        groupVersions: groupVersions ?? false,
        hostAllocator: hostAllocator ?? HostAllocatorVersion.Utilization,
        hostAllocatorFeedbackRule:
          hostAllocatorFeedbackRule ?? FeedbackRule.NoFeedback,
        hostAllocatorRoundingRule:
          hostAllocatorRoundingRule ?? RoundingRule.Down,
        hostsOverallocatedRule:
          hostsOverallocatedRule ?? OverallocatedRule.Ignore,
        mainlineTimeInQueueFactor: mainlineTimeInQueueFactor ?? 0,
        numDependentsFactor: numDependentsFactor ?? 0,
        patchFactor: patchFactor ?? 0,
        patchTimeInQueueFactor: patchTimeInQueueFactor ?? 0,
        stepbackTaskFactor: stepbackTaskFactor ?? 0,
        targetTimeSeconds: targetTimeSeconds ?? 0,
        taskFinder: taskFinder ?? FinderVersion.Legacy,
        translateProjectCacheBytesLimit: translateProjectCacheBytesLimit ?? 0,
        translateProjectCacheTTLSeconds: translateProjectCacheTTLSeconds ?? 0,
        translateProjectConcurrencyLimit: translateProjectConcurrencyLimit ?? 0,
      },
      taskLimits: {
        maxConcurrentLargeParserProjectTasks:
          maxConcurrentLargeParserProjectTasks ?? 0,
        maxDailyAutomaticRestarts: maxDailyAutomaticRestarts ?? 0,
        maxDegradedModeConcurrentLargeParserProjectTasks:
          maxDegradedModeConcurrentLargeParserProjectTasks ?? 0,
        maxDegradedModeParserProjectSize: maxDegradedModeParserProjectSize ?? 0,
        maxExecTimeoutSecs: maxExecTimeoutSecs ?? 0,
        maxGenerateTaskJSONSize: maxGenerateTaskJSONSize ?? 0,
        maxHourlyPatchTasks: maxHourlyPatchTasks ?? 0,
        maxIncludesPerVersion: maxIncludesPerVersion ?? 0,
        maxParserProjectSize: maxParserProjectSize ?? 0,
        maxPendingGeneratedTasks: maxPendingGeneratedTasks ?? 0,
        maxScheduledTasksPerDistro: maxScheduledTasksPerDistro ?? 0,
        maxTaskExecution: maxTaskExecution ?? 0,
        maxTasksPerVersion: maxTasksPerVersion ?? 0,
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ runners }, data) => {
  const { hostInit, notify, repotracker, scheduler, taskLimits } = runners;

  return {
    hostInit,
    notify: {
      bufferIntervalSeconds: data?.notify?.bufferIntervalSeconds,
      bufferTargetPerInterval: data?.notify?.bufferTargetPerInterval,
      ses: {
        senderAddress: notify.sesEmail,
      },
    },
    repotracker,
    scheduler,
    taskLimits,
  };
}) satisfies FormToGqlFunction<Tab>;
