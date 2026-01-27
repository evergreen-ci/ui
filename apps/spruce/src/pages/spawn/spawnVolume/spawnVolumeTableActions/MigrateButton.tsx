import { useRef, useState } from "react";
import { Button, Size } from "@leafygreen-ui/button";
import { TableVolume } from "types/spawn";
import { MigrateVolumeModal } from "./MigrateVolumeModal";

interface Props {
  volume: TableVolume;
}

export const MigrateButton: React.FC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);
  const triggerRef = useRef(null);
  return (
    <>
      <Button
        ref={triggerRef}
        as="button"
        data-cy={`migrate-btn-${volume.displayName || volume.id}`}
        disabled={volume.migrating}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
        size={Size.XSmall}
      >
        Migrate
      </Button>
      {openModal && (
        <MigrateVolumeModal
          open={openModal}
          setOpen={setOpenModal}
          volume={volume}
        />
      )}
    </>
  );
};
