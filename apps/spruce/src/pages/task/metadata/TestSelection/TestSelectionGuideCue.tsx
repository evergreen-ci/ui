import { useState } from "react";
import styled from "@emotion/styled";
import {
  GuideCue,
  GuideCueProps,
  TooltipAlign,
} from "@leafygreen-ui/guide-cue";
import { palette } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import { SEEN_TEST_SELECTION_GUIDE_CUE } from "constants/cookies";
import { showTestSelectionUI } from "constants/featureFlags";

const { green } = palette;

export const TestSelectionGuideCue: React.FC<{
  refEl: GuideCueProps["refEl"];
  enabled: boolean;
}> = ({ enabled, refEl }) => {
  const [open, setOpen] = useState(
    Cookies.get(SEEN_TEST_SELECTION_GUIDE_CUE) !== "true",
  );

  const closeGuideCue = () => {
    Cookies.set(SEEN_TEST_SELECTION_GUIDE_CUE, "true", { expires: 365 });
    setOpen(false);
  };

  return (
    <GuideCue
      currentStep={1}
      data-cy="test-selection-guide-cue"
      // TODO: Remove when the feature is ready for release in DEVPROD-22837.
      enabled={showTestSelectionUI && enabled}
      numberOfSteps={1}
      onPrimaryButtonClick={closeGuideCue}
      open={open}
      refEl={refEl}
      setOpen={setOpen}
      title="New: Test Selection!"
      tooltipAlign={TooltipAlign.Right}
    >
      {/* TODO: Update docs link in DEVPROD-22837. */}
      This task is using <GreenText>test selection</GreenText>, which means that
      it will run a subset of its tests. Read more about test selection at
      [docs].
    </GuideCue>
  );
};

const GreenText = styled.span`
  color: ${green.base};
`;
