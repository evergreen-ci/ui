import { useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import { PlusButton } from "components/Buttons";
import { SpawnVolumeModal } from "./SpawnVolumeModal";

interface SpawnVolumeButtonProps {
  maxSpawnableLimit: number;
  volumeLimit: number;
}

export const SpawnVolumeButton: React.FC<SpawnVolumeButtonProps> = ({
  maxSpawnableLimit,
  volumeLimit,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const spawnAnalytics = useSpawnAnalytics();

  const reachedMaxVolumeSize = maxSpawnableLimit === 0;

  return (
    <PaddedContainer>
      <Tooltip
        align="top"
        enabled={reachedMaxVolumeSize}
        justify="middle"
        trigger={
          <PlusButton
            data-cy="spawn-volume-btn"
            disabled={reachedMaxVolumeSize}
            onClick={() => {
              setOpenModal(true);
              spawnAnalytics.sendEvent({
                name: "Viewed spawn volume modal",
              });
            }}
          >
            Spawn a volume
          </PlusButton>
        }
        triggerEvent="hover"
      >
        {`You have reached the max volume limit (${volumeLimit} GiB). Delete some volumes to spawn more.`}
      </Tooltip>
      <Info>Limit {volumeLimit} GiB per User</Info>
      {openModal && (
        <SpawnVolumeModal
          maxSpawnableLimit={maxSpawnableLimit}
          onCancel={() => setOpenModal(false)}
          visible={openModal}
        />
      )}
    </PaddedContainer>
  );
};

const PaddedContainer = styled.div`
  padding: ${size.l} 0;
  display: flex;
  align-items: center;
`;

const Info = styled(Disclaimer)`
  font-weight: 300;
  padding-left: ${size.xs};
  position: relative;
  font-style: italic;
  color: ${palette.gray.dark2};
`;
