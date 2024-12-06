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
 * @returns an object containing
 * - adminBetaSettings: admin beta features settings
 * - loading: boolean representing query loading state
 */
export const useAdminBetaFeatures = () => {
  const { data, loading } = useQuery<
    AdminBetaFeaturesQuery,
    AdminBetaFeaturesQueryVariables
  >(ADMIN_BETA_FEATURES);
  const { spruceConfig } = data ?? {};
  const { ui } = spruceConfig ?? {};
  const { betaFeatures } = ui ?? {};
  return { adminBetaSettings: betaFeatures, loading };
};

/**
 * `useUserBetaFeatures` returns the user's beta feature settings.
 * @returns an object containing
 * - userBetaSettings: user's beta features settings
 * - loading: boolean representing query loading state
 */
export const useUserBetaFeatures = () => {
  const { data, loading } = useQuery<
    UserBetaFeaturesQuery,
    UserBetaFeaturesQueryVariables
  >(USER_BETA_FEATURES, {
    variables: {},
  });
  const { user } = data ?? {};
  const { betaFeatures } = user ?? {};
  return { userBetaSettings: betaFeatures, loading };
};

/**
 * `useMergedBetaFeatures` returns the result of merging admin and user level beta features.
 * @returns an object containing
 * - betaFeatures: merged beta features
 * - loading: boolean representing query loading state
 */
export const useMergedBetaFeatures = () => {
  const { adminBetaSettings, loading: adminLoading } = useAdminBetaFeatures();
  const { loading: userLoading, userBetaSettings } = useUserBetaFeatures();

  if (!adminBetaSettings || !userBetaSettings) {
    return { mergedBetaFeatures: undefined, loading: false };
  }

  const mergedBetaFeatures: BetaFeatures = {
    spruceWaterfallEnabled:
      adminBetaSettings.spruceWaterfallEnabled &&
      userBetaSettings.spruceWaterfallEnabled,
  };

  return {
    betaFeatures: mergedBetaFeatures,
    loading: adminLoading || userLoading,
  };
};
