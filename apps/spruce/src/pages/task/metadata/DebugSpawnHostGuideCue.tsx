import { useCallback, useRef, useState } from "react";
import styled from "@emotion/styled";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import { palette } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import { MetadataItem } from "components/MetadataCard";
import { SEEN_DEBUG_SPAWN_HOST_GUIDE_CUE } from "constants/cookies";
import { debugSpawnHostsDocumentationUrl } from "constants/externalResources";
import { getSpawnHostRoute } from "constants/routes";
import useIntersectionObserver from "hooks/useIntersectionObserver";

const { green } = palette;

interface DebugSpawnHostGuideCueProps {
  enabled: boolean;
  distroId: string;
  taskId: string;
}

export const DebugSpawnHostGuideCue: React.FC<DebugSpawnHostGuideCueProps> = ({
  distroId,
  enabled,
  taskId,
}) => {
  const { sendEvent } = useTaskAnalytics();
  const refEl = useRef<HTMLSpanElement>(null);

  const [open, setOpen] = useState(
    Cookies.get(SEEN_DEBUG_SPAWN_HOST_GUIDE_CUE) !== "true",
  );
  const [isVisible, setIsVisible] = useState(false);

  useIntersectionObserver(
    refEl,
    useCallback(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, []),
    { threshold: 0.5 },
  );

  const closeGuideCue = () => {
    Cookies.set(SEEN_DEBUG_SPAWN_HOST_GUIDE_CUE, "true", { expires: 365 });
    setOpen(false);
  };

  return (
    <MetadataItem>
      <GuideCue
        currentStep={1}
        enabled={enabled}
        numberOfSteps={1}
        onPrimaryButtonClick={() => {
          closeGuideCue();
          sendEvent({
            name: "Clicked to dismiss debug spawn host guide cue",
          });
        }}
        open={open && isVisible}
        refEl={refEl}
        setOpen={setOpen}
        title="New: Debug Spawn Hosts"
      >
        This task can be debugged using <GreenText>debug spawn hosts</GreenText>
        , which allows you to interactively re-run and inspect failed commands.
        Read more in{" "}
        <StyledLink href={debugSpawnHostsDocumentationUrl}>the docs</StyledLink>
        .
      </GuideCue>
      <span ref={refEl}>
        <StyledRouterLink
          data-cy="task-spawn-host-link"
          onClick={() => {
            closeGuideCue();
            sendEvent({
              name: "Clicked metadata link",
              "link.type": "spawn host link",
            });
          }}
          to={getSpawnHostRoute({
            distroId,
            spawnHost: true,
            taskId,
          })}
        >
          Spawn host
        </StyledRouterLink>
      </span>
    </MetadataItem>
  );
};

const GreenText = styled.span`
  color: ${green.base};
`;
