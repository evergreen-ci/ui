import { useQuery } from "@apollo/client/react";
import {
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { USER_SETTINGS } from "gql/queries";

export const useUserSettings = () => {
  const { data, loading } = useQuery<
    UserSettingsQuery,
    UserSettingsQueryVariables
  >(USER_SETTINGS);

  // const { user } = data || {};
  const userSettings = data?.user?.settings ?? null;
  return { userSettings, loading };
};
