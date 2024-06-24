import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { Row } from "components/LogRow/types";
import { size, transitionDuration } from "constants/tokens";

const { gray } = palette;

interface SectionHeaderProps extends Row {
  commandName: string;
  functionID: string;
  commandID: string;
  onOpen: (v: {
    commandID: string;
    functionID: string;
    isOpen: boolean;
  }) => void;
  open: boolean;
}

const SubsectionHeader: React.FC<SectionHeaderProps> = ({
  commandID,
  commandName,
  functionID,
  onOpen,
  open,
}) => {
  const { sendEvent } = useLogWindowAnalytics();

  return (
    <Wrapper aria-expanded={open} data-cy="section-header">
      <IconButton
        aria-label="Click to open or close section"
        data-cy="section-header-caret"
        onClick={() => {
          sendEvent({
            commandName,
            name: "Toggled Subsection",
            open: !open,
          });
          onOpen({ commandID, functionID, isOpen: !open });
        }}
      >
        <AnimatedIcon fill={gray.dark1} glyph="ChevronRight" open={open} />
      </IconButton>
      <Body>Command: {commandName}</Body>
    </Wrapper>
  );
};

const AnimatedIcon = styled(Icon)<{ open: boolean }>`
  transform: ${({ open }): string => (open ? "rotate(90deg)" : "unset")};
  transition-property: transform;
  transition-duration: ${transitionDuration.default}ms;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  padding-left: 48px;
  border-bottom: 1px solid ${gray.light1};
  background-color: ${gray.light2};
`;

SubsectionHeader.displayName = "SubsectionSectionHeader";

export default SubsectionHeader;
