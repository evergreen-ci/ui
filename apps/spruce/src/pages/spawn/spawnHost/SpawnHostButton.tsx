import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useSpawnAnalytics } from "analytics";
import { PlusButton } from "components/Buttons";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { MY_HOSTS } from "gql/queries";
import { useSpruceConfig } from "hooks";
import { HostStatus } from "types/host";
import { QueryParams } from "types/spawn";
import { SpawnHostModal } from "./spawnHostButton/SpawnHostModal";

export const SpawnHostButton: React.FC = () => {
  const { data: myHostsData } = useQuery<MyHostsQuery, MyHostsQueryVariables>(
    MY_HOSTS,
  );
  const [spawnHostParam, setSpawnHostParam] = useQueryParam<
    boolean | undefined
  >(QueryParams.SpawnHost, false);

  const spruceConfig = useSpruceConfig();

  const [openModal, setOpenModal] = useState(spawnHostParam);
  const spawnAnalytics = useSpawnAnalytics();

  const maxHosts = spruceConfig?.spawnHost?.spawnHostsPerUser || 0;

  const nonTerminatedHosts = myHostsData?.myHosts.filter(
    (host) => host.status !== HostStatus.Terminated,
  );
  const currentHostCount = nonTerminatedHosts?.length || 0;
  const reachedMaxNumHosts = currentHostCount >= maxHosts;

  return (
    <PaddedContainer>
      <Tooltip
        align="top"
        enabled={reachedMaxNumHosts}
        justify="middle"
        popoverZIndex={zIndex.tooltip}
        trigger={
          <PlusButton
            data-cy="spawn-host-button"
            disabled={reachedMaxNumHosts}
            onClick={() => {
              setOpenModal(true);
              spawnAnalytics.sendEvent({
                name: "Viewed spawn host modal",
              });
            }}
          >
            Spawn a host
          </PlusButton>
        }
        triggerEvent="hover"
      >
        {`You have reached the maximum number of hosts (${maxHosts}). Delete some hosts to spawn more.`}
      </Tooltip>
      {openModal && (
        <SpawnHostModal
          open={openModal}
          setOpen={(open) => {
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            setOpenModal(open);
            setSpawnHostParam(undefined);
          }}
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
