import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

type Tab = ProjectSettingsTabRoutes.General;

export const gqlToForm = ((data, options = {}) => {
  if (!data) return null;
  const projectType = options.projectType ?? ProjectType.Project;
  const { projectRef } = data;

  if (!projectRef) return null;

  return {
    generalConfiguration: {
      ...(projectType !== ProjectType.Repo &&
        "enabled" in projectRef && {
          enabled: projectRef.enabled,
        }),
      repositoryInfo: {
        owner: projectRef.owner,
        repo: projectRef.repo,
      },
      ...(projectType !== ProjectType.Repo &&
        "branch" in projectRef && {
          branch: projectRef.branch,
        }),
      other: {
        displayName: projectRef.displayName,
        ...(projectType !== ProjectType.Repo &&
          "identifier" in projectRef && {
            identifier: projectRef.identifier,
            projectID: projectRef.id,
          }),
        batchTime:
          projectRef?.batchTime ||
          // Allow attached projects to show repo fallback value
          (projectType === ProjectType.AttachedProject ? null : 0),
        remotePath: projectRef.remotePath,
        spawnHostScriptPath: projectRef.spawnHostScriptPath,
        versionControlEnabled: projectRef.versionControlEnabled,
      },
    },
    historicalTaskDataCaching: {
      disabledStatsCache: projectRef.disabledStatsCache,
    },
    projectFlags: {
      debug: {
        debugSpawnHostsDisabled: projectRef.debugSpawnHostsDisabled,
      },
      dispatchingDisabled: projectRef.dispatchingDisabled,
      patch: {
        patchingDisabled: projectRef.patchingDisabled,
      },
      repotracker: {
        forceRun: null,
        repotrackerDisabled: projectRef.repotrackerDisabled,
        runEveryMainlineCommit: projectRef.runEveryMainlineCommit,
        waterfallDisabled: projectRef.waterfallDisabled,
      },
      scheduling: {
        deactivatePrevious: projectRef.deactivatePrevious,
        deactivateStepback: null,
        stepbackBisection: projectRef.stepbackBisect,
        stepbackDisabled: projectRef.stepbackDisabled,
      },
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  {
    generalConfiguration,
    historicalTaskDataCaching: { disabledStatsCache },
    projectFlags,
  },
  isRepo,
  id,
) => {
  const projectRef: ProjectInput = {
    id,
    ...("enabled" in generalConfiguration && {
      enabled: generalConfiguration.enabled,
    }),
    owner: generalConfiguration.repositoryInfo.owner,
    repo: generalConfiguration.repositoryInfo.repo,
    ...("branch" in generalConfiguration && {
      branch: generalConfiguration.branch,
    }),
    displayName: generalConfiguration.other.displayName,
    ...(generalConfiguration.other.identifier && {
      identifier: generalConfiguration.other.identifier,
    }),
    batchTime: generalConfiguration.other.batchTime ?? 0,
    deactivatePrevious: projectFlags.scheduling.deactivatePrevious,
    debugSpawnHostsDisabled: projectFlags.debug.debugSpawnHostsDisabled,
    disabledStatsCache,
    dispatchingDisabled: projectFlags.dispatchingDisabled,
    patchingDisabled: projectFlags.patch.patchingDisabled,
    remotePath: generalConfiguration.other.remotePath,
    repotrackerDisabled: projectFlags.repotracker.repotrackerDisabled,
    runEveryMainlineCommit: projectFlags.repotracker.runEveryMainlineCommit,
    spawnHostScriptPath: generalConfiguration.other.spawnHostScriptPath,
    stepbackBisect: projectFlags.scheduling.stepbackBisection,
    stepbackDisabled: projectFlags.scheduling.stepbackDisabled,
    versionControlEnabled: generalConfiguration.other.versionControlEnabled,
    waterfallDisabled: projectFlags.repotracker.waterfallDisabled,
  };

  return { ...(isRepo ? { repoId: id } : { projectId: id }), projectRef };
}) satisfies FormToGqlFunction<Tab>;
