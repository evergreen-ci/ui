import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import { SectionStatus } from "constants/logs";
import { size } from "constants/tokens";
import { ToggleSection } from "hooks/useSections";
import { CaretToggle } from "../CaretToggle";

const { gray } = palette;

interface SectionHeaderProps extends Row {
  functionName: string;
  functionID: string;
  onOpen: ToggleSection;
  open: boolean;
  status: SectionStatus;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  functionID,
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
      <CaretToggle
        onClick={() => {
          sendEvent({
            name: "Toggled Section",
            open: !open,
            sectionName: functionName,
            sectionType: "function",
          });
          onOpen({ functionID, isOpen: !open });
        }}
        open={open}
      />
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

export default SectionHeader;
