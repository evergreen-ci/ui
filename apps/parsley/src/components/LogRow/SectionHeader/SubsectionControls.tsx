import Button from "@leafygreen-ui/button";
import { useLogContext } from "context/LogContext";

const SubsectionControls: React.FC<{ functionID: string }> = ({
  functionID,
}) => {
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
          onClick={() => toggleAllCommandsInFunction(functionID, true)}
          size="xsmall"
        >
          Open subsections
        </Button>
      )}
      {showCloseButton && (
        <Button
          data-cy="close-subsections-btn"
          onClick={() => toggleAllCommandsInFunction(functionID, false)}
          size="xsmall"
        >
          Close subsections
        </Button>
      )}
    </>
  );
};

export { SubsectionControls };
