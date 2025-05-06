import { useQuery } from "@apollo/client";
import {
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
  InstanceTypesQuery,
  InstanceTypesQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
} from "gql/generated/types";
import INSTANCE_TYPES from "gql/queries/instance-types.graphql";
import MY_VOLUMES from "gql/queries/my-volumes.graphql";
import MY_PUBLIC_KEYS from "gql/queries/public-keys.graphql";
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { MyHost } from "types/spawn";
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

export const useLoadFormData = (host: MyHost) => {
  // QUERY instance_types
  const { data: instanceTypesData } = useQuery<
    InstanceTypesQuery,
    InstanceTypesQueryVariables
  >(INSTANCE_TYPES);

  // QUERY volumes
  const { data: volumesData } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(MY_VOLUMES);

  // QUERY public keys
  const { data: publicKeysData } = useQuery<
    MyPublicKeysQuery,
    MyPublicKeysQueryVariables
  >(MY_PUBLIC_KEYS);

  const spruceConfig = useSpruceConfig();

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(
    false,
    host,
  );

  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
    isVolume: false,
  });

  return {
    instanceTypesData,
    volumesData,
    publicKeysData,
    disableExpirationCheckbox,
    noExpirationCheckboxTooltip,
  };
};
