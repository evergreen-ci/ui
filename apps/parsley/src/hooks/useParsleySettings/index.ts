import { useQuery } from "@apollo/client";
import {
  ParsleySettings,
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables,
} from "gql/generated/types";
import { PARSLEY_SETTINGS } from "gql/queries";

type UseParsleySettingsReturnType = {
  settings: Partial<ParsleySettings>; // TODO: Remove Partial<> after completion of DEVPROD-1113.
};

/**
 * `useParsleySettings` returns settings for the current user from the database.
 * Eventually we want to include the preferences stored in LogContext in database. This means
 * that preferences will no longer have to be stored centrally in the context.
 * @returns Parsley settings for the user
 */
const useParsleySettings = (): UseParsleySettingsReturnType => {
  const { data } = useQuery<
    ParsleySettingsQuery,
    ParsleySettingsQueryVariables
  >(PARSLEY_SETTINGS);
  const { user } = data || {};
  const { parsleySettings } = user || {};

  return {
    settings: parsleySettings ?? {},
  };
};

export { useParsleySettings };
