import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { JiraTicketType } from "types/jira";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { PluginsFormState } from "./types";

type Tab = ProjectSettingsTabRoutes.Plugins;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    buildBaronSettings: {
      fileTicketWebhook: {
        endpoint:
          projectRef?.taskAnnotationSettings?.fileTicketWebhook?.endpoint,
        secret: projectRef?.taskAnnotationSettings?.fileTicketWebhook?.secret,
      },
      ticketCreateIssueType: {
        issueType:
          projectRef?.buildBaronSettings?.ticketCreateIssueType ||
          JiraTicketType.BuildFailure,
      },

      ticketCreateProject: {
        createProject: projectRef?.buildBaronSettings?.ticketCreateProject,
      },
      ticketSearchProjects:
        projectRef?.buildBaronSettings?.ticketSearchProjects?.map(
          (searchProject) => ({ searchProject }),
        ) ?? [],
      useBuildBaron:
        projectRef?.taskAnnotationSettings?.fileTicketWebhook?.endpoint === "",
    },
    externalLinks:
      projectRef?.externalLinks?.map((e) => ({
        ...e,
        displayTitle: e.displayName,
      })) ?? [],
    performanceSettings: {
      perfEnabled: projectRef?.perfEnabled,
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { buildBaronSettings, externalLinks, performanceSettings },
  isRepo,
  id,
) => {
  const projectRef: ProjectInput = {
    id,
    perfEnabled: performanceSettings.perfEnabled,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    ...buildBaronIf(buildBaronSettings.useBuildBaron, buildBaronSettings),
    externalLinks:
      externalLinks.length > 0
        ? externalLinks.map(({ displayName, requesters, urlTemplate }) => ({
            displayName,
            requesters,
            urlTemplate,
          }))
        : null,
    taskAnnotationSettings: {
      ...fileTicketWebhookIf(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        buildBaronSettings.useBuildBaron,
        buildBaronSettings.fileTicketWebhook,
      ),
    },
  };
  return { ...(isRepo ? { repoId: id } : { projectId: id }), projectRef };
}) satisfies FormToGqlFunction<Tab>;

// conditionally include the buildBaronSettings field based on the useBuildBaron boolean
export const buildBaronIf = (
  useBuildBaron: boolean,
  buildBaronSettings: PluginsFormState["buildBaronSettings"],
) =>
  useBuildBaron === true &&
  buildBaronSettings !== undefined && {
    buildBaronSettings: {
      ticketCreateIssueType:
        buildBaronSettings.ticketCreateIssueType?.issueType ||
        JiraTicketType.BuildFailure,
      ticketCreateProject:
        buildBaronSettings.ticketCreateProject?.createProject,
      ticketSearchProjects: buildBaronSettings.ticketSearchProjects
        .map(({ searchProject }) => searchProject)
        .filter((str) => !!str),
    },
  };

// conditionally include the fileTicketWebhook field based on the useBuildBaron boolean
export const fileTicketWebhookIf = (
  useBuildBaron: boolean,
  fileTicketWebhook: PluginsFormState["buildBaronSettings"]["fileTicketWebhook"],
) =>
  useBuildBaron !== true &&
  fileTicketWebhook !== undefined && {
    fileTicketWebhook: {
      endpoint: fileTicketWebhook.endpoint,
      secret: fileTicketWebhook.secret,
    },
  };
