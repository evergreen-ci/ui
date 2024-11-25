import { useQuery } from "@apollo/client";
import {
  BetaFeatures,
  BetaFeaturesQuery,
  BetaFeaturesQueryVariables,
  UserPreferencesQuery,
  UserPreferencesQueryVariables,
} from "gql/generated/types";
import { BETA_FEATURES, USER_PREFERENCES } from "gql/queries";

/**
 * `useAdminBetaFeatures` returns the beta features defined at the admin level.
 * @returns admin beta features
 */
export const useAdminBetaFeatures = () => {
  const { data: adminSettingsData } = useQuery<
    BetaFeaturesQuery,
    BetaFeaturesQueryVariables
  >(BETA_FEATURES);
  const { spruceConfig } = adminSettingsData ?? {};
  const { ui } = spruceConfig ?? {};
  const { betaFeatures } = ui ?? {};
  return betaFeatures;
};

/**
 * `useUserBetaFeatures` returns the beta features defined at the user level.
 * @returns user's beta features
 */
export const useUserBetaFeatures = () => {
  const { data: userData } = useQuery<
    UserPreferencesQuery,
    UserPreferencesQueryVariables
  >(USER_PREFERENCES, {
    variables: {},
  });
  const { user } = userData ?? {};
  const { betaFeatures } = user ?? {};
  return betaFeatures;
};

/**
 * `useMergedBetaFeatures` returns the result of merging admin and user level beta features. If the beta feature
 * is disabled at the admin level, it should be returned as disabled in this function.
 * @returns merged beta features
 */
export const useMergedBetaFeatures = () => {
  const adminBetaFeatures = useAdminBetaFeatures();
  const userBetaFeatures = useUserBetaFeatures();

  if (!adminBetaFeatures || !userBetaFeatures) {
    return undefined;
  }

  const mergedBetaFeatures: BetaFeatures = {
    spruceWaterfallEnabled: adminBetaFeatures.spruceWaterfallEnabled
      ? userBetaFeatures.spruceWaterfallEnabled
      : false,
  };

  return mergedBetaFeatures;
};
