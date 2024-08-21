import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import { SectionHeaderWrapper } from "components/styles";
import { SectionStatus } from "constants/logs";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { CaretToggle } from "../CaretToggle";
import { SubsectionControls } from "./SubsectionControls";

const { gray } = palette;

interface SectionHeaderProps extends Row {
  functionName: string;
  functionID: string;
  open: boolean;
  status: SectionStatus;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  functionID,
  functionName,
  open,
  status,
}) => {
  const { sectioning } = useLogContext();
  const { sendEvent } = useLogWindowAnalytics();
  const statusGlyph =
    status === SectionStatus.Pass ? "CheckmarkWithCircle" : "XWithCircle";

  return (
    <SectionHeaderWrapper aria-expanded={open} data-cy="section-header">
      <CaretToggle
        onClick={() => {
          sendEvent({
            isNested: false,
            name: "Toggled section caret",
            open: !open,
            sectionName: functionName,
            sectionType: "function",
            status,
          });
          sectioning.toggleFunctionSection({ functionID, isOpen: !open });
        }}
        open={open}
      />
      <Icon fill={gray.dark1} glyph={statusGlyph} />
      <Body>Function: {functionName}</Body>
      <ButtonWrapper>
        <SubsectionControls
          functionID={functionID}
          functionName={functionName}
          status={status}
        />
      </ButtonWrapper>
    </SectionHeaderWrapper>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;

export default SectionHeader;
