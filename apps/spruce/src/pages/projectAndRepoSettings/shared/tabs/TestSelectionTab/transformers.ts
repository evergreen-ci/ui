import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { TaskLevelTestSelection } from "./types";

type Tab = ProjectSettingsTabRoutes.TestSelection;

const getTaskLevelSetting = (
  defaultEnabled?: boolean | null,
  mainlineDefaultEnabled?: boolean | null,
): TaskLevelTestSelection | null => {
  if (defaultEnabled === null || defaultEnabled === undefined) {
    return null;
  }
  if (!defaultEnabled) {
    return TaskLevelTestSelection.Disabled;
  }
  return mainlineDefaultEnabled
    ? TaskLevelTestSelection.PatchesAndMainline
    : TaskLevelTestSelection.Patches;
};

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  const { testSelection } = projectRef ?? {};

  return {
    allowed: testSelection?.allowed ?? null,
    taskLevel: getTaskLevelSetting(
      testSelection?.defaultEnabled,
      testSelection?.mainlineDefaultEnabled,
    ),
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, isRepo, id) => {
  const { taskLevel } = formState;
  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef: {
      id,
      testSelection: {
        allowed: formState.allowed,
        defaultEnabled:
          taskLevel === null
            ? null
            : taskLevel !== TaskLevelTestSelection.Disabled,
        mainlineDefaultEnabled:
          taskLevel === null
            ? null
            : taskLevel === TaskLevelTestSelection.PatchesAndMainline,
      },
    },
  };
}) satisfies FormToGqlFunction<Tab>;
