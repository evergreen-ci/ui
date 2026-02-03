import { useState } from "react";
import styled from "@emotion/styled";
import {
  GuideCue,
  GuideCueProps,
  TooltipAlign,
} from "@leafygreen-ui/guide-cue";
import { palette } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import { StyledLink } from "@evg-ui/lib/components";
import { SEEN_TEST_SELECTION_GUIDE_CUE } from "constants/cookies";
import { projectDistroSettingsDocumentationUrl } from "constants/externalResources";

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
      enabled={enabled}
      numberOfSteps={1}
      onPrimaryButtonClick={closeGuideCue}
      open={open}
      refEl={refEl}
      setOpen={setOpen}
      title="New: Test Selection"
      tooltipAlign={TooltipAlign.Right}
    >
      This task is using <GreenText>test selection</GreenText>, which means that
      it will run a subset of tests based on the project&apos;s optimization
      strategies. Read more about test selection in{" "}
      <StyledLink
        href={`${projectDistroSettingsDocumentationUrl}#test-selection-settings`}
      >
        the docs
      </StyledLink>
      .
    </GuideCue>
  );
};

const GreenText = styled.span`
  color: ${green.base};
`;
