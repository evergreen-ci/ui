import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import {
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { USER_SETTINGS } from "gql/queries";

type UseUserSettingsOptions = {
  onError?: (error: Error) => void;
};

export const useUserSettings = (options?: UseUserSettingsOptions) => {
  const { data, error, loading } = useQuery<
    UserSettingsQuery,
    UserSettingsQueryVariables
  >(USER_SETTINGS);

  const lastErrorMessage = useRef<string | null>(null);
  useEffect(() => {
    if (error && error.message !== lastErrorMessage.current) {
      lastErrorMessage.current = error.message;
      options?.onError?.(error);
    }
    if (!error) {
      lastErrorMessage.current = null;
    }
  }, [error, options]);

  const { user } = data || {};
  return { userSettings: user?.settings ?? {}, loading };
};
