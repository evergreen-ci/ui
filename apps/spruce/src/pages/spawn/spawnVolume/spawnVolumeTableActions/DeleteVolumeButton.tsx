import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import Button, { Size } from "@leafygreen-ui/button";
import { Checkbox } from "@leafygreen-ui/checkbox";
import Icon from "@evg-ui/lib/components/Icon";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import {
  RemoveVolumeMutation,
  RemoveVolumeMutationVariables,
} from "gql/generated/types";
import { REMOVE_VOLUME } from "gql/mutations";
import { TableVolume } from "types/spawn";

interface Props {
  volume: TableVolume;
}

export const DeleteVolumeButton: React.FC<Props> = ({ volume }) => {
  const dispatchToast = useToastContext();
  const [removeVolume, { loading: loadingRemoveVolume }] = useMutation<
    RemoveVolumeMutation,
    RemoveVolumeMutationVariables
  >(REMOVE_VOLUME, {
    refetchQueries: ["MyVolumes", "MyHosts"],
    onError: (err) =>
      dispatchToast.error(`Error removing volume: '${err.message}'`),
    onCompleted: () => {
      dispatchToast.success("Successfully deleted the volume.");
    },
  });

  const volumeName = volume.displayName ? volume.displayName : volume.id;
  const spawnAnalytics = useSpawnAnalytics();

  const [checkboxAcknowledged, setCheckboxAcknowledged] = useState(
    !volume.hostID,
  );

  return (
    <Popconfirm
      confirmDisabled={!checkboxAcknowledged}
      data-cy="delete-volume-popconfirm"
      onConfirm={() => {
        spawnAnalytics.sendEvent({
          name: "Deleted a volume",
          "volume.id": volume.id,
        });
        removeVolume({ variables: { volumeId: volume.id } });
      }}
      trigger={
        <Button
          data-cy={`trash-${volume.displayName || volume.id}`}
          disabled={loadingRemoveVolume || volume.migrating}
          onClick={(e) => {
            e.stopPropagation();
          }}
          size={Size.XSmall}
        >
          <Icon glyph="Trash" />
        </Button>
      }
    >
      Delete volume “{volumeName}”?
      {volume.hostID && (
        <Checkbox
          checked={checkboxAcknowledged}
          data-cy="abort-checkbox"
          label="I understand this volume is currently mounted to a host."
          onChange={(e) => {
            e.nativeEvent.stopPropagation();
            setCheckboxAcknowledged(!checkboxAcknowledged);
          }}
        />
      )}
    </Popconfirm>
  );
};
