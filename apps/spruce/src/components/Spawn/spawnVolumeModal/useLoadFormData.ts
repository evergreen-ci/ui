import { useQuery } from "@apollo/client/react";
import { volumeTypes } from "constants/volumes";
import {
  MyHostsQuery,
  MyHostsQueryVariables,
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables,
} from "gql/generated/types";
import { MY_HOSTS, SUBNET_AVAILABILITY_ZONES } from "gql/queries";
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    limit: spruceConfig?.spawnHost?.unexpirableVolumesPerUser,
    isVolume: true,
  });

  return {
    availabilityZones,
    types: volumeTypes,
    hosts,
    disableExpirationCheckbox,
    noExpirationCheckboxTooltip,
    loadingFormData: hostsLoading || availabilityZonesLoading,
  };
};
