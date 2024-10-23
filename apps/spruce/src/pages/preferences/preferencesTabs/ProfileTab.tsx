import { useQuery } from "@apollo/client";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import {
  AwsRegionsQuery,
  UserPreferencesQuery,
  UserPreferencesQueryVariables,
} from "gql/generated/types";
import { AWS_REGIONS, USER_PREFERENCES } from "gql/queries";
import { BetaFeatureSettings } from "./profileTab/BetaFeatures";
import { Settings } from "./profileTab/Settings";

export const ProfileTab: React.FC = () => {
  const { data: userData, loading: userDataLoading } = useQuery<
    UserPreferencesQuery,
    UserPreferencesQueryVariables
  >(USER_PREFERENCES, {
    variables: {},
  });
  const { user } = userData ?? {};
  const { betaFeatures, settings } = user ?? {};

  const { data: awsRegionData, loading: awsRegionLoading } =
    useQuery<AwsRegionsQuery>(AWS_REGIONS);
  const awsRegions = awsRegionData?.awsRegions || [];

  if (userDataLoading || awsRegionLoading || !betaFeatures || !settings) {
    return <ParagraphSkeleton data-loading="loading-skeleton" />;
  }

  return (
    <>
      <Settings awsRegions={awsRegions} settings={settings} />
      <BetaFeatureSettings betaFeatures={betaFeatures} />
    </>
  );
};
