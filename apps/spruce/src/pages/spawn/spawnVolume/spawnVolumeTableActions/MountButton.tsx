import { useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { TableVolume } from "types/spawn";
import { MountVolumeModal } from "./MountVolumeModal";

interface Props {
  volume: TableVolume;
}

export const MountButton: React.FC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        data-cy={`attach-btn-${volume.displayName || volume.id}`}
        disabled={volume.migrating}
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
        size={Size.XSmall}
      >
        Mount
      </Button>
      <MountVolumeModal
        onCancel={() => setOpenModal(false)}
        visible={openModal}
        volume={volume}
      />
    </>
  );
};
