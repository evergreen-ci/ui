import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Button, Size } from "@leafygreen-ui/button";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { copyToClipboard } from "@evg-ui/lib/utils";
import { useSpawnAnalytics } from "analytics";
import { SECOND } from "constants/index";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { EditSpawnHostButton } from "./EditSpawnHostButton";
import { SpawnHostActionButton } from "./SpawnHostActionButton";

export const SpawnHostTableActions: React.FC<{ host: MyHost }> = ({ host }) => (
  <FlexContainer>
    <SpawnHostActionButton host={host} />
    <CopySSHCommandButton
      hostStatus={host.status}
      hostUrl={host.persistentDnsName || host.hostUrl}
      user={host.user}
    />
    <EditSpawnHostButton host={host} />
  </FlexContainer>
);

export const CopySSHCommandButton: React.FC<{
  user: string | null | undefined;
  hostUrl: string;
  hostStatus: string;
}> = ({ hostStatus, hostUrl, user }) => {
  const sshCommand = user ? `ssh ${user}@${hostUrl}` : "";
  const spawnAnalytics = useSpawnAnalytics();

  const canSSH = hostStatus !== HostStatus.Terminated && !!hostUrl;
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasCopied(false), 10 * SECOND);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "Space") {
          e.stopPropagation();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <Tooltip
        align="top"
        data-cy="copy-ssh-tooltip"
        justify="middle"
        trigger={
          <Button
            data-cy="copy-ssh-button"
            disabled={!canSSH}
            leftGlyph={<Icon glyph="Copy" />}
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              copyToClipboard(sshCommand);
              spawnAnalytics.sendEvent({
                name: "Clicked copy SSH command button",
              });
              setHasCopied(!hasCopied);
            }}
            size={Size.XSmall}
          >
            <Label>SSH Command</Label>
          </Button>
        }
      >
        {hasCopied ? (
          <Center>Copied!</Center>
        ) : (
          <Center>
            {canSSH
              ? `Must be on VPN to connect to host`
              : `Host must be running in order to SSH`}
          </Center>
        )}
      </Tooltip>
    </span>
  );
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;
  gap: ${size.xs};
`;

const Label = styled.span`
  white-space: nowrap;
`;

const Center = styled.span`
  text-align: center;
`;
