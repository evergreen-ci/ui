import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import {
  sectionHeaderWrapperStyle,
  subsectionHeaderWrapperStyle,
} from "components/styles";
import { SectionStatus } from "constants/logs";
import { useLogContext } from "context/LogContext";
import { SubsectionHeaderRow } from "types/logs";
import { includesLineNumber } from "utils/logRow";
import { CaretToggle } from "../CaretToggle";
import { SectionStatusIcon } from "../SectionStatusIcon";

interface SubsectionHeaderProps extends Row {
  failingLine?: number;
  subsectionHeaderLine: SubsectionHeaderRow;
}

const SubsectionHeader: React.FC<SubsectionHeaderProps> = ({
  failingLine,
  subsectionHeaderLine,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { sectioning } = useLogContext();

  const {
    commandDescription,
    commandID,
    commandName,
    functionID,
    isOpen: open,
    isTopLevelCommand,
    step,
  } = subsectionHeaderLine;

  let status: SectionStatus | undefined;

  // Only show status icon for top-level commands.
  if (isTopLevelCommand) {
    status = includesLineNumber(subsectionHeaderLine, failingLine)
      ? SectionStatus.Fail
      : SectionStatus.Pass;
  }

  return (
    <div
      aria-expanded={open}
      css={
        isTopLevelCommand
          ? sectionHeaderWrapperStyle
          : subsectionHeaderWrapperStyle
      }
      data-cy="section-header"
    >
      <CaretToggle
        onClick={() => {
          sendEvent({
            name: "Toggled section caret",
            "section.name": commandName,
            "section.nested": !isTopLevelCommand,
            "section.open": !open,
            "section.status": status,
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
      {status && <SectionStatusIcon status={status} />}
      <Body>
        Command: {commandName} (step {step})
        {commandDescription && ` — ${commandDescription}`}
      </Body>
    </div>
  );
};

export default SubsectionHeader;
