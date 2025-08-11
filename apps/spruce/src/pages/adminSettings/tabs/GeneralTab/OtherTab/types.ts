export interface OtherFormState {
  other: {
    miscSettings: {
      configDir: string;
      domainName: string;
      githubOrgs: string[];
      githubPRCreatorOrg: string;
      githubWebhookSecret: string;
      logPath: string;
      perfMonitoringKanopyURL: string;
      perfMonitoringURL: string;
      pprofPort: string;
      shutdownWaitSeconds: number;
      releaseMode: {
        distroMaxHostsFactor: number;
        targetTimeSecondsOverride: number;
        idleTimeSecondsOverride: number;
      };
    };

    singleTaskHost: {
      projectTasksPairs: Array<{
        projectId: string;
        allowedTasks: string[];
        allowedBVs: string[];
      }>;
    };

    bucketConfig: {
      logBucket: {
        name: string;
        testResultsPrefix: string;
        roleARN: string;
      };
      testResultsBucket: {
        name: string;
        testResultsPrefix: string;
        roleARN: string;
      };
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
        fields: string;
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

    projectCrationSettings: {
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
