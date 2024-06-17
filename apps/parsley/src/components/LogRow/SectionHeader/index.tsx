import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { Row } from "components/LogRow/types";
import { SectionStatus } from "constants/logs";
import { size, transitionDuration } from "constants/tokens";
import { OpenSection } from "hooks/useSections";

const { gray } = palette;

interface SectionHeaderProps extends Row {
  functionName: string;
  onOpen: OpenSection;
  open: boolean;
  status: SectionStatus;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  functionName,
  onOpen,
  open,
  status,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const statusGlyph =
    status === SectionStatus.Pass ? "CheckmarkWithCircle" : "XWithCircle";

  return (
    <SectionHeaderWrapper aria-expanded={open} data-cy="section-header">
      <IconButton
        aria-label="Click to open or close section"
        data-cy="section-header-caret"
        onClick={() => {
          sendEvent({
            functionName,
            name: open ? "Closed Section" : "Opened Section",
          });
          onOpen(functionName, !open);
        }}
      >
        <AnimatedIcon fill={gray.dark1} glyph="ChevronRight" open={open} />
      </IconButton>
      <Icon fill={gray.dark1} glyph={statusGlyph} />
      <Body>Function: {functionName}</Body>
      <ButtonWrapper>
        <Button onClick={() => {}} size={Size.XSmall}>
          Open
        </Button>
      </ButtonWrapper>
    </SectionHeaderWrapper>
  );
};

const AnimatedIcon = styled(Icon)<{ open: boolean }>`
  transform: ${({ open }): string => (open ? "rotate(90deg)" : "unset")};
  transition-property: transform;
  transition-duration: ${transitionDuration.default}ms;
`;

const SectionHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  border-bottom: 1px solid ${gray.light2};
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
