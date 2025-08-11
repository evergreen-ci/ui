import { AdminSettingsGeneralSection } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";
import { OtherFormState } from "./types";

type Tab = AdminSettingsGeneralSection.Other;

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

      singleTaskHost: {
        projectTasksPairs:
          singleTaskDistro?.projectTasksPairs?.map((pair) => ({
            projectId: pair.projectId ?? "",
            allowedTasks: pair.allowedTasks ?? [],
            allowedBVs: pair.allowedBVs ?? [],
          })) ?? [],
      },

      bucketConfig: {
        logBucket: {
          name: buckets?.logBucket?.name ?? "",
          testResultsPrefix: buckets?.logBucket?.testResultsPrefix ?? "",
          roleARN: buckets?.logBucket?.roleARN ?? "",
        },
        testResultsBucket: {
          name: buckets?.testResultsBucket?.name ?? "",
          testResultsPrefix:
            buckets?.testResultsBucket?.testResultsPrefix ?? "",
          roleARN: buckets?.testResultsBucket?.roleARN ?? "",
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
          jiraNotifications?.customFields?.map((field) => ({
            project: field.project ?? "",
            fields: field.fields ? JSON.stringify(field.fields, null, 2) : "",
            components: field.components ?? [],
            labels: field.labels ?? [],
          })) ?? [],
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

      projectCrationSettings: {
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
      projectTasksPairs: other.singleTaskHost.projectTasksPairs
        .filter((pair) => pair.projectId)
        .map((pair) => ({
          projectID: pair.projectId,
          allowedTasks: pair.allowedTasks || [],
          allowedBVs: pair.allowedBVs || [],
        })),
    },

    buckets: {
      logBucket: {
        name: other.bucketConfig.logBucket.name || undefined,
        testResultsPrefix:
          other.bucketConfig.logBucket.testResultsPrefix || undefined,
        roleARN: other.bucketConfig.logBucket.roleARN || undefined,
      },
      testResultsBucket: {
        name: other.bucketConfig.testResultsBucket.name || undefined,
        testResultsPrefix:
          other.bucketConfig.testResultsBucket.testResultsPrefix || undefined,
        roleARN: other.bucketConfig.testResultsBucket.roleARN || undefined,
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

    expansions: (() => {
      if (
        !other.expansions.expansionValues ||
        other.expansions.expansionValues.length === 0
      ) {
        return undefined;
      }

      const expansionsObj: { [key: string]: string } = {};
      other.expansions.expansionValues.forEach((item) => {
        if (item.key && item.value) {
          expansionsObj[item.key.trim()] = item.value.trim();
        }
      });

      return Object.keys(expansionsObj).length > 0 ? expansionsObj : undefined;
    })(),

    hostJasper: {
      binaryName: other.hostJasper.binaryName || undefined,
      downloadFileName: other.hostJasper.downloadFileName || undefined,
      port: other.hostJasper.port || undefined,
      url: other.hostJasper.url || undefined,
      version: other.hostJasper.version || undefined,
    },

    jiraNotifications: {
      customFields: other.jiraNotificationsFields.customFields
        .filter((field) => field.project)
        .map((field) => {
          let parsedFields = {};
          try {
            parsedFields = field.fields ? JSON.parse(field.fields) : {};
          } catch {
            parsedFields = {};
          }
          return {
            project: field.project,
            fields: Object.keys(parsedFields).length > 0 ? parsedFields : {},
            components: field.components || [],
            labels: field.labels || [],
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
        other.projectCrationSettings.totalProjectLimit || undefined,
      repoProjectLimit:
        other.projectCrationSettings.repoProjectLimit || undefined,
      jiraProject: other.projectCrationSettings.jiraProject || undefined,
      repoExceptions: other.projectCrationSettings.repoExceptions
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
