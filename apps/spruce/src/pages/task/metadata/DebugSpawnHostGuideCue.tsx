import { useEffect, useRef, useState } from "react";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import Cookies from "js-cookie";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import { MetadataItem } from "components/MetadataCard";
import { SEEN_DEBUG_SPAWN_HOST_GUIDE_CUE } from "constants/cookies";
import { getSpawnHostRoute } from "constants/routes";

const debugSpawnHostDocsUrl =
  "https://docs.devprod.prod.corp.mongodb.com/evergreen/Hosts/Debug-Spawn-Hosts";

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
  const taskAnalytics = useTaskAnalytics();
  const refEl = useRef<HTMLSpanElement>(null);

  const [open, setOpen] = useState(
    Cookies.get(SEEN_DEBUG_SPAWN_HOST_GUIDE_CUE) !== "true",
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!open || !refEl.current) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(refEl.current);
    return () => observer.disconnect();
  }, [open]);

  const closeGuideCue = () => {
    Cookies.set(SEEN_DEBUG_SPAWN_HOST_GUIDE_CUE, "true", { expires: 365 });
    setOpen(false);
  };

  return (
    <MetadataItem>
      <GuideCue
        currentStep={1}
        data-cy="debug-spawn-host-guide-cue"
        enabled={enabled}
        numberOfSteps={1}
        onPrimaryButtonClick={() => {
          closeGuideCue();
          taskAnalytics.sendEvent({
            name: "Clicked debug spawn host guide cue dismiss",
          });
        }}
        open={open && isVisible}
        refEl={refEl}
        setOpen={setOpen}
        title="Debug your failed task"
      >
        Spawn a host with debug mode to interactively re-run and inspect failed
        commands.{" "}
        <StyledLink hideExternalIcon={false} href={debugSpawnHostDocsUrl}>
          Learn more
        </StyledLink>
      </GuideCue>
      <span ref={refEl}>
        <StyledRouterLink
          data-cy="task-spawn-host-link"
          onClick={() => {
            closeGuideCue();
            taskAnalytics.sendEvent({
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
