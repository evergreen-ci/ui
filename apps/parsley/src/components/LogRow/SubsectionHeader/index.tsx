import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import {
  SectionHeaderWrapper,
  SubsectionHeaderWrapper,
} from "components/styles";
import { SectionStatus } from "constants/logs";
import { useLogContext } from "context/LogContext";
import { CaretToggle } from "../CaretToggle";

const { gray } = palette;

interface SubsectionHeaderProps extends Row {
  commandName: string;
  functionID: string;
  commandID: string;
  open: boolean;
  step: string;
  status: SectionStatus | undefined;
  isTopLevelCommand: boolean;
}

const SubsectionHeader: React.FC<SubsectionHeaderProps> = ({
  commandID,
  commandName,
  functionID,
  isTopLevelCommand,
  open,
  status,
  step,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { sectioning } = useLogContext();
  const statusGlyph =
    status === SectionStatus.Pass ? "CheckmarkWithCircle" : "XWithCircle";
  const Wrapper = isTopLevelCommand
    ? SectionHeaderWrapper
    : SubsectionHeaderWrapper;
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

export default SubsectionHeader;
