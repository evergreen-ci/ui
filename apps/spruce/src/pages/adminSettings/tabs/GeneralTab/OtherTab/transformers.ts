import { AdminSettingsGeneralSection } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";
import { OtherFormState } from "./types";

type Tab = AdminSettingsGeneralSection.Other;

const convertExpansionsToGql = (
  expansionValues: Array<{ key: string; value: string }>,
) => {
  if (!Array.isArray(expansionValues) || expansionValues.length === 0) {
    return undefined;
  }

  const expansionsObj: { [key: string]: string } = {};
  expansionValues.forEach((item) => {
    if (item?.key && item?.value) {
      expansionsObj[item.key.trim()] = item.value.trim();
    }
  });

  return Object.keys(expansionsObj).length > 0 ? expansionsObj : undefined;
};

export const gqlToForm = ((data) => {
  if (!data) return null;
  const {
    buckets,
    configDir,
    domainName,
    expansions,
    githubCheckRun,
    githubOrgs,
    githubPRCreatorOrg,
    githubWebhookSecret,
    hostJasper,
    jiraNotifications,
    logPath,
    perfMonitoringKanopyURL,
    perfMonitoringURL,
    pprofPort,
    projectCreation,
    releaseMode,
    shutdownWaitSeconds,
    singleTaskDistro,
    sleepSchedule,
    spawnhost,
    ssh,
    tracer,
  } = data;

  return {
    other: {
      miscSettings: {
        configDir: configDir ?? "",
        domainName: domainName ?? "",
        githubOrgs: githubOrgs ?? [],
        githubPRCreatorOrg: githubPRCreatorOrg ?? "",
        githubWebhookSecret: githubWebhookSecret ?? "",
        logPath: logPath ?? "",
        perfMonitoringKanopyURL: perfMonitoringKanopyURL ?? "",
        perfMonitoringURL: perfMonitoringURL ?? "",
        pprofPort: pprofPort ?? "",
        shutdownWaitSeconds: shutdownWaitSeconds ?? 0,
        releaseMode: {
          distroMaxHostsFactor: releaseMode?.distroMaxHostsFactor ?? 0,
          targetTimeSecondsOverride:
            releaseMode?.targetTimeSecondsOverride ?? 0,
          idleTimeSecondsOverride: releaseMode?.idleTimeSecondsOverride ?? 0,
        },
      },

      singleTaskDistro: {
        projectTasksPairs:
          singleTaskDistro?.projectTasksPairs?.map((pair) => ({
            projectId: pair.projectId ?? "",
            allowedTasks: pair.allowedTasks ?? [],
            allowedBVs: pair.allowedBVs ?? [],
          })) ?? [],
      },

      bucketConfig: {
        logBucket: {
          defaultLogBucket: buckets?.logBucket?.name ?? "",
          logBucketLongRetentionName:
            buckets?.logBucketLongRetention?.name ?? "",
          longRetentionProjects: buckets?.longRetentionProjects ?? [],
          testResultsBucketName: buckets?.testResultsBucket?.name ?? "",
          testResultsBucketTestResultsPrefix:
            buckets?.testResultsBucket?.testResultsPrefix ?? "",
          testResultsBucketRoleARN: buckets?.testResultsBucket?.roleARN ?? "",
          credentialsKey: buckets?.credentials?.key ?? "",
          credentialsSecret: buckets?.credentials?.secret ?? "",
        },
      },

      sshPairs: {
        taskHostKey: {
          name: ssh?.taskHostKey?.name ?? "",
          secretARN: ssh?.taskHostKey?.secretARN ?? "",
        },
        spawnHostKey: {
          name: ssh?.spawnHostKey?.name ?? "",
          secretARN: ssh?.spawnHostKey?.secretARN ?? "",
        },
        kanopySSHKeyPath: data.kanopySSHKeyPath ?? "",
      },

      expansions: {
        expansionValues: expansions
          ? Object.entries(expansions).map(([key, value]) => ({
              key,
              value,
            }))
          : [],
      },

      hostJasper: {
        binaryName: hostJasper?.binaryName ?? "",
        downloadFileName: hostJasper?.downloadFileName ?? "",
        port: hostJasper?.port ?? 0,
        url: hostJasper?.url ?? "",
        version: hostJasper?.version ?? "",
      },

      jiraNotificationsFields: {
        customFields:
          jiraNotifications?.customFields?.map((field) => {
            const fieldsObject =
              field?.fields && typeof field.fields === "object"
                ? field.fields
                : {};
            const fieldsArray = Object.entries(fieldsObject).map(
              ([key, value]) => ({
                key: key || "",
                value: String(value || ""),
              }),
            );

            return {
              project: field?.project ?? "",
              fields: fieldsArray,
              components: Array.isArray(field?.components)
                ? field.components
                : [],
              labels: Array.isArray(field?.labels) ? field.labels : [],
            };
          }) ?? [],
      },

      spawnHost: {
        unexpirableHostsPerUser: spawnhost?.unexpirableHostsPerUser ?? 0,
        unexpirableVolumesPerUser: spawnhost?.unexpirableVolumesPerUser ?? 0,
        spawnHostsPerUser: spawnhost?.spawnHostsPerUser ?? 0,
      },

      sleepSchedule: {
        permanentlyExemptHosts: sleepSchedule?.permanentlyExemptHosts ?? [],
      },

      tracerConfiguration: {
        enabled: tracer?.enabled ?? false,
        collectorEndpoint: tracer?.collectorEndpoint ?? "",
        collectorInternalEndpoint: tracer?.collectorInternalEndpoint ?? "",
        collectorAPIKey: tracer?.collectorAPIKey ?? "",
      },

      projectCreationSettings: {
        totalProjectLimit: projectCreation?.totalProjectLimit ?? 0,
        repoProjectLimit: projectCreation?.repoProjectLimit ?? 0,
        jiraProject: projectCreation?.jiraProject ?? "",
        repoExceptions:
          projectCreation?.repoExceptions?.map((exception) => ({
            owner: exception.owner ?? "",
            repo: exception.repo ?? "",
          })) ?? [],
      },

      githubCheckRunConfigurations: {
        checkRunLimit: githubCheckRun?.checkRunLimit ?? 0,
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((form: OtherFormState) => {
  const { other } = form;

  return {
    configDir: other.miscSettings.configDir || undefined,
    domainName: other.miscSettings.domainName || undefined,
    githubOrgs:
      other.miscSettings.githubOrgs.length > 0
        ? other.miscSettings.githubOrgs
        : undefined,
    githubPRCreatorOrg: other.miscSettings.githubPRCreatorOrg || undefined,
    githubWebhookSecret: other.miscSettings.githubWebhookSecret || undefined,
    logPath: other.miscSettings.logPath || undefined,
    perfMonitoringKanopyURL:
      other.miscSettings.perfMonitoringKanopyURL || undefined,
    perfMonitoringURL: other.miscSettings.perfMonitoringURL || undefined,
    pprofPort: other.miscSettings.pprofPort || undefined,
    shutdownWaitSeconds: other.miscSettings.shutdownWaitSeconds || undefined,

    releaseMode: {
      distroMaxHostsFactor:
        other.miscSettings.releaseMode.distroMaxHostsFactor || undefined,
      targetTimeSecondsOverride:
        other.miscSettings.releaseMode.targetTimeSecondsOverride || undefined,
      idleTimeSecondsOverride:
        other.miscSettings.releaseMode.idleTimeSecondsOverride || undefined,
    },

    singleTaskDistro: {
      projectTasksPairs: other.singleTaskDistro.projectTasksPairs
        .filter((pair) => pair.projectId)
        .map((pair) => ({
          projectID: pair.projectId,
          allowedTasks: pair.allowedTasks || [],
          allowedBVs: pair.allowedBVs || [],
        })),
    },

    buckets: {
      logBucket: {
        name: other.bucketConfig.logBucket.defaultLogBucket || undefined,
      },
      logBucketLongRetention: {
        name:
          other.bucketConfig.logBucket.logBucketLongRetentionName || undefined,
      },
      longRetentionProjects:
        other.bucketConfig.logBucket.longRetentionProjects?.length > 0
          ? other.bucketConfig.logBucket.longRetentionProjects
          : undefined,
      testResultsBucket: {
        name: other.bucketConfig.logBucket.testResultsBucketName || undefined,
        testResultsPrefix:
          other.bucketConfig.logBucket.testResultsBucketTestResultsPrefix ||
          undefined,
        roleARN:
          other.bucketConfig.logBucket.testResultsBucketRoleARN || undefined,
      },
      credentials: {
        key: other.bucketConfig.logBucket.credentialsKey || undefined,
        secret: other.bucketConfig.logBucket.credentialsSecret || undefined,
      },
    },

    ssh: {
      taskHostKey: {
        name: other.sshPairs.taskHostKey.name || undefined,
        secretARN: other.sshPairs.taskHostKey.secretARN || undefined,
      },
      spawnHostKey: {
        name: other.sshPairs.spawnHostKey.name || undefined,
        secretARN: other.sshPairs.spawnHostKey.secretARN || undefined,
      },
    },

    kanopySSHKeyPath: other.sshPairs.kanopySSHKeyPath || undefined,

    expansions: convertExpansionsToGql(other.expansions?.expansionValues || []),

    hostJasper: {
      binaryName: other.hostJasper.binaryName || undefined,
      downloadFileName: other.hostJasper.downloadFileName || undefined,
      port: other.hostJasper.port || undefined,
      url: other.hostJasper.url || undefined,
      version: other.hostJasper.version || undefined,
    },

    jiraNotifications: {
      customFields: (other.jiraNotificationsFields?.customFields || [])
        .filter((field) => field?.project)
        .map((field) => {
          const fieldsObj: { [key: string]: string } = {};

          // Safely handle fields array
          if (Array.isArray(field.fields)) {
            field.fields.forEach((item) => {
              if (item?.key && item?.value) {
                fieldsObj[item.key.trim()] = item.value.trim();
              }
            });
          }

          return {
            project: field.project,
            fields: Object.keys(fieldsObj).length > 0 ? fieldsObj : {},
            components: Array.isArray(field.components) ? field.components : [],
            labels: Array.isArray(field.labels) ? field.labels : [],
          };
        }),
    },

    spawnhost: {
      unexpirableHostsPerUser:
        other.spawnHost.unexpirableHostsPerUser || undefined,
      unexpirableVolumesPerUser:
        other.spawnHost.unexpirableVolumesPerUser || undefined,
      spawnHostsPerUser: other.spawnHost.spawnHostsPerUser || undefined,
    },

    sleepSchedule: {
      permanentlyExemptHosts: other.sleepSchedule.permanentlyExemptHosts || [],
    },

    tracer: {
      enabled: other.tracerConfiguration.enabled,
      collectorEndpoint:
        other.tracerConfiguration.collectorEndpoint || undefined,
      collectorInternalEndpoint:
        other.tracerConfiguration.collectorInternalEndpoint || undefined,
      collectorAPIKey: other.tracerConfiguration.collectorAPIKey || undefined,
    },

    projectCreation: {
      totalProjectLimit:
        other.projectCreationSettings.totalProjectLimit || undefined,
      repoProjectLimit:
        other.projectCreationSettings.repoProjectLimit || undefined,
      jiraProject: other.projectCreationSettings.jiraProject || undefined,
      repoExceptions: other.projectCreationSettings.repoExceptions
        .filter((exception) => exception.owner && exception.repo)
        .map((exception) => ({
          owner: exception.owner,
          repo: exception.repo,
        })),
    },

    githubCheckRun: {
      checkRunLimit:
        other.githubCheckRunConfigurations.checkRunLimit || undefined,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
