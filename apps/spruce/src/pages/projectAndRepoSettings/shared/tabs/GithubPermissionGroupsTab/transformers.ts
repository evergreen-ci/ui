import { StringMap } from "@evg-ui/lib/types/utils";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.GithubPermissionGroups;

export const gqlToForm = ((data: ProjectSettingsQuery["projectSettings"]) => {
  if (!data) return null;

  const { githubAppAuth, projectRef } = data;

  return {
    appCredentials: {
      githubAppAuth: {
        appId: githubAppAuth?.appId ?? null,
        privateKey: githubAppAuth?.privateKey ?? "",
      },
    },
    permissionGroups:
      projectRef?.githubDynamicTokenPermissionGroups?.map((pg) => ({
        displayTitle: pg.name,
        name: pg.name,
        permissions: Object.keys(pg.permissions).map((p) => ({
          type: p,
          value: pg.permissions[p],
        })),
      })) ?? [],
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  githubAppAuth: {
    appId: formState?.appCredentials?.githubAppAuth?.appId ?? 0,
    privateKey: "",
  },
  projectRef: {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    id,
    githubDynamicTokenPermissionGroups:
      formState?.permissionGroups?.map((pg) => {
        const permissions: StringMap = {};
        pg?.permissions?.forEach((p) => {
          permissions[p.type] = p.value;
        });
        return {
          name: pg.name,
          permissions,
        };
      }) ?? [],
  },
})) satisfies FormToGqlFunction<Tab>;
