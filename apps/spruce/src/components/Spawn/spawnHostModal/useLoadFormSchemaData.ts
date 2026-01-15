import { useQuery } from "@apollo/client/react";
import { defaultEC2Region } from "constants/hosts";
import {
  DistrosQuery,
  DistrosQueryVariables,
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
  MyVolumesQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import { DISTROS, MY_PUBLIC_KEYS, MY_VOLUMES } from "gql/queries";
import {
  useDisableSpawnExpirationCheckbox,
  useSpruceConfig,
  useUserSettings,
} from "hooks";
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

interface Props {
  host: { noExpiration: boolean };
}
export const useLoadFormSchemaData = (p?: Props) => {
  const { data: distrosData, loading: distrosLoading } = useQuery<
    DistrosQuery,
    DistrosQueryVariables
  >(DISTROS, {
    variables: {
      onlySpawnable: true,
    },
  });

  const { data: publicKeysData, loading: publicKeyLoading } = useQuery<
    MyPublicKeysQuery,
    MyPublicKeysQueryVariables
  >(MY_PUBLIC_KEYS);

  const { userSettings } = useUserSettings();
  const { region: userAwsRegion } = userSettings ?? {};

  const { data: volumesData, loading: volumesLoading } = useQuery<
    MyVolumesQuery,
    MyHostsQueryVariables
  >(MY_VOLUMES);

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(
    false,
    p?.host,
  );

  const spruceConfig = useSpruceConfig();
  const noExpirationCheckboxTooltip =
    getNoExpirationCheckboxTooltipCopy({
      disableExpirationCheckbox,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
      isVolume: false,
    }) ?? "";

  const oAuthDisabled =
    spruceConfig?.serviceFlags?.jwtTokenForCLIDisabled ?? false;

  return {
    formSchemaInput: {
      disableExpirationCheckbox,
      distros: distrosData?.distros ?? [],
      oAuthDisabled,
      myPublicKeys: publicKeysData?.myPublicKeys ?? [],
      noExpirationCheckboxTooltip,
      userAwsRegion: userAwsRegion ?? defaultEC2Region,
      volumes: volumesData?.myVolumes ?? [],
    },
    loading: distrosLoading || publicKeyLoading || volumesLoading,
  };
};
