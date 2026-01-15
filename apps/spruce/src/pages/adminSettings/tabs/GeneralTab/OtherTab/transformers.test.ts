import { AdminSettings, AdminSettingsInput } from "gql/generated/types";
import { formToGql, gqlToForm } from "./transformers";
import { OtherFormState } from "./types";

describe("other tab transformers", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(mockAdminSettings)).toStrictEqual(expectedForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(expectedForm)).toStrictEqual(expectedGql);
  });

  describe("S3 cost transformations", () => {
    it("converts null s3Cost values from GQL to undefined in form", () => {
      const gqlWithNullS3Cost: AdminSettings = {
        ...mockAdminSettings,
        cost: {
          financeFormula: 0.5,
          savingsPlanDiscount: 0.1,
          onDemandDiscount: 0.05,
          s3Cost: {
            upload: {
              uploadCostDiscount: null,
            },
            storage: {
              standardStorageCostDiscount: null,
              infrequentAccessStorageCostDiscount: null,
            },
          },
        },
      };

      const result = gqlToForm(gqlWithNullS3Cost);
      expect(
        result!.other.miscSettings.cost.s3Cost.uploadCostDiscount,
      ).toBeUndefined();
      expect(
        result!.other.miscSettings.cost.s3Cost.standardStorageCostDiscount,
      ).toBeUndefined();
      expect(
        result!.other.miscSettings.cost.s3Cost
          .infrequentAccessStorageCostDiscount,
      ).toBeUndefined();
    });

    it("converts set s3Cost values from GQL to form", () => {
      const gqlWithS3Cost: AdminSettings = {
        ...mockAdminSettings,
        cost: {
          financeFormula: 0.5,
          savingsPlanDiscount: 0.1,
          onDemandDiscount: 0.05,
          s3Cost: {
            upload: {
              uploadCostDiscount: 0.15,
            },
            storage: {
              standardStorageCostDiscount: 0.25,
              infrequentAccessStorageCostDiscount: 0.35,
            },
          },
        },
      };

      const result = gqlToForm(gqlWithS3Cost);
      expect(result!.other.miscSettings.cost.s3Cost.uploadCostDiscount).toBe(
        0.15,
      );
      expect(
        result!.other.miscSettings.cost.s3Cost.standardStorageCostDiscount,
      ).toBe(0.25);
      expect(
        result!.other.miscSettings.cost.s3Cost
          .infrequentAccessStorageCostDiscount,
      ).toBe(0.35);
    });

    it("converts zero s3Cost values from GQL to form", () => {
      const gqlWithZeroS3Cost: AdminSettings = {
        ...mockAdminSettings,
        cost: {
          financeFormula: 0.5,
          savingsPlanDiscount: 0.1,
          onDemandDiscount: 0.05,
          s3Cost: {
            upload: {
              uploadCostDiscount: 0.0,
            },
            storage: {
              standardStorageCostDiscount: 0.0,
              infrequentAccessStorageCostDiscount: 0.0,
            },
          },
        },
      };

      const result = gqlToForm(gqlWithZeroS3Cost);
      expect(result!.other.miscSettings.cost.s3Cost.uploadCostDiscount).toBe(
        0.0,
      );
      expect(
        result!.other.miscSettings.cost.s3Cost.standardStorageCostDiscount,
      ).toBe(0.0);
      expect(
        result!.other.miscSettings.cost.s3Cost
          .infrequentAccessStorageCostDiscount,
      ).toBe(0.0);
    });

    it("does not send undefined s3Cost values from form to GQL", () => {
      const formWithUndefinedS3Cost: OtherFormState = {
        ...expectedForm,
        other: {
          ...expectedForm.other,
          miscSettings: {
            ...expectedForm.other.miscSettings,
            cost: {
              financeFormula: 0.5,
              savingsPlanDiscount: 0.1,
              onDemandDiscount: 0.05,
              s3Cost: {
                uploadCostDiscount: undefined,
                standardStorageCostDiscount: undefined,
                infrequentAccessStorageCostDiscount: undefined,
              },
            },
          },
        },
      };

      const result = formToGql(formWithUndefinedS3Cost);
      expect(result.cost?.s3Cost?.upload).toEqual({});
      expect(result.cost?.s3Cost?.storage).toEqual({});
    });

    it("sends set s3Cost values from form to GQL", () => {
      const formWithS3Cost: OtherFormState = {
        ...expectedForm,
        other: {
          ...expectedForm.other,
          miscSettings: {
            ...expectedForm.other.miscSettings,
            cost: {
              financeFormula: 0.5,
              savingsPlanDiscount: 0.1,
              onDemandDiscount: 0.05,
              s3Cost: {
                uploadCostDiscount: 0.15,
                standardStorageCostDiscount: 0.25,
                infrequentAccessStorageCostDiscount: 0.35,
              },
            },
          },
        },
      };

      const result = formToGql(formWithS3Cost);
      expect(result.cost?.s3Cost?.upload?.uploadCostDiscount).toBe(0.15);
      expect(result.cost?.s3Cost?.storage?.standardStorageCostDiscount).toBe(
        0.25,
      );
      expect(
        result.cost?.s3Cost?.storage?.infrequentAccessStorageCostDiscount,
      ).toBe(0.35);
    });

    it("sends zero s3Cost values from form to GQL", () => {
      const formWithZeroS3Cost: OtherFormState = {
        ...expectedForm,
        other: {
          ...expectedForm.other,
          miscSettings: {
            ...expectedForm.other.miscSettings,
            cost: {
              financeFormula: 0.5,
              savingsPlanDiscount: 0.1,
              onDemandDiscount: 0.05,
              s3Cost: {
                uploadCostDiscount: 0.0,
                standardStorageCostDiscount: 0.0,
                infrequentAccessStorageCostDiscount: 0.0,
              },
            },
          },
        },
      };

      const result = formToGql(formWithZeroS3Cost);
      expect(result.cost?.s3Cost?.upload?.uploadCostDiscount).toBe(0.0);
      expect(result.cost?.s3Cost?.storage?.standardStorageCostDiscount).toBe(
        0.0,
      );
      expect(
        result.cost?.s3Cost?.storage?.infrequentAccessStorageCostDiscount,
      ).toBe(0.0);
    });

    it("handles mixed s3Cost values (some set, some undefined)", () => {
      const formWithMixedS3Cost: OtherFormState = {
        ...expectedForm,
        other: {
          ...expectedForm.other,
          miscSettings: {
            ...expectedForm.other.miscSettings,
            cost: {
              financeFormula: 0.5,
              savingsPlanDiscount: 0.1,
              onDemandDiscount: 0.05,
              s3Cost: {
                uploadCostDiscount: 0.15,
                standardStorageCostDiscount: undefined,
                infrequentAccessStorageCostDiscount: 0.35,
              },
            },
          },
        },
      };

      const result = formToGql(formWithMixedS3Cost);
      expect(result.cost?.s3Cost?.upload?.uploadCostDiscount).toBe(0.15);
      expect(
        result.cost?.s3Cost?.storage?.standardStorageCostDiscount,
      ).toBeUndefined();
      expect(
        result.cost?.s3Cost?.storage?.infrequentAccessStorageCostDiscount,
      ).toBe(0.35);
    });
  });
});

const mockAdminSettings: AdminSettings = {
  disabledGQLQueries: [],
  configDir: "/etc/evergreen",
  domainName: "evergreen.example.com",
  githubOrgs: ["evergreen-ci", "mongodb"],
  githubPRCreatorOrg: "evergreen-ci",
  githubWebhookSecret: "webhook-secret",
  logPath: "/var/log/evergreen",
  oldestAllowedCLIVersion: "",
  pprofPort: "8080",
  shutdownWaitSeconds: 30,
  releaseMode: {
    distroMaxHostsFactor: 2,
    targetTimeSecondsOverride: 300,
    idleTimeSecondsOverride: 600,
  },
  cost: {
    financeFormula: 0.5,
    savingsPlanDiscount: 0.1,
    onDemandDiscount: 0.05,
  },
  singleTaskDistro: {
    projectTasksPairs: [
      {
        projectId: "test-project",
        allowedTasks: ["compile", "test"],
        allowedBVs: ["ubuntu", "windows"],
      },
    ],
  },
  buckets: {
    logBucket: {
      name: "evergreen-logs",
    },
    logBucketLongRetention: {
      name: "logBucketLongRetention",
    },
    longRetentionProjects: ["project1", "project2"],
    testResultsBucket: {
      name: "evergreen-test-results",
      testResultsPrefix: "results/",
      roleARN: "arn:aws:iam::123456789:role/TestRole",
      type: "s3",
    },
    credentials: {
      key: "cred-key",
      secret: "cred-secret",
    },
    logBucketFailedTasks: {
      name: "evergreen-failed-tasks",
    },
  },
  ssh: {
    taskHostKey: {
      name: "task-key",
      secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:task-key",
    },
    spawnHostKey: {
      name: "spawn-key",
      secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:spawn-key",
    },
  },
  kanopySSHKeyPath: "/etc/ssh/kanopy_key",
  expansions: {
    DATABASE_URL: "mongodb://localhost:27017",
    API_KEY: "secret-api-key",
  },
  hostJasper: {
    binaryName: "jasper",
    downloadFileName: "jasper.tar.gz",
    port: 2487,
    url: "https://jasper.example.com",
    version: "1.0.0",
  },
  jiraNotifications: {
    customFields: [
      {
        project: "EVG",
        fields: { priority: "high", team: "platform" },
        components: ["backend", "frontend"],
        labels: ["bug", "critical"],
      },
    ],
  },
  spawnhost: {
    unexpirableHostsPerUser: 2,
    unexpirableVolumesPerUser: 3,
    spawnHostsPerUser: 5,
  },
  sleepSchedule: {
    permanentlyExemptHosts: ["build-host-1", "build-host-2"],
  },
  tracer: {
    enabled: true,
    collectorEndpoint: "https://collector.example.com",
    collectorInternalEndpoint: "https://collector-internal.example.com",
    collectorAPIKey: "tracer-api-key",
  },
  projectCreation: {
    totalProjectLimit: 100,
    repoProjectLimit: 50,
    jiraProject: "EVG",
    repoExceptions: [
      {
        owner: "evergreen-ci",
        repo: "evergreen",
      },
    ],
  },
  githubCheckRun: {
    checkRunLimit: 10,
  },
};

const expectedForm: OtherFormState = {
  other: {
    miscSettings: {
      configDir: "/etc/evergreen",
      domainName: "evergreen.example.com",
      githubOrgs: ["evergreen-ci", "mongodb"],
      githubPRCreatorOrg: "evergreen-ci",
      githubWebhookSecret: "webhook-secret",
      logPath: "/var/log/evergreen",
      oldestAllowedCLIVersion: "",
      pprofPort: "8080",
      shutdownWaitSeconds: 30,
      releaseMode: {
        distroMaxHostsFactor: 2,
        targetTimeSecondsOverride: 300,
        idleTimeSecondsOverride: 600,
      },
      cost: {
        financeFormula: 0.5,
        savingsPlanDiscount: 0.1,
        onDemandDiscount: 0.05,
        s3Cost: {
          uploadCostDiscount: undefined,
          standardStorageCostDiscount: undefined,
          infrequentAccessStorageCostDiscount: undefined,
        },
      },
    },
    singleTaskDistro: {
      projectTasksPairs: [
        {
          projectId: "test-project",
          allowedTasks: ["compile", "test"],
          allowedBVs: ["ubuntu", "windows"],
        },
      ],
    },
    bucketConfig: {
      defaultLogBucket: "evergreen-logs",
      logBucketLongRetentionName: "logBucketLongRetention",
      longRetentionProjects: ["project1", "project2"],
      testResultsBucketName: "evergreen-test-results",
      testResultsBucketTestResultsPrefix: "results/",
      testResultsBucketRoleARN: "arn:aws:iam::123456789:role/TestRole",
      testResultsBucketType: "s3",
      credentialsKey: "cred-key",
      credentialsSecret: "cred-secret",
      failedTasksLogBucketName: "evergreen-failed-tasks",
    },
    sshPairs: {
      taskHostKey: {
        name: "task-key",
        secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:task-key",
      },
      spawnHostKey: {
        name: "spawn-key",
        secretARN:
          "arn:aws:secretsmanager:us-east-1:123456789:secret:spawn-key",
      },
      kanopySSHKeyPath: "/etc/ssh/kanopy_key",
    },
    expansions: {
      expansionValues: [
        {
          key: "DATABASE_URL",
          value: "mongodb://localhost:27017",
        },
        {
          key: "API_KEY",
          value: "secret-api-key",
        },
      ],
    },
    hostJasper: {
      binaryName: "jasper",
      downloadFileName: "jasper.tar.gz",
      port: 2487,
      url: "https://jasper.example.com",
      version: "1.0.0",
    },
    jiraNotificationsFields: {
      customFields: [
        {
          project: "EVG",
          fields: [
            { key: "priority", value: "high" },
            { key: "team", value: "platform" },
          ],
          components: ["backend", "frontend"],
          labels: ["bug", "critical"],
        },
      ],
    },
    spawnHost: {
      unexpirableHostsPerUser: 2,
      unexpirableVolumesPerUser: 3,
      spawnHostsPerUser: 5,
    },
    sleepSchedule: {
      permanentlyExemptHosts: ["build-host-1", "build-host-2"],
    },
    tracerConfiguration: {
      enabled: true,
      collectorEndpoint: "https://collector.example.com",
      collectorInternalEndpoint: "https://collector-internal.example.com",
      collectorAPIKey: "tracer-api-key",
    },
    projectCreationSettings: {
      totalProjectLimit: 100,
      repoProjectLimit: 50,
      jiraProject: "EVG",
      repoExceptions: [
        {
          owner: "evergreen-ci",
          repo: "evergreen",
        },
      ],
    },
    githubCheckRunConfigurations: {
      checkRunLimit: 10,
    },
  },
};

const expectedGql: AdminSettingsInput = {
  configDir: "/etc/evergreen",
  domainName: "evergreen.example.com",
  githubOrgs: ["evergreen-ci", "mongodb"],
  githubPRCreatorOrg: "evergreen-ci",
  githubWebhookSecret: "webhook-secret",
  logPath: "/var/log/evergreen",
  oldestAllowedCLIVersion: "",
  pprofPort: "8080",
  shutdownWaitSeconds: 30,
  releaseMode: {
    distroMaxHostsFactor: 2,
    targetTimeSecondsOverride: 300,
    idleTimeSecondsOverride: 600,
  },
  singleTaskDistro: {
    projectTasksPairs: [
      {
        projectID: "test-project",
        allowedTasks: ["compile", "test"],
        allowedBVs: ["ubuntu", "windows"],
      },
    ],
  },
  buckets: {
    logBucket: {
      name: "evergreen-logs",
    },
    logBucketLongRetention: {
      name: "logBucketLongRetention",
    },
    longRetentionProjects: ["project1", "project2"],
    testResultsBucket: {
      name: "evergreen-test-results",
      testResultsPrefix: "results/",
      roleARN: "arn:aws:iam::123456789:role/TestRole",
      type: "s3",
    },
    credentials: {
      key: "cred-key",
      secret: "cred-secret",
    },
    logBucketFailedTasks: {
      name: "evergreen-failed-tasks",
    },
  },
  ssh: {
    taskHostKey: {
      name: "task-key",
      secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:task-key",
    },
    spawnHostKey: {
      name: "spawn-key",
      secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:spawn-key",
    },
  },
  kanopySSHKeyPath: "/etc/ssh/kanopy_key",
  expansions: {
    DATABASE_URL: "mongodb://localhost:27017",
    API_KEY: "secret-api-key",
  },
  hostJasper: {
    binaryName: "jasper",
    downloadFileName: "jasper.tar.gz",
    port: 2487,
    url: "https://jasper.example.com",
    version: "1.0.0",
  },
  jiraNotifications: {
    customFields: [
      {
        project: "EVG",
        fields: { priority: "high", team: "platform" },
        components: ["backend", "frontend"],
        labels: ["bug", "critical"],
      },
    ],
  },
  cost: {
    financeFormula: 0.5,
    savingsPlanDiscount: 0.1,
    onDemandDiscount: 0.05,
    s3Cost: {
      upload: {},
      storage: {},
    },
  },
  spawnhost: {
    unexpirableHostsPerUser: 2,
    unexpirableVolumesPerUser: 3,
    spawnHostsPerUser: 5,
  },
  sleepSchedule: {
    permanentlyExemptHosts: ["build-host-1", "build-host-2"],
  },
  tracer: {
    enabled: true,
    collectorEndpoint: "https://collector.example.com",
    collectorInternalEndpoint: "https://collector-internal.example.com",
    collectorAPIKey: "tracer-api-key",
  },
  projectCreation: {
    totalProjectLimit: 100,
    repoProjectLimit: 50,
    jiraProject: "EVG",
    repoExceptions: [
      {
        owner: "evergreen-ci",
        repo: "evergreen",
      },
    ],
  },
  githubCheckRun: {
    checkRunLimit: 10,
  },
};
