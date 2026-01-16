import { useQuery } from "@apollo/client/react";
import {
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
  UserRepoSettingsPermissionsQuery,
  UserRepoSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import {
  USER_PROJECT_SETTINGS_PERMISSIONS,
  USER_REPO_SETTINGS_PERMISSIONS,
} from "gql/queries";

export const useHasProjectOrRepoEditPermission = (
  projectIdentifier: string = "",
  repoId: string = "",
) => {
  const { data: projectPermissionsData, loading: projectLoading } = useQuery<
    UserProjectSettingsPermissionsQuery,
    UserProjectSettingsPermissionsQueryVariables
  >(USER_PROJECT_SETTINGS_PERMISSIONS, {
    variables: { projectIdentifier },
    skip: !projectIdentifier,
    fetchPolicy: "cache-first",
  });
  const canEditProject =
    projectPermissionsData?.user?.permissions?.projectPermissions?.edit ??
    false;

  const { data: repoPermissionsData, loading: repoLoading } = useQuery<
    UserRepoSettingsPermissionsQuery,
    UserRepoSettingsPermissionsQueryVariables
  >(USER_REPO_SETTINGS_PERMISSIONS, {
    variables: { repoId },
    skip: !repoId,
    fetchPolicy: "cache-first",
  });
  const canEditRepo =
    repoPermissionsData?.user?.permissions?.repoPermissions?.edit ?? false;

  return {
    canEdit: repoId ? canEditRepo : canEditProject,
    loading: projectLoading || repoLoading,
  };
};
