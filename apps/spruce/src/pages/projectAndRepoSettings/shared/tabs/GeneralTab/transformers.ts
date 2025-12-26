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
            projectID: projectRef.id,
            identifier: projectRef.identifier,
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
    projectFlags: {
      dispatchingDisabled: projectRef.dispatchingDisabled,
      debugSpawnHostsDisabled: projectRef.debugSpawnHostsDisabled,
      scheduling: {
        deactivatePrevious: projectRef.deactivatePrevious,
        stepbackDisabled: projectRef.stepbackDisabled,
        stepbackBisection: projectRef.stepbackBisect,
        deactivateStepback: null,
      },
      repotracker: {
        repotrackerDisabled: projectRef.repotrackerDisabled,
        forceRun: null,
      },
      patch: {
        patchingDisabled: projectRef.patchingDisabled,
      },
    },
    historicalTaskDataCaching: {
      disabledStatsCache: projectRef.disabledStatsCache,
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
    remotePath: generalConfiguration.other.remotePath,
    spawnHostScriptPath: generalConfiguration.other.spawnHostScriptPath,
    versionControlEnabled: generalConfiguration.other.versionControlEnabled,
    dispatchingDisabled: projectFlags.dispatchingDisabled,
    deactivatePrevious: projectFlags.scheduling.deactivatePrevious,
    repotrackerDisabled: projectFlags.repotracker.repotrackerDisabled,
    debugSpawnHostsDisabled: projectFlags.debugSpawnHostsDisabled,
    stepbackDisabled: projectFlags.scheduling.stepbackDisabled,
    stepbackBisect: projectFlags.scheduling.stepbackBisection,
    patchingDisabled: projectFlags.patch.patchingDisabled,
    disabledStatsCache,
  };

  return { ...(isRepo ? { repoId: id } : { projectId: id }), projectRef };
}) satisfies FormToGqlFunction<Tab>;
