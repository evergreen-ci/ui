import { Requester } from "constants/requesters";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery } from "gql/generated/types";
import { StringMap } from "types/utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.GithubAppSettings;

export const gqlToForm = ((data: ProjectSettingsQuery["projectSettings"]) => {
  if (!data) return null;

  const { githubAppAuth, projectRef } = data;
  const { githubPermissionGroupByRequester } = projectRef ?? {};

  return {
    appCredentials: {
      githubAppAuth: {
        appId: githubAppAuth?.appId ?? null,
        privateKey: githubAppAuth?.privateKey ?? "",
      },
    },
    tokenPermissionRestrictions: {
      permissionsByRequester: Object.values(Requester).map((r) => ({
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
    githubAppAuth: {
      appId: formState?.appCredentials?.githubAppAuth?.appId ?? 0,
      privateKey: formState?.appCredentials?.githubAppAuth?.privateKey,
    },
    projectRef: {
      id,
      githubPermissionGroupByRequester,
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
