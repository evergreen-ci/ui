import { useFragment } from "@apollo/client/react";
import { PROJECT_BUILD_BARON_SETTINGS_FRAGMENT } from "gql/fragments/projectBuildBaronSettings";
import { ProjectBuildBaronSettingsFragment } from "gql/generated/types";

/**
 * useProjectBuildBaronSettings reads a project's Build Baron settings from the normalized Project
 * cache entity. It never issues a request, so callers that only need to describe existing state can
 * use it freely; something else must have already fetched the settings.
 * @param projectId - the id of the project whose settings to read
 * @returns whether Build Baron is configured, whether the project defines a Jira project for ticket
 * creation, and whether the settings were found in the cache
 */
export const useProjectBuildBaronSettings = (projectId?: string) => {
  const { complete, data } = useFragment<ProjectBuildBaronSettingsFragment>({
    from: projectId ? { __typename: "Project", id: projectId } : null,
    fragment: PROJECT_BUILD_BARON_SETTINGS_FRAGMENT,
  });

  const settings = complete ? data.buildBaronSettings : undefined;

  return {
    bbTicketCreationDefined: !!settings?.ticketCreateProject,
    // Visibility follows the project's current settings. Tasks whose Build Baron configuration only
    // exists in a historical version's project YAML no longer surface the tab on that basis alone.
    buildBaronConfigured: (settings?.ticketSearchProjects ?? []).length > 0,
    complete,
  };
};
