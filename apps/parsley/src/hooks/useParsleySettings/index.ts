import { useMutation, useQuery } from "@apollo/client/react";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  ParsleySettings,
  ParsleySettingsInput,
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables,
  UpdateParsleySettingsMutation,
  UpdateParsleySettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_PARSLEY_SETTINGS } from "gql/mutations";
import { PARSLEY_SETTINGS } from "gql/queries";

type UseParsleySettingsReturnType = {
  settings: ParsleySettings | undefined;
  updateSettings: (settings: ParsleySettingsInput) => void;
};

/**
 * `useParsleySettings` fetches settings for the current user from the database.
 * Eventually we will move the preferences stored in LogContext into the database.
 * This means that preferences will no longer have to be stored centrally in the context.
 * @returns Parsley settings for the user, function for updating Parsley settings
 */
const useParsleySettings = (): UseParsleySettingsReturnType => {
  const { data } = useQuery<
    ParsleySettingsQuery,
    ParsleySettingsQueryVariables
  >(PARSLEY_SETTINGS);
  const { user } = data || {};
  const { parsleySettings } = user || {};

  const dispatchToast = useToastContext();
  const [updateParsleySettings] = useMutation<
    UpdateParsleySettingsMutation,
    UpdateParsleySettingsMutationVariables
  >(UPDATE_PARSLEY_SETTINGS, {
    onError: (err) => {
      dispatchToast.warning(`Failed to save preferences: ${err.message}`);
    },
    refetchQueries: ["ParsleySettings"],
  });

  const updateSettings = (newSettings: ParsleySettingsInput) => {
    updateParsleySettings({
      variables: {
        opts: {
          parsleySettings: newSettings,
        },
      },
    });
  };

  return {
    settings: parsleySettings,
    updateSettings,
  };
};

export { useParsleySettings };
