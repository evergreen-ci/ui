import { AdminSettingsInput, PriorityLevel } from "gql/generated/types";
import { adminSettings } from "../../testData";
import { formToGql, gqlToForm } from "./transformers";
import { BackgroundProcessingFormState } from "./types";

describe("background processing section", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(adminSettings)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form, adminSettings)).toStrictEqual(gql);
  });
});

const form: BackgroundProcessingFormState = {
  backgroundProcessing: {
    amboy: {
      name: "amboy",
      singleName: "single",
      poolSizeLocal: 1,
      poolSizeRemote: 1,
      localStorage: 1,
      groupDefaultWorkers: 1,
      groupBackgroundCreateFrequencyMinutes: 1,
      groupPruneFrequencyMinutes: 1,
      groupTTLMinutes: 1,
      lockTimeoutMinutes: 1,
      sampleSize: 1,
      retry: {
        numWorkers: 1,
        maxCapacity: 1,
        maxRetryAttempts: 1,
        maxRetryTimeSeconds: 1,
        retryBackoffSeconds: 1,
        staleRetryingMonitorIntervalSeconds: 1,
      },
      namedQueues: [
        {
          name: "named.queue.1",
          regexp: "",
          numWorkers: 1,
          sampleSize: 1,
          lockTimeoutSeconds: 1,
        },
      ],
      dbURL: "amboy-db-url",
      dbName: "amboy-db-name",
    },
    loggerConfig: {
      buffer: {
        useAsync: true,
        durationSeconds: 1,
        count: 1,
        incomingBufferFactor: 1,
      },
      defaultLevel: PriorityLevel.Emergency,
      thresholdLevel: PriorityLevel.Info,
      logkeeperURL: "logkeeper-url",
      redactKeys: ["secret", "key"],
    },
    notificationRateLimits: {
      bufferIntervalSeconds: 1,
      bufferTargetPerInterval: 1,
    },
    triggers: {
      generateTaskDistro: "archlinux-test",
    },
  },
};

const gql: AdminSettingsInput = {
  amboy: {
    name: "amboy",
    singleName: "single",
    poolSizeLocal: 1,
    poolSizeRemote: 1,
    localStorage: 1,
    groupDefaultWorkers: 1,
    groupBackgroundCreateFrequencyMinutes: 1,
    groupPruneFrequencyMinutes: 1,
    groupTTLMinutes: 1,
    lockTimeoutMinutes: 1,
    sampleSize: 1,
    retry: {
      numWorkers: 1,
      maxCapacity: 1,
      maxRetryAttempts: 1,
      maxRetryTimeSeconds: 1,
      retryBackoffSeconds: 1,
      staleRetryingMonitorIntervalSeconds: 1,
    },
    namedQueues: [
      {
        name: "named.queue.1",
        regexp: "",
        numWorkers: 1,
        sampleSize: 1,
        lockTimeoutSeconds: 1,
      },
    ],
  },
  amboyDB: {
    url: "amboy-db-url",
    database: "amboy-db-name",
  },
  notify: {
    ses: {
      senderAddress: "evg-sender",
    },
    bufferIntervalSeconds: 1,
    bufferTargetPerInterval: 1,
  },
  loggerConfig: {
    buffer: {
      useAsync: true,
      durationSeconds: 1,
      count: 1,
      incomingBufferFactor: 1,
    },
    defaultLevel: PriorityLevel.Emergency,
    thresholdLevel: PriorityLevel.Info,
    logkeeperURL: "logkeeper-url",
    redactKeys: ["secret", "key"],
  },
  triggers: {
    generateTaskDistro: "archlinux-test",
  },
};
