import { useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { useSpawnAnalytics } from "analytics";
import { EditSpawnHostModal } from "pages/spawn/spawnHost/index";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";

interface EditSpawnHostButtonProps {
  host: MyHost;
}
export const EditSpawnHostButton: React.FC<EditSpawnHostButtonProps> = ({
  host,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const spawnAnalytics = useSpawnAnalytics();
  const canEditSpawnHost =
    host.status === HostStatus.Stopped || host.status === HostStatus.Running;
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,
      jsx-a11y/no-static-element-interactions */}
      <span
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Tooltip
          align="top"
          enabled={!canEditSpawnHost}
          justify="middle"
          trigger={
            <Button
              as="button"
              data-cy="edit-host-button"
              disabled={!canEditSpawnHost}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setOpenModal(true);
                spawnAnalytics.sendEvent({
                  name: "Viewed edit spawn host modal",
                  "host.id": host.id,
                  "host.status": host.status,
                });
              }}
              size={Size.XSmall}
            >
              Edit
            </Button>
          }
          triggerEvent="hover"
        >
          {`Can only edit a spawn host when the status is ${HostStatus.Stopped} or ${HostStatus.Running}`}
        </Tooltip>
      </span>
      <EditSpawnHostModal
        key={host.id}
        host={host}
        onCancel={() => setOpenModal(false)}
        visible={openModal}
      />
    </>
  );
};
