import { useQuery } from "@apollo/client";
import { CardSkeleton } from "@leafygreen-ui/skeleton-loader";
import { SettingsCard } from "components/SettingsCard";
import { AwsRegionsQuery } from "gql/generated/types";
import AWS_REGIONS from "gql/queries/aws-regions.graphql";
import { useUserSettings } from "hooks";
import { Settings } from "./profileTab/Settings";

export const ProfileTab: React.FC = () => {
  const { userSettings } = useUserSettings();
  const { data: awsRegionData, loading } =
    useQuery<AwsRegionsQuery>(AWS_REGIONS);
  const awsRegions = awsRegionData?.awsRegions || [];

  if (loading) {
    return <CardSkeleton />;
  }
  return (
    <SettingsCard>
      <Settings awsRegions={awsRegions} userSettings={userSettings} />
    </SettingsCard>
  );
};
