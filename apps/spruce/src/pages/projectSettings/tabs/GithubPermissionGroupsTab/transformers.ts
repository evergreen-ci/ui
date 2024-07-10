import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery } from "gql/generated/types";
import { StringMap } from "types/utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.GithubPermissionGroups;

export const gqlToForm = ((data: ProjectSettingsQuery["projectSettings"]) => {
  if (!data) return null;

  const { projectRef } = data;

  return {
    permissionGroups:
      projectRef?.githubDynamicTokenPermissionGroups?.map((group) => ({
        displayTitle: group.name,
        name: group.name,
        permissions: Object.keys(group.permissions).map((p) => ({
          type: p,
          value: group.permissions[p],
        })),
      })) ?? [],
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    id,
    githubDynamicTokenPermissionGroups:
      formState?.permissionGroups?.map((group) => {
        const permissions: StringMap = {};
        group?.permissions?.forEach((p) => {
          permissions[p.type] = p.value;
        });
        return {
          name: group.name,
          permissions,
        };
      }) ?? [],
  },
})) satisfies FormToGqlFunction<Tab>;
