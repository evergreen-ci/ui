import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import { InlineKeyCode } from "@leafygreen-ui/typography";
import Cookie from "js-cookie";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { HAS_SEEN_SEARCHBAR_GUIDE_CUE } from "constants/cookies";

interface SearchBarGuideCueProps {
  containerRef?: HTMLDivElement | null;
}

const SearchBarGuideCue: React.FC<SearchBarGuideCueProps> = ({
  containerRef,
}) => {
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
      popoverZIndex={zIndex.popover}
      portalContainer={containerRef}
      refEl={triggerRef}
      setOpen={setOpenGuideCue}
      title="New tab completion and memory!"
      tooltipAlign="bottom"
    >
      <GuideCueText>
        <span>
          The search bar now remembers the last few filters you applied!
        </span>
        <span>
          It will now suggest a project filter or previous filter as you type.
          You can <InlineKeyCode>Tab</InlineKeyCode> to complete the suggestion.
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
