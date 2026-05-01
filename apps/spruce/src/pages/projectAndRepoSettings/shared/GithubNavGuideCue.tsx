import { useState } from "react";
import {
  GuideCue,
  GuideCueProps,
  TooltipAlign,
} from "@leafygreen-ui/guide-cue";
import Cookies from "js-cookie";
import { SEEN_GITHUB_NAV_GUIDE_CUE } from "constants/cookies";
import { showNewProjectNavigation } from "constants/featureFlags";

type Props = {
  refEl: GuideCueProps["refEl"];
};

export const GithubNavGuideCue: React.FC<Props> = ({ refEl }) => {
  const [open, setOpen] = useState(
    Cookies.get(SEEN_GITHUB_NAV_GUIDE_CUE) !== "true",
  );

  const close = () => {
    Cookies.set(SEEN_GITHUB_NAV_GUIDE_CUE, "true", { expires: 365 });
    setOpen(false);
  };

  return (
    <GuideCue
      currentStep={1}
      enabled={showNewProjectNavigation}
      numberOfSteps={1}
      onPrimaryButtonClick={close}
      open={open}
      refEl={refEl}
      setOpen={setOpen}
      title="New: GitHub settings group"
      tooltipAlign={TooltipAlign.Right}
    >
      GitHub-related settings like Pull Requests, Commit Checks, and Git Tags
      now live under this GitHub section.
    </GuideCue>
  );
};
