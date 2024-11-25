import { useQuery } from "@apollo/client";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { AwsRegionsQuery } from "gql/generated/types";
import { AWS_REGIONS } from "gql/queries";
import {
  useAdminBetaFeatures,
  useUserBetaFeatures,
  useUserSettings,
} from "hooks";
import { BetaFeatureSettings } from "./profileTab/BetaFeatures";
import { Settings } from "./profileTab/Settings";

export const ProfileTab: React.FC = () => {
  const { loading, userSettings } = useUserSettings();
  const userBetaFeatures = useUserBetaFeatures();
  const adminBetaFeatures = useAdminBetaFeatures();

  const { data: awsRegionData, loading: awsRegionLoading } =
    useQuery<AwsRegionsQuery>(AWS_REGIONS);
  const awsRegions = awsRegionData?.awsRegions || [];

  if (
    loading ||
    awsRegionLoading ||
    !adminBetaFeatures ||
    !userBetaFeatures ||
    !userSettings
  ) {
    return <ParagraphSkeleton data-loading="loading-skeleton" />;
  }

  return (
    <>
      <Settings awsRegions={awsRegions} userSettings={userSettings} />
      <BetaFeatureSettings
        adminBetaFeatures={adminBetaFeatures}
        userBetaFeatures={userBetaFeatures}
      />
    </>
  );
};
