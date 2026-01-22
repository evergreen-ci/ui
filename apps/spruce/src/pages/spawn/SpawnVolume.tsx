import { useQuery } from "@apollo/client/react";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { Subtitle } from "@leafygreen-ui/typography";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { Title, BadgeWrapper, TitleContainer } from "components/Spawn";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { MyVolumesQuery, MyVolumesQueryVariables } from "gql/generated/types";
import { MY_VOLUMES } from "gql/queries";
import { usePolling, useSpruceConfig } from "hooks";
import { SpawnVolumeTable } from "pages/spawn/spawnVolume/SpawnVolumeTable";
import SpawnPageSkeleton from "./SpawnPageSkeleton";
import { SpawnVolumeButton } from "./spawnVolume/SpawnVolumeButton";

export const SpawnVolume = () => {
  usePageTitle("My Volumes");
  const spruceConfig = useSpruceConfig();

  const {
    data: volumesData,
    error,
    loading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<MyVolumesQuery, MyVolumesQueryVariables>(MY_VOLUMES, {
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading your spawn volume");
  const migrationInProcess = !!volumesData?.myVolumes.find(
    ({ migrating }) => migrating,
  );
  usePolling<MyVolumesQuery, MyVolumesQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
    shouldPollFaster: migrationInProcess,
  });

  if (loading) {
    return <SpawnPageSkeleton />;
  }

  const volumes = volumesData?.myVolumes || [];
  const volumeLimit = spruceConfig?.providers?.aws?.maxVolumeSizePerUser;
  const totalVolumeSize = volumes.reduce((acc, volume) => acc + volume.size, 0);
  const maxSpawnableLimit =
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    volumeLimit - totalVolumeSize >= 0 ? volumeLimit - totalVolumeSize : 0;
  const mountedCount = volumes.filter((v) => v.hostID).length ?? 0;
  const unmountedCount = volumes.filter((v) => !v.hostID).length ?? 0;

  return (
    <>
      <TitleContainer>
        <Title>Volumes</Title>
        <BadgeWrapper>
          <Badge
            data-cy="mounted-badge"
            variant={Variant.Green}
          >{`${mountedCount} Mounted`}</Badge>
          <Badge
            data-cy="free-badge"
            variant={Variant.Blue}
          >{`${unmountedCount} Free`}</Badge>
        </BadgeWrapper>
      </TitleContainer>
      <SpawnVolumeButton
        maxSpawnableLimit={maxSpawnableLimit}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        volumeLimit={volumeLimit}
      />
      {volumes.length ? (
        <SpawnVolumeTable
          maxSpawnableLimit={maxSpawnableLimit}
          volumes={volumes}
        />
      ) : (
        <Subtitle>No volumes available, spawn one to get started.</Subtitle>
      )}
    </>
  );
};
