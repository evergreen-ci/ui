import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
  Provider,
} from "gql/generated/types";
import { AWS_REGIONS } from "gql/queries";
import { useSpruceConfig } from "hooks";
import { useDistroSettingsContext } from "pages/distroSettings/Context";
import { omitTypename } from "utils/object";
import { BaseTab } from "../BaseTab";
import { WritableDistroSettingsTabs } from "../types";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";
import { UnsavedModal } from "./UnsavedModal";

const ec2Providers = [Provider.Ec2Fleet, Provider.Ec2OnDemand];

export const ProviderTab: React.FC<TabProps> = ({ distro, distroData }) => {
  const { getTab } = useDistroSettingsContext();
  const { formData, initialData } = getTab(WritableDistroSettingsTabs.Provider);

  const { data: awsData } = useQuery<AwsRegionsQuery, AwsRegionsQueryVariables>(
    AWS_REGIONS,
  );
  const { awsRegions } = awsData || {};

  const spruceConfig = useSpruceConfig();
  const { pools } = spruceConfig?.containerPools || {};

  const selectedPoolId = formData?.dockerProviderSettings?.containerPoolId;
  const selectedPool = pools?.find((p) => p.id === selectedPoolId) ?? null;
  const poolMappingInfo = selectedPool
    ? JSON.stringify(omitTypename(selectedPool), null, 2)
    : "";

  const fleetRegionsInUse = formData?.ec2FleetProviderSettings?.map(
    (p) => p.region,
  );
  const onDemandRegionsInUse = formData?.ec2OnDemandProviderSettings?.map(
    (p) => p.region,
  );
  const providerName = formData?.provider?.providerName;

  const formSchema = useMemo(
    () =>
      getFormSchema({
        awsRegions: awsRegions || [],
        fleetRegionsInUse: fleetRegionsInUse || [],
        onDemandRegionsInUse: onDemandRegionsInUse || [],
        pools: pools || [],
        poolMappingInfo,
        isEC2Provider: ec2Providers.includes(providerName as Provider),
      }),
    [
      awsRegions,
      fleetRegionsInUse,
      onDemandRegionsInUse,
      pools,
      poolMappingInfo,
      providerName,
    ],
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
