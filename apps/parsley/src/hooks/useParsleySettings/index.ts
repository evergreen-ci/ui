import { useMutation, useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
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
  settings: Partial<ParsleySettings>; // TODO: Remove Partial<> after completion of DEVPROD-1113.
  updateSettings: (settings: ParsleySettingsInput) => void;
};

/**
 * `useParsleySettings` returns settings for the current user from the database.
 * Eventually we want to include the preferences stored in LogContext in database. This means
 * that preferences will no longer have to be stored centrally in the context.
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
    settings: parsleySettings ?? {},
    updateSettings,
  };
};

export { useParsleySettings };
