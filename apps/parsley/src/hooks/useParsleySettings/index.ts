import { gql, useMutation, useQuery } from "@apollo/client";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  ParsleySettings,
  ParsleySettingsInput,
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables,
  UpdateParsleySettingsMutation,
  UpdateParsleySettingsMutationVariables,
} from "gql/generated/types";

const PARSLEY_SETTINGS = gql`
  query ParsleySettings {
    user {
      parsleySettings {
        showWrapLines
        showLineNumbers
        expandableRows
        prettyPrint
        filterLogic
        caseSensitive
        showMatchesOnly
        wrap
        showBookmarks
        showToolbar
        showDarkMode
        highlightLine
        expandableRowsEnabled
        projectFilters {
          projectIdentifier
          variants
          tasks
          tests
        }
      }
    }
  }
`;

const UPDATE_PARSLEY_SETTINGS = gql`
  mutation UpdateParsleySettings($opts: UserSettingsInput!) {
    updateUserSettings(userSettings: $opts) {
      parsleySettings {
        showWrapLines
        showLineNumbers
        expandableRows
        prettyPrint
        filterLogic
        caseSensitive
        showMatchesOnly
        wrap
        showBookmarks
        showToolbar
        showDarkMode
        highlightLine
        expandableRowsEnabled
        projectFilters {
          projectIdentifier
          variants
          tasks
          tests
        }
      }
    }
  }
`;

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
