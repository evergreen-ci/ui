import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import { sectionHeaderWrapperStyle } from "components/styles";
import { SectionStatus } from "constants/logs";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { CaretToggle } from "../CaretToggle";
import { SectionStatusIcon } from "../SectionStatusIcon";
import { SubsectionControls } from "./SubsectionControls";

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

  return (
    <div
      aria-expanded={open}
      css={sectionHeaderWrapperStyle}
      data-cy="section-header"
    >
      <CaretToggle
        onClick={() => {
          sendEvent({
            name: "Toggled section",
            open: !open,
            "section.name": functionName,
            "section.type": "function",
          });
          sectioning.toggleFunctionSection({ functionID, isOpen: !open });
        }}
        open={open}
      />
      <SectionStatusIcon status={status} />
      <Body>Function: {functionName}</Body>
      <ButtonWrapper>
        <SubsectionControls functionID={functionID} />
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
