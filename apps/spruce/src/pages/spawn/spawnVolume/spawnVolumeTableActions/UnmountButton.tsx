import { useQuery, useMutation } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import ConditionalWrapper from "@evg-ui/lib/components/ConditionalWrapper";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import {
  MyHostsQuery,
  MyHostsQueryVariables,
  DetachVolumeFromHostMutation,
  DetachVolumeFromHostMutationVariables,
} from "gql/generated/types";
import { DETACH_VOLUME } from "gql/mutations";
import { MY_HOSTS } from "gql/queries";
import { TableVolume } from "types/spawn";

interface Props {
  volume: TableVolume;
}

export const UnmountButton: React.FC<Props> = ({ volume }) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();

  const { data: myHostsData } = useQuery<MyHostsQuery, MyHostsQueryVariables>(
    MY_HOSTS,
  );

  const myHosts = myHostsData?.myHosts ?? [];

  const [detachVolume, { loading: loadingDetachVolume }] = useMutation<
    DetachVolumeFromHostMutation,
    DetachVolumeFromHostMutationVariables
  >(DETACH_VOLUME, {
    onError: (err) =>
      dispatchToast.error(`Error detaching volume: '${err.message}'`),
    onCompleted: () => {
      dispatchToast.success("Successfully unmounted the volume.");
    },
    refetchQueries: ["MyVolumes", "MyHosts"],
  });

  const volumeName = volume.displayName ? volume.displayName : volume.id;
  const hostName = volume.host?.displayName
    ? volume.host.displayName
    : volume.host?.id;
  // Check if myHosts has this volume as one of its homeVolumes. This handles the scenarios where
  // one of the volumes was a home volume but is no longer attached to a host
  const isHomeVolume = myHosts?.some((h) => h.homeVolumeID === volume.id);

  return (
    <ConditionalWrapper
      altWrapper={(children) => (
        <Popconfirm
          align="left"
          onConfirm={() => {
            spawnAnalytics.sendEvent({
              name: "Changed unmounted volume on host",
              "volume.id": volume.id,
            });
            detachVolume({ variables: { volumeId: volume.id } });
          }}
          trigger={children}
        >
          Detach this volume {volumeName} from host {hostName}?
        </Popconfirm>
      )}
      condition={isHomeVolume}
      wrapper={(children) => (
        <Tooltip
          align="top"
          justify="middle"
          trigger={children}
          triggerEvent="hover"
        >
          Cannot unmount home volume
        </Tooltip>
      )}
    >
      <Button
        data-cy={`detach-btn-${volume.displayName || volume.id}`}
        disabled={loadingDetachVolume || isHomeVolume || volume.migrating}
        onClick={(e) => {
          e.stopPropagation();
        }}
        size={Size.XSmall}
      >
        Unmount
      </Button>
    </ConditionalWrapper>
  );
};
