import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { GuideCue, TooltipAlign } from "@leafygreen-ui/guide-cue";
import Cookies from "js-cookie";
import { size } from "@evg-ui/lib/constants/tokens";
import { SEEN_TEST_ANALYSIS_TAB_GUIDE_CUE } from "constants/cookies";

// TODO: Remove in https://jira.mongodb.org/browse/DEVPROD-12094
export const TestAnalysisTabGuideCue: React.FC = () => {
  const [open, setOpen] = useState(
    Cookies.get(SEEN_TEST_ANALYSIS_TAB_GUIDE_CUE) !== "true",
  );
  const badgeRef = useRef<HTMLDivElement | null>(null);

  const closeGuideCue = () => {
    Cookies.set(SEEN_TEST_ANALYSIS_TAB_GUIDE_CUE, "true", { expires: 365 });
    setOpen(false);
  };

  if (!open) {
    return null;
  }
  return (
    <>
      <GuideCue
        currentStep={1}
        data-cy="test-analysis-tab-guide-cue"
        numberOfSteps={1}
        onPrimaryButtonClick={closeGuideCue}
        open={open}
        refEl={badgeRef}
        setOpen={setOpen}
        title="New Test Analysis Tab!"
        tooltipAlign={TooltipAlign.Right}
      >
        Visit the Test Analysis tab to view an overview of common failed test
        results across this version.
      </GuideCue>
      <BadgeRefWrapper ref={badgeRef}>
        <StyledBadge variant="green">NEW</StyledBadge>
      </BadgeRefWrapper>
    </>
  );
};

const StyledBadge = styled(Badge)`
  // Fix height to be consistent with text-only tabs
  height: ${size.s};
`;

const BadgeRefWrapper = styled.div`
  display: inline-block;
`;
