import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { JiraTicketType } from "types/jira";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.Plugins;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    performanceSettings: {
      perfEnabled: projectRef?.perfEnabled,
    },
    buildBaronSettings: {
      useBuildBaron:
        projectRef?.taskAnnotationSettings?.fileTicketWebhook?.endpoint === "",
      ticketSearchProjects:
        projectRef?.buildBaronSettings?.ticketSearchProjects?.map(
          (searchProject) => ({ searchProject }),
        ) ?? [],

      ticketCreateProject: {
        createProject: projectRef?.buildBaronSettings?.ticketCreateProject,
      },
      ticketCreateIssueType: {
        issueType:
          projectRef?.buildBaronSettings?.ticketCreateIssueType ||
          JiraTicketType.BuildFailure,
      },
      fileTicketWebhook: {
        endpoint:
          projectRef?.taskAnnotationSettings?.fileTicketWebhook?.endpoint,
        secret: projectRef?.taskAnnotationSettings?.fileTicketWebhook?.secret,
      },
    },
    externalLinks:
      projectRef?.externalLinks?.map((e) => ({
        ...e,
        displayTitle: e.displayName,
      })) ?? [],
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { buildBaronSettings, externalLinks, performanceSettings },
  isRepo,
  id,
) => {
  const projectRef: ProjectInput = {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    id,
    perfEnabled: performanceSettings.perfEnabled,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    ...buildBaronIf(buildBaronSettings.useBuildBaron, buildBaronSettings),
    taskAnnotationSettings: {
      ...fileTicketWebhookIf(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        buildBaronSettings.useBuildBaron,
        buildBaronSettings.fileTicketWebhook,
      ),
    },
    externalLinks:
      externalLinks.length > 0
        ? externalLinks.map(({ displayName, requesters, urlTemplate }) => ({
            requesters,
            displayName,
            urlTemplate,
          }))
        : null,
  };
  return { ...(isRepo ? { repoId: id } : { projectId: id }), projectRef };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;

// conditionally include the buildBaronSettings field based on the useBuildBaron boolean
export const buildBaronIf = (useBuildBaron: boolean, buildBaronSettings: any) =>
  useBuildBaron === true &&
  buildBaronSettings !== undefined && {
    buildBaronSettings: {
      ticketCreateProject:
        buildBaronSettings.ticketCreateProject?.createProject,
      ticketSearchProjects: buildBaronSettings.ticketSearchProjects
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        .map(({ searchProject }) => searchProject)
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        .filter((str) => !!str),
      ticketCreateIssueType:
        buildBaronSettings.ticketCreateIssueType?.issueType ||
        JiraTicketType.BuildFailure,
    },
  };

// conditionally include the fileTicketWebhook field based on the useBuildBaron boolean
export const fileTicketWebhookIf = (
  useBuildBaron: boolean,
  fileTicketWebhook: any,
) =>
  useBuildBaron !== true &&
  fileTicketWebhook !== undefined && {
    fileTicketWebhook: {
      endpoint: fileTicketWebhook.endpoint,
      secret: fileTicketWebhook.secret,
    },
  };
