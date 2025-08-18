import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import {
  sectionHeaderWrapperStyle,
  subsectionHeaderWrapperStyle,
} from "components/styles";
import { SectionStatus } from "constants/logs";
import { useLogContext } from "context/LogContext";
import { CaretToggle } from "../CaretToggle";
import { SectionStatusIcon } from "../SectionStatusIcon";

interface SubsectionHeaderProps extends Row {
  commandDescription: string | undefined;
  commandName: string;
  functionID: string;
  commandID: string;
  open: boolean;
  step: string;
  status: SectionStatus | undefined;
  isTopLevelCommand: boolean;
}

const SubsectionHeader: React.FC<SubsectionHeaderProps> = ({
  commandDescription,
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
