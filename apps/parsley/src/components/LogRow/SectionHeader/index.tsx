import { useState } from "react";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { SectionHeaderRow } from "components/LogRow/types";
import { SectionStatus } from "constants/logs";
import { size, transitionDuration } from "constants/tokens";

const { gray } = palette;

interface SectionHeaderProps extends SectionHeaderRow {
  defaultOpen?: boolean;
  functionName: string;
  onFocus: (functionName: string) => void;
  onOpen: (functionName: string) => void;
  status: SectionStatus;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  defaultOpen = false,
  functionName,
  onFocus,
  onOpen,
  status,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const [open, setOpen] = useState(defaultOpen);

  const statusGlyph =
    status === SectionStatus.Pass ? "CheckmarkWithCircle" : "XWithCircle";

  return (
    <SectionHeaderWrapper data-cy="section-header">
      <IconButton
        aria-label="Click to open or close section"
        onClick={() => setOpen(!open)}
      >
        <AnimatedIcon fill={gray.dark1} glyph="ChevronRight" open={open} />
      </IconButton>
      <Icon fill={gray.dark1} glyph={statusGlyph} />
      <Body>Function: {functionName}</Body>
      <ButtonWrapper>
        <Button
          onClick={() => {
            onOpen(functionName);
            sendEvent({ functionName, name: "Opened Section" });
          }}
          size={Size.XSmall}
        >
          Open
        </Button>
        <Button
          onClick={() => {
            onFocus(functionName);
            sendEvent({ functionName, name: "Focused Section" });
          }}
          size={Size.XSmall}
        >
          Focus
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
