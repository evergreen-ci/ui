import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
  Provider,
} from "gql/generated/types";
import { AWS_REGIONS } from "gql/queries";
import { useDistroSettingsContext } from "pages/distroSettings/Context";
import { BaseTab } from "../BaseTab";
import { WritableDistroSettingsTabs } from "../types";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";
import { UnsavedModal } from "./UnsavedModal";

export const ProviderTab: React.FC<TabProps> = ({ distro, distroData }) => {
  const { getTab } = useDistroSettingsContext();
  const { formData, initialData } = getTab(WritableDistroSettingsTabs.Provider);

  const { data: awsData } = useQuery<AwsRegionsQuery, AwsRegionsQueryVariables>(
    AWS_REGIONS,
  );
  const { awsRegions } = awsData || {};

  const fleetRegionsInUse = formData?.ec2FleetProviderSettings?.map(
    (p) => p.region,
  );
  const providerName = formData?.provider?.providerName;

  const formSchema = useMemo(
    () =>
      getFormSchema({
        awsRegions: awsRegions || [],
        fleetRegionsInUse: fleetRegionsInUse || [],
        isEC2Provider: providerName === Provider.Ec2Fleet,
      }),
    [awsRegions, fleetRegionsInUse, providerName],
  );

  return (
    <>
      {/* Use conditional rendering instead of the shouldBlock prop so that modifying fields other than the provider triggers the standard navigation warning modal */}
      {initialData?.provider !== formData?.provider?.providerName && (
        <UnsavedModal distro={distro} shouldBlock />
      )}
      <BaseTab formSchema={formSchema} initialFormState={distroData} />
    </>
  );
};
