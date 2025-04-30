import { useQuery } from "@apollo/client";
import {
  DistrosQuery,
  DistrosQueryVariables,
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
  MyVolumesQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import AWS_REGIONS from "gql/queries/aws-regions.graphql";
import DISTROS from "gql/queries/distros.graphql";
import MY_VOLUMES from "gql/queries/my-volumes.graphql";
import MY_PUBLIC_KEYS from "gql/queries/public-keys.graphql";
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
  const { data: awsData, loading: awsLoading } = useQuery<
    AwsRegionsQuery,
    AwsRegionsQueryVariables
  >(AWS_REGIONS);

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

  const spruceConfig = useSpruceConfig();

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
  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
    isVolume: false,
  });
  return {
    formSchemaInput: {
      awsRegions: awsData?.awsRegions,
      disableExpirationCheckbox,
      distros: distrosData?.distros,
      myPublicKeys: publicKeysData?.myPublicKeys,
      noExpirationCheckboxTooltip,
      userAwsRegion,
      volumes: volumesData?.myVolumes,
    },
    loading: distrosLoading || publicKeyLoading || awsLoading || volumesLoading,
  };
};
