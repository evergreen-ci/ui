import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import { InlineKeyCode } from "@leafygreen-ui/typography";
import Cookie from "js-cookie";
import { size } from "@evg-ui/lib/constants";
import { HAS_SEEN_SEARCHBAR_GUIDE_CUE } from "constants/cookies";

const SearchBarGuideCue: React.FC = () => {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const [openGuideCue, setOpenGuideCue] = useState(
    Cookie.get(HAS_SEEN_SEARCHBAR_GUIDE_CUE) !== "true",
  );

  const onHideCue = () => {
    Cookie.set(HAS_SEEN_SEARCHBAR_GUIDE_CUE, "true", { expires: 365 });
    setOpenGuideCue(false);
  };

  return (
    <GuideCue
      currentStep={1}
      data-cy="searchbar-guide-cue"
      numberOfSteps={1}
      onPrimaryButtonClick={onHideCue}
      open={openGuideCue}
      refEl={triggerRef}
      setOpen={setOpenGuideCue}
      title="New: Tab Completion and Memory!"
      tooltipAlign="bottom"
    >
      <GuideCueText>
        <span>The search bar will now remember your recent searches!</span>
        <span>
          It will suggest options as you type. You can use{" "}
          <InlineKeyCode>Tab</InlineKeyCode> to complete the suggestion.
        </span>
      </GuideCueText>
    </GuideCue>
  );
};

const GuideCueText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
`;

export default SearchBarGuideCue;
