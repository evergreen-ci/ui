import { AdminSettingsGeneralSection } from "constants/routes";
import { PriorityLevel } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";

type Tab = AdminSettingsGeneralSection.BackgroundProcessing;

export const gqlToForm = ((data) => {
  const { amboy, amboyDB, loggerConfig, notify, triggers } = data;

  return {
    backgroundProcessing: {
      amboy: {
        name: amboy?.name ?? "",
        singleName: amboy?.singleName ?? "",
        poolSizeLocal: amboy?.poolSizeLocal ?? 0,
        poolSizeRemote: amboy?.poolSizeRemote ?? 0,
        localStorage: amboy?.localStorage ?? 0,
        groupDefaultWorkers: amboy?.groupDefaultWorkers ?? 0,
        groupBackgroundCreateFrequencyMinutes:
          amboy?.groupBackgroundCreateFrequencyMinutes ?? 0,
        groupPruneFrequencyMinutes: amboy?.groupPruneFrequencyMinutes ?? 0,
        groupTTLMinutes: amboy?.groupTTLMinutes ?? 0,
        lockTimeoutMinutes: amboy?.lockTimeoutMinutes ?? 0,
        sampleSize: amboy?.sampleSize ?? 0,
        retry: {
          numWorkers: amboy?.retry?.numWorkers ?? 0,
          maxCapacity: amboy?.retry?.maxCapacity ?? 0,
          maxRetryAttempts: amboy?.retry?.maxRetryAttempts ?? 0,
          maxRetryTimeSeconds: amboy?.retry?.maxRetryTimeSeconds ?? 0,
          retryBackoffSeconds: amboy?.retry?.retryBackoffSeconds ?? 0,
          staleRetryingMonitorIntervalSeconds:
            amboy?.retry?.staleRetryingMonitorIntervalSeconds ?? 0,
        },
        namedQueues:
          amboy?.namedQueues?.map((q) => ({
            name: q.name ?? "",
            regexp: q.regexp ?? "",
            numWorkers: q.numWorkers ?? 0,
            sampleSize: q.sampleSize ?? 0,
            lockTimeoutSeconds: q.lockTimeoutSeconds ?? 0,
          })) ?? [],
        dbURL: amboyDB?.url ?? "",
        dbName: amboyDB?.database ?? "",
      },
      loggerConfig: {
        buffer: {
          useAsync: loggerConfig?.buffer?.useAsync ?? false,
          durationSeconds: loggerConfig?.buffer?.durationSeconds ?? 0,
          count: loggerConfig?.buffer?.count ?? 0,
          incomingBufferFactor: loggerConfig?.buffer?.incomingBufferFactor ?? 0,
        },
        defaultLevel: loggerConfig?.defaultLevel ?? PriorityLevel.Info,
        thresholdLevel: loggerConfig?.thresholdLevel ?? PriorityLevel.Info,
        logkeeperURL: loggerConfig?.logkeeperURL ?? "",
        redactKeys: loggerConfig?.redactKeys ?? [],
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
