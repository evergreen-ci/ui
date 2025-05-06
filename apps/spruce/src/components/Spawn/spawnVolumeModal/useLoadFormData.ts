import { useQuery } from "@apollo/client";
import { volumeTypes } from "constants/volumes";
import {
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables,
  MyHostsQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import MY_HOSTS from "gql/queries/my-hosts.graphql";
import SUBNET_AVAILABILITY_ZONES from "gql/queries/subnet-availability-zones.graphql";
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
