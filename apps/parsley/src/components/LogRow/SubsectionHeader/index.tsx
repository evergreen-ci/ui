import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import { SectionStatus } from "constants/logs";
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
  status: SectionStatus | undefined;
}

const SubsectionHeader: React.FC<SectionHeaderProps> = ({
  commandID,
  commandName,
  functionID,
  open,
  status,
  step,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { sectioning } = useLogContext();
  const statusGlyph =
    status === SectionStatus.Pass ? "CheckmarkWithCircle" : "XWithCircle";
  const Wrapper = status ? SectionHeaderWrapper : SubsectionHeaderWrapper;
  return (
    <Wrapper aria-expanded={open} data-cy="section-header">
      <CaretToggle
        onClick={() => {
          sendEvent({
            name: "Toggled section",
            open: !open,
            sectionName: commandName,
            sectionType: "command",
          });
          sectioning.toggleCommandSection({
            commandID,
            functionID,
            isOpen: !open,
          });
        }}
        open={open}
      />
      {status && <Icon fill={gray.dark1} glyph={statusGlyph} />}
      <Body>
        Command: {commandName} (step {step})
      </Body>
    </Wrapper>
  );
};

const SubsectionHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  padding-left: 48px;
  border-bottom: 1px solid ${gray.light1};
  background-color: ${gray.light2};
`;
const SectionHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  border-bottom: 1px solid ${gray.light2};
`;

export default SubsectionHeader;
