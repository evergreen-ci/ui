import { useState } from "react";
import { Button, Size } from "@leafygreen-ui/button";
import { TableVolume } from "types/spawn";
import { AttachVolumeModal } from "./AttachVolumeModal";

interface Props {
  volume: TableVolume;
}

export const AttachButton: React.FC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        as="button"
        data-cy={`attach-btn-${volume.displayName || volume.id}`}
        disabled={volume.migrating}
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
        size={Size.XSmall}
      >
        Attach
      </Button>
      <AttachVolumeModal
        onCancel={() => setOpenModal(false)}
        visible={openModal}
        volume={volume}
      />
    </>
  );
};
