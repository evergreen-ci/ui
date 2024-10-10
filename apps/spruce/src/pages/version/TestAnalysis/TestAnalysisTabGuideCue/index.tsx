import { useState } from "react";
import {
  GuideCue,
  GuideCueProps,
  TooltipAlign,
} from "@leafygreen-ui/guide-cue";
import Cookies from "js-cookie";
import { SEEN_TEST_ANALYSIS_TAB_GUIDE_CUE } from "constants/cookies";

export const TestAnalysisTabGuideCue: React.FC<{
  refEl: GuideCueProps["refEl"];
}> = ({ refEl }) => {
  const [open, setOpen] = useState(
    Cookies.get(SEEN_TEST_ANALYSIS_TAB_GUIDE_CUE) !== "true",
  );

  const closeGuideCue = () => {
    Cookies.set(SEEN_TEST_ANALYSIS_TAB_GUIDE_CUE, "true", { expires: 365 });
    setOpen(false);
  };

  return (
    <GuideCue
      currentStep={1}
      data-cy="test-analysis-tab-guide-cue"
      numberOfSteps={1}
      onPrimaryButtonClick={closeGuideCue}
      open={open}
      refEl={refEl}
      setOpen={setOpen}
      title="New Test Analysis Tab!"
      tooltipAlign={TooltipAlign.Right}
    >
      Visit the Test Analysis tab to view an overview of common failed test
      results across your version.
    </GuideCue>
  );
};
