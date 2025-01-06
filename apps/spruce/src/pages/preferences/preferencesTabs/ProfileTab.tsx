import { useQuery } from "@apollo/client";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { SettingsCard } from "components/SettingsCard";
import { AwsRegionsQuery } from "gql/generated/types";
import { AWS_REGIONS } from "gql/queries";
import { useUserSettings } from "hooks";
import { Settings } from "./profileTab/Settings";

export const ProfileTab: React.FC = () => {
  const { userSettings } = useUserSettings();
  const { data: awsRegionData } = useQuery<AwsRegionsQuery>(AWS_REGIONS);
  const awsRegions = awsRegionData?.awsRegions || [];

  return (
    <SettingsCard>
      {awsRegions.length && userSettings ? (
        <Settings awsRegions={awsRegions} userSettings={userSettings} />
      ) : (
        <ParagraphSkeleton />
      )}
    </SettingsCard>
  );
};
