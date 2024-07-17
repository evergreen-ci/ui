import {
  adhocRequester,
  githubMergeRequester,
  githubPRRequester,
  gitTagRequester,
  gitterRequester,
  patchRequester,
  triggerRequester,
} from "constants/requesters";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery } from "gql/generated/types";
import { StringMap } from "types/utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.GithubAppSettings;

// Maintain an array to guarantee a consistent order of the requesters on the page.
const requestersArray = [
  githubPRRequester,
  patchRequester,
  gitTagRequester,
  gitterRequester,
  triggerRequester,
  adhocRequester,
  githubMergeRequester,
];

export const gqlToForm = ((data: ProjectSettingsQuery["projectSettings"]) => {
  if (!data) return null;

  const { projectRef } = data;
  const { githubPermissionGroupByRequester } = projectRef ?? {};

  return {
    tokenPermissionRestrictions: {
      permissionsByRequester: requestersArray.map((r) => ({
        requesterType: r,
        permissionGroup: githubPermissionGroupByRequester?.[r] ?? "",
      })),
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, isRepo, id) => {
  const githubPermissionGroupByRequester: StringMap = {};
  formState.tokenPermissionRestrictions.permissionsByRequester.forEach((p) => {
    if (p.permissionGroup) {
      githubPermissionGroupByRequester[p.requesterType] = p.permissionGroup;
    }
  });
  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef: {
      id,
      githubPermissionGroupByRequester,
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
