import Button from "@leafygreen-ui/button";
import { useLogWindowAnalytics } from "analytics";
import { SectionStatus } from "constants/logs";
import { useLogContext } from "context/LogContext";

const SubsectionControls: React.FC<{
  functionID: string;
  functionName: string;
  status: SectionStatus;
}> = ({ functionID, functionName, status }) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { sectioning } = useLogContext();
  const { sectionState, toggleAllCommandsInFunction } = sectioning;
  const showExpandButton =
    sectionState &&
    (Object.values(sectionState[functionID].commands).some(
      (commandID) => !commandID.isOpen,
    ) ||
      !sectionState[functionID].isOpen);
  const showCloseButton =
    sectionState &&
    Object.values(sectionState[functionID].commands).some(
      (commandID) => commandID.isOpen,
    ) &&
    sectionState[functionID].isOpen;
  return (
    <>
      {showExpandButton && (
        <Button
          data-cy="open-subsections-btn"
          onClick={() => {
            sendEvent({
              "function.name": functionName,
              "function.status": status,
              name: "Clicked open subsections button",
              "was.function.closed": !sectionState[functionID].isOpen,
            });
            toggleAllCommandsInFunction(functionID, true);
          }}
          size="xsmall"
        >
          Open subsections
        </Button>
      )}
      {showCloseButton && (
        <Button
          data-cy="close-subsections-btn"
          onClick={() => {
            toggleAllCommandsInFunction(functionID, false);
            sendEvent({
              "function.name": functionName,
              "function.status": status,
              name: "Clicked close subsections button",
            });
          }}
          size="xsmall"
        >
          Close subsections
        </Button>
      )}
    </>
  );
};

export { SubsectionControls };
