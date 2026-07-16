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
      dbName: "amboy-db-name",
      dbURL: "amboy-db-url",
      groupBackgroundCreateFrequencyMinutes: 1,
      groupDefaultWorkers: 1,
      groupPruneFrequencyMinutes: 1,
      groupTTLMinutes: 1,
      localStorage: 1,
      lockTimeoutMinutes: 1,
      name: "amboy",
      namedQueues: [
        {
          lockTimeoutSeconds: 1,
          name: "named.queue.1",
          numWorkers: 1,
          regexp: "",
          sampleSize: 1,
        },
      ],
      poolSizeLocal: 1,
      poolSizeRemote: 1,
      retry: {
        maxCapacity: 1,
        maxRetryAttempts: 1,
        maxRetryTimeSeconds: 1,
        numWorkers: 1,
        retryBackoffSeconds: 1,
        staleRetryingMonitorIntervalSeconds: 1,
      },
      sampleSize: 1,
      singleName: "single",
    },
    loggerConfig: {
      buffer: {
        count: 1,
        durationSeconds: 1,
        incomingBufferFactor: 1,
        useAsync: true,
      },
      defaultLevel: PriorityLevel.Emergency,
      logkeeperURL: "logkeeper-url",
      redactKeys: ["secret", "key"],
      thresholdLevel: PriorityLevel.Info,
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
    groupBackgroundCreateFrequencyMinutes: 1,
    groupDefaultWorkers: 1,
    groupPruneFrequencyMinutes: 1,
    groupTTLMinutes: 1,
    localStorage: 1,
    lockTimeoutMinutes: 1,
    name: "amboy",
    namedQueues: [
      {
        lockTimeoutSeconds: 1,
        name: "named.queue.1",
        numWorkers: 1,
        regexp: "",
        sampleSize: 1,
      },
    ],
    poolSizeLocal: 1,
    poolSizeRemote: 1,
    retry: {
      maxCapacity: 1,
      maxRetryAttempts: 1,
      maxRetryTimeSeconds: 1,
      numWorkers: 1,
      retryBackoffSeconds: 1,
      staleRetryingMonitorIntervalSeconds: 1,
    },
    sampleSize: 1,
    singleName: "single",
  },
  amboyDB: {
    database: "amboy-db-name",
    url: "amboy-db-url",
  },
  loggerConfig: {
    buffer: {
      count: 1,
      durationSeconds: 1,
      incomingBufferFactor: 1,
      useAsync: true,
    },
    defaultLevel: PriorityLevel.Emergency,
    logkeeperURL: "logkeeper-url",
    redactKeys: ["secret", "key"],
    thresholdLevel: PriorityLevel.Info,
  },
  notify: {
    bufferIntervalSeconds: 1,
    bufferTargetPerInterval: 1,
    ses: {
      senderAddress: "evg-sender",
    },
  },
  triggers: {
    generateTaskDistro: "archlinux-test",
  },
};
