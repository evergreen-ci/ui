import { AdminSettingsGeneralSection } from "constants/routes";
import { PriorityLevel } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";

type Tab = AdminSettingsGeneralSection.BackgroundProcessing;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { amboy, amboyDB, loggerConfig, notify, triggers } = data;

  const {
    groupBackgroundCreateFrequencyMinutes,
    groupDefaultWorkers,
    groupPruneFrequencyMinutes,
    groupTTLMinutes,
    localStorage,
    lockTimeoutMinutes,
    name,
    namedQueues,
    poolSizeLocal,
    poolSizeRemote,
    retry,
    sampleSize,
    singleName,
  } = amboy ?? {};

  const { buffer, defaultLevel, logkeeperURL, redactKeys, thresholdLevel } =
    loggerConfig ?? {};

  return {
    backgroundProcessing: {
      amboy: {
        dbName: amboyDB?.database ?? "",
        dbURL: amboyDB?.url ?? "",
        groupBackgroundCreateFrequencyMinutes:
          groupBackgroundCreateFrequencyMinutes ?? 0,
        groupDefaultWorkers: groupDefaultWorkers ?? 0,
        groupPruneFrequencyMinutes: groupPruneFrequencyMinutes ?? 0,
        groupTTLMinutes: groupTTLMinutes ?? 0,
        localStorage: localStorage ?? 0,
        lockTimeoutMinutes: lockTimeoutMinutes ?? 0,
        name: name ?? "",
        namedQueues:
          namedQueues?.map((q) => ({
            lockTimeoutSeconds: q.lockTimeoutSeconds ?? 0,
            name: q.name ?? "",
            numWorkers: q.numWorkers ?? 0,
            regexp: q.regexp ?? "",
            sampleSize: q.sampleSize ?? 0,
          })) ?? [],
        poolSizeLocal: poolSizeLocal ?? 0,
        poolSizeRemote: poolSizeRemote ?? 0,
        retry: {
          maxCapacity: retry?.maxCapacity ?? 0,
          maxRetryAttempts: retry?.maxRetryAttempts ?? 0,
          maxRetryTimeSeconds: retry?.maxRetryTimeSeconds ?? 0,
          numWorkers: retry?.numWorkers ?? 0,
          retryBackoffSeconds: retry?.retryBackoffSeconds ?? 0,
          staleRetryingMonitorIntervalSeconds:
            retry?.staleRetryingMonitorIntervalSeconds ?? 0,
        },
        sampleSize: sampleSize ?? 0,
        singleName: singleName ?? "",
      },
      loggerConfig: {
        buffer: {
          count: buffer?.count ?? 0,
          durationSeconds: buffer?.durationSeconds ?? 0,
          incomingBufferFactor: buffer?.incomingBufferFactor ?? 0,
          useAsync: buffer?.useAsync ?? false,
        },
        defaultLevel: defaultLevel ?? PriorityLevel.Info,
        logkeeperURL: logkeeperURL ?? "",
        redactKeys: redactKeys ?? [],
        thresholdLevel: thresholdLevel ?? PriorityLevel.Info,
      },
      notificationRateLimits: {
        bufferIntervalSeconds: notify?.bufferIntervalSeconds ?? 0,
        bufferTargetPerInterval: notify?.bufferTargetPerInterval ?? 0,
      },
      triggers: {
        generateTaskDistro: triggers?.generateTaskDistro ?? "",
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ backgroundProcessing }, data) => {
  const { amboy, loggerConfig, notificationRateLimits, triggers } =
    backgroundProcessing;

  const { dbName, dbURL, ...amboyFields } = amboy;

  return {
    amboy: amboyFields,
    amboyDB: {
      database: dbName,
      url: dbURL,
    },
    loggerConfig,
    notify: {
      ses: {
        senderAddress: data?.notify?.ses?.senderAddress ?? "",
      },
      ...notificationRateLimits,
    },
    triggers,
  };
}) satisfies FormToGqlFunction<Tab>;
