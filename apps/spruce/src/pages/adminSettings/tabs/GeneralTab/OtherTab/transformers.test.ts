import { AdminSettingsInput } from "gql/generated/types";
import { AdminSettingsData } from "pages/adminSettings/tabs/types";
import { formToGql, gqlToForm } from "./transformers";
import { OtherFormState } from "./types";

describe("other tab transformers", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(mockAdminSettings)).toStrictEqual(expectedForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(expectedForm)).toStrictEqual(expectedGql);
  });

  it("converts lifecycleLastSyncedAt values arriving as ISO strings", () => {
    const isoString = "2026-07-06T12:00:00.000Z";
    const adminSettingsWithSyncTime: AdminSettingsData = {
      ...mockAdminSettings,
      buckets: {
        ...mockAdminSettings.buckets,
        logBucket: {
          ...mockAdminSettings.buckets?.logBucket,
          lifecycleLastSyncedAt: isoString as unknown as Date,
        },
      },
    };

    const loaded = gqlToForm(adminSettingsWithSyncTime);
    expect(loaded?.other.bucketConfig.logBucketLifecycleLastSyncedAt).toBe(
      isoString,
    );
  });

  it("round-trips S3 storage account ID lists from admin settings", () => {
    const adminSettingsWithS3Lists: AdminSettingsData = {
      ...mockAdminSettings,
      cost: {
        ...mockAdminSettings.cost,
        s3Cost: {
          storage: {
            __typename: "S3StorageCostConfig",
            archiveStorageCostDiscount: 0,
            artifactAwsAccountsWithoutLifecycleRules: ["111"],
            defaultMaxArtifactExpirationDays: 1,
            devprodOwnedAwsAccountIds: ["222"],
            iAStorageCostDiscount: 0,
            standardStorageCostDiscount: 0,
          },
          upload: {
            __typename: "S3UploadCostConfig",
            uploadCostDiscount: 0,
          },
        },
      },
    };

    const loaded = gqlToForm(adminSettingsWithS3Lists);
    expect(loaded).not.toBeNull();
    expect(formToGql(loaded!)).toStrictEqual({
      ...expectedGql,
      cost: {
        ...expectedGql.cost,
        s3Cost: {
          ...expectedGql.cost?.s3Cost,
          storage: {
            ...expectedGql.cost?.s3Cost?.storage,
            artifactAwsAccountsWithoutLifecycleRules: ["111"],
            devprodOwnedAwsAccountIds: ["222"],
          },
        },
      },
    });
  });
});

const mockAdminSettings: AdminSettingsData = {
  buckets: {
    credentials: {
      key: "cred-key",
      secret: "cred-secret",
    },
    logBucket: {
      name: "evergreen-logs",
    },
    logBucketFailedTasks: {
      name: "evergreen-failed-tasks",
    },
    logBucketLongRetention: {
      name: "logBucketLongRetention",
    },
    longRetentionProjects: ["project1", "project2"],
    testResultsBucket: {
      name: "evergreen-test-results",
      roleARN: "arn:aws:iam::123456789:role/TestRole",
      testResultsPrefix: "results/",
      type: "s3",
    },
  },
  configDir: "/etc/evergreen",
  cost: {
    ebsCost: {
      ebsDiscount: 0.1,
    },
    financeFormula: 0.5,
    onDemandDiscount: 0.05,
    savingsPlanDiscount: 0.1,
  },
  debugSpawnHosts: {
    setupScript: "echo debug spawn hosts",
  },
  diagnostics: {
    s3BucketName: "diagnostics-bucket",
    s3Prefix: "diagnostics/",
  },
  disabledGQLQueries: [],
  domainName: "evergreen.example.com",
  expansions: {
    API_KEY: "secret-api-key",
    DATABASE_URL: "mongodb://localhost:27017",
  },
  githubCheckRun: {
    checkRunLimit: 10,
  },
  githubOrgs: ["evergreen-ci", "mongodb"],
  githubPRCreatorOrg: "evergreen-ci",
  githubWebhookSecret: "webhook-secret",
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
        components: ["backend", "frontend"],
        fields: { priority: "high", team: "platform" },
        labels: ["bug", "critical"],
        project: "EVG",
      },
    ],
  },
  logPath: "/var/log/evergreen",
  oktaServiceConfig: {
    audience: "https://example.okta.com",
    clientId: "okta-service-client-id",
    clientSecret: "okta-service-client-secret",
    issuer: "https://example.okta.com",
    scopes: ["scope1", "scope2"],
  },
  oldestAllowedCLIVersion: "",
  pprofPort: "8080",
  projectCreation: {
    repoExceptions: [
      {
        owner: "evergreen-ci",
        repo: "evergreen",
      },
    ],
    repoProjectLimit: 50,
    totalProjectLimit: 100,
  },
  releaseMode: {
    distroMaxHostsFactor: 2,
    idleTimeSecondsOverride: 600,
    targetTimeSecondsOverride: 300,
  },
  shutdownWaitSeconds: 30,
  singleTaskDistro: {
    projectTasksPairs: [
      {
        allowedBVs: ["ubuntu", "windows"],
        allowedTasks: ["compile", "test"],
        projectId: "test-project",
      },
    ],
  },
  sleepSchedule: {
    permanentlyExemptHosts: ["build-host-1", "build-host-2"],
  },
  spawnhost: {
    spawnHostsPerUser: 5,
    unexpirableHostsPerUser: 2,
    unexpirableVolumesPerUser: 3,
  },
  ssh: {
    spawnHostKey: {
      name: "spawn-key",
      secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:spawn-key",
    },
    taskHostKey: {
      name: "task-key",
      secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:task-key",
    },
  },
  tracer: {
    collectorAPIKey: "tracer-api-key",
    collectorEndpoint: "https://collector.example.com",
    collectorInternalEndpoint: "https://collector-internal.example.com",
    enabled: true,
    traceUrlTemplate: "https://apm.example.com/trace/%s",
  },
};

const expectedForm: OtherFormState = {
  other: {
    bucketConfig: {
      credentialsKey: "cred-key",
      credentialsSecret: "cred-secret",
      defaultLogBucket: "evergreen-logs",
      failedTasksLogBucketExpirationDays: 0,
      failedTasksLogBucketLifecycleLastSyncedAt: "",
      failedTasksLogBucketLifecycleSyncError: "",
      failedTasksLogBucketName: "evergreen-failed-tasks",
      failedTasksLogBucketTransitionToGlacierDays: 0,
      failedTasksLogBucketTransitionToIADays: 0,
      logBucketExpirationDays: 0,
      logBucketLifecycleLastSyncedAt: "",
      logBucketLifecycleSyncError: "",
      logBucketLongRetentionExpirationDays: 0,
      logBucketLongRetentionLifecycleLastSyncedAt: "",
      logBucketLongRetentionLifecycleSyncError: "",
      logBucketLongRetentionName: "logBucketLongRetention",
      logBucketLongRetentionTransitionToGlacierDays: 0,
      logBucketLongRetentionTransitionToIADays: 0,
      logBucketTransitionToGlacierDays: 0,
      logBucketTransitionToIADays: 0,
      longRetentionProjects: ["project1", "project2"],
      retryFailedLogMoveLookbackDays: 0,
      retryFailedLogMoveMaxJobsPerRun: 0,
      testResultsBucketName: "evergreen-test-results",
      testResultsBucketRoleARN: "arn:aws:iam::123456789:role/TestRole",
      testResultsBucketTestResultsPrefix: "results/",
      testResultsBucketType: "s3",
    },
    debugSpawnHostsConfig: {
      setupScript: "echo debug spawn hosts",
    },
    diagnosticsConfig: {
      s3BucketName: "diagnostics-bucket",
      s3Prefix: "diagnostics/",
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
    githubCheckRunConfigurations: {
      checkRunLimit: 10,
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
          components: ["backend", "frontend"],
          fields: [
            { key: "priority", value: "high" },
            { key: "team", value: "platform" },
          ],
          labels: ["bug", "critical"],
          project: "EVG",
        },
      ],
    },
    miscSettings: {
      configDir: "/etc/evergreen",
      cost: {
        ebsDiscount: 0.1,
        financeFormula: 0.5,
        hiddenCostProjects: [],
        onDemandDiscount: 0.05,
        s3Cost: {
          archiveStorageCostDiscount: 0,
          artifactAwsAccountsWithoutLifecycleRules: [],
          defaultMaxArtifactExpirationDays: 1,
          devprodOwnedAwsAccountIds: [],
          iAStorageCostDiscount: 0,
          standardStorageCostDiscount: 0,
          uploadCostDiscount: 0,
        },
        savingsPlanDiscount: 0.1,
      },
      domainName: "evergreen.example.com",
      githubOrgs: ["evergreen-ci", "mongodb"],
      githubPRCreatorOrg: "evergreen-ci",
      githubWebhookSecret: "webhook-secret",
      logPath: "/var/log/evergreen",
      oldestAllowedCLIVersion: "",
      pprofPort: "8080",
      releaseMode: {
        distroMaxHostsFactor: 2,
        idleTimeSecondsOverride: 600,
        targetTimeSecondsOverride: 300,
      },
      shutdownWaitSeconds: 30,
    },
    oktaServiceConfig: {
      audience: "https://example.okta.com",
      clientId: "okta-service-client-id",
      clientSecret: "okta-service-client-secret",
      issuer: "https://example.okta.com",
      scopes: ["scope1", "scope2"],
    },
    projectCreationSettings: {
      repoExceptions: [
        {
          owner: "evergreen-ci",
          repo: "evergreen",
        },
      ],
      repoProjectLimit: 50,
      totalProjectLimit: 100,
    },
    singleTaskDistro: {
      projectTasksPairs: [
        {
          allowedBVs: ["ubuntu", "windows"],
          allowedTasks: ["compile", "test"],
          projectId: "test-project",
        },
      ],
    },
    sleepSchedule: {
      permanentlyExemptHosts: ["build-host-1", "build-host-2"],
    },
    spawnHost: {
      spawnHostsPerUser: 5,
      unexpirableHostsPerUser: 2,
      unexpirableVolumesPerUser: 3,
    },
    sshPairs: {
      spawnHostKey: {
        name: "spawn-key",
        secretARN:
          "arn:aws:secretsmanager:us-east-1:123456789:secret:spawn-key",
      },
      taskHostKey: {
        name: "task-key",
        secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:task-key",
      },
    },
    tracerConfiguration: {
      collectorAPIKey: "tracer-api-key",
      collectorEndpoint: "https://collector.example.com",
      collectorInternalEndpoint: "https://collector-internal.example.com",
      enabled: true,
      traceUrlTemplate: "https://apm.example.com/trace/%s",
    },
  },
};

const expectedGql: AdminSettingsInput = {
  buckets: {
    credentials: {
      key: "cred-key",
      secret: "cred-secret",
    },
    logBucket: {
      name: "evergreen-logs",
    },
    logBucketFailedTasks: {
      name: "evergreen-failed-tasks",
    },
    logBucketLongRetention: {
      name: "logBucketLongRetention",
    },
    longRetentionProjects: ["project1", "project2"],
    retryFailedLogMoveLookbackDays: undefined,
    retryFailedLogMoveMaxJobsPerRun: undefined,
    testResultsBucket: {
      name: "evergreen-test-results",
      roleARN: "arn:aws:iam::123456789:role/TestRole",
      testResultsPrefix: "results/",
      type: "s3",
    },
  },
  configDir: "/etc/evergreen",
  cost: {
    ebsCost: {
      ebsDiscount: 0.1,
    },
    financeFormula: 0.5,
    hiddenCostProjects: [],
    onDemandDiscount: 0.05,
    s3Cost: {
      storage: {
        archiveStorageCostDiscount: 0,
        artifactAwsAccountsWithoutLifecycleRules: [],
        defaultMaxArtifactExpirationDays: 1,
        devprodOwnedAwsAccountIds: [],
        iAStorageCostDiscount: 0,
        standardStorageCostDiscount: 0,
      },
      upload: {
        uploadCostDiscount: 0,
      },
    },
    savingsPlanDiscount: 0.1,
  },
  debugSpawnHosts: {
    setupScript: "echo debug spawn hosts",
  },
  diagnostics: {
    s3BucketName: "diagnostics-bucket",
    s3Prefix: "diagnostics/",
  },
  domainName: "evergreen.example.com",
  expansions: {
    API_KEY: "secret-api-key",
    DATABASE_URL: "mongodb://localhost:27017",
  },
  githubCheckRun: {
    checkRunLimit: 10,
  },
  githubOrgs: ["evergreen-ci", "mongodb"],
  githubPRCreatorOrg: "evergreen-ci",
  githubWebhookSecret: "webhook-secret",
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
        components: ["backend", "frontend"],
        fields: { priority: "high", team: "platform" },
        labels: ["bug", "critical"],
        project: "EVG",
      },
    ],
  },
  logPath: "/var/log/evergreen",
  oktaServiceConfig: {
    audience: "https://example.okta.com",
    clientId: "okta-service-client-id",
    clientSecret: "okta-service-client-secret",
    issuer: "https://example.okta.com",
    scopes: ["scope1", "scope2"],
  },
  oldestAllowedCLIVersion: "",
  pprofPort: "8080",
  projectCreation: {
    repoExceptions: [
      {
        owner: "evergreen-ci",
        repo: "evergreen",
      },
    ],
    repoProjectLimit: 50,
    totalProjectLimit: 100,
  },
  releaseMode: {
    distroMaxHostsFactor: 2,
    idleTimeSecondsOverride: 600,
    targetTimeSecondsOverride: 300,
  },
  shutdownWaitSeconds: 30,
  singleTaskDistro: {
    projectTasksPairs: [
      {
        allowedBVs: ["ubuntu", "windows"],
        allowedTasks: ["compile", "test"],
        projectID: "test-project",
      },
    ],
  },
  sleepSchedule: {
    permanentlyExemptHosts: ["build-host-1", "build-host-2"],
  },
  spawnhost: {
    spawnHostsPerUser: 5,
    unexpirableHostsPerUser: 2,
    unexpirableVolumesPerUser: 3,
  },
  ssh: {
    spawnHostKey: {
      name: "spawn-key",
      secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:spawn-key",
    },
    taskHostKey: {
      name: "task-key",
      secretARN: "arn:aws:secretsmanager:us-east-1:123456789:secret:task-key",
    },
  },
  tracer: {
    collectorAPIKey: "tracer-api-key",
    collectorEndpoint: "https://collector.example.com",
    collectorInternalEndpoint: "https://collector-internal.example.com",
    enabled: true,
    traceUrlTemplate: "https://apm.example.com/trace/%s",
  },
};
