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
    debugSpawnHosts,
    diagnostics,
    domainName,
    expansions,
    githubCheckRun,
    githubOrgs,
    githubPRCreatorOrg,
    githubWebhookSecret,
    hostJasper,
    jiraNotifications,
    logPath,
    oktaServiceConfig,
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
      bucketConfig: {
        credentialsKey: buckets?.credentials?.key ?? "",
        credentialsSecret: buckets?.credentials?.secret ?? "",
        defaultLogBucket: buckets?.logBucket?.name ?? "",
        failedTasksLogBucketExpirationDays:
          buckets?.logBucketFailedTasks?.expirationDays ?? 0,
        failedTasksLogBucketLifecycleLastSyncedAt: buckets?.logBucketFailedTasks
          ?.lifecycleLastSyncedAt
          ? new Date(
              buckets.logBucketFailedTasks.lifecycleLastSyncedAt,
            ).toISOString()
          : "",
        failedTasksLogBucketLifecycleSyncError:
          buckets?.logBucketFailedTasks?.lifecycleSyncError ?? "",
        failedTasksLogBucketName: buckets?.logBucketFailedTasks?.name ?? "",
        failedTasksLogBucketTransitionToGlacierDays:
          buckets?.logBucketFailedTasks?.transitionToGlacierDays ?? 0,
        failedTasksLogBucketTransitionToIADays:
          buckets?.logBucketFailedTasks?.transitionToIADays ?? 0,
        logBucketExpirationDays: buckets?.logBucket?.expirationDays ?? 0,
        logBucketLifecycleLastSyncedAt: buckets?.logBucket
          ?.lifecycleLastSyncedAt
          ? new Date(buckets.logBucket.lifecycleLastSyncedAt).toISOString()
          : "",
        logBucketLifecycleSyncError:
          buckets?.logBucket?.lifecycleSyncError ?? "",
        logBucketLongRetentionExpirationDays:
          buckets?.logBucketLongRetention?.expirationDays ?? 0,
        logBucketLongRetentionLifecycleLastSyncedAt: buckets
          ?.logBucketLongRetention?.lifecycleLastSyncedAt
          ? new Date(
              buckets.logBucketLongRetention.lifecycleLastSyncedAt,
            ).toISOString()
          : "",
        logBucketLongRetentionLifecycleSyncError:
          buckets?.logBucketLongRetention?.lifecycleSyncError ?? "",
        logBucketLongRetentionName: buckets?.logBucketLongRetention?.name ?? "",
        logBucketLongRetentionTransitionToGlacierDays:
          buckets?.logBucketLongRetention?.transitionToGlacierDays ?? 0,
        logBucketLongRetentionTransitionToIADays:
          buckets?.logBucketLongRetention?.transitionToIADays ?? 0,
        logBucketTransitionToGlacierDays:
          buckets?.logBucket?.transitionToGlacierDays ?? 0,
        logBucketTransitionToIADays:
          buckets?.logBucket?.transitionToIADays ?? 0,
        longRetentionProjects: buckets?.longRetentionProjects ?? [],
        retryFailedLogMoveLookbackDays:
          buckets?.retryFailedLogMoveLookbackDays ?? 0,
        retryFailedLogMoveMaxJobsPerRun:
          buckets?.retryFailedLogMoveMaxJobsPerRun ?? 0,
        testResultsBucketName: buckets?.testResultsBucket?.name ?? "",
        testResultsBucketRoleARN: buckets?.testResultsBucket?.roleARN ?? "",
        testResultsBucketTestResultsPrefix:
          buckets?.testResultsBucket?.testResultsPrefix ?? "",
        testResultsBucketType: buckets?.testResultsBucket?.type ?? "",
      },

      debugSpawnHostsConfig: {
        setupScript: debugSpawnHosts?.setupScript ?? "",
      },

      diagnosticsConfig: {
        s3BucketName: diagnostics?.s3BucketName ?? "",
        s3Prefix: diagnostics?.s3Prefix ?? "",
      },

      expansions: {
        expansionValues: expansions
          ? Object.entries(expansions).map(([key, value]) => ({
              key,
              value,
            }))
          : [],
      },

      githubCheckRunConfigurations: {
        checkRunLimit: githubCheckRun?.checkRunLimit ?? 0,
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
              components: Array.isArray(field?.components)
                ? field.components
                : [],
              fields: fieldsArray,
              labels: Array.isArray(field?.labels) ? field.labels : [],
              project: field?.project ?? "",
            };
          }) ?? [],
      },

      miscSettings: {
        configDir: configDir ?? "",
        cost: {
          ebsDiscount: cost?.ebsCost?.ebsDiscount ?? 0,
          financeFormula: cost?.financeFormula ?? 0,
          hiddenCostProjects: cost?.hiddenCostProjects ?? [],
          onDemandDiscount: cost?.onDemandDiscount ?? 0,
          s3Cost: {
            archiveStorageCostDiscount:
              cost?.s3Cost?.storage?.archiveStorageCostDiscount ?? 0,
            artifactAwsAccountsWithoutLifecycleRules:
              cost?.s3Cost?.storage?.artifactAwsAccountsWithoutLifecycleRules ??
              [],
            defaultMaxArtifactExpirationDays:
              cost?.s3Cost?.storage?.defaultMaxArtifactExpirationDays || 1,
            devprodOwnedAwsAccountIds:
              cost?.s3Cost?.storage?.devprodOwnedAwsAccountIds ?? [],
            iAStorageCostDiscount:
              cost?.s3Cost?.storage?.iAStorageCostDiscount ?? 0,
            standardStorageCostDiscount:
              cost?.s3Cost?.storage?.standardStorageCostDiscount ?? 0,
            uploadCostDiscount: cost?.s3Cost?.upload?.uploadCostDiscount ?? 0,
          },
          savingsPlanDiscount: cost?.savingsPlanDiscount ?? 0,
        },
        domainName: domainName ?? "",
        githubOrgs: githubOrgs ?? [],
        githubPRCreatorOrg: githubPRCreatorOrg ?? "",
        githubWebhookSecret: githubWebhookSecret ?? "",
        logPath: logPath ?? "",
        oldestAllowedCLIVersion: oldestAllowedCLIVersion ?? "",
        pprofPort: pprofPort ?? "",
        releaseMode: {
          distroMaxHostsFactor: releaseMode?.distroMaxHostsFactor ?? 0,
          idleTimeSecondsOverride: releaseMode?.idleTimeSecondsOverride ?? 0,
          targetTimeSecondsOverride:
            releaseMode?.targetTimeSecondsOverride ?? 0,
        },
        shutdownWaitSeconds: shutdownWaitSeconds ?? 0,
      },

      oktaServiceConfig: {
        audience: oktaServiceConfig?.audience ?? "",
        clientId: oktaServiceConfig?.clientId ?? "",
        clientSecret: oktaServiceConfig?.clientSecret ?? "",
        issuer: oktaServiceConfig?.issuer ?? "",
        scopes: oktaServiceConfig?.scopes ?? [],
      },

      projectCreationSettings: {
        repoExceptions:
          projectCreation?.repoExceptions?.map((exception) => ({
            owner: exception.owner ?? "",
            repo: exception.repo ?? "",
          })) ?? [],
        repoProjectLimit: projectCreation?.repoProjectLimit ?? 0,
        totalProjectLimit: projectCreation?.totalProjectLimit ?? 0,
      },

      singleTaskDistro: {
        projectTasksPairs:
          singleTaskDistro?.projectTasksPairs?.map((pair) => ({
            allowedBVs: pair.allowedBVs ?? [],
            allowedTasks: pair.allowedTasks ?? [],
            projectId: pair.projectId ?? "",
          })) ?? [],
      },

      sleepSchedule: {
        permanentlyExemptHosts: sleepSchedule?.permanentlyExemptHosts ?? [],
      },

      spawnHost: {
        spawnHostsPerUser: spawnhost?.spawnHostsPerUser ?? 0,
        unexpirableHostsPerUser: spawnhost?.unexpirableHostsPerUser ?? 0,
        unexpirableVolumesPerUser: spawnhost?.unexpirableVolumesPerUser ?? 0,
      },

      sshPairs: {
        spawnHostKey: {
          name: ssh?.spawnHostKey?.name ?? "",
          secretARN: ssh?.spawnHostKey?.secretARN ?? "",
        },
        taskHostKey: {
          name: ssh?.taskHostKey?.name ?? "",
          secretARN: ssh?.taskHostKey?.secretARN ?? "",
        },
      },

      tracerConfiguration: {
        collectorAPIKey: tracer?.collectorAPIKey ?? "",
        collectorEndpoint: tracer?.collectorEndpoint ?? "",
        collectorInternalEndpoint: tracer?.collectorInternalEndpoint ?? "",
        enabled: tracer?.enabled ?? false,
        traceUrlTemplate: tracer?.traceUrlTemplate ?? "",
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((form: OtherFormState) => {
  const { other } = form;

  const {
    bucketConfig,
    debugSpawnHostsConfig,
    diagnosticsConfig,
    expansions,
    githubCheckRunConfigurations,
    hostJasper,
    jiraNotificationsFields,
    miscSettings,
    oktaServiceConfig,
    projectCreationSettings,
    singleTaskDistro,
    sleepSchedule,
    spawnHost,
    sshPairs,
    tracerConfiguration,
  } = other;

  const { ...ssh } = sshPairs;

  return {
    buckets: {
      credentials: {
        key: bucketConfig.credentialsKey || undefined,
        secret: bucketConfig.credentialsSecret || undefined,
      },
      logBucket: {
        name: bucketConfig.defaultLogBucket || undefined,
      },
      logBucketFailedTasks: {
        name: bucketConfig.failedTasksLogBucketName || undefined,
      },
      logBucketLongRetention: {
        name: bucketConfig.logBucketLongRetentionName || undefined,
      },
      longRetentionProjects:
        bucketConfig.longRetentionProjects.length > 0
          ? bucketConfig.longRetentionProjects
          : undefined,
      retryFailedLogMoveLookbackDays:
        bucketConfig.retryFailedLogMoveLookbackDays || undefined,
      retryFailedLogMoveMaxJobsPerRun:
        bucketConfig.retryFailedLogMoveMaxJobsPerRun || undefined,
      testResultsBucket: {
        name: bucketConfig.testResultsBucketName || undefined,
        roleARN: bucketConfig.testResultsBucketRoleARN || undefined,
        testResultsPrefix:
          bucketConfig.testResultsBucketTestResultsPrefix || undefined,
        type: bucketConfig.testResultsBucketType || undefined,
      },
    },
    configDir: miscSettings.configDir || undefined,
    cost: {
      ebsCost: {
        ebsDiscount: miscSettings.cost.ebsDiscount || undefined,
      },
      financeFormula: miscSettings.cost.financeFormula || undefined,
      hiddenCostProjects: miscSettings.cost.hiddenCostProjects,
      onDemandDiscount: miscSettings.cost.onDemandDiscount || undefined,
      s3Cost: {
        storage: {
          archiveStorageCostDiscount:
            miscSettings.cost.s3Cost.archiveStorageCostDiscount ?? undefined,
          artifactAwsAccountsWithoutLifecycleRules:
            miscSettings.cost.s3Cost.artifactAwsAccountsWithoutLifecycleRules,
          defaultMaxArtifactExpirationDays:
            miscSettings.cost.s3Cost.defaultMaxArtifactExpirationDays ||
            undefined,
          devprodOwnedAwsAccountIds:
            miscSettings.cost.s3Cost.devprodOwnedAwsAccountIds,
          iAStorageCostDiscount:
            miscSettings.cost.s3Cost.iAStorageCostDiscount ?? undefined,
          standardStorageCostDiscount:
            miscSettings.cost.s3Cost.standardStorageCostDiscount ?? undefined,
        },
        upload: {
          uploadCostDiscount:
            miscSettings.cost.s3Cost.uploadCostDiscount ?? undefined,
        },
      },
      savingsPlanDiscount: miscSettings.cost.savingsPlanDiscount || undefined,
    },
    debugSpawnHosts: {
      setupScript: debugSpawnHostsConfig.setupScript || undefined,
    },
    diagnostics: {
      s3BucketName: diagnosticsConfig.s3BucketName || undefined,
      s3Prefix: diagnosticsConfig.s3Prefix || undefined,
    },
    domainName: miscSettings.domainName || undefined,
    expansions: convertExpansionsToGql(expansions.expansionValues),
    githubCheckRun: {
      checkRunLimit: githubCheckRunConfigurations.checkRunLimit || undefined,
    },
    githubOrgs:
      miscSettings.githubOrgs.length > 0 ? miscSettings.githubOrgs : undefined,

    githubPRCreatorOrg: miscSettings.githubPRCreatorOrg || undefined,

    githubWebhookSecret: miscSettings.githubWebhookSecret || undefined,

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
            components: Array.isArray(field.components) ? field.components : [],
            fields: Object.keys(fieldsObj).length > 0 ? fieldsObj : {},
            labels: Array.isArray(field.labels) ? field.labels : [],
            project: field.project,
          };
        }),
    },

    logPath: miscSettings.logPath || undefined,

    oktaServiceConfig: {
      audience: oktaServiceConfig.audience || undefined,
      clientId: oktaServiceConfig.clientId || undefined,
      clientSecret: oktaServiceConfig.clientSecret || undefined,
      issuer: oktaServiceConfig.issuer || undefined,
      scopes: oktaServiceConfig.scopes || undefined,
    },

    oldestAllowedCLIVersion: miscSettings.oldestAllowedCLIVersion,

    pprofPort: miscSettings.pprofPort || undefined,

    projectCreation: {
      repoExceptions: projectCreationSettings.repoExceptions
        .filter((exception) => exception.owner && exception.repo)
        .map((exception) => ({
          owner: exception.owner,
          repo: exception.repo,
        })),
      repoProjectLimit: projectCreationSettings.repoProjectLimit || undefined,
      totalProjectLimit: projectCreationSettings.totalProjectLimit || undefined,
    },

    releaseMode: {
      distroMaxHostsFactor:
        miscSettings.releaseMode.distroMaxHostsFactor || undefined,
      idleTimeSecondsOverride:
        miscSettings.releaseMode.idleTimeSecondsOverride || undefined,
      targetTimeSecondsOverride:
        miscSettings.releaseMode.targetTimeSecondsOverride || undefined,
    },

    shutdownWaitSeconds: miscSettings.shutdownWaitSeconds || undefined,

    singleTaskDistro: {
      projectTasksPairs: singleTaskDistro.projectTasksPairs
        .filter((pair) => pair.projectId)
        .map((pair) => ({
          allowedBVs: pair.allowedBVs || [],
          allowedTasks: pair.allowedTasks || [],
          projectID: pair.projectId,
        })),
    },

    sleepSchedule: {
      permanentlyExemptHosts: sleepSchedule.permanentlyExemptHosts || [],
    },

    spawnhost: {
      spawnHostsPerUser: spawnHost.spawnHostsPerUser || undefined,
      unexpirableHostsPerUser: spawnHost.unexpirableHostsPerUser || undefined,
      unexpirableVolumesPerUser:
        spawnHost.unexpirableVolumesPerUser || undefined,
    },

    ssh: {
      spawnHostKey: {
        name: ssh.spawnHostKey.name || undefined,
        secretARN: ssh.spawnHostKey.secretARN || undefined,
      },
      taskHostKey: {
        name: ssh.taskHostKey.name || undefined,
        secretARN: ssh.taskHostKey.secretARN || undefined,
      },
    },

    tracer: {
      collectorAPIKey: tracerConfiguration.collectorAPIKey || undefined,
      collectorEndpoint: tracerConfiguration.collectorEndpoint || undefined,
      collectorInternalEndpoint:
        tracerConfiguration.collectorInternalEndpoint || undefined,
      enabled: tracerConfiguration.enabled,
      traceUrlTemplate: tracerConfiguration.traceUrlTemplate || undefined,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
