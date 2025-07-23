import { PriorityLevel } from "gql/generated/types";

export interface BackgroundProcessingFormState {
  backgroundProcessing: {
    amboy: {
      name: string;
      singleName: string;
      poolSizeLocal: number;
      poolSizeRemote: number;
      localStorage: number;
      groupDefaultWorkers: number;
      groupBackgroundCreateFrequencyMinutes: number;
      groupPruneFrequencyMinutes: number;
      groupTTLMinutes: number;
      lockTimeoutMinutes: number;
      sampleSize: number;
      retry: {
        numWorkers: number;
        maxCapacity: number;
        maxRetryAttempts: number;
        maxRetryTimeSeconds: number;
        retryBackoffSeconds: number;
        staleRetryingMonitorIntervalSeconds: number;
      };
      namedQueues: {
        name: string;
        regexp: string;
        numWorkers: number;
        sampleSize: number;
        lockTimeoutSeconds: number;
      }[];
      dbURL: string;
      dbName: string;
    };
    loggerConfig: {
      buffer: {
        useAsync: boolean;
        durationSeconds: number;
        count: number;
        incomingBufferFactor: number;
      };
      defaultLevel: PriorityLevel;
      thresholdLevel: PriorityLevel;
      logkeeperURL: string;
      redactKeys: string[];
    };
    notificationRateLimits: {
      bufferIntervalSeconds: number;
      bufferTargetPerInterval: number;
    };
    triggers: {
      generateTaskDistro: string;
    };
  };
}

export type TabProps = {
  backgroundProcessingData: BackgroundProcessingFormState;
};
