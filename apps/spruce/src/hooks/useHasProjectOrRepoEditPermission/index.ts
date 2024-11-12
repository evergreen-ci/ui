import { useQuery } from "@apollo/client";
import {
  IsRepoQuery,
  IsRepoQueryVariables,
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
  UserRepoSettingsPermissionsQuery,
  UserRepoSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import {
  IS_REPO,
  USER_PROJECT_SETTINGS_PERMISSIONS,
  USER_REPO_SETTINGS_PERMISSIONS,
} from "gql/queries";

export const useHasProjectOrRepoEditPermission = (id?: string) => {
  const projectOrRepoId = id ?? "";

  const { data: isRepoData, loading: isRepoLoading } = useQuery<
    IsRepoQuery,
    IsRepoQueryVariables
  >(IS_REPO, {
    variables: { projectOrRepoId },
    skip: !projectOrRepoId,
    fetchPolicy: "cache-first",
  });
  const isRepo = isRepoData?.isRepo ?? false;

  const { data: projectPermissionsData, loading: projectLoading } = useQuery<
    UserProjectSettingsPermissionsQuery,
    UserProjectSettingsPermissionsQueryVariables
  >(USER_PROJECT_SETTINGS_PERMISSIONS, {
    variables: { projectIdentifier: projectOrRepoId },
    skip:
      isRepoLoading || isRepoData === undefined || isRepo || !projectOrRepoId,
    fetchPolicy: "cache-first",
  });
  const canEditProject =
    projectPermissionsData?.user?.permissions?.projectPermissions?.edit ??
    false;

  const { data: repoPermissionsData, loading: repoLoading } = useQuery<
    UserRepoSettingsPermissionsQuery,
    UserRepoSettingsPermissionsQueryVariables
  >(USER_REPO_SETTINGS_PERMISSIONS, {
    variables: { repoId: projectOrRepoId },
    skip:
      isRepoLoading || isRepoData === undefined || !isRepo || !projectOrRepoId,
    fetchPolicy: "cache-first",
  });
  const canEditRepo =
    repoPermissionsData?.user?.permissions?.repoPermissions?.edit ?? false;

  return {
    canEdit: isRepo ? canEditRepo : canEditProject,
    loading: isRepoLoading || projectLoading || repoLoading,
  };
};
