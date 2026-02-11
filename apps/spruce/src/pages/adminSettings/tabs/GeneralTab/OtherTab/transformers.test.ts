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
  debugSpawnHosts: {
    setupScript: "echo debug spawn hosts",
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
          uploadCostDiscount: 0,
          standardStorageCostDiscount: 0,
          iAStorageCostDiscount: 0,
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
    debugSpawnHostsConfig: {
      setupScript: "echo debug spawn hosts",
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
      upload: {
        uploadCostDiscount: undefined,
      },
      storage: {
        standardStorageCostDiscount: undefined,
        iAStorageCostDiscount: undefined,
      },
    },
  },
  spawnhost: {
    unexpirableHostsPerUser: 2,
    unexpirableVolumesPerUser: 3,
    spawnHostsPerUser: 5,
  },
  debugSpawnHosts: {
    setupScript: "echo debug spawn hosts",
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
