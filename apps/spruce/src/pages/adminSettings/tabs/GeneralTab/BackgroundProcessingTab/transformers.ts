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
        name: name ?? "",
        singleName: singleName ?? "",
        poolSizeLocal: poolSizeLocal ?? 0,
        poolSizeRemote: poolSizeRemote ?? 0,
        localStorage: localStorage ?? 0,
        groupDefaultWorkers: groupDefaultWorkers ?? 0,
        groupBackgroundCreateFrequencyMinutes:
          groupBackgroundCreateFrequencyMinutes ?? 0,
        groupPruneFrequencyMinutes: groupPruneFrequencyMinutes ?? 0,
        groupTTLMinutes: groupTTLMinutes ?? 0,
        lockTimeoutMinutes: lockTimeoutMinutes ?? 0,
        sampleSize: sampleSize ?? 0,
        retry: {
          numWorkers: retry?.numWorkers ?? 0,
          maxCapacity: retry?.maxCapacity ?? 0,
          maxRetryAttempts: retry?.maxRetryAttempts ?? 0,
          maxRetryTimeSeconds: retry?.maxRetryTimeSeconds ?? 0,
          retryBackoffSeconds: retry?.retryBackoffSeconds ?? 0,
          staleRetryingMonitorIntervalSeconds:
            retry?.staleRetryingMonitorIntervalSeconds ?? 0,
        },
        namedQueues: namedQueues
          ? namedQueues.map((q) => ({
              name: q.name ?? "",
              regexp: q.regexp ?? "",
              numWorkers: q.numWorkers ?? 0,
              sampleSize: q.sampleSize ?? 0,
              lockTimeoutSeconds: q.lockTimeoutSeconds ?? 0,
            }))
          : [],
        dbURL: amboyDB?.url ?? "",
        dbName: amboyDB?.database ?? "",
      },
      loggerConfig: {
        buffer: {
          useAsync: buffer?.useAsync ?? false,
          durationSeconds: buffer?.durationSeconds ?? 0,
          count: buffer?.count ?? 0,
          incomingBufferFactor: buffer?.incomingBufferFactor ?? 0,
        },
        defaultLevel: defaultLevel ?? PriorityLevel.Info,
        thresholdLevel: thresholdLevel ?? PriorityLevel.Info,
        logkeeperURL: logkeeperURL ?? "",
        redactKeys: redactKeys ?? [],
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
    notify: {
      ses: {
        senderAddress: data?.notify?.ses?.senderAddress ?? "",
      },
      ...notificationRateLimits,
    },
    triggers,
    loggerConfig,
  };
}) satisfies FormToGqlFunction<Tab>;
