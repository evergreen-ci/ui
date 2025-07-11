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

  const { hostInit, notify, podLifecycle, repotracker, scheduler, taskLimits } =
    data;

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
    maxParallelPodRequests,
    maxPodDefinitionCleanupRate,
    maxSecretCleanupRate,
  } = podLifecycle ?? {};

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
  } = scheduler ?? {};

  const {
    maxConcurrentRequests,
    maxRepoRevisionsToSearch,
    numNewRepoRevisionsToFetch,
  } = repotracker ?? {};

  return {
    runners: {
      notify: {
        sesEmail: notify?.ses?.senderAddress ?? "",
      },
      taskLimits: {
        maxTasksPerVersion: maxTasksPerVersion ?? 0,
        maxIncludesPerVersion: maxIncludesPerVersion ?? 0,
        maxHourlyPatchTasks: maxHourlyPatchTasks ?? 0,
        maxPendingGeneratedTasks: maxPendingGeneratedTasks ?? 0,
        maxGenerateTaskJSONSize: maxGenerateTaskJSONSize ?? 0,
        maxConcurrentLargeParserProjectTasks:
          maxConcurrentLargeParserProjectTasks ?? 0,
        maxDegradedModeConcurrentLargeParserProjectTasks:
          maxDegradedModeConcurrentLargeParserProjectTasks ?? 0,
        maxDegradedModeParserProjectSize: maxDegradedModeParserProjectSize ?? 0,
        maxParserProjectSize: maxParserProjectSize ?? 0,
        maxExecTimeoutSecs: maxExecTimeoutSecs ?? 0,
        maxTaskExecution: maxTaskExecution ?? 0,
        maxDailyAutomaticRestarts: maxDailyAutomaticRestarts ?? 0,
      },
      hostInit: {
        hostThrottle: hostThrottle ?? 0,
        provisioningThrottle: provisioningThrottle ?? 0,
        cloudStatusBatchSize: cloudStatusBatchSize ?? 0,
        maxTotalDynamicHosts: maxTotalDynamicHosts ?? 0,
      },
      podLifecycle: {
        maxParallelPodRequests: maxParallelPodRequests ?? 0,
        maxPodDefinitionCleanupRate: maxPodDefinitionCleanupRate ?? 0,
        maxSecretCleanupRate: maxSecretCleanupRate ?? 0,
      },
      scheduler: {
        taskFinder: taskFinder ?? FinderVersion.Legacy,
        hostAllocator: hostAllocator ?? HostAllocatorVersion.Utilization,
        hostAllocatorRoundingRule:
          hostAllocatorRoundingRule ?? RoundingRule.Down,
        hostAllocatorFeedbackRule:
          hostAllocatorFeedbackRule ?? FeedbackRule.NoFeedback,
        hostsOverallocatedRule:
          hostsOverallocatedRule ?? OverallocatedRule.Ignore,
        futureHostFraction: futureHostFraction ?? 0,
        cacheDurationSeconds: cacheDurationSeconds ?? 0,
        targetTimeSeconds: targetTimeSeconds ?? 0,
        acceptableHostIdleTimeSeconds: acceptableHostIdleTimeSeconds ?? 0,
        groupVersions: groupVersions ?? false,
        patchFactor: patchFactor ?? 0,
        patchTimeInQueueFactor: patchTimeInQueueFactor ?? 0,
        commitQueueFactor: commitQueueFactor ?? 0,
        mainlineTimeInQueueFactor: mainlineTimeInQueueFactor ?? 0,
        expectedRuntimeFactor: expectedRuntimeFactor ?? 0,
        generateTaskFactor: generateTaskFactor ?? 0,
        numDependentsFactor: numDependentsFactor ?? 0,
        stepbackTaskFactor: stepbackTaskFactor ?? 0,
      },
      repotracker: {
        numNewRepoRevisionsToFetch: numNewRepoRevisionsToFetch ?? 0,
        maxRepoRevisionsToSearch: maxRepoRevisionsToSearch ?? 0,
        maxConcurrentRequests: maxConcurrentRequests ?? 0,
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ runners }) => {
  const { hostInit, notify, podLifecycle, repotracker, scheduler, taskLimits } =
    runners;

  return {
    notify: {
      ses: {
        senderAddress: notify.sesEmail,
      },
    },
    taskLimits,
    hostInit,
    podLifecycle,
    scheduler,
    repotracker,
  };
}) satisfies FormToGqlFunction<Tab>;
