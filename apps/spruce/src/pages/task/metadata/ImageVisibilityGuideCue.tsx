import { useState } from "react";
import {
  GuideCue,
  GuideCueProps,
  TooltipAlign,
} from "@leafygreen-ui/guide-cue";
import Cookies from "js-cookie";
import { SEEN_IMAGE_VISIBILITY_GUIDE_CUE } from "constants/cookies";

export const ImageVisibilityGuideCue: React.FC<{
  refEl: GuideCueProps["refEl"];
}> = ({ refEl }) => {
  const [open, setOpen] = useState(
    Cookies.get(SEEN_IMAGE_VISIBILITY_GUIDE_CUE) !== "true",
  );

  const closeGuideCue = () => {
    Cookies.set(SEEN_IMAGE_VISIBILITY_GUIDE_CUE, "true", { expires: 365 });
    setOpen(false);
  };

  return (
    <GuideCue
      currentStep={1}
      data-cy="image-visibility-guide-cue"
      numberOfSteps={1}
      onPrimaryButtonClick={closeGuideCue}
      open={open}
      refEl={refEl}
      setOpen={setOpen}
      title="Newly Introduced Image Page!"
      tooltipAlign={TooltipAlign.Right}
    >
      Visit the Image page to view general information and package installations
      for Evergreen distros.
    </GuideCue>
  );
};
