import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import { sectionHeaderWrapperStyle } from "components/styles";
import { SectionStatus } from "constants/logs";
import { useLogContext } from "context/LogContext";
import { SectionHeaderRow } from "types/logs";
import { includesLineNumber } from "utils/logRow";
import { CaretToggle } from "../CaretToggle";
import { SectionStatusIcon } from "../SectionStatusIcon";
import { SubsectionControls } from "./SubsectionControls";

interface SectionHeaderProps extends Row {
  failingLine?: number;
  sectionHeaderLine: SectionHeaderRow;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  failingLine,
  sectionHeaderLine,
}) => {
  const { sectioning } = useLogContext();
  const { sendEvent } = useLogWindowAnalytics();

  const { functionID, functionName = "", isOpen: open } = sectionHeaderLine;
  const status = includesLineNumber(sectionHeaderLine, failingLine)
    ? SectionStatus.Fail
    : SectionStatus.Pass;

  return (
    <div
      aria-expanded={open}
      css={sectionHeaderWrapperStyle}
      data-cy="section-header"
    >
      <CaretToggle
        onClick={() => {
          sendEvent({
            name: "Toggled section caret",
            "section.name": functionName,
            "section.nested": false,
            "section.open": !open,
            "section.status": status,
            "section.type": "function",
          });
          sectioning.toggleFunctionSection({ functionID, isOpen: !open });
        }}
        open={open}
      />
      <SectionStatusIcon status={status} />
      <Body>Function: {functionName}</Body>
      <ButtonWrapper>
        <SubsectionControls
          functionID={functionID}
          functionName={functionName}
          status={status}
        />
      </ButtonWrapper>
    </div>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;

export default SectionHeader;
