import { useState } from "react";
import { Button, Size } from "@leafygreen-ui/button";
import { TableVolume } from "types/spawn";
import { EditVolumeModal } from "./EditVolumeModal";

interface Props {
  maxSpawnableLimit: number;
  volume: TableVolume;
}

export const EditButton: React.FC<Props> = ({ maxSpawnableLimit, volume }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        as="button"
        data-cy={`edit-btn-${volume.displayName || volume.id}`}
        disabled={volume.migrating}
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
        size={Size.XSmall}
      >
        Edit
      </Button>
      {openModal && (
        <EditVolumeModal
          maxSpawnableLimit={maxSpawnableLimit}
          onCancel={() => setOpenModal(false)}
          visible={openModal}
          volume={volume}
        />
      )}
    </>
  );
};
