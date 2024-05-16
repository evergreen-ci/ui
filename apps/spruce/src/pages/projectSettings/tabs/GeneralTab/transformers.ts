import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

type Tab = ProjectSettingsTabRoutes.General;

export const gqlToForm = ((data, options = {}) => {
  if (!data) return null;
  const projectType = options.projectType ?? ProjectType.Project;
  const { projectRef } = data;

  return {
    generalConfiguration: {
      ...(projectType !== ProjectType.Repo &&
        // @ts-ignore: FIXME. This comment was added by an automated script.
        "enabled" in projectRef && {
          enabled: projectRef.enabled,
        }),
      repositoryInfo: {
        // @ts-ignore: FIXME. This comment was added by an automated script.
        owner: projectRef.owner,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        repo: projectRef.repo,
      },
      ...(projectType !== ProjectType.Repo &&
        // @ts-ignore: FIXME. This comment was added by an automated script.
        "branch" in projectRef && {
          branch: projectRef.branch,
        }),
      other: {
        // @ts-ignore: FIXME. This comment was added by an automated script.
        displayName: projectRef.displayName,
        ...(projectType !== ProjectType.Repo &&
          // @ts-ignore: FIXME. This comment was added by an automated script.
          "identifier" in projectRef && {
            identifier: projectRef.identifier,
          }),
        // @ts-ignore: FIXME. This comment was added by an automated script.
        batchTime: projectRef.batchTime || null,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        remotePath: projectRef.remotePath,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        spawnHostScriptPath: projectRef.spawnHostScriptPath,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        versionControlEnabled: projectRef.versionControlEnabled,
      },
    },
    projectFlags: {
      // @ts-ignore: FIXME. This comment was added by an automated script.
      dispatchingDisabled: projectRef.dispatchingDisabled,
      scheduling: {
        // @ts-ignore: FIXME. This comment was added by an automated script.
        deactivatePrevious: projectRef.deactivatePrevious,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        stepbackDisabled: projectRef.stepbackDisabled,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        stepbackBisection: projectRef.stepbackBisect,
        deactivateStepback: null,
      },
      repotracker: {
        // @ts-ignore: FIXME. This comment was added by an automated script.
        repotrackerDisabled: projectRef.repotrackerDisabled,
        forceRun: null,
      },
      patch: {
        // @ts-ignore: FIXME. This comment was added by an automated script.
        patchingDisabled: projectRef.patchingDisabled,
      },
      taskSync: {
        // @ts-ignore: FIXME. This comment was added by an automated script.
        configEnabled: projectRef.taskSync.configEnabled,
        // @ts-ignore: FIXME. This comment was added by an automated script.
        patchEnabled: projectRef.taskSync.patchEnabled,
      },
    },
    historicalTaskDataCaching: {
      // @ts-ignore: FIXME. This comment was added by an automated script.
      disabledStatsCache: projectRef.disabledStatsCache,
    },
  };
  // @ts-ignore: FIXME. This comment was added by an automated script.
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
    // @ts-ignore: FIXME. This comment was added by an automated script.
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
    stepbackDisabled: projectFlags.scheduling.stepbackDisabled,
    stepbackBisect: projectFlags.scheduling.stepbackBisection,
    patchingDisabled: projectFlags.patch.patchingDisabled,
    taskSync: {
      configEnabled: projectFlags.taskSync.configEnabled,
      patchEnabled: projectFlags.taskSync.patchEnabled,
    },
    disabledStatsCache,
  };

  return { ...(isRepo ? { repoId: id } : { projectId: id }), projectRef };
  // @ts-ignore: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
