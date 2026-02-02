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
    if (item.key && item.value) {
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
    cost,
    domainName,
    expansions,
    githubCheckRun,
    githubOrgs,
    githubPRCreatorOrg,
    githubWebhookSecret,
    hostJasper,
    jiraNotifications,
    logPath,
    oldestAllowedCLIVersion,
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
        oldestAllowedCLIVersion: oldestAllowedCLIVersion ?? "",
        pprofPort: pprofPort ?? "",
        shutdownWaitSeconds: shutdownWaitSeconds ?? 0,
        releaseMode: {
          distroMaxHostsFactor: releaseMode?.distroMaxHostsFactor ?? 0,
          targetTimeSecondsOverride:
            releaseMode?.targetTimeSecondsOverride ?? 0,
          idleTimeSecondsOverride: releaseMode?.idleTimeSecondsOverride ?? 0,
        },
        cost: {
          financeFormula: cost?.financeFormula ?? 0,
          savingsPlanDiscount: cost?.savingsPlanDiscount ?? 0,
          onDemandDiscount: cost?.onDemandDiscount ?? 0,
          s3Cost: {
            uploadCostDiscount: cost?.s3Cost?.upload?.uploadCostDiscount ?? 0,
            standardStorageCostDiscount:
              cost?.s3Cost?.storage?.standardStorageCostDiscount ?? 0,
            iAStorageCostDiscount:
              cost?.s3Cost?.storage?.iAStorageCostDiscount ?? 0,
          },
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
        defaultLogBucket: buckets?.logBucket?.name ?? "",
        logBucketLongRetentionName: buckets?.logBucketLongRetention?.name ?? "",
        longRetentionProjects: buckets?.longRetentionProjects ?? [],
        testResultsBucketName: buckets?.testResultsBucket?.name ?? "",
        testResultsBucketTestResultsPrefix:
          buckets?.testResultsBucket?.testResultsPrefix ?? "",
        testResultsBucketType: buckets?.testResultsBucket?.type ?? "",
        testResultsBucketRoleARN: buckets?.testResultsBucket?.roleARN ?? "",
        credentialsKey: buckets?.credentials?.key ?? "",
        credentialsSecret: buckets?.credentials?.secret ?? "",
        failedTasksLogBucketName: buckets?.logBucketFailedTasks?.name ?? "",
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

  const {
    bucketConfig,
    expansions,
    githubCheckRunConfigurations,
    hostJasper,
    jiraNotificationsFields,
    miscSettings,
    projectCreationSettings,
    singleTaskDistro,
    sleepSchedule,
    spawnHost,
    sshPairs,
    tracerConfiguration,
  } = other;

  const { kanopySSHKeyPath, ...ssh } = sshPairs;

  return {
    configDir: miscSettings.configDir || undefined,
    domainName: miscSettings.domainName || undefined,
    githubOrgs:
      miscSettings.githubOrgs.length > 0 ? miscSettings.githubOrgs : undefined,
    githubPRCreatorOrg: miscSettings.githubPRCreatorOrg || undefined,
    githubWebhookSecret: miscSettings.githubWebhookSecret || undefined,
    logPath: miscSettings.logPath || undefined,
    oldestAllowedCLIVersion: miscSettings.oldestAllowedCLIVersion,
    pprofPort: miscSettings.pprofPort || undefined,
    shutdownWaitSeconds: miscSettings.shutdownWaitSeconds || undefined,

    releaseMode: {
      distroMaxHostsFactor:
        miscSettings.releaseMode.distroMaxHostsFactor || undefined,
      targetTimeSecondsOverride:
        miscSettings.releaseMode.targetTimeSecondsOverride || undefined,
      idleTimeSecondsOverride:
        miscSettings.releaseMode.idleTimeSecondsOverride || undefined,
    },

    cost: {
      financeFormula: miscSettings.cost.financeFormula || undefined,
      savingsPlanDiscount: miscSettings.cost.savingsPlanDiscount || undefined,
      onDemandDiscount: miscSettings.cost.onDemandDiscount || undefined,
      s3Cost: {
        upload: {
          uploadCostDiscount:
            miscSettings.cost.s3Cost.uploadCostDiscount || undefined,
        },
        storage: {
          standardStorageCostDiscount:
            miscSettings.cost.s3Cost.standardStorageCostDiscount || undefined,
          iAStorageCostDiscount:
            miscSettings.cost.s3Cost.iAStorageCostDiscount || undefined,
        },
      },
    },

    singleTaskDistro: {
      projectTasksPairs: singleTaskDistro.projectTasksPairs
        .filter((pair) => pair.projectId)
        .map((pair) => ({
          projectID: pair.projectId,
          allowedTasks: pair.allowedTasks || [],
          allowedBVs: pair.allowedBVs || [],
        })),
    },

    buckets: {
      logBucket: {
        name: bucketConfig.defaultLogBucket || undefined,
      },
      logBucketLongRetention: {
        name: bucketConfig.logBucketLongRetentionName || undefined,
      },
      logBucketFailedTasks: {
        name: bucketConfig.failedTasksLogBucketName || undefined,
      },
      longRetentionProjects:
        bucketConfig.longRetentionProjects.length > 0
          ? bucketConfig.longRetentionProjects
          : undefined,
      testResultsBucket: {
        name: bucketConfig.testResultsBucketName || undefined,
        testResultsPrefix:
          bucketConfig.testResultsBucketTestResultsPrefix || undefined,
        roleARN: bucketConfig.testResultsBucketRoleARN || undefined,
        type: bucketConfig.testResultsBucketType || undefined,
      },
      credentials: {
        key: bucketConfig.credentialsKey || undefined,
        secret: bucketConfig.credentialsSecret || undefined,
      },
    },

    ssh: {
      taskHostKey: {
        name: ssh.taskHostKey.name || undefined,
        secretARN: ssh.taskHostKey.secretARN || undefined,
      },
      spawnHostKey: {
        name: ssh.spawnHostKey.name || undefined,
        secretARN: ssh.spawnHostKey.secretARN || undefined,
      },
    },

    kanopySSHKeyPath: kanopySSHKeyPath || undefined,

    expansions: convertExpansionsToGql(expansions.expansionValues),

    hostJasper: {
      binaryName: hostJasper.binaryName || undefined,
      downloadFileName: hostJasper.downloadFileName || undefined,
      port: hostJasper.port || undefined,
      url: hostJasper.url || undefined,
      version: hostJasper.version || undefined,
    },

    jiraNotifications: {
      customFields: jiraNotificationsFields.customFields
        .filter((field) => field.project)
        .map((field) => {
          const fieldsObj: { [key: string]: string } = {};
          // Safely handle fields array
          if (Array.isArray(field.fields)) {
            field.fields.forEach((item) => {
              if (item.key && item.value) {
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
      unexpirableHostsPerUser: spawnHost.unexpirableHostsPerUser || undefined,
      unexpirableVolumesPerUser:
        spawnHost.unexpirableVolumesPerUser || undefined,
      spawnHostsPerUser: spawnHost.spawnHostsPerUser || undefined,
    },

    sleepSchedule: {
      permanentlyExemptHosts: sleepSchedule.permanentlyExemptHosts || [],
    },

    tracer: {
      enabled: tracerConfiguration.enabled,
      collectorEndpoint: tracerConfiguration.collectorEndpoint || undefined,
      collectorInternalEndpoint:
        tracerConfiguration.collectorInternalEndpoint || undefined,
      collectorAPIKey: tracerConfiguration.collectorAPIKey || undefined,
    },

    projectCreation: {
      totalProjectLimit: projectCreationSettings.totalProjectLimit || undefined,
      repoProjectLimit: projectCreationSettings.repoProjectLimit || undefined,
      jiraProject: projectCreationSettings.jiraProject || undefined,
      repoExceptions: projectCreationSettings.repoExceptions
        .filter((exception) => exception.owner && exception.repo)
        .map((exception) => ({
          owner: exception.owner,
          repo: exception.repo,
        })),
    },

    githubCheckRun: {
      checkRunLimit: githubCheckRunConfigurations.checkRunLimit || undefined,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
