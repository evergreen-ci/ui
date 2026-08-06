import { skipToken, useQuery } from "@apollo/client/react";
import {
  ProjectBuildBaronSettingsQuery,
  ProjectBuildBaronSettingsQueryVariables,
} from "gql/generated/types";
import { PROJECT_BUILD_BARON_SETTINGS } from "gql/queries";
import { useProjectBuildBaronSettings } from "hooks";
import { statuses } from "utils";

const { isFailedTaskStatus } = statuses;

interface UseBuildBaronVariablesType {
  task: {
    status: string;
    hasAnnotation: boolean;
    canModifyAnnotation: boolean;
    projectId?: string;
    projectIdentifier?: string;
  };
}

/**
 * useBuildBaronVariables derives Failure Details tab visibility and behavior from the project's
 * current Build Baron settings. Settings are read from the normalized Project cache entity when it is
 * already populated, so viewing many tasks in the same project does not issue a request per task.
 * @param options - the options object
 * @param options.task - status, annotation state, and project of the task being viewed
 * @returns whether to show the tab, whether Build Baron is configured for the project, and whether the
 * project defines a Jira project for ticket creation
 */
const useBuildBaronVariables = ({ task }: UseBuildBaronVariablesType) => {
  const {
    canModifyAnnotation,
    hasAnnotation,
    projectId,
    projectIdentifier,
    status,
  } = task;
  const isFailedTask = isFailedTaskStatus(status);

  const { bbTicketCreationDefined, buildBaronConfigured, complete } =
    useProjectBuildBaronSettings(projectId);

  useQuery<
    ProjectBuildBaronSettingsQuery,
    ProjectBuildBaronSettingsQueryVariables
  >(
    PROJECT_BUILD_BARON_SETTINGS,
    isFailedTask && !complete && projectIdentifier
      ? { variables: { projectIdentifier } }
      : skipToken,
  );

  const showBuildBaron =
    isFailedTask &&
    (buildBaronConfigured || hasAnnotation || canModifyAnnotation);

  return {
    bbTicketCreationDefined,
    buildBaronConfigured,
    showBuildBaron,
  };
};

export default useBuildBaronVariables;
