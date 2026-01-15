export interface OtherFormState {
  other: {
    miscSettings: {
      configDir: string;
      domainName: string;
      githubOrgs: string[];
      githubPRCreatorOrg: string;
      githubWebhookSecret: string;
      logPath: string;
      oldestAllowedCLIVersion: string;
      pprofPort: string;
      shutdownWaitSeconds: number;
      releaseMode: {
        distroMaxHostsFactor: number;
        targetTimeSecondsOverride: number;
        idleTimeSecondsOverride: number;
      };
      cost: {
        financeFormula: number;
        savingsPlanDiscount: number;
        onDemandDiscount: number;
        s3Cost: {
          uploadCostDiscount?: number;
          standardStorageCostDiscount?: number;
          infrequentAccessStorageCostDiscount?: number;
        };
      };
    };

    singleTaskDistro: {
      projectTasksPairs: Array<{
        projectId: string;
        allowedTasks: string[];
        allowedBVs: string[];
      }>;
    };

    bucketConfig: {
      defaultLogBucket: string;
      logBucketLongRetentionName: string;
      longRetentionProjects: string[];
      testResultsBucketName: string;
      testResultsBucketTestResultsPrefix: string;
      testResultsBucketRoleARN: string;
      testResultsBucketType: string;
      credentialsKey: string;
      credentialsSecret: string;
      failedTasksLogBucketName: string;
    };

    sshPairs: {
      taskHostKey: {
        name: string;
        secretARN: string;
      };
      spawnHostKey: {
        name: string;
        secretARN: string;
      };
      kanopySSHKeyPath: string;
    };

    expansions: {
      expansionValues: Array<{
        key: string;
        value: string;
      }>;
    };

    hostJasper: {
      binaryName: string;
      downloadFileName: string;
      port: number;
      url: string;
      version: string;
    };

    jiraNotificationsFields: {
      customFields: Array<{
        project: string;
        fields: Array<{
          key: string;
          value: string;
        }>;
        components: string[];
        labels: string[];
      }>;
    };

    spawnHost: {
      unexpirableHostsPerUser: number;
      unexpirableVolumesPerUser: number;
      spawnHostsPerUser: number;
    };

    sleepSchedule: {
      permanentlyExemptHosts: string[];
    };

    tracerConfiguration: {
      enabled: boolean;
      collectorEndpoint: string;
      collectorInternalEndpoint: string;
      collectorAPIKey: string;
    };

    projectCreationSettings: {
      totalProjectLimit: number;
      repoProjectLimit: number;
      jiraProject: string;
      repoExceptions: Array<{
        owner: string;
        repo: string;
      }>;
    };

    githubCheckRunConfigurations: {
      checkRunLimit: number;
    };
  };
}

export type TabProps = {
  otherData: OtherFormState;
};
