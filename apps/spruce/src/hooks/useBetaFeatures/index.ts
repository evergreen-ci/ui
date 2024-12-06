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
 * - betaFeatures: admin beta features
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
  return { betaFeatures, loading };
};

/**
 * `useUserBetaFeatures` returns the beta features defined at the user level.
 * @returns an object containing
 * - betaFeatures: user beta features
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
  return { betaFeatures, loading };
};

/**
 * `useMergedBetaFeatures` returns the result of merging admin and user level beta features.
 * @returns merged beta features
 */
export const useMergedBetaFeatures = () => {
  const { betaFeatures: adminBetaFeatures, loading: adminLoading } =
    useAdminBetaFeatures();
  const { betaFeatures: userBetaFeatures, loading: userLoading } =
    useUserBetaFeatures();

  if (!adminBetaFeatures || !userBetaFeatures) {
    return { mergedBetaFeatures: undefined, loading: false };
  }

  const mergedBetaFeatures: BetaFeatures = {
    spruceWaterfallEnabled:
      adminBetaFeatures.spruceWaterfallEnabled &&
      userBetaFeatures.spruceWaterfallEnabled,
  };

  return {
    betaFeatures: mergedBetaFeatures,
    loading: adminLoading || userLoading,
  };
};
