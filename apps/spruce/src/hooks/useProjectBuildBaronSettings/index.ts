import { skipToken, useFragment, useQuery } from "@apollo/client/react";
import { PROJECT_BUILD_BARON_SETTINGS_FRAGMENT } from "gql/fragments/projectBuildBaronSettings";
import {
  ProjectBuildBaronSettingsFragment,
  ProjectBuildBaronSettingsQuery,
  ProjectBuildBaronSettingsQueryVariables,
} from "gql/generated/types";
import { PROJECT_BUILD_BARON_SETTINGS } from "gql/queries";

interface UseProjectBuildBaronSettingsOptions {
  projectId?: string;
  /**
   * Passing an identifier opts into fetching the settings when the cache doesn't already have them.
   * Omit it to read whatever is cached without issuing a request.
   */
  projectIdentifier?: string;
}

/**
 * useProjectBuildBaronSettings returns a project's Build Baron settings, preferring the normalized
 * Project cache entity so that many tasks in the same project share one fetch. The entity is written
 * by anything that has already read these fields, such as the project settings page.
 * @param options - the options object
 * @param options.projectId - the id of the project whose settings to read
 * @param options.projectIdentifier - the identifier to fetch settings by, when fetching is wanted
 * @returns whether Build Baron is configured and whether the project defines a Jira project for
 * ticket creation
 */
export const useProjectBuildBaronSettings = ({
  projectId,
  projectIdentifier,
}: UseProjectBuildBaronSettingsOptions) => {
  const { complete, data: cached } =
    useFragment<ProjectBuildBaronSettingsFragment>({
      from: projectId ? { __typename: "Project", id: projectId } : null,
      fragment: PROJECT_BUILD_BARON_SETTINGS_FRAGMENT,
    });

  const { data: fetched } = useQuery<
    ProjectBuildBaronSettingsQuery,
    ProjectBuildBaronSettingsQueryVariables
  >(
    PROJECT_BUILD_BARON_SETTINGS,
    !complete && projectIdentifier
      ? { variables: { projectIdentifier } }
      : skipToken,
  );

  const settings = complete
    ? cached.buildBaronSettings
    : fetched?.project?.buildBaronSettings;

  return {
    bbTicketCreationDefined: !!settings?.ticketCreateProject,
    // Visibility follows the project's current settings. Tasks whose Build Baron configuration only
    // exists in a historical version's project YAML no longer surface the tab on that basis alone.
    buildBaronConfigured: (settings?.ticketSearchProjects ?? []).length > 0,
  };
};
