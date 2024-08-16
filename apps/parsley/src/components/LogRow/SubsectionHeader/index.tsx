import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { CaretToggle } from "../CaretToggle";

const { gray } = palette;

interface SectionHeaderProps extends Row {
  commandName: string;
  functionID: string;
  commandID: string;
  open: boolean;
  step: string;
}

const SubsectionHeader: React.FC<SectionHeaderProps> = ({
  commandID,
  commandName,
  functionID,
  open,
  step,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { sectioning } = useLogContext();
  return (
    <Wrapper aria-expanded={open} data-cy="section-header">
      <CaretToggle
        onClick={() => {
          sendEvent({
            name: "Toggled section",
            open: !open,
            "section.name": commandName,
            "section.type": "command",
          });
          sectioning.toggleCommandSection({
            commandID,
            functionID,
            isOpen: !open,
          });
        }}
        open={open}
      />
      <Body>
        Command: {commandName} (step {step})
      </Body>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  padding-left: 48px;
  border-bottom: 1px solid ${gray.light1};
  background-color: ${gray.light2};
`;

export default SubsectionHeader;
