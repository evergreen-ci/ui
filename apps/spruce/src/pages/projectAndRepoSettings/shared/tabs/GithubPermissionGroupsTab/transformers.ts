import { StringMap } from "@evg-ui/lib/types";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.GithubPermissionGroups;

export const gqlToForm = ((data) => {
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
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  githubAppAuth: {
    appId: formState?.appCredentials?.githubAppAuth?.appId ?? 0,
    privateKey: "",
  },
  projectRef: {
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
