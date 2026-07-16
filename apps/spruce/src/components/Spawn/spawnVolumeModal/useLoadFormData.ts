import { useQuery } from "@apollo/client/react";
import { volumeTypes } from "constants/volumes";
import {
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables,
  MyHostsQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import { SUBNET_AVAILABILITY_ZONES, MY_HOSTS } from "gql/queries";
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

export const useLoadFormData = () => {
  const spruceConfig = useSpruceConfig();

  // QUERY hosts
  const { data: hostsData, loading: hostsLoading } = useQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(MY_HOSTS);
  const hosts = hostsData?.myHosts ?? [];

  // QUERY availability zones
  const { data: availabilityZoneData, loading: availabilityZonesLoading } =
    useQuery<
      SubnetAvailabilityZonesQuery,
      SubnetAvailabilityZonesQueryVariables
    >(SUBNET_AVAILABILITY_ZONES);
  const availabilityZones = availabilityZoneData?.subnetAvailabilityZones ?? [];

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(true);

  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    isVolume: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    limit: spruceConfig?.spawnHost?.unexpirableVolumesPerUser,
  });

  return {
    availabilityZones,
    disableExpirationCheckbox,
    hosts,
    loadingFormData: hostsLoading || availabilityZonesLoading,
    noExpirationCheckboxTooltip,
    types: volumeTypes,
  };
};
