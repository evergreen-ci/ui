import { useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { TableVolume } from "types/spawn";
import { EditVolumeModal } from "./EditVolumeModal";

interface Props {
  volume: TableVolume;
}

export const EditButton: React.FC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
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
          onCancel={() => setOpenModal(false)}
          visible={openModal}
          volume={volume}
        />
      )}
    </>
  );
};
