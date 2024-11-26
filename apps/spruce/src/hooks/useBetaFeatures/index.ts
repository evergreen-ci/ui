import { useQuery } from "@apollo/client";
import {
  AdminBetaFeaturesQuery,
  AdminBetaFeaturesQueryVariables,
  BetaFeatures,
  UserBetaFeaturesQuery,
  UserBetaFeaturesQueryVariables,
} from "gql/generated/types";
import { ADMIN_BETA_FEATURES, USER_BETA_FEATURES } from "gql/queries";

/**
 * `useAdminBetaFeatures` returns the beta features defined at the admin level.
 * @returns admin beta features
 */
export const useAdminBetaFeatures = () => {
  const { data: adminSettingsData } = useQuery<
    AdminBetaFeaturesQuery,
    AdminBetaFeaturesQueryVariables
  >(ADMIN_BETA_FEATURES);
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
    UserBetaFeaturesQuery,
    UserBetaFeaturesQueryVariables
  >(USER_BETA_FEATURES, {
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
